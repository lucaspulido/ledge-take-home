# Northwind Processing Pipeline

A TypeScript-based ingestion pipeline that extracts data from a fixed Northwind SQLite source, transforms it into a canonical domain model, validates and enriches records, persists processed data into PostgreSQL, and exposes the results through REST APIs.

The system is designed around idempotent processing, exception tracking, and pipeline observability.

---

## Tech Stack

- TypeScript
- Node.js
- Express
- PostgreSQL
- Prisma
- Zod
- Pino
- Swagger/OpenAPI
- Jest + Supertest
- Docker + Docker Compose

---

## Documentation

Detailed design documentation can be found here:

- `docs/architecture.md` — system architecture and pipeline design
- `docs/database.md` — database design and modeling decisions
- `docs/domain.md` — canonical domain model and business rules

---

## Environment Setup

Create a local environment file from the provided template:

```bash
cp .env.example .env
```

Then update the values as needed for your local setup.

---

## Requirements

Install:

- Node.js 24+
- Docker
- Docker Compose

Verify installation:

```bash
node --version
docker --version
docker compose version
```

---

## Running Locally

Install dependencies:

```bash
npm install
```

Create environment variables:

```bash
cp .env.example .env
```

Generate Prisma client:

```bash
npx prisma generate
```

Start services:

```bash
docker compose up --build
```

Run database migrations:

```bash
npx prisma migrate dev
```

Open Prisma Studio (optional, to see the tables):

```bash
npx prisma studio
```

---

## API Authentication

Requests use API-key authentication:

```http
X-API-KEY: local-dev-key
```

---

## Design Highlights

- Immutable Northwind source
- Canonical domain model
- Idempotent ingestion via fingerprints
- Exception tracking with flexible reason codes
- Pipeline execution observability
- Dockerized local environment
- Explicit pipeline stages and separation of concerns

---

## License

Developed as a take-home technical challenge.