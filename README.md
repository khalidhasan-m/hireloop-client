# HireLoop Client

HireLoop is a responsive Next.js frontend for a full-stack job portal. It provides public job and company discovery, Seeker workflows, Recruiter workflows, Admin management, profile settings, messaging and notifications, and Stripe billing interfaces.

## Technology

The client uses Next.js 16 App Router, React, Tailwind CSS, HeroUI, Better Auth, Motion, React Icons, and `react-hot-toast`. API requests are sent to the Express server through the shared client API helpers.

## Requirements

Use Node.js 20 or newer and npm. The client expects the HireLoop server to run locally on port `5050` unless the API URL is changed.

## Installation and development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set the client API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

If `.env.example` is not present in your checkout, create `.env.local` manually with the variable above. Never commit secrets or local environment files.

## Available commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm run test:e2e` | Run the complete Playwright browser suite. |
| `npm run test:visual` | Run sidebar visual regression checks. |
| `npm run test:a11y` | Run axe accessibility checks. |
| `npm run test:performance` | Run route performance-budget checks. |

Playwright generates local reports and test results that are ignored by Git. Baseline screenshots are stored under `tests/e2e/` and should only be updated intentionally.

## Main routes

### Public routes

- `/` — landing page with hero search, featured jobs, features, pricing, CTA, and footer.
- `/jobs` — public job search with filters and pagination.
- `/jobs/[id]` — public job details.
- `/companies` — public company directory with search, verified badges, and pagination.
- `/pricing` — role-aware Seeker and Recruiter pricing with Stripe checkout actions.
- `/auth/login` — email/password login.
- `/auth/signup` — Seeker or Recruiter registration.
- `/success` — payment-success confirmation page.

### Dashboard routes

- `/dashboard/seeker` — Seeker overview.
- `/dashboard/seeker/jobs` — API-backed job discovery, saving, and applications.
- `/dashboard/seeker/applications` — application history and export.
- `/dashboard/seeker/saved` — saved jobs.
- `/dashboard/seeker/billing` — subscription and payment management.
- `/dashboard/seeker/settings` — profile, avatar, resume, and security settings.
- `/dashboard/recruiter` — Recruiter overview.
- `/dashboard/recruiter/company` — company registration and management.
- `/dashboard/recruiter/jobs` — job creation and management.
- `/dashboard/recruiter/applications` — applicant review and status updates.
- `/dashboard/recruiter/billing` — Recruiter subscription management.
- `/dashboard/recruiter/settings` — Recruiter profile and security settings.
- `/dashboard/admin` — platform overview.
- `/dashboard/admin/users` — user search, suspension, activation, deletion, and role management.
- `/dashboard/admin/companies` — company approval and rejection.
- `/dashboard/admin/jobs` — job administration.
- `/dashboard/admin/payments` — payment history, exports, and Admin plan upgrades.
- `/dashboard/admin/settings` — Admin profile, avatar upload, and security settings.

## Authentication and roles

Better Auth manages sessions. Users have one of the roles `seeker`, `recruiter`, or `admin`. The shared dashboard layout and sidebar use the authenticated role to select navigation and protect the appropriate dashboard routes. Email/password authentication is enabled; social login controls are intentionally not displayed because they are not configured.

## Billing

The pricing and dashboard billing pages use the server Stripe API. Configure Stripe on the server before testing paid checkout. Paid plan activation is driven by verified Stripe webhook events. An Admin can also apply a paid plan to an eligible Seeker or Recruiter from Admin Payments; an existing Stripe subscription is updated when available, otherwise the server records an explicit Admin-granted local plan.

## Visual and responsive design

The public landing page and dashboard chrome are responsive across desktop, tablet, and phone widths. The Playwright suite protects role-specific sidebar widths, mobile overflow behavior, accessibility, and basic performance budgets. Motion effects are intentionally restrained: one-time entrances and small interaction feedback remain, while continuous and scroll-triggered animation loops have been removed.

## Production deployment

Create a production build with:

```bash
npm run build
npm run start
```

Set `NEXT_PUBLIC_API_URL` to the public HTTPS API URL. Configure the server CORS and `CLIENT_URL` values to allow the deployed client origin. Serve the application behind HTTPS and ensure the server’s upload URL configuration points to a persistent storage location in production.

## Project structure

```text
src/app/                 App Router pages and dashboard routes
src/components/          Public sections and shared UI
src/components/common/   Sidebar and dashboard header
src/lib/api/              API request helpers
src/lib/constants.js     Shared client plan and status constants
tests/e2e/                Playwright regression suite
public/images/            Homepage visual assets
```

The client is API-backed. Pages should use live responses and loading/empty states rather than hardcoded demo records.
