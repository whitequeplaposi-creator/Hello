import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getServerSession } from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import client from '@/lib/db';

export const dynamic = 'force-dynamic';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
};

export async function GET(request: NextRequest) {
  // 1. Check own JWT cookie first (email/password login)
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return NextResponse.json({
        user: {
          id: payload.id,
          email: payload.email,
          name: payload.name,
        },
      });
    }
  } catch {
    // Invalid JWT — fall through to NextAuth check
  }

  // 2. Check NextAuth session (Google login)
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      // Look up the customer record to get the internal ID
      const result = await client.execute({
        sql: 'SELECT id, name, email FROM customers WHERE email = ?',
        args: [session.user.email.toLowerCase()],
      });

      if (result.rows.length > 0) {
        const row = result.rows[0];
        return NextResponse.json({
          user: {
            id: row.id as string,
            email: row.email as string,
            name: row.name as string,
          },
        });
      }

      // Customer row not yet created — return basic session data
      return NextResponse.json({
        user: {
          id: (session.user as any).id ?? session.user.email,
          email: session.user.email,
          name: session.user.name ?? session.user.email.split('@')[0],
        },
      });
    }
  } catch (err) {
    console.error('Error checking NextAuth session in /api/auth/me:', err);
  }

  return NextResponse.json({ user: null });
}
