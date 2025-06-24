# MutualFund Pro - Full Stack Mutual Fund Application

A complete full-stack web application for mutual fund investment management built with React.js, Node.js, Express.js, and MongoDB.

## Features

### Frontend (React.js + CSS)
- **Authentication**: Secure login and registration with JWT
- **Search**: Real-time mutual fund search using mfapi.in API
- **Fund Details**: Comprehensive fund information display
- **Portfolio Management**: Save and manage favorite funds
- **Responsive Design**: Mobile-first responsive UI
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

### Backend (Node.js + Express.js + MongoDB)
- **JWT Authentication**: Secure user authentication
- **RESTful API**: Clean API endpoints
- **Database Integration**: MongoDB with Mongoose
- **Password Security**: Bcrypt password hashing
- **CORS Support**: Cross-origin resource sharing
- **Environment Variables**: Secure configuration management

## Tech Stack

- **Frontend**: React.js, React Router, Axios, Pure CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Bcrypt for password hashing
- **API**: mfapi.in for mutual fund data

## Project Structure

\`\`\`
mutual-fund-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js
│   └── package.json
├── .env                   # Environment variables
└── README.md
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
\`\`\`bash
cd server
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file in server directory:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/mutualfunds
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
\`\`\`

4. Start the server:
\`\`\`bash
npm run dev
\`\`\`

### Frontend Setup

1. Navigate to client directory:
\`\`\`bash
cd client
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm start
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Funds Management
- `POST /api/funds/save` - Save a mutual fund
- `GET /api/funds` - Get user's saved funds
- `DELETE /api/funds/:id` - Remove saved fund

## Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set environment variables if needed

### Backend (Render/Railway)
1. Connect your repository
2. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT`
3. Deploy

## Environment Variables

### Server (.env)
\`\`\`env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
\`\`\`

## Features Implemented

✅ User authentication (register/login)
✅ JWT-based security
✅ Mutual fund search functionality
✅ Fund details display
✅ Save/remove funds to portfolio
✅ Responsive design
✅ Loading states and error handling
✅ Clean, modern UI with pure CSS
✅ MongoDB integration
✅ RESTful API design
✅ Password hashing
✅ Protected routes
✅ Auto-refresh UI
✅ Duplicate prevention
✅ Confirmation messages

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Search Funds**: Use the search bar to find mutual funds by name
3. **View Details**: Click on any fund to see detailed information
4. **Save Funds**: Save interesting funds to your portfolio
5. **Manage Portfolio**: View and manage your saved funds
6. **Remove Funds**: Remove funds from your portfolio when needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
