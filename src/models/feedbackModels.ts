import { Schema, model, models } from "mongoose"

const feedbackSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Judul tidak boleh kosong"],
    },
    description: {
      type: String,
      required: [true, "Deskripsi tidak boleh kosong"],
    },
    _userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

const Feedback = models.feedbacks || model("feedbacks", feedbackSchema)

export default Feedback
