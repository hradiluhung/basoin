import startDb from "@/db/dbConfig"
import Subject from "@/models/subjectModels"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET LAST OPENED SUBJECTS
export async function GET(
  request: Request,
  { params }: { params: { ids: string } }
) {
  try {
    const subjectIds = params.ids.split(",")

    await startDb()

    const subjects = await Subject.find({
      _id: {
        $in: subjectIds,
      },
    })

    return NextResponse.json({
      status: 200,
      message: "Berhasil mendapatkan data mata kuliah",
      subjects: subjects,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
