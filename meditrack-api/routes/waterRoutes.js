const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getWater, setWater } = require("../controllers/waterController");

router.use(protect);
router.get("/", getWater);
router.put("/", setWater);

module.exports = router;
