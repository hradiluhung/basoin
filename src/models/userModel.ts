import { Schema, model, models } from "mongoose"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username tidak boleh kosong"],
      unique: [true, "Username sudah digunakan"],
    },
    name: {
      type: String,
      required: [true, "Nama tidak boleh kosong"],
    },
    angkatan: {
      type: Number,
      required: [true, "Angkatan tidak boleh kosong"],
    },
    password: {
      type: String,
      required: [true, "Password tidak boleh kosong"],
    },
    followedSubjects: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const User = models.users || model("users", userSchema)

export default User
