import prisma from "@/lib/db";

export const getAccountByUserId = async (userId: string) => {
  const account = await prisma.account.findFirst({
    where: { userId }
  });

  return account;
};
