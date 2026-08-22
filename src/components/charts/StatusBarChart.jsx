"use client";

/** Horizontal bar chart for application status distribution */
export default function StatusBarChart({ data = [], maxValue }) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const colors = {
    Applied: "#818cf8",
    "Under Review": "#a78bfa",
    Shortlisted: "#fbbf24",
    Rejected: "#f87171",
    Offered: "#34d399",
  };

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const pct = Math.round((item.value / max) * 100);
        return (
          <div key={item.name} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-400">{item.name}</span>
              <span className="font-medium text-white">{item.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: colors[item.name] || "#818cf8",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
