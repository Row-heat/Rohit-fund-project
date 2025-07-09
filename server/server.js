const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const fundRoutes = require("./routes/funds");
const analyticsFundRoutes = require("./routes/fund");

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Proper CORS middleware setup
const corsOptions = {
  origin: 'https://rohit-fund-project.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ Handle preflight requests with same config

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/funds", fundRoutes);
app.use("/api/fund", analyticsFundRoutes);

// ✅ Test route
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

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
