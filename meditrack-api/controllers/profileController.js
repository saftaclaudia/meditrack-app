const User = require("../models/User");

const calculateRecommendedCalories = (user) => {
  const { age, sex, heightCm, weightKg, targetWeightKg, activityLevel } = user;

  if (!age || !sex || !heightCm || !weightKg) return null;
  // BMR
  let bmr;
  if (sex === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  // TDEE
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const tdee = bmr * (activityFactors[activityLevel] || 1.2);

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
      sex: user.sex,
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
      email,
    } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name !== undefined) user.name = name;
    if (email !== undefined) {
      const emailTaken = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (emailTaken) return res.status(400).json({ message: "Email already in use" });
      user.email = email;
    }
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
      sex: user.sex,
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

// GET /profile/macros
const getMacroGoals = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("macroGoals");
    res.json(user?.macroGoals ?? {});
  } catch {
    res.status(500).json({ message: "Failed to fetch macro goals" });
  }
};

// PATCH /profile/macros
const updateMacroGoals = async (req, res) => {
  try {
    const { protein, carbs, fat } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.macroGoals) user.macroGoals = {};
    if (protein !== undefined) user.macroGoals.protein = protein;
    if (carbs !== undefined) user.macroGoals.carbs = carbs;
    if (fat !== undefined) user.macroGoals.fat = fat;
    user.markModified("macroGoals");
    await user.save();
    res.json(user.macroGoals);
  } catch {
    res.status(500).json({ message: "Failed to update macro goals" });
  }
};

// GET /profile/favorites
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("favoriteFoods");
    res.json(user?.favoriteFoods ?? []);
  } catch {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

// POST /profile/favorites
const addFavorite = async (req, res) => {
  try {
    const { name, calories, quantity, unit, protein, carbs, fat } = req.body;
    const user = await User.findById(req.user._id);
    const already = user.favoriteFoods.find(
      (f) => f.name.toLowerCase() === name.toLowerCase()
    );
    if (already) return res.status(409).json({ message: "Already in favorites" });
    user.favoriteFoods.push({ name, calories, quantity, unit, protein, carbs, fat });
    await user.save();
    res.status(201).json(user.favoriteFoods);
  } catch {
    res.status(500).json({ message: "Failed to add favorite" });
  }
};

// DELETE /profile/favorites/:name
const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favoriteFoods = user.favoriteFoods.filter(
      (f) => f.name.toLowerCase() !== decodeURIComponent(req.params.name).toLowerCase()
    );
    await user.save();
    res.json(user.favoriteFoods);
  } catch {
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};

module.exports = { getProfile, updateProfile, getMacroGoals, updateMacroGoals, getFavorites, addFavorite, removeFavorite };
