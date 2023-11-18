import startDb from "@/db/dbConfig"
import Subject from "@/models/subjectModels"
import User from "@/models/userModel"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET ALL SUBJECTS WITH ISFOLLOWED BY USER
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId

  await startDb()

  try {
    const user = await User.findById(userId)
    const subjects = await Subject.find()

    const subjectsWithFollowed = subjects.map((subject) => {
      const isFollowed = user.followedSubjects.includes(subject._id.toString())
      return { ...subject._doc, isFollowed }
    })

    return NextResponse.json({
      status: 200,
      message: "Berhasil mendapatkan data mata kuliah",
      subjects: subjectsWithFollowed,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}

// UPDATE FOLLOWED SUBJECTS
export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId

  await startDb()

  try {
    let message = ""
    const reqBody = await request.json()
    const { subjectId } = reqBody

    const user = await User.findById(userId)
    const subject = await Subject.findById(subjectId)

    if (!user.followedSubjects.includes(subjectId)) {
      user.followedSubjects.push(subjectId)
      subject.followers.push(userId)

      message = `${subject.name} berhasil diikuti`
    } else {
      user.followedSubjects = user.followedSubjects.filter(
        (subject: string) => subject != subjectId
      )
      subject.followers = subject.followers.filter(
        (user: string) => user != userId
      )
      message = `Berhasil berhenti mengikuti ${subject.name}`
    }

    await user.save()
    await subject.save()

    return NextResponse.json({
      status: 200,
      message: message,
      user,
      subject,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
