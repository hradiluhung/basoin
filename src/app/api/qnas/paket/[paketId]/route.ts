import Qna from "@/models/qnaModel"
import Subject from "@/models/subjectModels"
import { NextResponse } from "next/server"
import startDb from "@/db/dbConfig"

// GET ALL QNA BY PAKETID
export async function GET(
  request: Request,
  { params }: { params: { paketId: string } }
) {
  const paketId = params.paketId

  await startDb()

  try {
    const qnas = await Qna.find({ _paketId: paketId }).sort({
      createdAt: 1,
    })

    return NextResponse.json({
      status: 200,
      message: "Berhasil mendapatkan data pertanyaan dan jawaban",
      qnas: qnas,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}

// CREATE QNA BY PAKETID
export async function POST(
  request: Request,
  { params }: { params: { paketId: string } }
) {
  const paketId = params.paketId

  await startDb()

  try {
    const reqBody = await request.json()
    const {
      question,
      questionImage,
      publicIdQuestionImage,
      answer,
      answerImage,
      publicIdAnswerImage,
      subjectId,
    } = reqBody

    const qna = await Qna.create({
      question,
      questionImage,
      publicIdQuestionImage,
      answer,
      answerImage,
      publicIdAnswerImage,
      _paketId: paketId,
      _subjectId: subjectId,
    })

    await Subject.updateOne({ _id: subjectId }, { $inc: { numberOfQnA: 1 } })

    return NextResponse.json({
      status: 201,
      message: "Berhasil membuat pertanyaan dan jawaban",
      qna: qna,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
