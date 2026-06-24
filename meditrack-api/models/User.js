const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerifyToken: { type: String },
  emailVerifyExpire: { type: Date },
  age: { type: Number },
  sex: { type: String, enum: ["male", "female"] },
  heightCm: { type: Number },
  weightKg: { type: Number },
  targetWeightKg: { type: Number },
  activityLevel: {
    type: String,
    enum: ["sedentary", "light", "moderate", "active", "very_active"],
    default: "sedentary",
  },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  notificationPrefs: {
    exams: { type: Boolean, default: true },
    calories: { type: Boolean, default: true },
    mealReminders: {
      breakfast: { enabled: { type: Boolean, default: false }, time: { type: String, default: "08:00" } },
      lunch:     { enabled: { type: Boolean, default: false }, time: { type: String, default: "13:00" } },
      dinner:    { enabled: { type: Boolean, default: false }, time: { type: String, default: "19:00" } },
    },
    waterReminder:    { type: Boolean, default: false },
    caloriesPacing:   { type: Boolean, default: false },
  },
  macroGoals: {
    protein: { type: Number },
    carbs:   { type: Number },
    fat:     { type: Number },
  },
  favoriteFoods: [
    {
      name:     { type: String },
      calories: { type: Number },
      quantity: { type: Number },
      unit:     { type: String },
      protein:  { type: Number },
      carbs:    { type: Number },
      fat:      { type: Number },
    },
  ],
});

// Encrypt password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
