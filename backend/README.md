# Order Management System — Backend

REST API built with NestJS, TypeORM and MySQL for managing customers, 
products, and orders.

## Tech Stack

- NestJS + TypeScript
- MySQL 8.0 (hosted on Railway)
- TypeORM
- JWT authentication (access + refresh tokens)
- Cloudinary (image storage)
- Docker

## Setup Instructions

### Prerequisites
- Node.js 20+
- Docker (optional, for containerized run)
- A MySQL instance (local or Railway)

### 1. Clone and install
\`\`\`bash
git clone <repo-url>
cd backend
npm install
\`\`\`

### 2. Environment variables
\`\`\`bash
cp .env.example .env
\`\`\`
Fill in `.env` with your database credentials, JWT secrets, and Cloudinary keys.

### 3. Database
Run the schema script against your MySQL instance:
\`\`\`bash
mysql -h <host> -P <port> -u <user> -p < scripts/schema.sql
\`\`\`

### 4. Run the app
\`\`\`bash
npm run start:dev
\`\`\`
API available at `http://localhost:3000/api`

### 5. Run with Docker
\`\`\`bash
docker build -t order-management-backend .
docker run -p 3000:3000 --env-file .env order-management-backend
\`\`\`
Or use the `docker-compose.yml` at the project root to run backend + frontend + MySQL together.

## Technical Decisions & Assumptions

[Aquí van todas las decisiones que ya documentamos a lo largo de la conversación:
price snapshotting, soft deletes, currency handling, workspace_settings 
single-row, scalability considerations, etc.]

## API Documentation

Swagger available at `http://localhost:3000/api/docs` (if implemented).

## Known Limitations

[Lo que dejarías para producción: migraciones versionadas, multi-currency real, 
rate limiting, etc.]