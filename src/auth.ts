import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import "@/types/auth" // Import custom types

// Login schema validation
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Validate input
          const { email, password } = loginSchema.parse(credentials)
          
          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              mitra: true,
              sppg: true
            }
          })
          
          if (!user) {
            throw new Error("Invalid email or password")
          }
          
          // Check user status
          if (user.status !== 'ACTIVE') {
            throw new Error("Account is not active")
          }
          
          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.passwordHash)
          if (!isValidPassword) {
            throw new Error("Invalid email or password")
          }
          
          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })
          
          // Return user object for session
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            mitraId: user.mitraId,
            sppgId: user.sppgId,
            avatar: user.avatar,
            mitraName: user.mitra?.name || null,
            sppgName: user.sppg?.name || null
          }
          
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  
  pages: {
    signIn: "/login",
    error: "/login"
  },
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    async jwt({ token, user }) {
      // Store additional user data in JWT token
      if (user) {
        token.role = user.role
        token.mitraId = user.mitraId
        token.sppgId = user.sppgId
        token.avatar = user.avatar
        token.mitraName = user.mitraName
        token.sppgName = user.sppgName
      }
      return token
    },
    
    async session({ session, token }) {
      // Send properties to client
      if (token && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as string
        session.user.mitraId = token.mitraId
        session.user.sppgId = token.sppgId
        session.user.avatar = token.avatar
        session.user.mitraName = token.mitraName
        session.user.sppgName = token.sppgName
      }
      return session
    }
  },
  
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User ${user.email} signed in`)
    },
    
    async signOut() {
      console.log(`User signed out`)
    }
  }
})