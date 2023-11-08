import { Schema, model, models } from "mongoose";

const paketSchema = new Schema(
  {
    year: {
      type: Number,
      required: [true, "Tahun tidak boleh kosong"],
    },
    type: {
      type: String,
      required: [true, "Tipe paket tidak boleh kosong"],
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

const Paket = models.pakets || model("pakets", paketSchema);

export default Paket;
