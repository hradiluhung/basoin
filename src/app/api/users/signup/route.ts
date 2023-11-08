import { connect } from "@/db/dbConfig"
import User from "@/models/userModel"
import { genSalt } from "bcrypt-ts"
import { hash } from "bcrypt-ts/browser"

import { NextResponse } from "next/server"

connect()

const hashPassword = async (unhashPassword: string) => {
  const saltRound = 10
  const salt = await genSalt(saltRound)
  return await hash(unhashPassword, salt)
}

// SIGN UP
export async function POST(request: Request) {
  try {
    const reqBody = await request.json()
    const { name, username, angkatan, password } = reqBody

    const hashedPassword = await hashPassword(password)

    const user = await User.findOne({ username })

    if (user) {
      throw new Error("Username sudah digunakan")
    } else {
      const user = await User.create({
        name,
        username,
        angkatan,
        password: hashedPassword,
      })

      return NextResponse.json({
        status: 201,
        message: `Berhasil membuat akun ${user.name}`,
        user: user,
      })
    }
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
