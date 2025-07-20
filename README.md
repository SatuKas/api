# NestJS API Base Project 🚀

A robust and scalable NestJS starter template designed to kickstart your backend development with essential features pre-configured. This project serves as a solid foundation for building production-ready REST APIs with best practices and modern tooling.

## 📝 Summary

This base project is crafted to accelerate your NestJS application development by providing a well-structured foundation with pre-implemented essential features. It's regularly maintained and updated to ensure compatibility with the latest dependencies and best practices.

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Quick Setup](#-quick-setup)
- [Build and Run](#-build-and-run)
- [Testing](#-testing)
- [Tech Stack](#-tech-stack)

## ✨ Key Features

- **Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control
  - Token refresh mechanism
  - Device-based authentication tracking

- **Database Integration**

  - Prisma ORM setup
  - PostgreSQL configuration
  - Migration support
  - Type-safe database queries

- **Email Service**

  - Multi-provider support (SMTP, Resend)
  - Email templates
  - Email verification flow
  - Password reset functionality

- **Security & Best Practices**

  - Request validation
  - Exception handling
  - Winston logger integration
  - Redis integration for caching
  - CORS configuration

- **Developer Experience**
  - TypeScript support
  - ESLint + Prettier configuration
  - Swagger API documentation
  - Environment configuration
  - Unit and E2E testing setup

## 🚀 Quick Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nest-api-base-project
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   ```bash
   # Copy example env file
   cp .env.example .env

   # Configure your environment variables
   # Required variables:
   # - DATABASE_URL
   # - JWT_ACCESS_SECRET
   # - JWT_EMAIL_SECRET
   # - FRONTEND_URL
   # - BACKEND_URL
   ```

4. **Database setup**
   ```bash
   # Run database migrations
   pnpm prisma migrate dev
   ```

## 🛠 Build and Run

```bash
# Development
pnpm run start

# Watch mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 💻 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: Passport, JWT
- **Email Service**:
  - SMTP
  - Resend API
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Code Quality**:
  - ESLint
  - Prettier
  - Husky (Git Hooks)

## 📦 Dependencies

Key dependencies used in this project:

```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/config": "^4.0.2",
  "@nestjs/jwt": "^11.0.0",
  "@prisma/client": "^6.11.1",
  "class-validator": "^0.14.2",
  "winston": "^3.17.0"
}
```

For a complete list of dependencies, please refer to `package.json`.

---

🔄 This project is actively maintained and regularly updated with new features and security patches. Feel free to contribute or raise issues if you find any.
