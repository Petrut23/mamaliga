const fs = require('fs')

const content = `import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parola", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        if (!user || !user.passwordHash) return null
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        if (!passwordMatch) return null
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role as string
        token.id = user.id as string
        token.name = user.name as string
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name as string
        ;(session.user as any).role = token.role as string
        ;(session.user as any).id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  trustHost: true,
})
`

fs.writeFileSync('auth.ts', content)
console.log('Gata!')