import axios from "axios"

// GET ALL QNA BY PAKETID
export const getAllQnasByPaketId = async (paketId: string) => {
  try {
    const response = await axios.get(`/api/qnas/paket/${paketId}`)

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

// CREATE QNA BY PAKETID
export const createQnaByPaketId = async ({
  paketId,
  question,
  questionImage,
  publicIdQuestionImage,
  answer,
  answerImage,
  publicIdAnswerImage,
  subjectId,
}: {
  paketId: string
  question: string
  questionImage: string
  publicIdQuestionImage: string
  answer: string
  answerImage: string
  publicIdAnswerImage: string
  subjectId: string
}) => {
  try {
    const response = await axios.post(`/api/qnas/paket/${paketId}`, {
      question,
      questionImage,
      publicIdQuestionImage,
      answer,
      answerImage,
      publicIdAnswerImage,
      subjectId,
    })

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}

// DELETE QNA BY ID
export const deleteQnaByQnaId = async (id: string) => {
  try {
    const response = await axios.delete(`/api/qnas/${id}`)

    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.message)
  }
}
