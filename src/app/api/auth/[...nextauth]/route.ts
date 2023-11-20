import NextAuth from "next-auth/next"
import { authOptions } from "./authOptions"

export const dynamic = "force-dynamic"

const authHandler = NextAuth(authOptions)

export { authHandler as GET, authHandler as POST }
