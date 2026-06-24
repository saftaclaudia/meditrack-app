const mongoose = require("mongoose");

const templateEntrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  { _id: false }
);

const mealTemplateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    entries: [templateEntrySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealTemplate", mealTemplateSchema);
