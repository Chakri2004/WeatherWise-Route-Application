const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "WeatherWise Route Planner",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
