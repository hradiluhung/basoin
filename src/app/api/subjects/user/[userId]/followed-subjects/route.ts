import startDb from "@/db/dbConfig"
import Subject from "@/models/subjectModels"
import User from "@/models/userModel"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET FOLLOWED SUBJECTS BY USER ID
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId
  await startDb()

  try {
    const user = await User.findById(userId)

    const followedSubjects = user.followedSubjects

    const subjects = await Subject.find({
      _id: { $in: followedSubjects },
    })

    const subjectsWithIsFollowed = subjects.map((subject) => {
      return {
        ...subject._doc,
        isFollowed: true,
      }
    })

    return NextResponse.json({
      status: 200,
      message: "Berhasil mendapatkan data mata pelajaran",
      subjects: subjectsWithIsFollowed,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
