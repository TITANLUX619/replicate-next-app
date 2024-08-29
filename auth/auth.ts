import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { z } from 'zod'
import bcryptjs from 'bcryptjs'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/db'
import { delete2FAConfirmationById, get2FAConfirmationByUserId } from '@/actions/two-factor-confirmation'
import { getUserByEmail, getUserById, updateUser } from '@/actions/user-actions'
import { getAccountByUserId } from '@/actions/account-actions'

export const { auth, signIn, signOut, unstable_update, handlers: { GET, POST } } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      const existingUser = await getUserById(user.id as string)

      if (account?.provider !== 'credentials') {
        if (existingUser && !existingUser.image) {
          await updateUser(user.email as string, profile?.picture)

        }
        return true
      }

      if (!existingUser || !existingUser.emailVerified) {
        return false
      }

      if (existingUser.twoFactorEnabled) {
        const twoFactorConfirmation = await get2FAConfirmationByUserId(existingUser.id)

        if (!twoFactorConfirmation) {
          return false
        }

        await delete2FAConfirmationById(twoFactorConfirmation.id)
      }

      return true
    },
    async jwt({ token }) {
      const existingUser = await getUserById(token.sub as string);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(
        existingUser.id
      );

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.twoFactorEnabled = existingUser.twoFactorEnabled;

      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role
      }


      if (session.user) {
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session
    }
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6)
          })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data

          const existingUser = await getUserByEmail(email)

          if (!existingUser) return null

          const passwordsMatch = await bcryptjs.compare(password, existingUser.password as string)

          if (passwordsMatch) return existingUser
        }

        return null
      }
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true
    })
  ]
})
