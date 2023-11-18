import startDb from "@/db/dbConfig"
import { NextResponse } from "next/server"
import User from "@/models/userModel"
import { compare } from "bcrypt-ts"
import { hashPassword } from "@/helpers/hashPassword"

export const dynamic = "force-dynamic"
// UPDATE PASSWORD BY USER ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  await startDb()

  try {
    const { oldPassword, newPassword } = await request.json()

    // validate old password
    const user = await User.findById(id)
    const validPassword = await compare(oldPassword, user.password)
    if (!validPassword) {
      throw new Error("Gagal mengganti password. Password lama tidak sesuai")
    }

    // update password
    const hashedPassword = await hashPassword(newPassword)

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { password: hashedPassword },
      { new: true }
    )

    return NextResponse.json({
      status: 200,
      message: "Berhasil mengganti password Anda",
      user: updatedUser,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
