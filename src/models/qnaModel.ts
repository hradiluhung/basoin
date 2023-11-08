import { Schema, model, models } from "mongoose";

const qnaSchema = new Schema(
  {
    question: {
      type: String,
      required: [true, "Pertanyaan tidak boleh kosong"],
    },
    questionImage: {
      type: String,
      default: "",
    },
    publicIdQuestionImage: {
      type: String,
      default: "",
    },
    answer: {
      type: String,
      required: [true, "Jawaban tidak boleh kosong"],
    },
    answerImage: {
      type: String,
      default: "",
    },
    publicIdAnswerImage: {
      type: String,
      default: "",
    },
    _paketId: {
      type: Schema.Types.ObjectId,
      ref: "Paket",
      required: true,
    },
    _subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Qna = models.qnas || model("qnas", qnaSchema);

export default Qna;
