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

## 4. Workflow & TDD
- **STRICT TDD:** You MUST follow the `test-driven-development` skill. No production code without a failing test first. (Mocks only when unavoidable).
- **Brainstorming:** Use the `brainstorming` skill before touching any creative code. Do not write implementation without a plan.

Violating these rules will result in technical debt and a rejected PR. Read `docs/plans/` for current implementation details.
<!-- END:nextjs-agent-rules -->
