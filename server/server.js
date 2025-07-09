const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const fundRoutes = require("./routes/funds");
const analyticsFundRoutes = require("./routes/fund");

const app = express();

// ✅ Correct CORS Configuration
app.use(cors({
  origin: "https://rohit-fund-project.vercel.app", // Your frontend URL
  credentials: true,
}));

// ✅ Parse JSON requests
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Define Routes
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

// ✅ Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    database: "connected",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
