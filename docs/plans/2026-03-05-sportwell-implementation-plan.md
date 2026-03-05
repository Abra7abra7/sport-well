# SportWell Unified AI Platform - Implementation Plan

## Goal Description
Transform the conceptual design of the SportWell unified system into a concrete Next.js 16 application. The app will feature a modular architecture so components like Authentication (Clerk) and Payments (GoPay) can be replaced seamlessly if business needs change.

## Proposed Changes

### 1. Project Initialization & Setup (Next.js 16)
*   Leverage existing Next.js 16 Canary setup.
*   Use `next-best-practices` to prepare asynchronous segments and data patterns.
*   Configure Tailwind CSS variables with SportWell Brand Tokens:
    *   Primary: `#00287D` (Deep Blue)
    *   Heading Font: `Asap Condensed` (via `next/font/google`)

### 2. Database & Abstracted Interfaces
*   Initialize Prisma with PostgreSQL.
*   #### [NEW] `lib/services/auth.interface.ts` (to abstract Clerk)
*   #### [NEW] `lib/services/payment.interface.ts` (to abstract GoPay)

### 3. Authentication Layer (Clerk Adapter)
*   Install `@clerk/nextjs` but wrap it in an internal adapter service.
*   Create Webhook endpoint to sync Clerk users to PostgreSQL.

### 4. Public Site & CMS Layer
*   Implement static marketing pages fetching data from the database.
*   Build the Admin UI with a rich text editor.

### 5. AI Booking & Onboarding
*   Integrate OpenAI SDK for semantic analysis of "bolesť chrbta".
*   Build digital diagnostic forms (`react-hook-form` + `zod`).

### 6. Portals & Dashboards
*   **Client / Trainer / Admin Portals**.

### 7. Payments (GoPay)
*   Integrate GoPay REST API.
*   Build checkout sessions for purchasing Credits.
*   Handle GoPay successful payment redirection to sync with the internal Credit ledger.

## Verification Plan
*   Execute Test-Driven Development (TDD) for critical business logic (Payments and Matching algorithms).
*   Mock GoPay HTTP calls using `jest`/`vitest`.
