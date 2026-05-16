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
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'E-post, lösenord och namn krävs' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Lösenordet måste vara minst 6 tecken' }, { status: 400 });
    }

    // Ensure password_hash column exists
    try {
      await client.execute(`ALTER TABLE customers ADD COLUMN password_hash TEXT`);
    } catch {
      // Column already exists, ignore
    }

    // Check if email already exists
    const existing = await client.execute({
      sql: 'SELECT id FROM customers WHERE email = ?',
      args: [email.toLowerCase()],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'E-postadressen används redan' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const id = `cust_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    await client.execute({
      sql: `INSERT INTO customers (id, email, name, password_hash, created_at, updated_at, status, total_orders, total_spent)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'active', 0, 0)`,
      args: [id, email.toLowerCase(), `${firstName} ${lastName}`.trim(), passwordHash],
    });

    const token = await new SignJWT({ id, email: email.toLowerCase(), name: `${firstName} ${lastName}`.trim() })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      user: { id, email: email.toLowerCase(), name: `${firstName} ${lastName}`.trim() },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registrering misslyckades' }, { status: 500 });
  }
}
