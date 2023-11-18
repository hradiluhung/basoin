import startDb from "@/db/dbConfig"
import Feedback from "@/models/feedbackModels"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// CREATE NEW FEEDBACK
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId

  await startDb()

  try {
    const reqBody = await request.json()
    const { title, description, image, publicId } = reqBody

    const feedback = await Feedback.create({
      title,
      description,
      image,
      publicId,
      _userId: userId,
    })

    return NextResponse.json({
      status: 201,
      message: "Berhasil membuat feedback",
      feedback: feedback,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
