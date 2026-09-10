"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Sidebar from "@/components/common/Sidebar";
import DashboardHeader from "@/components/common/DashboardHeader";

/**
 * Dashboard is fully private:
 * - guest (no session) → /auth/login (with ?next= so they return after login)
 * - wrong role (e.g. seeker opening /dashboard/recruiter/...) → their own dashboard
 * Loading state keeps the existing layout skeleton — no design change.
 */
function roleForDashboardPath(pathname) {
  if (pathname?.startsWith("/dashboard/admin")) return "admin";
  if (pathname?.startsWith("/dashboard/recruiter")) return "recruiter";
  if (pathname?.startsWith("/dashboard/seeker")) return "seeker";
  return null;
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  React.useEffect(() => {
    if (isPending) return;
    if (!user) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/auth/login${next}`);
      return;
    }
    const requiredRole = roleForDashboardPath(pathname);
    const userRole = (user.role || "seeker").toLowerCase();
    if (requiredRole && requiredRole !== userRole) {
      router.replace(`/dashboard/${userRole}`);
    }
  }, [isPending, user, pathname, router]);

  // While session resolves or a redirect is pending, keep sidebar/header
  // chrome out of the paint — render the same loading screen used elsewhere.
  const requiredRole = roleForDashboardPath(pathname);
  const userRole = (user?.role || "seeker").toLowerCase();
  const blocked =
    isPending || !user || (requiredRole && requiredRole !== userRole);

  if (blocked) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08080c]/80 backdrop-blur-xl">
        <div className="flex flex-col items-center p-8 rounded-3xl border border-white/10 bg-[#0b0b0f]/90 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <div className="absolute w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 animate-pulse shadow-lg shadow-indigo-500/50" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-sm font-black tracking-tight flex items-center justify-center">
              <span className="text-white">hire</span>
              <span className="text-blue-500">l</span>
              <span className="text-orange-500">oop</span>
            </h2>
            <p className="text-[11px] text-gray-400 tracking-wider uppercase font-medium animate-pulse">
              Loading workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/auth/login");
            router.refresh();
          },
        },
      });
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white flex">
      {/* Shared Sidebar – adapts to role automatically */}
      <Sidebar
        user={user}
        isPending={isPending}
        handleLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main content area */}
      <div className={`min-w-0 flex-1 flex flex-col min-h-screen lg:pl-56`}>
        <DashboardHeader
          user={user}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        <main className="flex-1 p-4 sm:p-7 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
