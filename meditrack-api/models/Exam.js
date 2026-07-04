const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  file: { type: String, required: true },
  uploadedAt: { type: String, required: true },
  type: { type: String, default: "pdf" },
});

const examSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      default: "general",
    },

    speciality: { type: String, default: "" },
    doctor: { type: String, default: "" },

    lastDate: { type: Date },
    nextDate: { type: Date },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    recommendationNotified: {
      type: Boolean,
      default: false,
    },

    recommendedFrequencyMonths: { type: Number },

    result: { type: String, default: "" },
    resultValue: { type: Number },
    resultUnit: { type: String, default: "" },
    treatment: { type: String, default: "" },
    clinic: { type: String, default: "" },
    notes: { type: String, default: "" },
    documents: [documentSchema],
  },

  { timestamps: true },
);
module.exports = mongoose.model("Exam", examSchema);
