import Qna from "@/models/qnaModel"
import Subject from "@/models/subjectModels"
import { NextResponse } from "next/server"
import { connect } from "@/db/dbConfig"

connect()

// DELETE QNA BY ID
export async function DELETE(request: Request, context: any) {
  const id = context.params.id

  try {
    const qna = await Qna.findByIdAndDelete(id)

    await Subject.updateOne(
      { _id: qna._subjectId },
      { $inc: { numberOfQnA: -1 } }
    )

    return NextResponse.json({
      status: 200,
      qna: qna,
      message: "Berhasil menghapus pertanyaan dan jawaban",
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
