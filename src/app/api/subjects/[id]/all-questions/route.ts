import Paket from "@/models/paketModels"
import Qna from "@/models/qnaModel"
import { NextResponse } from "next/server"

// GET ALL QUESTIONS BY SUBJECT ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const subjectId = params.id

  try {
    const pakets = await Paket.find({ _subjectId: subjectId })
    const paketIds = await Paket.find({ _subjectId: subjectId }).select("_id")

    const questions = await Qna.find({ _paketId: { $in: paketIds } })

    // add year and type from paket to questions
    const questionsWithYearAndType = questions
      .map((question) => {
        const paket = pakets.find((paket) =>
          paket._id.equals(question._paketId)
        )

        return {
          ...question._doc,
          year: paket?.year,
          type: paket?.type,
        }
      })
      .sort((a, b) => {
        if (a.year > b.year) return -1
        if (a.year < b.year) return 1
        if (a.type > b.type) return 1
        if (a.type < b.type) return -1
        return 0
      })

    return NextResponse.json({
      status: 200,
      message: "Berhasil mendapatkan data pertanyaan",
      questions: questionsWithYearAndType,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
