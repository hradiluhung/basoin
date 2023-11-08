import { Schema, model, models } from "mongoose"

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Nama mata kuliah tidak boleh kosong"],
    },
    semester: {
      type: String,
      required: [true, "Semester tidak boleh kosong"],
    },
    code: {
      type: String,
      required: [true, "Kode mata kuliah tidak boleh kosong"],
    },
    image: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
    followers: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    numberOfQnA: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const Subject = models.subjects || model("subjects", subjectSchema)

export default Subject
