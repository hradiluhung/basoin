import startDb from "@/db/dbConfig"
import User from "@/models/userModel"
import { compare } from "bcrypt-ts"
import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"

export const dynamic = "force-dynamic"

const comparePassword = async (password: string, hash: string) => {
  return await compare(password, hash)
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string
          password: string
        }

        await startDb()

        const user = await User.findOne({ username })
        if (!user) throw Error("Username tidak ditemukan")

        const passwordMatch = await comparePassword(password, user.password)
        if (!passwordMatch) throw Error("Password salah")

        return {
          id: user._id,
          name: user.name,
          username: user.username,
          angkatan: user.angkatan,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    jwt(params: any) {
      if (params.user?.role) {
        params.token.role = params.user.role
        params.token.id = params.user.id
      }
      return params.token
    },
    session({ session, token }) {
      if (session.user) {
        ;(session.user as { id: string }).id = token.id as string
        ;(session.user as { role: string }).role = token.role as string
      }
      return session
    },
  },
}

const authHandler = NextAuth(authOptions)

export { authHandler as GET, authHandler as POST }
