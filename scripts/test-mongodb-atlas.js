// Test script to verify MongoDB Atlas connection
const mongoose = require("mongoose")
require("dotenv").config()

async function testMongoDBAtlas() {
  console.log("🔍 Testing MongoDB Atlas Connection...\n")

  try {
    // Connect to MongoDB Atlas
    console.log("1. Connecting to MongoDB Atlas...")
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`✅ Connected successfully!`)
    console.log(`📊 Host: ${conn.connection.host}`)
    console.log(`🗄️  Database: ${conn.connection.name}`)
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? "Connected" : "Disconnected"}`)

    // Test database operations
    console.log("\n2. Testing database operations...")

    // Create a test collection
    const TestCollection = mongoose.model(
      "Test",
      new mongoose.Schema({
        message: String,
        timestamp: { type: Date, default: Date.now },
      }),
    )

    // Insert test document
    const testDoc = new TestCollection({
      message: "MongoDB Atlas connection test successful!",
    })

    await testDoc.save()
    console.log("✅ Test document created successfully")

    // Read test document
    const foundDoc = await TestCollection.findOne({ message: "MongoDB Atlas connection test successful!" })
    console.log("✅ Test document retrieved successfully")
    console.log(`📄 Document ID: ${foundDoc._id}`)

    // Clean up test document
    await TestCollection.deleteOne({ _id: foundDoc._id })
    console.log("✅ Test document cleaned up")

    console.log("\n🎉 MongoDB Atlas connection test completed successfully!")
  } catch (error) {
    console.error("❌ MongoDB Atlas connection failed:")
    console.error("Error:", error.message)

    if (error.message.includes("authentication failed")) {
      console.log("\n💡 Troubleshooting Tips:")
      console.log("1. Check your database password in the connection string")
      console.log("2. Make sure you replaced <db_password> with your actual password")
      console.log("3. Verify your MongoDB Atlas user has proper permissions")
    }

    if (error.message.includes("IP")) {
      console.log("4. Check if your IP address is whitelisted in MongoDB Atlas")
      console.log("5. Consider adding 0.0.0.0/0 for development (not recommended for production)")
    }
  } finally {
    await mongoose.connection.close()
    console.log("\n🔌 Connection closed")
  }
}

testMongoDBAtlas()
