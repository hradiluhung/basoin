import startDb from "@/db/dbConfig"
import User from "@/models/userModel"
import { NextResponse } from "next/server"
import { hashPassword } from "@/helpers/hashPassword"

export const dynamic = "force-dynamic"

interface NewUserRequest {
  username: string
  name: string
  angkatan: number
  password: string
}

interface NewUserResponse {
  id: string
  username: string
  name: string
  angkatan: number
  role: string
}

type NewResponse = NextResponse<{ user?: NewUserResponse; error?: string }>

export const POST = async (req: Request): Promise<NewResponse> => {
  const body = (await req.json()) as NewUserRequest

  await startDb()

  const oldUser = await User.findOne({ username: body.username })
  if (oldUser)
    return NextResponse.json({ status: 422, error: "Username sudah digunakan" })

  body.password = await hashPassword(body.password)
  const user = await User.create({ ...body })

  return NextResponse.json({
    status: 201,
    message: `Berhasil membuat akun ${user.name}`,
    user: {
      id: user._id,
      username: user.username,
      name: user.name,
      angkatan: user.angkatan,
      role: user.role,
    },
  })
}
