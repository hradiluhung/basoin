export type Subject = {
  _id: string
  name: string
  semester: string
  code: string
  image: string
  publicId: string
  followers: []
  numberOfQnA: number
  createdAt?: Date
  updatedAt?: Date
}

export type Paket = {
  _id: string
  year: number
  type: string
  _subjectId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type Qna = {
  _id: string
  question: string
  questionImage: string
  publicIdQuestionImage: string
  answer: string
  answerImage: string
  publicIdAnswerImage: string
  _paketId?: string
  _subjectId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type User = {
  _id: string
  username: string
  name: string
  angkatan: number
  followedSubjects: [string]
  createdAt?: Date
  updatedAt?: Date
}
