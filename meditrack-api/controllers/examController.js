const Exam = require("../models/Exam");

const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createExam = async (req, res) => {
  try {
    const exam = await Exam.create({ ...req.body, user: req.user._id });
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({ _id: req.params.id, user: req.user._id });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({ _id: req.params.id, user: req.user._id });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    await exam.deleteOne();
    res.json({ message: "Exam deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getExams, createExam, updateExam, deleteExam };
