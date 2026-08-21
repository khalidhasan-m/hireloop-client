/**
 * Map user role to the correct dashboard home path.
 * Admin is never chosen on public signup; may exist from DB.
 */
export function dashboardPathForRole(role) {
  const r = (role || "").toLowerCase();
  if (r === "admin") return "/dashboard/admin";
  if (r === "recruiter") return "/dashboard/recruiter";
  return "/dashboard/seeker";
}
