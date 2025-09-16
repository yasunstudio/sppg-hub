// NextAuth custom types for SPPG Hub application

import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      mitraId: string | null
      sppgId: string | null
      avatar: string | null
      mitraName: string | null
      sppgName: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    mitraId: string | null
    sppgId: string | null
    avatar: string | null
    mitraName: string | null
    sppgName: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    mitraId: string | null
    sppgId: string | null
    avatar: string | null
    mitraName: string | null
    sppgName: string | null
  }
}