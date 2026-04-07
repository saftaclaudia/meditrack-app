const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: "buc" },
});

const mealSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
    required: true,
  },
  entries: [entrySchema],
});

const calorieLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    dailyGoal: { type: Number, default: 2000 },
    meals: [mealSchema],
  },
  { timestamps: true },
);

calorieLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("CalorieLog", calorieLogSchema);
