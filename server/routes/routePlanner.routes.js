const express = require("express");
const router = express.Router();
const {
  getOptimizedRoutes
} = require("../controllers/routePlanner.controller");
const validateRequest = require("../middlewares/validateRequest.middleware");

router.get("/", validateRequest, getOptimizedRoutes);

module.exports = router;
