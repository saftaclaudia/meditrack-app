const Recipe = require("../models/Recipe");

const computeCalories = (ingredients, portions) => {
  const total = Math.round(
    ingredients.reduce((sum, i) => sum + i.calories, 0)
  );
  return { totalCalories: total, caloriesPerPortion: Math.round(total / portions) };
};

// GET /recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

// POST /recipes
const createRecipe = async (req, res) => {
  try {
    const { name, portions, ingredients } = req.body;
    const { totalCalories, caloriesPerPortion } = computeCalories(ingredients, portions);
    const recipe = await Recipe.create({
      user: req.user._id,
      name,
      portions,
      ingredients,
      totalCalories,
      caloriesPerPortion,
    });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Failed to create recipe" });
  }
};

// PUT /recipes/:id
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const { name, portions, ingredients } = req.body;
    const { totalCalories, caloriesPerPortion } = computeCalories(ingredients, portions);

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      { name, portions, ingredients, totalCalories, caloriesPerPortion },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update recipe" });
  }
};

// DELETE /recipes/:id
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    await recipe.deleteOne();
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};

module.exports = { getRecipes, createRecipe, updateRecipe, deleteRecipe };
