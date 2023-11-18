import startDb from "@/db/dbConfig"
import User from "@/models/userModel"
import { NextResponse } from "next/server"

// GET USER BY ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  await startDb()

  try {
    const user = await User.findById(id)

    user.password = undefined

    return NextResponse.json({
      status: 200,
      message: "Berhasil mendapatkan data user",
      user: user,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}

// UPDATE USER BY ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  await startDb()

  try {
    const { username, name, angkatan } = await request.json()

    const oldUser = await User.find({ username: username })

    if (oldUser) {
      throw new Error("Username sudah digunakan")
    } else {
      const user = await User.findOneAndUpdate(
        { _id: id },
        {
          username,
          name,
          angkatan,
        },
        { new: true }
      )

      return NextResponse.json({
        status: 200,
        message: "Berhasil mengupdate profil Anda",
        user: user,
      })
    }
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
