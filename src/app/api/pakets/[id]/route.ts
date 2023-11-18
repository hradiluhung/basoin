import Paket from "@/models/paketModels"
import { NextResponse } from "next/server"
import startDb from "@/db/dbConfig"
import Qna from "@/models/qnaModel"
import Subject from "@/models/subjectModels"

export const dynamic = "force-dynamic"

// GET PAKET BY ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  await startDb()

  try {
    const paket = await Paket.findById(id)

    return NextResponse.json({
      status: 200,
      message: "Berhasil mendapatkan data paket",
      paket: paket,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}

// UPDATE PAKET BY ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  await startDb()

  try {
    const reqBody = await request.json()
    const { year, type } = reqBody

    const paket = await Paket.findByIdAndUpdate(
      id,
      { year, type },
      { new: true }
    )

    return NextResponse.json({
      status: 200,
      message: `Berhasil mengubah data paket ${paket.year} - ${paket.type}`,
      paket: paket,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}

// DELETE PAKET BY ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  await startDb()

  try {
    const paket = await Paket.findByIdAndDelete(id)

    const qna = await Qna.find({ _paketId: id })
    await Qna.deleteMany({ _paketId: id })

    await Subject.updateOne(
      { _id: paket._subjectId },
      { $inc: { numberOfQnA: -qna.length } }
    )

    return NextResponse.json({
      status: 200,
      message: `Berhasil menghapus paket ${paket.year} - ${paket.type}`,
      paket: paket,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
