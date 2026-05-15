# Northwind Processing Pipeline

A TypeScript-based ingestion pipeline that extracts business data from a fixed Northwind SQLite source, transforms it into a canonical domain model, validates and enriches records, persists processed data into PostgreSQL, and exposes the results through REST APIs.

The system was designed as a reproducible and observable data-processing service focused on idempotency, explicit pipeline stages, exception tracking, and strong separation between ingestion, domain, persistence, and API layers.

---

## Problem Statement

Operational business systems often depend on legacy data sources that were not designed for downstream processing, consistency guarantees, or observability. This project demonstrates how a fixed external source can be safely ingested into a canonical internal model through a deterministic pipeline architecture.

The intended users are backend engineers, platform engineers, and reviewers evaluating ingestion design, data consistency strategies, idempotent processing, and API exposure over normalized operational data.

---

## Tech Stack

- TypeScript
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- SQLite3
- Zod
- Pino
- Swagger / OpenAPI
- Jest + Supertest
- Docker + Docker Compose

---

## Architecture

```mermaid
flowchart LR

A[Northwind SQLite]
--> B[Ingest]

B --> C[Validate]
C --> D[Normalize]
D --> E[Dedupe]
E --> F[Consistency Checks]
F --> G[Persist]

G --> H[(PostgreSQL)]

H --> I[REST API]
H --> J[Exceptions API]
H --> K[Pipeline Runs]

I --> L[Swagger/OpenAPI]
```

---

## Pipeline Stages

The ingestion workflow is implemented explicitly through isolated stages:

```txt
ingest
→ validate
→ normalize
→ dedupe
→ consistency-check
→ persist
→ serve/query
```

### Stage Responsibilities

| Stage | Responsibility |
|---|---|
| ingest | Reads immutable Northwind SQLite data |
| validate | Applies domain validation rules |
| normalize | Standardizes canonical values |
| dedupe | Detects already-processed records |
| consistency-check | Detects business inconsistencies |
| persist | Stores canonical entities and exceptions |
| serve/query | Exposes processed data through REST APIs |

---

## Canonical Domain Model

The project defines a strong internal canonical model independent from the Northwind schema.

### Example Canonical Order

```json
{
  "northwindId": 10248,
  "customerId": "VINET",
  "orderDate": "1996-07-04T00:00:00.000Z",
  "requiredDate": "1996-08-01T00:00:00.000Z",
  "shippedDate": "1996-07-16T00:00:00.000Z",
  "freight": 32.38,
  "totalAmount": 440,
  "lines": [
    {
      "productId": 11,
      "productName": "Queso Cabrales",
      "quantity": 12,
      "unitPrice": 14,
      "discountRate": 0,
      "lineTotal": 168
    }
  ]
}
```

---

## Documentation

Detailed design documentation can be found in:

- `docs/architecture.md`
- `docs/database.md`
- `docs/domain.md`

---

## Requirements

Install:

- Node.js 22+
- Docker
- Docker Compose

Verify installation:

```bash
node --version
docker --version
docker compose version
```

---

## Environment Setup

Create a local environment file:

```bash
cp .env.example .env
```

Example `.env`:

```env
NODE_ENV=development

PORT=3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/northwind

API_KEY=ledge-local-development-key

LOG_LEVEL=debug
```
When running inside Docker containers, Prisma uses the internal PostgreSQL hostname configured through Docker networking.

The provided Docker configuration already handles this automatically through environment overrides.
---

## Quickstart

### 1. Install dependencies

```bash
npm install
```

---

### 2. Generate Prisma client

```bash
npx prisma generate
```

---

### 3. Download Northwind source

```bash
npm run download:northwind
```

---

### 4. Verify source integrity

```bash
npm run verify:northwind
```

Expected SHA-256:

```txt
2f4f5c68dfcd33ba27373eae48c7a4869800c68095ee0f9f0da494f83382a877
```

The SQLite file is intentionally excluded from version control and treated as an immutable external source.

---

### 5. Start infrastructure

```bash
docker compose up --build
```

---

### 6. Run database migrations

```bash
npx prisma migrate dev
```

---

### 7. Execute ingestion pipeline

```bash
npm run pipeline
```

---

### 8. Open Swagger documentation

```txt
http://localhost:3000/api/docs
```

Authorize using:

```txt
X-API-KEY: ledge-local-development-key
```

---

## API Overview

### Orders

```http
GET /api/orders
```

Returns processed canonical orders.

---

### Exceptions

```http
GET /api/exceptions
```

Returns detected processing inconsistencies and validation issues.

---

### Pipeline Execution

```http
POST /api/pipeline/run
```

Triggers a new ingestion execution.

---

## Exception Handling

The pipeline includes explicit consistency and business-rule validation stages.

To demonstrate exception tracking and observability behavior, a small subset of records is intentionally mutated during ingestion in development environments.

These controlled inconsistencies allow the system to generate and persist processing exceptions such as:

- freight amount exceeding total order amount
- shipped date occurring before order date
- excessive discount rates

Detected inconsistencies are persisted in the `ProcessingException` table and exposed through the `/api/exceptions` endpoint.

Each exception contains:

- pipeline stage
- reason code
- descriptive message
- related order identifier
- additional metadata

This approach allows deterministic testing of exception workflows while preserving the original Northwind SQLite source as immutable.
---

## API Authentication

All endpoints require API-key authentication.

Header:

```http
X-API-KEY: ledge-local-development-key
```

---

## Structured Logging

The pipeline uses structured JSON logging through Pino.

Example log:

```json
{
  "level": 30,
  "time": 1778826532621,
  "correlationId": "eced1826-3f11-4a35-957b-b1cb14864ff4",
  "msg": "Validate stage completed"
}
```

Each pipeline execution receives its own correlation ID for traceability.

---

## Idempotency

The ingestion process is fully idempotent.

Duplicate detection is implemented through deterministic fingerprint generation using canonical order attributes.

Running the pipeline multiple times does not create duplicated records.

Example second execution:

```txt
processed: 0
duplicatesSkipped: 16282
```

---

## Dataset Characteristics

The provided SQLite source is significantly larger than the classic Northwind sample database.

Approximate dataset size:

- ~16k orders
- ~600k order lines

The ingestion layer was optimized to avoid quadratic processing during canonical mapping by grouping order lines before transformation.

---

## Business Rules

The system implements non-trivial business validation and consistency rules including:

- order total consistency vs line totals
- discount validation
- shipping/freight validation
- duplicate detection via deterministic fingerprints
- normalization precision enforcement

All rules are covered through automated tests.

---

## Testing

### Run all tests

```bash
npm test
```

---

### Run integration tests

```bash
npm run test:integration
```

### Run E2E tests

```bash
npm run test:e2e
```
---

## Test Coverage

Tests include:

### Unit Tests

- deduplication logic
- normalization behavior
- business validation rules
- consistency checks
- fingerprint generation

### Integration Tests

- end-to-end pipeline execution
- persistence validation
- idempotent re-ingestion behavior

---

## Database Persistence

Persistence is implemented using PostgreSQL + Prisma.

The schema is versioned through Prisma migrations.

Entities persisted include:

- orders
- order lines
- processing exceptions
- pipeline executions

---

## Design Highlights

- immutable Northwind source
- canonical domain model
- explicit pipeline stages
- idempotent ingestion
- deterministic fingerprinting
- structured JSON logging
- correlation IDs
- exception tracking
- reproducible Docker environment
- Prisma migrations/versioning
- OpenAPI documentation
- API-key protected endpoints
- Deterministic synthetic inconsistency injection for exception testing

---

## Decisions & Assumptions

- The downloaded Northwind SQLite database is treated as immutable and read-only.
- Canonical order totals are preserved from the source dataset.
- Idempotency is implemented through deterministic order fingerprints.
- Duplicate detection uses a natural-business-key strategy combined with fingerprint hashing.
- A small subset of records is intentionally modified during development ingestion runs to demonstrate exception detection behavior.
- Synthetic inconsistencies are only injected in development environments.
---

## Limitations

Current limitations include:

- no background job queue
- no retry orchestration
- no distributed processing
- no pagination on API endpoints
- no rate limiting
- no RBAC/advanced auth
- no dead-letter queue
- no metrics backend integration

---

## Threat Model

This project is intended for local/internal development environments.

Security considerations:

- API-key authentication prevents anonymous access
- no secrets are committed to version control
- the SQLite source is treated as read-only
- no write access is exposed through the public API
- no user-provided SQL or dynamic query execution exists

Out of scope:

- production-grade secret management
- RBAC
- OAuth/JWT
- rate limiting
- DDoS protection

---

## AI Usage

AI tooling was used during development for:

- architecture brainstorming
- TypeScript scaffolding
- Prisma schema refinement
- debugging assistance
- pipeline design iteration
- test generation support

All business rules, persistence behavior, idempotency validation, Docker setup, and pipeline execution behavior were manually validated and tested.

---

## License

Developed as a take-home technical challenge.