const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getTemplates, createTemplate, deleteTemplate } = require("../controllers/mealTemplateController");

router.use(protect);
router.get("/", getTemplates);
router.post("/", createTemplate);
router.delete("/:id", deleteTemplate);

module.exports = router;
