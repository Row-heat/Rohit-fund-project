const express = require("express")
const cors = require("cors")
require("dotenv").config()
const connectDB = require("./config/database")
const authRoutes = require("./routes/auth")
const fundRoutes = require("./routes/funds")
const analyticsFundRoutes = require("./routes/funds")

const app = express()

// ✅ CORS configuration using your environment variables
const allowedOrigins = [
  "http://localhost:3000", // Local development
  "https://rohit-fund-project.vercel.app", // Your Vercel deployment
  process.env.ALLOWED_ORIGIN, // From your env vars
].filter(Boolean) // Remove undefined values

console.log("🌐 Allowed CORS origins:", allowedOrigins)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS allowed for origin: ${origin}`)
        return callback(null, true)
      } else {
        console.log(`❌ CORS blocked for origin: ${origin}`)
        return callback(new Error(`Not allowed by CORS. Origin: ${origin}`))
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    exposedHeaders: ["Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  }),
)

// ✅ Handle preflight requests explicitly
app.options("*", cors())

// ✅ Additional middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get("Origin")}`)
  next()
})

app.use(express.json())

connectDB()

// ✅ Routes
app.use("/api/auth", authRoutes)
app.use("/api/funds", fundRoutes)
app.use("/api/fund", analyticsFundRoutes)

// ✅ Test route with environment info
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Mutual Fund API is running!",
    database: "MongoDB Connected",
    time: new Date().toISOString(),
    allowedOrigins: allowedOrigins,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
      CUSTOM_MF_API_URL: process.env.CUSTOM_MF_API_URL,
    },
  })
})

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    database: "connected",
    timestamp: new Date().toISOString(),
    cors: {
      allowedOrigins: allowedOrigins,
    },
  })
})

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message)

  if (err.message.includes("Not allowed by CORS")) {
    return res.status(403).json({
      error: "CORS Error",
      message: err.message,
      allowedOrigins: allowedOrigins,
    })
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  })
})

// ✅ Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌐 Allowed origins:`, allowedOrigins)
  console.log(`🔗 API URL: https://rohit-fund-project-3.onrender.com`)
})