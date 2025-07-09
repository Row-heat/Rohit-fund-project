const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const fundRoutes = require("./routes/funds");
const analyticsFundRoutes = require("./routes/fund");

const app = express();

// ✅ Correct CORS setup for Render + Vercel
app.use(cors({
  origin: "https://rohit-fund-project.vercel.app", // ✅ Frontend domain
  credentials: true, // ✅ Allow cookies/headers with credentials
}));

// ✅ Parse JSON requests
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Define routes
app.use("/api/auth", authRoutes);
app.use("/api/funds", fundRoutes);
app.use("/api/fund", analyticsFundRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Mutual Fund API is running!",
    database: "MongoDB Connected",
    time: new Date().toISOString(),
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

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
