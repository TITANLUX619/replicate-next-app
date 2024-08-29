'use server';

import prisma from '@/lib/db';

import { getUserByEmail } from "./user-actions";
import { v4 as uuid } from 'uuid';

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { id: existingToken.id }
    })
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return verificationToken;
}

export const getVerificationTokenByEmail = async (email: string) => {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: { email },
  });

  return verificationToken;
}

export const getVerificationTokenByToken = async (token: string) => {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  return verificationToken;
}

export const verifyToken = async (token: string): ServerActionResult<null> => {

  const verificationToken = await getVerificationTokenByToken(token);

  if (!verificationToken) return { type: 'error', message: 'Invalid token!' };

  const hasExpired = new Date() > verificationToken.expires;

  if (hasExpired) return { type: 'error', message: 'Token has expired!' };

  const existingUser = await getUserByEmail(verificationToken.email);

  if (!existingUser) return { type: 'error', message: 'User not found!' };

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      email: verificationToken.email,
      emailVerified: new Date(),
    }
  })

  await prisma.verificationToken.delete({
    where: { id: verificationToken.id }
  })

  return { type: 'success', message: 'Email verified!' };
}