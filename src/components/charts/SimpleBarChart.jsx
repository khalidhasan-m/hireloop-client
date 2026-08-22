"use client";

/** Vertical bar chart (e.g. applicants per job, jobs per category) */
export default function SimpleBarChart({
  data = [],
  valueKey = "value",
  labelKey = "label",
  color = "#818cf8",
  height = 180,
}) {
  const max = Math.max(...data.map((d) => Number(d[valueKey] || 0)), 1);

  if (!data.length) {
    return (
      <p className="py-10 text-center text-xs text-gray-500">No data yet</p>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex h-full items-end gap-2">
        {data.map((item, index) => {
          const value = Number(item[valueKey] || 0);
          const h = Math.max(4, Math.round((value / max) * 100));
          const label = String(item[labelKey] || "").slice(0, 12);
          return (
            <div
              key={`${label}-${index}`}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1"
            >
              <span className="text-[9px] font-medium text-gray-400">{value}</span>
              <div
                className="w-full max-w-10 rounded-t-md transition-all"
                style={{ height: `${h}%`, backgroundColor: color, opacity: 0.85 }}
                title={`${label}: ${value}`}
              />
              <span className="max-w-full truncate text-[9px] text-gray-500">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
