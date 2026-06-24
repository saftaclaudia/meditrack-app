const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
    category: {
      type: String,
      enum: ["cardio", "strength", "sport", "daily"],
      default: "cardio",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
