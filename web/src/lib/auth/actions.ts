"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn } from "@/auth";
import { homeForAccountType } from "@/lib/auth/routes";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export type AuthFormState = { error?: string } | undefined;

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain a letter.")
    .regex(/[0-9]/, "Password must contain a number."),
  accountType: z.enum(["student", "adviser"]),
});

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    accountType: formData.get("accountType"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { name, email, password, accountType } = parsed.data;

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.insert(users).values({
    name,
    email,
    hashedPassword,
    accountType,
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: homeForAccountType(accountType),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but automatic sign-in failed. Please sign in." };
    }
    throw error;
  }
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const next = formData.get("next") as string | null;

  const [existing] = await db
    .select({ accountType: users.accountType })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const home = homeForAccountType(existing?.accountType ?? "student");
  const redirectTo = next && next.startsWith(home) ? next : home;

  try {
    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    throw error;
  }
}
