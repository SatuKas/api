# SatuKas API 🚀

A robust and scalable REST API for SatuKas, a personal finance management application. Built with NestJS and modern best practices to provide secure and efficient financial data management.

## 📝 Summary

SatuKas API serves as the backend infrastructure for the SatuKas application, providing essential features for personal finance management including user authentication, transaction tracking, budgeting, and financial reporting capabilities. Built on top of NestJS with focus on security, scalability, and developer experience.

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Quick Setup](#-quick-setup)
- [Build and Run](#-build-and-run)
- [Docker](#-docker)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Tech Stack](#-tech-stack)

## ✨ Key Features

- **Authentication & Authorization**
  - Secure JWT-based authentication
  - Role-based access control
  - Token refresh mechanism
  - Device-based authentication tracking

- **Financial Management**
  - Transaction management
  - Budget tracking
  - Category management
  - Financial reporting

- **Database Integration**
  - Prisma ORM setup
  - PostgreSQL configuration
  - Migration support
  - Type-safe database queries

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
   cd satukas-api
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   ```

   Configure the variables in `.env`. See [Environment variables](#environment-variables) for the full list.

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

## 🐳 Docker

### Prerequisites

- [Docker Engine](https://docs.docker.com/engine/install/) 24+
- [Docker Compose](https://docs.docker.com/compose/install/) v2+

### Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default: `5000`) |
| `LOG_TO_FILE` | Enable file logging (`true` / `false`) |
| `NODE_ENV` | Runtime environment (`development`, `production`, etc.) |
| `JWT_ACCESS_SECRET` | Secret for access tokens |
| `JWT_EMAIL_SECRET` | Secret for email verification tokens |
| `APP_NAME` | Application display name |
| `VERIFICATION_PROCESS_VIA` | Verification redirect target: `backend` or `frontend` |
| `FRONTEND_URL` | Frontend base URL |
| `BACKEND_URL` | Backend base URL |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `REDIS_USERNAME` | Redis username (optional) |
| `REDIS_PASSWORD` | Redis password (optional) |
| `MAIL_DRIVER` | Mail provider: `resend` or `smtp` |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_FROM` | SMTP sender address |
| `SMTP_USERNAME` | SMTP username |
| `SMTP_PASSWORD` | SMTP password |
| `RESEND_API_URL` | Resend API URL |
| `RESEND_FROM` | Resend sender address |
| `RESEND_API_KEY` | Resend API key |

When using external PostgreSQL and Redis, set `DATABASE_URL`, `REDIS_HOST`, and `REDIS_PORT` to your remote hosts in `.env`.

### Run API only (external database & Redis)

Use this when PostgreSQL and Redis are already hosted elsewhere:

```bash
cp .env.example .env
# Set DATABASE_URL, REDIS_HOST, REDIS_PORT, and other vars in .env

docker compose up -d --build
docker compose logs -f api
docker compose down
```

Run database migrations:

```bash
pnpm prisma migrate deploy
# or without local Node.js:
docker compose exec api npx prisma migrate deploy
```

The API is available at `http://localhost:5000`.

### Run with bundled PostgreSQL & Redis (optional)

For local development without installing PostgreSQL or Redis on the host, add `docker-compose.infra.yml`:

```bash
cp .env.example .env
# Fill in non-database env vars; DATABASE_URL and REDIS_* are overridden by the infra compose file

docker compose -f docker-compose.yml -f docker-compose.infra.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.infra.yml logs -f api
docker compose -f docker-compose.yml -f docker-compose.infra.yml down
```

Bundled defaults:

- PostgreSQL: `postgresql://postgres:postgres@postgres:5432/satukas`
- Redis: `redis:6379`

### Build image manually

```bash
docker build -t satukas-api:local .

docker run --rm -p 5000:5000 --env-file .env satukas-api:local
```

### Production compose (VPS)

`docker-compose.prod.yml` runs the pre-built image from GitHub Container Registry:

```bash
export DOCKER_IMAGE=ghcr.io/<owner>/<repo>:dev
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

A production `.env` with external `DATABASE_URL` and Redis settings must exist in the same directory.

## 🚀 Deployment

This project supports **two parallel deploy methods**:

| Workflow | File | Method |
|----------|------|--------|
| VPS (PM2) | `.github/workflows/deploy.yaml` | Upload build artifacts via SCP, run with PM2 (manual) |
| Docker | `.github/workflows/deploy-docker.yaml` | Build & push image to GHCR, deploy container on VPS (manual) |

Both workflows are triggered manually from GitHub Actions (**Actions → select workflow → Run workflow**).

### Deploy via Docker (CI/CD)

The `deploy-docker.yaml` workflow:

1. Builds a Docker image from `Dockerfile`
2. Pushes to `ghcr.io/<owner>/<repo>:dev`
3. Uploads `docker-compose.prod.yml` to the VPS
4. Pulls the latest image and restarts the container

#### Required GitHub Secrets

Add these under **Settings → Secrets and variables → Actions** (environment `deploy-dev`):

| Secret | Description |
|--------|-------------|
| `VPS_HOST` | VPS IP or hostname |
| `VPS_USER` | SSH username |
| `VPS_SSH_KEY` | SSH private key |
| `ENV_DEV` | Full production `.env` contents (multi-line) |
| `GHCR_TOKEN` | GitHub PAT with `read:packages` scope (for pulling images on the VPS) |
| `GHCR_USERNAME` | Optional GHCR username override. Defaults to the GitHub Actions actor. |

Pushing images from CI uses `GITHUB_TOKEN` (`packages: write` is already set in the workflow).

#### Initial VPS setup (Docker)

```bash
# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

mkdir -p /home/<vps-user>/satukas-api-docker
```

After the first successful workflow run, the `satukas-api` container runs on port `5000` (or whatever `PORT` is set to in `.env`).

#### Pull image manually from GHCR

```bash
echo "<GHCR_TOKEN>" | docker login ghcr.io -u <ghcr-username> --password-stdin
docker pull ghcr.io/<owner>/<repo>:dev
```

### Deploy via PM2 (existing)

The `deploy.yaml` workflow remains active — it uploads `dist/`, installs dependencies on the VPS, and restarts via PM2. See the workflow file for step details.

> **Note:** Do not run PM2 and the Docker container for the same instance on the same port.

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

🔄 This project is actively maintained. Feel free to contribute or raise issues if you find any.
