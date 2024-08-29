'use server';

import crypto from 'crypto';
import prisma from '@/lib/db';

export const generate2FAToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 15);

  const existingToken = await get2FATokenByEmail(email);

  if (existingToken) {
    await prisma.twoFactorToken.delete({
      where: { id: existingToken.id }
    })
  }

  const twoFactorToken = await prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return twoFactorToken;
}

export const get2FATokenByEmail = async (email: string) => {
  const twoFactorToken = await prisma.twoFactorToken.findFirst({
    where: { email }
  })

  return twoFactorToken;
}

export const get2FATokenByToken = async (token: string) => {
  const twoFactorToken = await prisma.twoFactorToken.findUnique({
    where: { token }
  })

  return twoFactorToken;
}

export const delete2FATokenById = async (id: string) => {
  await prisma.twoFactorToken.delete({
    where: { id }
  })
}