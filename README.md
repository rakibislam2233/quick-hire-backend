# Quick-hire Backend

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-000000?style=for-the-badge&logo=BullMQ&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-000000?style=for-the-badge&logo=Nodemailer&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

A robust, scalable backend application built with Node.js, TypeScript, and PostgreSQL using Prisma ORM. This application provides a comprehensive foundation for building modern web applications with features like authentication, file uploads, and more.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **File Uploads**: Cloudinary integration for media storage
- **Security**: Comprehensive security measures including CORS, CSRF, XSS protection
- **Caching**: Redis integration for caching and session management
- **Environment Configuration**: Flexible environment-based configuration
- **Logging**: Structured logging with Winston
- **API Documentation**: Auto-generated API documentation

## 🛠️ Tech Stack

- **Runtime**: ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) Node.js
- **Language**: ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) TypeScript
- **Framework**: ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=white) Express.js
- **Database**: ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) PostgreSQL
- **ORM**: ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=prisma&logoColor=white) Prisma with PostgreSQL adapter
- **Authentication**: ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=JSON%20web%20tokens&logoColor=white) JWT, bcrypt
- **Caching**: ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white) Redis
- **File Storage**: Cloudinary
- **Real-time**: ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socket.io&logoColor=white) Socket.IO
- **Security**: Helmet, csurf, express-mongo-sanitize, hpp
- **Logging**: Winston
- **Testing**: Jest (planned)

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v16 or higher)
- PostgreSQL database
- Redis server
- Cloudinary account (optional, for file uploads)

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/rakibislam2233/quick-hire-backend.git
cd quick-hire-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (see `.env.example`):

```bash
cp .env.example .env
```

4. Update your `.env` file with appropriate values

5. Run database migrations:

```bash
npx prisma migrate dev
```

6. Generate Prisma client:

```bash
npx prisma generate
```

7. Start the development server:

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── app.ts              # Express application setup
├── server.ts           # Server initialization and startup
├── config/             # Configuration files
│   ├── index.ts        # Main configuration
│   ├── database.config.ts # Database configuration
│   ├── redis.config.ts # Redis configuration
│   └── logger.config.ts # Logger configuration
├── controllers/        # Request handlers
├── middleware/         # Custom middleware
├── models/             # Data models (via Prisma)
├── routes/             # API route definitions
├── services/           # Business logic
├── utils/              # Utility functions
├── socket/             # Socket.IO handlers
└── modules/            # Feature modules
    ├── auth/           # Authentication module
    ├── user/           # User management module
    └── otp/            # OTP management module
```

## 🔐 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Application Environment
NODE_ENV=development
PORT=8082
SOCKET=8082

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT Authentication
JWT_ACCESS_SECRET=your_super_secret_access_token_key
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key
JWT_RESET_PASSWORD_SECRET=your_super_secret_reset_password_key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
DEV_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000

# Security
ENCRYPTION_KEY=your_encryption_key_for_sensitive_data
```

## 🧪 Running Tests

Currently, the test suite is being developed. To run existing tests:

```bash
npm test
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Running in Production

```bash
npm start
```

### Docker Support

Coming soon...

## 🔐 Security Features

- **CORS**: Configurable cross-origin resource sharing
- **CSRF**: Cross-site request forgery protection
- **XSS**: Cross-site scripting prevention
- **SQL Injection**: Prisma ORM prevents SQL injection
- **Rate Limiting**: Built-in rate limiting for API endpoints
- **Input Validation**: Comprehensive input validation and sanitization

## 📊 API Endpoints

The API follows RESTful conventions and is organized by modules:

### Core Modules

- `/api/v1/auth` - Authentication endpoints
- `/api/v1/users` - User management endpoints
- `/api/v1/otp` - OTP management endpoints
- `/api/v1/files` - File upload endpoints

### Job & Category Modules

- `/api/v1/jobs` - Job management endpoints
- `/api/v1/categories` - Category management endpoints

### 📖 Detailed API Documentation

For comprehensive API documentation including all endpoints, validation rules, and examples, see:

- **[API Documentation](./postman/API_Documentation.md)** - Complete API reference
- **[Postman Collection](./postman/QuickHire_API_Collection.json)** - Ready-to-use Postman collection

API documentation is auto-generated and available at `/api-docs` in development mode.

## 🔄 Real-time Features

The application supports real-time communication using Socket.IO with Redis adapter for horizontal scaling:

- Real-time notifications
- Live updates
- Chat functionality (planned)

## 🗂️ Database Schema

The application uses PostgreSQL with the following main entities:

- **User**: User accounts and profiles
- **Otp**: One-time passwords for verification
- **RefreshToken**: JWT refresh tokens
- **FileUpload**: File metadata and storage information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you have any questions or need help, feel free to open an issue in the repository.

## 🙏 Acknowledgments

- Express.js team
- Prisma team
- All the contributors who made this project possible
