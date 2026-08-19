"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { RecruiterSidebar } from "./_components/RecruiterSidebar";
import { RecruiterHeader } from "./_components/RecruiterHeader";

export default function RecruiterDashboardLayout({ children }) {
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
      {/* Sidebar Component */}
      <RecruiterSidebar
        user={user}
        isPending={isPending}
        handleLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72">
        {/* Header Component */}
        <RecruiterHeader
          user={user}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
