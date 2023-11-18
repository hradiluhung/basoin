import Subject from "@/models/subjectModels"
import User from "@/models/userModel"
import { log } from "console"
import { NextResponse } from "next/server"

// GET SUBJECT WITH ISFOLLOWED BY USER BY ID
export async function GET(
  request: Request,
  { params }: { params: { userId: string; subjectId: string } }
) {
  const userId = params.userId
  const subjectId = params.subjectId

  try {
    const user = await User.findById(userId)
    const subject = await Subject.findById(subjectId)

    const isFollowed = user.followedSubjects.includes(subject._id.toString())

    const subjectWithFollowed = { ...subject._doc, isFollowed }

    return NextResponse.json({
      status: 200,
      message: `Berhasil mendapatkan data mata kuliah ${subject.name}`,
      subject: subjectWithFollowed,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
