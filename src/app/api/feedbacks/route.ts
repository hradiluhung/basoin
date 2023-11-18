import startDb from "@/db/dbConfig"
import Feedback from "@/models/feedbackModels"
import User from "@/models/userModel"
import { NextResponse } from "next/server"

// GET ALL FEEDBACKS
export async function GET() {
  await startDb()
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 })
    const userIds = feedbacks.map((feedback) => feedback._userId)

    const users = await User.find({ _id: { $in: userIds } })

    const feedbacksWithUserName = feedbacks.map((feedback) => {
      const user = users.find((user) => user._id.equals(feedback._userId))
      return {
        ...feedback._doc,
        userName: user?.name,
      }
    })

    return NextResponse.json({
      status: 200,
      message: "Berhasil mendapatkan data mata kuliah",
      feedbacks: feedbacksWithUserName,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
