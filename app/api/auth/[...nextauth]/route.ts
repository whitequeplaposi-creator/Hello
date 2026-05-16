import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import client from '@/lib/db';

export const dynamic = 'force-dynamic';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      try {
        // Ensure password_hash column exists
        try {
          await client.execute(`ALTER TABLE customers ADD COLUMN password_hash TEXT`);
        } catch { /* already exists */ }

        const existing = await client.execute({
          sql: 'SELECT id FROM customers WHERE email = ?',
          args: [user.email.toLowerCase()],
        });

        if (existing.rows.length === 0) {
          const id = `cust_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          const name = user.name || user.email.split('@')[0];
          await client.execute({
            sql: `INSERT INTO customers (id, email, name, created_at, updated_at, status, total_orders, total_spent)
                  VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'active', 0, 0)`,
            args: [id, user.email.toLowerCase(), name],
          });
        }
      } catch (err) {
        console.error('Error creating customer from Google sign-in:', err);
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        try {
          const result = await client.execute({
            sql: 'SELECT id, name FROM customers WHERE email = ?',
            args: [session.user.email.toLowerCase()],
          });
          if (result.rows.length > 0) {
            (session.user as any).id = result.rows[0].id as string;
            session.user.name = result.rows[0].name as string;
          }
        } catch { /* ignore */ }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

export { handler as GET, handler as POST };
