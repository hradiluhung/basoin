import Subject from "@/models/subjectModels"
import { NextResponse } from "next/server"
import startDb from "@/db/dbConfig"
import Paket from "@/models/paketModels"
import Qna from "@/models/qnaModel"

export const dynamic = "force-dynamic"

// GET SUBJECT BY ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  await startDb()

  try {
    const subject = await Subject.findById(id)

    return NextResponse.json({
      status: 200,
      message: "Berhasil mendapatkan data mata kuliah",
      subject: subject,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}

// UPDATE SUBJECT BY ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  await startDb()

  try {
    const reqBody = await request.json()
    const { code, name, semester, image, publicId } = reqBody

    const subject = await Subject.findOne({ code })

    if (!subject._id.equals(id)) {
      throw new Error("Mata kuliah dengan kode yang sama sudah ada")
    } else {
      const subject = await Subject.findOneAndUpdate(
        { _id: id },
        { code, name, semester, image, publicId },
        { new: true }
      )

      return NextResponse.json({
        status: 200,
        message: `Berhasil mengubah data mata kuliah ${subject.name}`,
        subject: subject,
      })
    }
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}

// DELETE SUBJECT BY ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  await startDb()

  try {
    const subject = await Subject.findByIdAndDelete(id)

    await Paket.deleteMany({ _subjectId: id })
    await Qna.deleteMany({ _subjectId: id })

    return NextResponse.json({
      status: 200,
      subject: subject,
      message: `Berhasil menghapus mata kuliah ${subject.name}`,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
