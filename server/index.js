const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routePlannerRoutes = require("./routes/routePlanner.routes");
const healthRoutes = require("./routes/health.routes");
const errorHandler = require("./middlewares/errorHandler.middleware");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/health", healthRoutes);
app.use("/api/route", routePlannerRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
