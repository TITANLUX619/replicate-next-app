'use server';

import prisma from '@/lib/db';
import { auth } from "@/auth/auth";

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
}

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user;
}

export const updateUser = async (email: string, data: any) => {
  const user = await prisma.user.update({
    where: { email },
    data: { ...data },
  });

  return user;
}

