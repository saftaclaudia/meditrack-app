const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, enum: ["g", "ml", "buc"], default: "g" },
  caloriesPer: { type: Number, required: true },
  baseQty: { type: Number, required: true },
  calories: { type: Number, required: true },
});

const recipeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    portions: { type: Number, required: true, min: 1, default: 1 },
    ingredients: [ingredientSchema],
    totalCalories: { type: Number, default: 0 },
    caloriesPerPortion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
