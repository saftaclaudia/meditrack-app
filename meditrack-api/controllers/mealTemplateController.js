const MealTemplate = require("../models/MealTemplate");

const getTemplates = async (req, res) => {
  try {
    const templates = await MealTemplate.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(templates);
  } catch {
    res.status(500).json({ message: "Failed to fetch templates" });
  }
};

const createTemplate = async (req, res) => {
  try {
    const { name, entries } = req.body;
    const template = await MealTemplate.create({ user: req.user._id, name, entries });
    res.status(201).json(template);
  } catch {
    res.status(500).json({ message: "Failed to create template" });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    await MealTemplate.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ id: req.params.id });
  } catch {
    res.status(500).json({ message: "Failed to delete template" });
  }
};

module.exports = { getTemplates, createTemplate, deleteTemplate };
