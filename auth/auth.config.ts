import { NextAuthConfig } from "next-auth"
import { apiAuthPrefix, authRoutes, DEFAULT_SIGN_IN_REDIRECT, DEFAULT_SIGN_OUT_REDIRECT, publicRoutes } from "@/lib/constants/routes";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up'
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }: { auth: any, request: { nextUrl: any } }) {
      const isLoggedIn = !!auth
      const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
      const isAuthRoute = authRoutes.includes(nextUrl.pathname)
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

      if (isApiAuthRoute) {
        return true
      }

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL(DEFAULT_SIGN_IN_REDIRECT, nextUrl))
        }
        return true
      }

      if (!isLoggedIn && !isPublicRoute) {

        return Response.redirect(new URL(DEFAULT_SIGN_OUT_REDIRECT, nextUrl))
      }

      return true
    },
  },
  providers: []
} satisfies NextAuthConfig
