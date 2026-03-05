# SportWell Project Plan & Roadmap

This document tracks the progress and future plans for the SportWell Physiotherapy application.

## 🏁 Completed Phases

### Phase 1: Foundation (v1.0)
- [x] Initial Next.js 16 setup (using Turbopack).
- [x] Prisma ORM integration with PostgreSQL (Docker/Local).
- [x] Clerk Auth integration (Base setup).
- [x] Design System initialization (Tailwind CSS v4 + shadcn UI).
- [x] Core Layout and Branding (Geist & Asap fonts).

### Phase 2: Core Business Logic (Physio & Trainer)
- [x] Refactored `TrainerDashboard` and unified role-based paths.
- [x] Implemented `Booking` and `SessionNote` models in Prisma.
- [x] Built Trainer Triage / AI Matching logic base.
- [x] Created `ClientZone` with initial booking flow.

### Phase 3: Stabilization & Internationalization (i18n)
- [x] Upgraded to stable **Next.js 16.1.6**.
- [x] Implemented dynamic localized routing (`app/[lang]/`).
- [x] Added Slovenian (`sk`) and English (`en`) dictionaries.
- [x] Configured `proxy.ts` middleware for locale redirection & Clerk protection.
- [x] Renamed and localized all key URLs (e.g., `/trener`).

### Phase 4: Extended Roles & SEO
- [x] Expanded `Role` enum: `PHYSIO`, `MASSEUR`, `OWNER`, `RECEPTIONIST`.
- [x] Added **JSON-LD (LocalBusiness)** schema for SEO and AI/GEO visibility.
- [x] Implemented Clerk Webhooks for user sync to database.

### Phase 5: Infrastructure & AI Flex (v1.1)
- [x] Refactored `AIService` for multi-provider support (OpenAI/Mistral).
- [x] Implemented robust AI JSON parsing & error fallback.
- [x] Provisioned **Neon Postgres** cloud database.
- [x] Synchronized schema and seeded initial trainers for testing.
- [x] Verified build stability and 18+ Vitest suite pass.

### Phase 6: Production Launch & Hardening (v1.2)
- [x] **Bugfix**: Fixed `proxy.ts` locale-bypass (Auth now correctly protects `/sk/client-zone`).
- [ ] **Vercel Deployment**: Finalize setup of all Environment Variables in Vercel Dashboard.
- [ ] **Production DB**: Run migrations and seed against the live Neon database.
- [ ] **Webhook Config**: Activate `CLERK_WEBHOOK_SECRET` in production dashboard.
- [ ] **Domain**: Link custom domain and verify SSL.
- [ ] **Live AI**: Switch to production OpenAI/Mistral keys.

---

## 🚀 Future Roadmap

### Phase 7: Production Launch (Upcoming)
- [ ] **Vercel Deployment**: Finalize production build on Vercel.
- [ ] **Webhook Config**: Activate `CLERK_WEBHOOK_SECRET` in production dashboard.
- [ ] **Domain**: Link custom domain and verify SSL.
- [ ] **Live AI**: Switch to production OpenAI/Mistral keys.

### Phase 8: Payments & Professional Experience
- [ ] **GoPay Integration**: Implement production payment flow for credits and bookings.
- [ ] **Dynamic Calendar**: Connect AI matching with real-time `time-slots` for trainers.
- [ ] **Masseur & Physio Views**: Build specialized dashboards for medical roles.
- [ ] **Client Forms**: Finish the remaining 8/10 diagnostic forms with PDF export.

### Phase 8: Scaling & Advanced Features
- [ ] **AI Recommendation Engine**: More reactive chat-based triage for clients.
- [ ] **Marketing AI**: Automated SEO blog posts based on clinic stats.
- [ ] **Owner Analytics**: Revenue and booking charts.

---

## 🛠️ Project Guards (AGENTS.md Rules)
- **TDD Requirement**: Every new feature must have a failing test first.
- **Zero-Crash Policy**: Always use mock data fallback if external services (DB/AI) fail.
- **Session Kickstart**: Always run `scripts/check-db.js` and `pnpm test` when starting.
