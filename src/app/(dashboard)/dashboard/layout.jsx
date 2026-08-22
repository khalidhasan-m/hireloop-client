"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Sidebar from "@/components/common/Sidebar";
import DashboardHeader from "@/components/common/DashboardHeader";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

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
