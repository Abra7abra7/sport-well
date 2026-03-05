# SportWell Unified AI Platform Design Document

## Context and Goal
SportWell requires a unified system to replace its fragmented architecture. The goal is a highly automated AI-driven platform that handles everything from public web presence to intelligent trainer matching, digital onboarding, CRM, marketing, and operational management.

## Architecture
*   **Application Framework:** Next.js 16 (App Router)
*   **Database:** PostgreSQL with Prisma ORM.
*   **Auth Provider:** Modular Adapter Architecture. Starting with Clerk (Drop-in SaaS identity management), but structured to allow swapping to NextAuth or custom JWT easily later.
*   **Payment Provider:** Modular Adapter Architecture. Starting with GoPay (Local SK/CZ provider) instead of Stripe, ensuring lower localized fees.
*   **Styling:** Tailwind CSS + shadcn/ui.

## Key System Components (Phase 1)

### 1. Modular Authentication
*   Fully abstracted authentication layer. Features passwordless Magic Links, Google Authenticator, and standard login.
*   The application code interfaces with our internal `AuthService`, not directly with Clerk SDK everywhere, allowing future provider migrations.

### 2. The Public Website & Internal CMS
*   Built entirely in Next.js.
*   An `Admin` role can log into the portal and use a rich text editor (e.g., TipTap) to edit page content, pricing, and blog posts directly, saving to the PostgreSQL database.

### 3. The "Tinder for Trainers" AI Booking Engine
*   **Trigger:** Client visits `/rezervacia`.
*   **Action:** Client describes their physical issue or goals in a text area.
*   **AI Logic:** OpenAI API matches the text against the profiles and specializations of the 10 trainers.
*   **Result:** System presents top 3 available trainers. Client selects a time slot.
*   **Payments:** System checks credit balance. If 0, redirects to GoPay Checkout or offers "Pay at Reception". If >0, deducts 1 credit.

### 4. Smart Onboarding & Unified CRM
*   **Pre-arrival:** Upon booking, an email is sent to the client with a unique link to their dashboard to complete GDPR forms and dynamic diagnostic questionnaires digitally.
*   **The Hub:** A single dashboard per client where trainers view historical forms, past sessions, and upload PDF/image outputs from diagnostic machines.

## Business Expansion Modules (Phase 2+)

### A. AI Marketing & Campaign Manager
*   Integrated mass-email functionality using Resend.
*   AI creates segments and drafts personalized emails.

### B. Social Media & Content Brain
*   AI suggests content pillars and drafts copy for Facebook/Instagram posts based on real clinic data.
