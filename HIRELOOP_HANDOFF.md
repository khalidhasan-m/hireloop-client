# HireLoop Project — Handoff Document

**Last updated:** August 21, 2026 (evening)  
**Repos:** https://github.com/khalidhasan-m/hireloop-server  
**Repos:** https://github.com/khalidhasan-m/hireloop-client  

This document explains everything already done and what remains, so any AI or developer can continue the work.

---

## 1. Project Overview

HireLoop is a full-stack job portal with 3 roles:

| Role | Purpose |
|------|--------|
| **Seeker** | Browse jobs, save, apply, track applications, subscribe |
| **Recruiter** | Post jobs, manage company, review applications |
| **Admin** | Approve companies, manage users/jobs, view payments |

**Stack:**
- **Client:** Next.js 16 (App Router), Tailwind, Better Auth client, react-hot-toast
- **Server:** Express.js, native MongoDB driver (MongoClient), Better Auth
- **Auth:** Better Auth (role on user: `seeker` | `recruiter` | `admin`)
- **Payments:** Stripe (checkout scaffold ready; set `STRIPE_SECRET_KEY`)

---

## 2. What Is Already Done ✅

### Server (`hireloop-server`)

#### Structure
```
hireloop-server/
├── index.js                 # DB + all route mounts
├── config/
│   └── stripe.js            # Stripe client (null if no key)
├── middleware/
│   ├── auth.js              # Better Auth session
│   ├── role.js              # roleGuard, seekerOnly, recruiterOnly, adminOnly
│   └── planLimit.js         # checkSeekerApplicationLimit, checkRecruiterJobLimit, checkSeekerSavedJobLimit
├── models/
│   ├── User.js, Company.js, Job.js, Application.js
│   ├── SavedJob.js, Payment.js, Subscription.js
├── routes/
│   ├── job.routes.js        # CRUD + close/reopen (+ plan limit on create)
│   ├── company.routes.js
│   ├── application.routes.js # + plan limit on POST
│   ├── savedJob.routes.js   # POST/GET/DELETE
│   ├── payment.routes.js    # history, checkout session, confirm
│   └── admin.routes.js      # stats, users, companies, jobs, payments
└── utils/
    └── constants.js         # Plans, statuses, roles
```

#### API endpoints (all under `/api`)

| Area | Methods |
|------|--------|
| **Jobs** | POST `/jobs` (recruiter + plan limit), GET `/jobs`, GET `/jobs/my`, GET `/jobs/:id`, PATCH `/jobs/:id`, DELETE `/jobs/:id`, PATCH `/jobs/:id/close`, PATCH `/jobs/:id/reopen` |
| **Companies** | POST `/companies`, GET `/companies/my`, PATCH `/companies/:id`, GET `/companies/:id` |
| **Applications** | POST `/applications` (seeker + plan limit), GET `/applications/my`, GET `/applications/job/:jobId`, PATCH `/applications/:id/status` |
| **Saved Jobs** | POST `/saved-jobs`, GET `/saved-jobs/my`, DELETE `/saved-jobs/:id` |
| **Payments** | GET `/payments/my`, POST `/payments/create-checkout-session`, POST `/payments/confirm` |
| **Admin** | GET `/admin/stats`, GET `/admin/users`, PATCH `/admin/users/:id/suspend`, GET `/admin/companies`, PATCH `/admin/companies/:id/status`, GET `/admin/jobs`, PATCH `/admin/jobs/:id/close`, GET `/admin/payments` |

#### Collections on `app.locals`
`jobCollection`, `companyCollection`, `applicationCollection`, `savedJobCollection`, `paymentCollection`, `subscriptionCollection`, `userCollection`, `sessionCollection`

#### Constants
- `APPLICATION_STATUS`: Applied | Under Review | Shortlisted | Rejected | Offered  
- `COMPANY_STATUS`: Pending | Approved | Rejected  
- `JOB_STATUS`: active | closed | draft  
- `SEEKER_PLANS`: FREE (3 apps/mo), PRO (30), PREMIUM (unlimited)  
- `RECRUITER_PLANS`: FREE (3 active jobs), GROWTH (10), ENTERPRISE (50)

---

### Client (`hireloop-client`)

#### Shared
- `src/components/common/Sidebar.jsx` — role-aware nav
- `src/components/common/DashboardHeader.jsx`
- `src/app/(dashboard)/dashboard/layout.jsx`
- `src/lib/constants.js` — same enums/plans as server
- `src/lib/api/index.js` + `client.js`

#### Seeker pages (dynamic)
| Route | Status |
|-------|--------|
| `/dashboard/seeker` | ✅ Stats, profile, status bars, activity |
| `/dashboard/seeker/applications` | ✅ Table, tabs, stats |
| `/dashboard/seeker/saved` | ✅ List (uses Saved Jobs API) |
| `/dashboard/seeker/billing` | ✅ Plan card, history UI |
| `/dashboard/seeker/settings` | ✅ Profile, resume UI, skills |

#### Recruiter pages (dynamic)
| Route | Status |
|-------|--------|
| `/dashboard/recruiter` | ✅ Real stats + recent apps + create job |
| `/dashboard/recruiter/jobs` | ✅ List, create, delete, close, reopen |
| `/dashboard/recruiter/applications` | ✅ Load apps, filter, update status |
| `/dashboard/recruiter/company` | ⚠️ UI may still be partial |
| `/dashboard/recruiter/settings` | ⚠️ Basic / partial |
| `/dashboard/recruiter/billing` | ⚠️ Can mirror seeker billing |

#### Admin pages (dynamic)
| Route | Status |
|-------|--------|
| `/dashboard/admin` | ✅ Platform stats |
| `/dashboard/admin/users` | ✅ List + suspend/unsuspend |
| `/dashboard/admin/companies` | ✅ Approve / Reject |
| `/dashboard/admin/jobs` | ✅ List + force close |
| `/dashboard/admin/payments` | ✅ Payment list |

---

## 3. What Is Left (optional / polish)

| Task | Priority | Notes |
|------|----------|-------|
| Seeker **Browse Jobs** page (`/dashboard/seeker/jobs`) | Medium | List active jobs + Apply + Save |
| Public **`/pricing`** page | Medium | Show seeker + recruiter plans; call checkout |
| Wire **Recruiter Company** page fully | Medium | `getMyCompany` / `updateMyCompany` |
| Recruiter **Billing** page | Low | Same pattern as seeker billing |
| **Stripe webhook** (production) | Medium | Verify signature; update plan on `checkout.session.completed` |
| Set real Stripe **Price IDs** in constants | Medium | `SEEKER_PLANS.*.priceId` / `RECRUITER_PLANS.*.priceId` |
| Persist profile fields API | Low | headline, bio, skills, resumeUrl on User |
| Increment `applicantsCount` on job when apply | Low | In application POST |
| Public company profiles `/companies` | Low | |
| Better Auth role on signup | Medium | Ensure role is set correctly for seeker/recruiter |

---

## 4. Technical Notes

### Auth token (client)
```js
const { data } = await authClient.getSession();
const token = data?.session?.token;
// Header: Authorization: Bearer ${token}
```

### Application status (exact strings)
```
"Applied" | "Under Review" | "Shortlisted" | "Rejected" | "Offered"
```

### Job status
```
"active" | "closed" | "draft"
```

### Admin access
User document must have `role: "admin"`.

### Stripe env (server `.env`)
```
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:3000
```
Without `STRIPE_SECRET_KEY`, checkout returns 503 (safe).

### Plan limits already attached
- `POST /api/applications` → `checkSeekerApplicationLimit`
- `POST /api/jobs` → `recruiterOnly` + `checkRecruiterJobLimit`
- `POST /api/saved-jobs` → `checkSeekerSavedJobLimit`

---

## 5. How To Run

```bash
# Server (port 5050)
cd hireloop-server
git pull origin main
npm install
# .env: MONGO_DB_URI, BETTER_AUTH_*, STRIPE_SECRET_KEY (optional), CLIENT_URL
npm run dev

# Client (port 3000)
cd hireloop-client
git pull origin main
# .env.local: NEXT_PUBLIC_API_URL=http://localhost:5050/api
npm install
npm run dev
```

---

## 6. Progress Checklist

```
[x] Constants (server + client)
[x] Role + planLimit middleware
[x] Models with create helpers
[x] Shared Sidebar + Dashboard layout
[x] Seeker Home, Applications, Saved, Billing, Settings
[x] Recruiter Dashboard (real data)
[x] Recruiter Jobs (create/delete/close/reopen)
[x] Recruiter Applications (load + status update)
[x] Saved Jobs server API
[x] Plan limits on application + job + saved routes
[x] Admin API + Admin UI pages
[x] Stripe checkout scaffold + payment history
[ ] Seeker browse jobs inside dashboard
[ ] Public pricing page
[ ] Production Stripe webhook
[ ] Full company page (recruiter)
[ ] Profile fields persistence API
```

---

## 7. Suggested Prompt for Next AI

> Continue HireLoop.  
> Repos:  
> - https://github.com/khalidhasan-m/hireloop-server  
> - https://github.com/khalidhasan-m/hireloop-client  
>  
> Core dashboards (Seeker, Recruiter, Admin), Saved Jobs API, plan limits, and Stripe checkout scaffold are done.  
> Next priorities:  
> 1) Seeker browse-jobs page under `/dashboard/seeker/jobs` (list active jobs, apply, save)  
> 2) Public `/pricing` page that calls `POST /api/payments/create-checkout-session`  
> 3) Optional: Stripe webhook + set priceId in constants  
>  
> Full context: `HIRELOOP_HANDOFF.md` in both repos.

---

**End of handoff document.**
