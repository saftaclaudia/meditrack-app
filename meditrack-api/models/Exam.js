const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  name: { type: String, require: true },
  file: { type: String, require: true },
  uploadedAt: { type: String, require: true },
  type: { type: String, default: "pdf" },
});

const examSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    name: { type: String, require: true },
    speciality: { type: String, default: "" },
    doctor: { type: String, default: "" },
    lastDate: { type: String, default: "" },
    nextDate: { type: String, default: "" },
    result: { type: String, default: "" },
    treatment: { type: String, default: "" },
    notes: { type: String, default: "" },
    documents: [documentSchema],
  },
  { timestamps: true },
);
module.exports = mongoose.model("Exam", examSchema);
