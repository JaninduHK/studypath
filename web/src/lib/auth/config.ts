import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "@/lib/db";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, parsed.data.email))
          .limit(1);

        if (!user?.hashedPassword) return null;

        const passwordMatches = await bcrypt.compare(
          parsed.data.password,
          user.hashedPassword,
        );
        if (!passwordMatches) return null;

        if (user.suspendedAt) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          accountType: user.accountType,
          staffRole: user.staffRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accountType = user.accountType;
        token.staffRole = user.staffRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.accountType = token.accountType as typeof session.user.accountType;
        session.user.staffRole = token.staffRole as typeof session.user.staffRole;
      }
      return session;
    },
  },
};
