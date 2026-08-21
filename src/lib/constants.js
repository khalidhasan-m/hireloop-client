// ======================
// APPLICATION STATUS
// ======================
export const APPLICATION_STATUS = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Under Review",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  OFFERED: "Offered",
};

export const APPLICATION_STATUS_FLOW = [
  APPLICATION_STATUS.APPLIED,
  APPLICATION_STATUS.UNDER_REVIEW,
  APPLICATION_STATUS.SHORTLISTED,
  APPLICATION_STATUS.REJECTED,
  APPLICATION_STATUS.OFFERED,
];

// ======================
// COMPANY STATUS
// ======================
export const COMPANY_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

// ======================
// JOB STATUS
// ======================
export const JOB_STATUS = {
  ACTIVE: "active",
  CLOSED: "closed",
  DRAFT: "draft",
};

// ======================
// USER ROLES
// ======================
export const USER_ROLES = {
  SEEKER: "seeker",
  RECRUITER: "recruiter",
  ADMIN: "admin",
};

// ======================
// SEEKER PLANS
// ======================
export const SEEKER_PLANS = {
  FREE: {
    id: "free",
    name: "Free",
    price: 0,
    priceId: null, // Stripe Price ID
    maxApplicationsPerMonth: 3,
    maxSavedJobs: 10,
    features: [
      "Browse & save up to 10 jobs",
      "Apply to up to 3 jobs per month",
      "Basic profile",
      "Email alerts",
    ],
  },
  PRO: {
    id: "pro",
    name: "Pro",
    price: 19,
    priceId: null,
    maxApplicationsPerMonth: 30,
    maxSavedJobs: Infinity,
    features: [
      "Apply to up to 30 jobs per month",
      "Unlimited saved jobs",
      "Application tracking",
      "Salary insights",
    ],
  },
  PREMIUM: {
    id: "premium",
    name: "Premium",
    price: 39,
    priceId: null,
    maxApplicationsPerMonth: Infinity,
    maxSavedJobs: Infinity,
    features: [
      "Everything in Pro",
      "Unlimited applications",
      "Profile boost to recruiters",
      "Early access to new jobs",
      "Priority support",
    ],
  },
};

// ======================
// RECRUITER PLANS
// ======================
export const RECRUITER_PLANS = {
  FREE: {
    id: "free",
    name: "Free",
    price: 0,
    priceId: null,
    maxActiveJobs: 3,
    analytics: false,
    features: [
      "Up to 3 active job posts",
      "Basic applicant management",
      "Standard listing visibility",
    ],
  },
  GROWTH: {
    id: "growth",
    name: "Growth",
    price: 49,
    priceId: null,
    maxActiveJobs: 10,
    analytics: "basic",
    features: [
      "Up to 10 active job posts",
      "Applicant tracking",
      "Basic analytics",
      "Email support",
    ],
  },
  ENTERPRISE: {
    id: "enterprise",
    name: "Enterprise",
    price: 149,
    priceId: null,
    maxActiveJobs: 50,
    analytics: "advanced",
    features: [
      "Up to 50 active job posts",
      "Advanced analytics dashboard",
      "Featured job listings",
      "Team collaboration",
      "Custom branding",
      "Priority support",
    ],
  },
};

// ======================
// JOB TYPES
// ======================
export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Remote",
  "Contract",
  "Internship",
];

// ======================
// JOB CATEGORIES
// ======================
export const JOB_CATEGORIES = [
  "Software Engineering",
  "Product Design",
  "Marketing",
  "Sales",
  "Data Science",
  "DevOps",
  "Customer Support",
  "Finance",
  "HR",
  "Other",
];

// ======================
// INDUSTRIES (for companies)
// ======================
export const INDUSTRIES = [
  "Fintech",
  "AI",
  "Developer Tools",
  "E-Commerce",
  "Healthcare",
  "Education",
  "SaaS",
  "Other",
];
