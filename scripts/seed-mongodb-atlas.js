// Seed script specifically for MongoDB Atlas
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

// User schema
const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    savedFunds: [
      {
        schemeCode: String,
        schemeName: String,
        savedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
)

const User = mongoose.model("User", userSchema)

async function seedMongoDBAtlas() {
  console.log("🌱 Seeding MongoDB Atlas with sample data...\n")

  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ Connected to MongoDB Atlas")

    // Clear existing data
    await User.deleteMany({})
    console.log("🧹 Cleared existing user data")

    // Create sample users
    const hashedPassword = await bcrypt.hash("password123", 12)

    const sampleUsers = [
      {
        email: "demo@mutualfund.com",
        password: hashedPassword,
        savedFunds: [
          {
            schemeCode: "120503",
            schemeName: "Aditya Birla Sun Life Tax Relief 96 - Growth",
          },
          {
            schemeCode: "120504",
            schemeName: "Aditya Birla Sun Life Frontline Equity Fund - Growth",
          },
          {
            schemeCode: "100016",
            schemeName: "SBI Bluechip Fund - Growth",
          },
        ],
      },
      {
        email: "investor@example.com",
        password: hashedPassword,
        savedFunds: [
          {
            schemeCode: "101206",
            schemeName: "HDFC Top 100 Fund - Growth",
          },
        ],
      },
      {
        email: "test@test.com",
        password: hashedPassword,
        savedFunds: [],
      },
    ]

    const createdUsers = await User.insertMany(sampleUsers)
    console.log(`✅ Created ${createdUsers.length} sample users`)

    console.log("\n🎉 MongoDB Atlas seeding completed successfully!")
    console.log("\n👤 Demo Accounts Created:")
    console.log("📧 Email: demo@mutualfund.com")
    console.log("🔒 Password: password123")
    console.log("💼 Portfolio: 3 saved funds")
    console.log("")
    console.log("📧 Email: investor@example.com")
    console.log("🔒 Password: password123")
    console.log("💼 Portfolio: 1 saved fund")
    console.log("")
    console.log("📧 Email: test@test.com")
    console.log("🔒 Password: password123")
    console.log("💼 Portfolio: Empty")
  } catch (error) {
    console.error("❌ Seeding failed:", error.message)
  } finally {
    await mongoose.connection.close()
    console.log("\n🔌 Database connection closed")
  }
}

seedMongoDBAtlas()
