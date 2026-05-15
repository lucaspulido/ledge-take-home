# Domain Model

## Overview

The system does not persist the original Northwind schema directly.

Instead, the ingestion pipeline transforms the SQLite source into a canonical internal domain model designed for:

- strong typing
- idempotent processing
- business validation
- exception tracking
- pipeline observability

This separation prevents the application from being tightly coupled to the external Northwind structure and allows validation and normalization rules to evolve independently.

---

# Core Domain Entities

## Order

Represents a canonical business order after ingestion and normalization.

An order contains:

- customer information
- order and shipping dates
- freight cost
- total amount
- processing metadata
- associated order lines
- detected processing exceptions

Each order also contains a deterministic fingerprint used for idempotency and duplicate detection across pipeline executions.

---

## OrderLine

Represents an individual product line associated with an order.

Each line contains:

- product identifier
- quantity
- unit price
- discount rate
- computed line total

Order lines are validated independently before persistence.

---

## ProcessingException

Represents a detected inconsistency or business validation issue during pipeline execution.

Exceptions are intentionally persisted separately from the main order data in order to preserve observability and allow reviewers to inspect problematic records explicitly.

Each exception stores:

- pipeline stage
- reason code
- human-readable message
- optional metadata payload

The `reasonCode` field is intentionally implemented as a string instead of a database enum to allow future extension without requiring schema migrations.

Current supported reason codes include:

- `INVALID_DATE`
- `TOTAL_MISMATCH`
- `INVALID_DISCOUNT`
- `POSSIBLE_DUPLICATE`

---

## PipelineRun

Represents a single execution of the ingestion pipeline.

The entity stores operational metrics such as:

- execution status
- processed records
- failed records
- skipped duplicates
- timestamps
- correlation identifier

This enables traceability and pipeline observability across executions.

---

# Business Rules

The current implementation includes several business validation rules executed during pipeline processing.

## Total Consistency

The order total must equal:

line totals sum + freight

A tolerance threshold is allowed for floating point operations.

---

## Discount Validation

Discount values must remain within the valid range:

0 <= discount <= 1

Invalid discounts generate processing exceptions.

---

## Duplicate Detection

The system implements two levels of duplicate detection.

### Exact duplicates

Orders with the same fingerprint are considered already processed and skipped during persistence.

This guarantees idempotent pipeline execution.

### Possible duplicates

Orders with:

- same customer
- very similar total amount
- nearby order dates

are flagged as potential duplicates and persisted as exceptions for manual review.

---

## Shipping Date Consistency

Shipping dates must be equal to or later than the original order date.

Invalid temporal relationships generate validation exceptions.

---

# Domain Design Decisions

## Canonical Model Separation

Northwind entities are intentionally isolated from internal domain entities.

The ingestion flow follows this structure:

Northwind SQLite → Raw Models → Canonical Domain → Persistence

This separation improves maintainability and validation clarity.

---

## Flexible Exception Metadata

Exceptions support arbitrary JSON metadata in order to preserve contextual information without forcing schema changes for every new validation rule.

---

## Explicit Pipeline Stages

Validation and transformation logic are organized into explicit pipeline stages:

- ingest
- validate
- normalize
- dedupe
- consistency-check
- persist
- serve/query

This improves traceability and testing isolation.

---

# Idempotency Strategy

Idempotency is enforced using deterministic order fingerprints generated from canonical order data.

When the pipeline is re-executed:

- previously confirmed records are skipped
- duplicates are not reinserted
- execution metrics remain observable through `PipelineRun`

This guarantees safe reprocessing behavior.