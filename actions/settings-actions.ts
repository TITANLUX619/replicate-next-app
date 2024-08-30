"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { unstable_update } from "@/auth/auth";
import prisma from "@/lib/db";
import { currentUser, getUserByEmail, getUserById } from "./user-actions";
import { generateVerificationToken } from "./verification-token-actions";
import { sendVerificationEmail } from "./auth-actions";
import { settingsSchema } from "@/schemas";

export const settings = async (
  values: z.infer<typeof settingsSchema>
) => {

  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" }
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized" }
  }

  /*   if (user.isOAuth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
    } */

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" }
    }

    const verificationToken = await generateVerificationToken(
      values.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Verification email sent!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(
      values.newPassword,
      10,
    );
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  Object.keys(values).forEach((key) => {

    const value = values[key as keyof z.infer<typeof settingsSchema>]

    if (typeof value === 'string' && value === '') {

      values[key as keyof z.infer<typeof settingsSchema>] = undefined;
    }
  });



  const updatedUser = await prisma.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    }
  });

  unstable_update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      twoFactorEnabled: updatedUser.twoFactorEnabled,
      role: updatedUser.role,
    }
  });

  return { success: "Settings Updated!" }
}