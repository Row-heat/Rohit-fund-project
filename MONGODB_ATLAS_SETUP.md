# 🗄️ MongoDB Atlas Setup Guide

## Step 1: Replace Password in Connection String

**IMPORTANT:** Replace `<db_password>` with your actual MongoDB Atlas password.

Your connection string should look like:
\`\`\`
mongodb+srv://admin:YOUR_ACTUAL_PASSWORD@mutualfund.apnqph3.mongodb.net/mutualfunds?retryWrites=true&w=majority&appName=MutualFund
\`\`\`

## Step 2: Update .env File

Create/update your `server/.env` file:
\`\`\`env
MONGODB_URI=mongodb+srv://admin:YOUR_ACTUAL_PASSWORD@mutualfund.apnqph3.mongodb.net/mutualfunds?retryWrites=true&w=majority&appName=MutualFund
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
PORT=5000
\`\`\`

## Step 3: MongoDB Atlas Configuration

### 3.1 Network Access (IP Whitelist)
1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" in the left sidebar
3. Click "Add IP Address"
4. For development: Add `0.0.0.0/0` (allows all IPs)
5. For production: Add your specific server IP

### 3.2 Database User Permissions
1. Go to "Database Access" in MongoDB Atlas
2. Make sure user `admin` has:
   - **Read and write to any database** permissions
   - Or specific permissions for `mutualfunds` database

### 3.3 Database Name
- Your app will use database: `mutualfunds`
- Collections will be created automatically:
  - `users` (for user accounts)
  - `tests` (for connection testing)

## Step 4: Test Connection

Run the test script:
\`\`\`bash
cd server
node scripts/test-mongodb-atlas.js
\`\`\`

## Step 5: Start Your Application

\`\`\`bash
# Backend
cd server
npm install
npm run dev

# Frontend (in new terminal)
cd client
npm install
npm start
\`\`\`

## 🔧 Troubleshooting

### Connection Issues:
1. **Authentication Failed**: Check password in connection string
2. **Network Error**: Verify IP whitelist in MongoDB Atlas
3. **Database Access**: Ensure user has proper permissions

### Common Fixes:
- Replace `<db_password>` with actual password (no brackets)
- Check for special characters in password (may need URL encoding)
- Verify cluster is running in MongoDB Atlas
- Check network connectivity

## 🎯 Success Indicators

When everything works correctly, you should see:
\`\`\`
✅ MongoDB Atlas Connected: mutualfund-shard-00-02.apnqph3.mongodb.net
📊 Database: mutualfunds
🚀 Server running on port 5000
\`\`\`

## 📊 Database Structure

Your MongoDB Atlas database will contain:

### Users Collection:
\`\`\`javascript
{
  _id: ObjectId,
  email: "user@example.com",
  password: "hashed_password",
  savedFunds: [
    {
      schemeCode: "120503",
      schemeName: "Fund Name",
      savedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## 🔐 Security Best Practices

1. **Never commit .env file** to version control
2. **Use strong passwords** for database users
3. **Restrict IP access** in production
4. **Use environment-specific** connection strings
5. **Monitor database access** in Atlas dashboard

## 🚀 Production Deployment

For production deployment:
1. Update IP whitelist to your server's IP
2. Use strong, unique passwords
3. Enable MongoDB Atlas monitoring
4. Set up automated backups
5. Use connection pooling for better performance
