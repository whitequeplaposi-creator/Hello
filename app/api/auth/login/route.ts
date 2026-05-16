import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import client from '@/lib/db';

export const dynamic = 'force-dynamic';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-post och lösenord krävs' }, { status: 400 });
    }

    const result = await client.execute({
      sql: 'SELECT id, email, name, password_hash FROM customers WHERE email = ?',
      args: [email.toLowerCase()],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Fel e-postadress eller lösenord' }, { status: 401 });
    }

    const customer = result.rows[0];
    const passwordHash = customer.password_hash as string;

    if (!passwordHash) {
      return NextResponse.json({ error: 'Kontot har inget lösenord. Registrera dig igen.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Fel e-postadress eller lösenord' }, { status: 401 });
    }

    const id = customer.id as string;
    const name = customer.name as string;

    const token = await new SignJWT({ id, email: email.toLowerCase(), name })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      user: { id, email: email.toLowerCase(), name },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Inloggning misslyckades' }, { status: 500 });
  }
}
