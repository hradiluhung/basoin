import { NextResponse } from "next/server"
import Subject from "@/models/subjectModels"
import startDb from "@/db/dbConfig"

export const dynamic = "force-dynamic"

// GET ALL SUBJECTS
export async function GET() {
  await startDb()

  try {
    const subjects = await Subject.find().sort({ semester: 1 })

    return NextResponse.json({
      status: 200,
      message: "Berhasil mendapatkan data mata kuliah",
      subjects: subjects,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}

// CREATE NEW SUBJECT
export async function POST(request: Request) {
  await startDb()

  try {
    const reqBody = await request.json()
    const { code, name, semester, image, publicId } = reqBody

    const subject = await Subject.findOne({ code })

    if (subject) {
      throw new Error("Mata kuliah dengan kode yang sama sudah ada")
    } else {
      const subject = await Subject.create({
        code,
        name,
        semester,
        image,
        publicId,
      })

      return NextResponse.json({
        status: 201,
        message: `Berhasil membuat mata kuliah ${subject.name}`,
        subject: subject,
      })
    }
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
