"use client";

/** Simple SVG line chart for registrations over time */
export default function SimpleLineChart({
  data = [],
  valueKey = "value",
  labelKey = "label",
  height = 160,
  color = "#34d399",
}) {
  if (!data.length) {
    return (
      <p className="py-10 text-center text-xs text-gray-500">No data yet</p>
    );
  }

  const values = data.map((d) => Number(d[valueKey] || 0));
  const max = Math.max(...values, 1);
  const w = 100;
  const h = 100;
  const points = values
    .map((v, i) => {
      const x = data.length === 1 ? 50 : (i / (data.length - 1)) * w;
      const y = h - (v / max) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="h-[calc(100%-20px)] w-full"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          points={points}
        />
        {values.map((v, i) => {
          const x = data.length === 1 ? 50 : (i / (data.length - 1)) * w;
          const y = h - (v / max) * h;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.5"
              fill={color}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-[9px] text-gray-500">
        <span>{String(data[0]?.[labelKey] || "").slice(5)}</span>
        <span>{String(data[data.length - 1]?.[labelKey] || "").slice(5)}</span>
      </div>
    </div>
  );
}
