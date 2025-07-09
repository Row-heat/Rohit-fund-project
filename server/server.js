const express = require("express");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const fundRoutes = require("./routes/funds");
const analyticsFundRoutes = require("./routes/fund");

const app = express();

// ✅ Custom CORS Middleware for Render + Vercel
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://rohit-fund-project.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// ✅ Connect MongoDB
connectDB();

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/funds", fundRoutes);
app.use("/api/fund", analyticsFundRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.json({
    message: "Mutual Fund API is running!",
    database: "MongoDB Atlas Connected",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    database: "connected",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
