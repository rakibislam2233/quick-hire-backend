# QuickHire Backend

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-000000?style=for-the-badge&logo=Nodemailer&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

**A comprehensive, production-ready job board backend built with modern technologies**

[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

</div>

## 📖 Overview

QuickHire Backend is a robust, scalable RESTful API designed to power modern job board applications. Built with TypeScript and following enterprise-grade patterns, it provides comprehensive functionality for job posting, application management, user authentication, and company management.

## 🗃️ Database Schema

Below is the Entity-Relationship Diagram showing the complete database structure:

<div align="center">

![ER Diagram](doc/er-diagram.png)

</div>

### 🎯 Key Features

- **🔐 Advanced Authentication**: JWT-based auth with refresh tokens, role-based access control (Admin, Company, User)
- **💼 Job Management**: Complete CRUD operations with status management (Pending, Approved, Rejected, Closed)
- **🏢 Company Profiles**: Comprehensive company management with verification system
- **📁 Application Tracking**: Full application lifecycle management with interview scheduling
- **🏷️ Category System**: Flexible job categorization with job count tracking
- **💾 Smart Caching**: Redis-based caching for optimal performance
- **📡 Real-time Features**: Socket.IO integration for live notifications
- **🔒 Enterprise Security**: Comprehensive security measures (CORS, CSRF, XSS, Rate Limiting)
- **📊 Advanced Logging**: Structured logging with Winston and daily rotation
- **📁 File Management**: Cloudinary integration for file uploads
- **🔍 Advanced Search**: Full-text search with filtering and pagination
- **📈 Analytics Dashboard**: Comprehensive admin analytics and reporting

## 🛠️ Technology Stack

### Core Technologies

- **Runtime**: Node.js v16+
- **Language**: TypeScript 5.9+
- **Framework**: Express.js 5.x

### Database & ORM

- **Database**: PostgreSQL
- **ORM**: Prisma 7.x

### Authentication & Security

- **Authentication**: JWT with refresh tokens
- **Password Hashing**: bcrypt
- **Security**: Helmet, CORS, CSRF, XSS Protection, Rate Limiting

### Caching & Real-time

- **Caching**: Redis
- **Real-time**: Socket.IO

### File Storage & Communication

- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Push Notifications**: Firebase Admin

### Development & Quality

- **Validation**: Zod schemas
- **Logging**: Winston
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/rakibislam2233/quick-hire-backend.git
cd quick-hire-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file:

```env
# Application
NODE_ENV=development
PORT=8082

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/quickhire"

# Authentication
JWT_ACCESS_SECRET=your_super_secret_access_token_key
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. Database Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:8082`

## 📁 Project Architecture

```
quick-hire-backend/
├── 📁 src/                          # Source code
│   ├── 📄 app.ts                   # Express application setup
│   ├── 📄 server.ts                # Server initialization
│   ├── 📁 config/                  # Configuration management
│   ├── 📁 modules/                 # Feature modules
│   │   ├── 📁 auth/                # Authentication
│   │   ├── 📁 user/                # User management
│   │   ├── 📁 company/             # Company management
│   │   ├── 📁 job/                 # Job management
│   │   ├── 📁 category/            # Category management
│   │   ├── 📁 application/         # Application management
│   │   ├── 📁 savedJob/            # Saved jobs
│   │   ├── 📁 otp/                 # OTP verification
│   │   └── 📁 dashboard/           # Admin dashboard
│   ├── 📁 middleware/              # Custom middleware
│   ├── 📁 utils/                  # Utility functions
│   ├── 📁 routes/                 # API routes
│   ├── 📁 queues/                 # BullMQ job queues
│   └── 📁 workers/                # Queue workers
├── 📁 prisma/                     # Database schema
│   ├── 📁 schema/                 # Prisma schema files
│   ├── 📁 migrations/             # Database migrations
│   └── 📁 generated/              # Generated Prisma client
├── 📁 postman/                    # Postman collection
│   ├── 📄 QuickHire_API_Collection.json
│   └── 📄 API_Documentation.md
├── 📄 package.json                # Dependencies
├── � tsconfig.json              # TypeScript config
├── 📄 .eslintrc.json             # ESLint config
├── 📄 .prettierrc                # Prettier config
└── 📄 README.md                  # This file
```

## 🗄️ Database Schema

### Core Entities

#### 👤 User

- **Roles**: ADMIN, COMPANY, USER
- **Status**: ACTIVE, INACTIVE, BLOCKED, BANNED
- **Features**: Email verification, profile management, company association

#### 🏢 Company

- **Verification**: Verified badge system
- **Details**: Industry, location, employee count, contact info
- **Relationships**: Multiple employees, job postings

#### 💼 Job

- **Status Flow**: PENDING → APPROVED/REJECTED → CLOSED
- **Types**: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE
- **Features**: Salary range, location, requirements, responsibilities

#### 📝 Application

- **Status Tracking**: PENDING → REVIEWING → SHORTLISTED → SCHEDULED → ACCEPTED/REJECTED
- **Features**: Resume upload, cover letter, interview scheduling

#### 🏷️ Category

- **Organization**: Job categorization with icons
- **Analytics**: Job count per category

## 📚 API Documentation

### Base URL

```
http://localhost:8082/api/v1
```

### Core Endpoints

#### 🔐 Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

#### � User Management

- `GET /users/profile/me` - Get user profile
- `PATCH /users/profile/me` - Update user profile

#### 🏢 Company Management

- `GET /companies` - Get all companies
- `GET /companies/:id` - Get company details
- `POST /companies` - Create company (Admin)
- `PATCH /companies/:id` - Update company

#### � Job Management

- `GET /jobs` - Get all jobs (Public)
- `GET /jobs/:id` - Get job details (Public)
- `POST /jobs` - Create job (Company)
- `PATCH /jobs/:id` - Update job (Company/Admin)
- `DELETE /jobs/:id` - Delete job (Company/Admin)
- `PATCH /jobs/admin/:id/status` - Update job status (Admin)

#### 🏷️ Category Management

- `GET /categories` - Get all categories (Public)
- `GET /categories/:id` - Get category details (Public)
- `POST /categories` - Create category (Admin)
- `PATCH /categories/:id` - Update category (Admin)
- `DELETE /categories/:id` - Delete category (Admin)

#### 📝 Application Management

- `GET /applications` - Get user applications
- `POST /applications/job/:jobId` - Apply for job
- `PATCH /applications/:id/status` - Update application status (Company)

### 📖 Complete API Reference

- **[API Documentation](./postman/API_Documentation.md)** - Complete API reference
- **[Postman Collection](./postman/QuickHire_API_Collection.json)** - Ready-to-use Postman collection

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio

# Testing
npm test                 # Run test suite
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

## � Security Features

### Authentication & Authorization

- **JWT Tokens**: Access and refresh token system
- **Role-Based Access**: Granular permissions (Admin, Company, User)
- **Password Security**: bcrypt hashing with salt rounds
- **Email Verification**: Account verification system

### API Security

- **CORS Protection**: Configurable cross-origin resource sharing
- **CSRF Protection**: Cross-site request forgery prevention
- **XSS Protection**: Cross-site scripting prevention
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **Rate Limiting**: Configurable rate limits per endpoint
- **Input Validation**: Comprehensive Zod schema validation
- **Helmet**: Security header configuration

## � Performance Optimizations

### Caching Strategy

- **Redis Integration**: Session storage and data caching
- **Query Caching**: Frequently accessed data caching
- **Cache Invalidation**: Smart cache invalidation on data changes

### Database Optimization

- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Optimized Prisma queries
- **Indexing**: Strategic database indexes
- **Soft Deletes**: Performance-friendly data deletion

## 📊 Monitoring & Logging

### Logging System

- **Winston**: Structured logging framework
- **Log Levels**: Debug, Info, Warn, Error
- **Daily Rotation**: Automatic log file rotation
- **Structured Format**: JSON-based log format
- **Performance Metrics**: Request/response time logging

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper commit messages
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Push to your fork and open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## � Acknowledgments

- **Express.js Team** - For the excellent web framework
- **Prisma Team** - For the amazing ORM
- **TypeScript Team** - For the type-safe JavaScript
- **Open Source Community** - For all the amazing packages

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/rakibislam2233/quick-hire-backend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rakibislam2233/quick-hire-backend/discussions)
- **Email**: rakibislam2233@gmail.com

---

<div align="center">

**Built with ❤️ by [Rakib Islam](https://github.com/rakibislam2233)**

[![GitHub followers](https://img.shields.io/github/followers/rakibislam2233?style=social)](https://github.com/rakibislam2233)
[![GitHub stars](https://img.shields.io/github/stars/rakibislam2233/quick-hire-backend?style=social)](https://github.com/rakibislam2233/quick-hire-backend)

</div>
