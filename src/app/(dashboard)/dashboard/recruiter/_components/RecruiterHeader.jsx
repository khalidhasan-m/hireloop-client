"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { HiBars3, HiBell, HiMagnifyingGlass } from "react-icons/hi2";

export function RecruiterHeader({ user, setMobileSidebarOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mock notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Applicant",
      desc: "Julianne Moore applied for Senior Product Designer",
      time: "10m ago",
      read: false,
    },
    {
      id: 2,
      title: "Interview Reminder",
      desc: "Interview loop with Robert Downey starts in 30 mins",
      time: "1h ago",
      read: false,
    },
    {
      id: 3,
      title: "Job Post Live",
      desc: "Your opening for DevOps Architect is now active",
      time: "3h ago",
      read: true,
    },
  ]);

  // Check if there are any unread notifications
  const hasUnread = notifications.some((n) => !n.read);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-20 border-b border-white/10 bg-[#08080c]/60 backdrop-blur-xl px-6 sm:px-10 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white cursor-pointer"
        >
          <HiBars3 className="text-xl" />
        </button>
        <span className="text-sm font-semibold text-white">
          HireLoop Recruiter
        </span>
      </div>

      {/* Search bar with HiMagnifyingGlass icon */}
      <div className="hidden sm:flex items-center relative w-96">
        <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
        <input
          type="text"
          placeholder="Search applications, jobs, or talent..."
          className="w-full h-11 bg-[#101014] border border-white/10 rounded-xl pl-10 pr-4 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500/50 transition"
        />
      </div>

      {/* Profile / notification icons */}
      <div
        className="flex items-center gap-4 ml-auto relative"
        ref={dropdownRef}
      >
        {/* Notification Bell Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-xl border border-white/10 bg-white/2 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition relative cursor-pointer"
          title="Notifications"
        >
          {hasUnread && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          )}
          <HiBell className="text-lg" />
        </button>

        {/* Notifications Dropdown Panel */}
        {isOpen && (
          <div className="absolute right-0 top-14 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#0b0b0f] shadow-2xl backdrop-blur-2xl z-50 overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Notifications
                </h3>
                {hasUnread && (
                  <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/30">
                    New
                  </span>
                )}
              </div>
              {hasUnread && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-gray-400 hover:text-white transition cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-xs">
                  No notifications right now.
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={`p-4 transition cursor-pointer hover:bg-white/4 ${
                      !item.read ? "bg-white/2" : "opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-white">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-gray-500 shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                    {!item.read && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* User Profile Section */}
        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">
              {user?.name || "Alex Sterling"}
            </p>
            <p className="text-[10px] text-gray-500">TechFlow Inc.</p>
          </div>
          <div className="w-10 h-10 rounded-full relative overflow-hidden border border-white/10 bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white">
            {user?.image ? (
              <Image
                src={user.image}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              "A"
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
