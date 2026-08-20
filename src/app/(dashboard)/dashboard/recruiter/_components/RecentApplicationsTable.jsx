import React from "react";
import Link from "next/link";

export function RecentApplicationsTable({ applications }) {
  return (
    <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-white">Recent Applications</h2>
        <Link
          href="/dashboard/recruiter/applications"
          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
              <th className="pb-3 pr-4">Candidate Name</th>
              <th className="pb-3 px-4">Role</th>
              <th className="pb-3 px-4">Date Applied</th>
              <th className="pb-3 px-4">Experience</th>
              <th className="pb-3 pl-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {applications.map((app, idx) => (
              <tr key={idx} className="group hover:bg-white/2 transition">
                <td className="py-4 pr-4 font-medium text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white shrink-0">
                    {app.name.charAt(0)}
                  </div>
                  <span className="truncate">{app.name}</span>
                </td>
                <td className="py-4 px-4 text-gray-300 truncate">{app.role}</td>
                <td className="py-4 px-4 text-gray-500">{app.date}</td>
                <td className="py-4 px-4 text-gray-400">{app.experience}</td>
                <td className="py-4 pl-4 text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${app.statusColor}`}
                  >
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}