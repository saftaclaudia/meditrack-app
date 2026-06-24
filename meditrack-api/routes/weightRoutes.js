const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getWeightHistory, logWeight, deleteWeight } = require("../controllers/weightController");

router.use(protect);
router.get("/", getWeightHistory);
router.put("/", logWeight);
router.delete("/:id", deleteWeight);

module.exports = router;
