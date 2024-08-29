import prisma from '@/lib/db';

export const generate2FAConfirmation = async (userId: string) => {
  const twoFactorToken = await prisma.twoFactorConfirmation.create({
    data: {
      userId,
    }
  })

  return twoFactorToken;
}

export const get2FAConfirmationByUserId = async (userId: string) => {
  const twoFactorToken = await prisma.twoFactorConfirmation.findFirst({
    where: { userId }
  })

  return twoFactorToken;
}

export const delete2FAConfirmationById = async (id: string) => {
  await prisma.twoFactorConfirmation.delete({
    where: { id }
  })
}

