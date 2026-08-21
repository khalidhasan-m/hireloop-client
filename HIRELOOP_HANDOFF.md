# HireLoop Project — Handoff Document

**Last updated:** August 21, 2026  
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
- **Payments:** Stripe (planned, not fully wired)

---

## 2. What Is Already Done

### Server (`hireloop-server`)

#### Folder structure
```
hireloop-server/
├── index.js
├── config/
├── middleware/
│   ├── auth.js
│   ├── role.js              # roleGuard, seekerOnly, recruiterOnly, adminOnly
│   └── planLimit.js         # checkSeekerApplicationLimit, checkRecruiterJobLimit
├── models/
│   ├── User.js, Company.js, Job.js, Application.js
│   ├── SavedJob.js, Payment.js, Subscription.js
├── routes/
└── utils/
    └── constants.js         # Plans, statuses, roles
```

#### Constants
- APPLICATION_STATUS, COMPANY_STATUS, JOB_STATUS, USER_ROLES
- SEEKER_PLANS: FREE (3 apps/mo), PRO (30), PREMIUM (unlimited)
- RECRUITER_PLANS: FREE (3 active jobs), GROWTH (10), ENTERPRISE (50)

#### Existing APIs
- Companies, Jobs (CRUD + close/reopen), Applications (create, my, by job, status update)

### Client (`hireloop-client`)

- Shared Sidebar + Dashboard layout (role-aware)
- Seeker pages: Home, Applications, Saved Jobs, Billing, Settings (all dynamic UI)
- Recruiter pages: UI exists, need real API wiring
- Admin: placeholders only
- API client: `src/lib/api/index.js` + `client.js`

---

## 3. What Is Left

### Priority order

**A. Step 8 — Wire Recruiter to real API (HIGH)**
- Dashboard: getMyJobs + applications → real stats
- Jobs: create/delete/close/reopen
- Applications: load + updateApplicationStatus

**B. Saved Jobs API on server (HIGH)**
```
POST /api/saved-jobs
GET  /api/saved-jobs/my
DELETE /api/saved-jobs/:id
```

**C. Step 6 — Admin pages (HIGH)**
- Home, Users, Companies (approve/reject), Jobs, Payments

**D. Step 7 — Stripe (MEDIUM)**
- Checkout, webhooks, update user.plan

**E. Other**
- Seeker browse jobs page
- Public /pricing, /companies
- Attach plan limit middleware to routes
- Profile fields API (headline, bio, skills, resume)

---

## 4. Technical Notes

- Token: `authClient.getSession()` → `data.session.token` → `Authorization: Bearer ...`
- Application status strings: Applied | Under Review | Shortlisted | Rejected | Offered
- Job status: active | closed | draft
- Collections on app.locals: jobCollection, companyCollection, applicationCollection, savedJobCollection, etc.

---

## 5. Run Locally

```bash
# Server (port 5050)
cd hireloop-server && npm install && npm run dev

# Client (port 3000)
cd hireloop-client
# NEXT_PUBLIC_API_URL=http://localhost:5050/api
npm install && npm run dev
```

---

## 6. Checklist

```
[x] Constants, middleware, models
[x] Shared layout + Seeker pages
[ ] Recruiter real API wiring
[ ] Saved Jobs server API
[ ] Admin pages
[ ] Stripe
[ ] Plan limits on routes
[ ] Public pricing
```

## 7. Prompt for next AI

> Continue HireLoop. Repos: khalidhasan-m/hireloop-server and hireloop-client.  
> First: Step 8 — wire Recruiter dashboard/jobs/applications to existing APIs (no mocks).  
> Then Saved Jobs API. Full context in HIRELOOP_HANDOFF.md.

**End of handoff.**
