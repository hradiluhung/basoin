import User from "@/models/userModel"
import { NextResponse } from "next/server"
import startDb from "@/db/dbConfig"

// GET ALL USERS
export async function GET() {
  try {
    await startDb()
    const users = await User.find()

    // filter which role is not admin
    const filteredUsers = users.filter((user) => user.role !== "admin")

    // hide password
    filteredUsers.forEach((user) => {
      user.password = undefined
    })

    return NextResponse.json({
      status: 200,
      message: "Berhasil mendapatkan data user",
      users: filteredUsers,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
