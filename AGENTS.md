<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project runs on **Next.js 16 (Canary) with App Router**. APIs, conventions, and file structures MUST follow the latest Next.js 15/16 best practices. Check active skills and `node_modules/next/dist/docs/` before writing any code.

# SportWell Unified AI Platform - STRICT System Rules
Before making any changes to this repository, you MUST adhere to the following constraints:

## 1. Architecture & Services (Modular Pattern)
- Do NOT tightly couple 3rd-party services to our application code.
- **Authentication:** We use **Clerk**. However, all Clerk logic must be wrapped in a local Adapter (`lib/services/auth.interface.ts`). Do NOT implement NextAuth or custom password forms.
- **Payments:** We use **GoPay** (not Stripe). All payment logic must be wrapped in `lib/services/payment.interface.ts`.
- **Database:** Prisma ORM connected to PostgreSQL. E-kasa logic, credit ledgers, and CRM forms reside here.
- It is a MONOLITH. Public website (CMS driven by the database) and private CRM portals run on the same Next.js app.

## 2. UI / UX Design Standards
- **MANDATORY:** You must use the 17 installed Vercel design skills (e.g., `frontend-design`, `animate`, `delight`, `audit`) when writing UI code.
- We build *WOW* experiences. Do not write generic, gray, unstyled HTML.
- **Styling:** Tailwind CSS v4 + Radix/shadcn UI.
- Aim for 1-click experiences, minimal text, and smart AI automation.

## 3. Brand Style & UI Tokens (Extracted from sportwell.sk)
- **Primary Color:** Deep Blue `rgb(0, 40, 125)` / `#00287D`. Used for H1 headings, primary buttons, and major accents.
- **Background / Surface:** Pure White `rgb(255, 255, 255)` with Light Gray secondary surfaces `rgb(235, 235, 235)`.
- **Text Color:** Near Black `rgb(10, 10, 10)`.
- **Typography - Headings:** `"Asap Condensed", sans-serif`. You MUST configure this font via `next/font/google`.
- **Typography - Body:** System sans-serif.

## 4. Next.js 16 Technical Conventions
- **Proxy vs Middleware:** In Next.js 16, use `proxy.ts` instead of `middleware.ts` for route protection and edge logic.
- **Server Actions:** Every Server Action file (e.g., in `app/actions/`) MUST start with the `'use server';` directive. Do NOT use `'use strict';`.
- **Server-Only Leakage:** Be extremely careful not to import server-only modules (Clerk server SDK, OpenAI) into Client Components. If a module is used in both, wrap initialization in a lazy-loading function.

## 5. Application Resilience & Stability (MANDATORY)
- **Zero-Crash Policy:** The application MUST boot even if 3rd-party keys (Clerk, OpenAI) or the Database are missing/invalid.
- **Graceful Fallbacks:** 
  - Use `try-catch` blocks in all service adapters (e.g., `lib/services/ai.service.ts`).
  - If a service fails (e.g., DB connection error, OpenAI quota), return **Mock Data** instead of throwing an error.
- **UI Status Indicators:** 
  - Wrap `ClerkProvider` in a check for valid keys in `app/layout.tsx`.
  - Display non-intrusive warning banners in the root layout when running in "Limited Mode" (missing Auth or local DB).
- **Port Management:** Standard dev port is `3000`. If it's blocked, identify and kill the process instead of drifting to random ports.

## 6. Workflow & TDD
- **STRICT TDD:** You MUST follow the `test-driven-development` skill. No production code without a failing test first.
- **Brainstorming:** Use the `brainstorming` skill before touching any creative code. Do not write implementation without a plan.

Violating these rules will result in technical debt, build errors, or a rejected PR. Read `docs/plans/` for current implementation details.
<!-- END:nextjs-agent-rules -->
