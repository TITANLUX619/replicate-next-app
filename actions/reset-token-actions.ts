'use server';

import { v4 as uuid } from 'uuid';
import prisma from '@/lib/db';

export const generateResetPasswordToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) deletePasswordResetTokenById(existingToken.id);

  const passwordResetToken = await prisma.resetToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return passwordResetToken;
}

export const getPasswordResetTokenByToken = async (token: string) => {
  const passwordResetToken = await prisma.resetToken.findUnique({
    where: { token }
  })

  return passwordResetToken;
}

export const getPasswordResetTokenByEmail = async (email: string) => {
  const passwordResetToken = await prisma.resetToken.findFirst({
    where: { email }
  })

  return passwordResetToken;
}

export const deletePasswordResetTokenById = async (id: string) => {
  await prisma.resetToken.delete({
    where: { id }
  })
}