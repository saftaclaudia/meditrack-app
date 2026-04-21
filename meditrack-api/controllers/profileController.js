const User = require("../models/User");

const calculateRecommendedCalories = (user) => {
  const { age, sex, heightCm, weightKg, targetWeightKg, activityLevel } = user;

  if (!age || !sex || !heightCm || !weightKg) return null;
  // BRM
  let bmr;
  if (sex === "male") {
    brm = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    brm = 10 * weightKg + 6.25 + heightCm - 5 * age - 161;
  }

  // TDEE
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const tdee = brm * (activityFactors[activityLevel] || 1.2);

  if (!targetWeightKg) return Math.round(tdee);

  if (targetWeightKg < weightKg) {
    return Math.round(tdee - 500);
  } else if (targetWeightKg > weightKg) {
    return Math.round(tdee + 300);
  } else {
    return Math.round(tdee);
  }
};

// GET /profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(400).json({ message: "User not found" });

    const recommendedCalories = calculateRecommendedCalories(user);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      heightCm: user.heightCm,
      weightKg: user.weightKg,
      targetWeightKg: user.targetWeightKg,
      activityLevel: user.activityLevel,
      recommendedCalories,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// PATCH /profile update
const updateProfile = async (req, res) => {
  try {
    const {
      age,
      sex,
      heightCm,
      weightKg,
      targetWeightKg,
      activityLevel,
      name,
    } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    if (sex !== undefined) user.sex = sex;
    if (heightCm !== undefined) user.heightCm = heightCm;
    if (weightKg !== undefined) user.weightKg = weightKg;
    if (targetWeightKg !== undefined) user.targetWeightKg = targetWeightKg;
    if (activityLevel !== undefined) user.activityLevel = activityLevel;

    await user.save();

    const recommendedCalories = calculateRecommendedCalories(user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      heightCm: user.heightCm,
      weightKg: user.weightKg,
      targetWeightKg: user.targetWeightKg,
      activityLevel: user.activityLevel,
      recommendedCalories,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = { getProfile, updateProfile };
