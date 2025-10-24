# English Practice Backend API

A comprehensive, industry-level backend API for the English learning platform built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

### Authentication & Security
- **JWT Authentication** with access and refresh tokens
- **Password Hashing** using bcrypt with configurable rounds
- **Rate Limiting** to prevent abuse
- **Input Validation** with comprehensive Joi schemas
- **CORS Configuration** for frontend integration
- **Helmet Security** headers
- **Request Compression** and logging

### Database Models
- **User Management** with comprehensive profile fields
- **Progress Tracking** with XP, levels, and skill metrics
- **Refresh Token Management** for secure authentication
- **User Level System** with streak tracking and achievements

### API Endpoints
- **Authentication**: Register, Login, Token Refresh, Logout
- **Profile Management**: Get/Update profile, Change password
- **Progress Tracking**: XP calculations, Level progression
- **User Management**: User statistics and management

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # MongoDB connection
│   │   └── auth.ts          # JWT and auth configuration
│   ├── controllers/
│   │   ├── auth.controller.ts       # Authentication logic
│   │   ├── progress.controller.ts   # Progress calculations
│   │   ├── accuracy.controller.ts   # Message analysis
│   │   └── userLevel.controller.ts  # User level management
│   ├── middleware/
│   │   ├── auth.ts          # JWT verification middleware
│   │   ├── validation.ts    # Input validation middleware
│   │   ├── rateLimit.ts     # Rate limiting middleware
│   │   └── index.ts         # Middleware exports
│   ├── models/
│   │   ├── User.ts          # User schema and methods
│   │   ├── Progress.ts      # Progress tracking schema
│   │   ├── RefreshToken.ts  # Refresh token schema
│   │   ├── UserLevel.ts     # User level schema
│   │   └── index.ts         # Model exports
│   ├── routes/
│   │   ├── auth.ts          # Authentication routes
│   │   ├── progress.ts      # Progress routes
│   │   ├── user.ts          # User management routes
│   │   ├── profile.ts       # Profile routes
│   │   └── accuracy.ts      # Analysis routes
│   ├── utils/
│   │   ├── progressCalculator.ts  # XP and level calculations
│   │   ├── accuracyCalculator.ts  # Message analysis utilities
│   │   ├── errorHandler.ts        # Error handling utilities
│   │   └── index.ts               # Utility exports
│   └── index.ts             # Main server entry point
├── .env                     # Environment configuration
├── .env.example            # Environment template
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- TypeScript support

### Setup

1. **Clone and install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# Database
MONGODB_URI=your-mongodb-connection-string

# JWT Secrets (use strong, unique values)
JWT_SECRET=your-super-secret-jwt-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Server
PORT=5000
NODE_ENV=development

# Frontend
CLIENT_URL=http://localhost:3000
```

3. **Start development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
npm start
```

## 🔧 Configuration

### Database Configuration
The app connects to MongoDB using the URI specified in `MONGODB_URI`. Supports both local and cloud instances.

### Authentication Configuration
- **JWT_SECRET**: Secret key for signing JWT tokens
- **JWT_EXPIRES_IN**: Token expiration time (default: 7d)
- **REFRESH_TOKEN_SECRET**: Secret for refresh tokens
- **REFRESH_TOKEN_EXPIRES_IN**: Refresh token expiration (default: 30d)

### Security Features
- **Rate Limiting**: Configurable request limits per time window
- **Password Security**: bcrypt hashing with configurable rounds
- **Input Validation**: Comprehensive validation using Joi schemas
- **CORS**: Configurable cross-origin resource sharing

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "targetLanguage": "English",
  "nativeLanguage": "Spanish",
  "country": "Spain",
  "proficiencyLevel": "intermediate"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer your-access-token
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "username": "janesmith",
  "targetLanguage": "English",
  "proficiencyLevel": "advanced"
}
```

### Progress Endpoints

#### Calculate XP Reward
```http
POST /api/progress/calculate-xp-reward
Content-Type: application/json

{
  "action": "send_message",
  "multiplier": 1.0,
  "customXP": 10
}
```

#### Get Level Info
```http
POST /api/progress/get-level-info
Content-Type: application/json

{
  "totalXP": 1250
}
```

## 🔐 Security Features

### Authentication
- JWT-based authentication with access and refresh tokens
- Secure password hashing with bcrypt
- Refresh token rotation for enhanced security
- Account lockout protection

### Rate Limiting
- General API rate limiting (100 requests/15 minutes)
- Strict auth rate limiting (5 attempts/15 minutes)
- Password reset rate limiting (3 attempts/hour)

### Input Validation
- Comprehensive validation schemas for all endpoints
- SQL injection protection through parameterized queries
- XSS protection through input sanitization

### Security Headers
- Helmet.js security headers
- CORS configuration
- Content Security Policy

## 🚀 Deployment

### Development
```bash
npm run dev
```
Starts the development server with hot reload using tsx.

### Production
```bash
npm run build
npm start
```
Builds the TypeScript code and starts the production server.

## 🧪 Testing

Run tests (when implemented):
```bash
npm test
```

## 📈 Performance

- **Database Indexing**: Optimized indexes for fast queries
- **Request Compression**: Automatic response compression
- **Connection Pooling**: MongoDB connection pooling
- **Caching**: JWT token caching for better performance

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include comprehensive error handling
4. Write clear documentation
5. Add tests for new features

## 🔄 Migration from Previous Version

If migrating from a previous backend version:
1. Backup your database
2. Update environment variables
3. Run `npm install` to update dependencies
4. The new structure is backward compatible with the frontend

## 📄 License

MIT License - see LICENSE file for details.
