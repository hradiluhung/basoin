import Qna from "@/models/qnaModel"
import Subject from "@/models/subjectModels"
import { NextResponse } from "next/server"
import startDb from "@/db/dbConfig"

// DELETE QNA BY ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  await startDb()

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

// UPDATE QNA BY ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  await startDb()

  try {
    const reqBody = await request.json()
    const {
      question,
      answer,
      questionImage,
      answerImage,
      publicIdQuestionImage,
      publicIdAnswerImage,
    } = reqBody

    const qna = await Qna.findOneAndUpdate(
      { _id: id },
      {
        question,
        answer,
        questionImage,
        answerImage,
        publicIdQuestionImage,
        publicIdAnswerImage,
      },
      { new: true }
    )

    return NextResponse.json({
      status: 200,
      message: "Berhasil mengubah pertanyaan dan jawaban",
      qna: qna,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
