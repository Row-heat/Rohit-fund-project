# ⚡ Quick Start Guide

## 🏃‍♂️ Get Running in 10 Minutes

### 1. Download & Extract
- Create folder: `mutual-fund-app`
- Copy all files from the code project

### 2. Backend (Terminal 1)
\`\`\`bash
cd server
npm install
echo "MONGODB_URI=mongodb://localhost:27017/mutualfunds
JWT_SECRET=your_secret_key
PORT=5000" > .env
npm run dev
\`\`\`

### 3. Frontend (Terminal 2)
\`\`\`bash
cd client
npm install
npm start
\`\`\`

### 4. Test
- Open http://localhost:3000
- Register account
- Search "SBI" funds
- Save a fund
- Check saved funds

## 🎯 That's it! Your app is running!

### Default Test Account
After running seed script:
- Email: demo@example.com  
- Password: password123

### API Endpoints
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- MF API: https://api.mfapi.in/mf

### Deployment
- Frontend → Netlify/Vercel
- Backend → Railway/Render
- Database → MongoDB Atlas
