"use client";

import React from "react";

export function LifeAtCompanyGallery({ photos, companyName }) {
  const images = Array.isArray(photos) ? photos.filter(Boolean).slice(0, 3) : [];
  return <div className="space-y-4 rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-6 backdrop-blur-xl"><div className="flex items-center justify-between"><h3 className="text-sm font-bold text-white">Life at {companyName || "Company"}</h3>{images.length > 0 && <button type="button" className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300">View Gallery</button>}</div>{images.length ? <div className="grid h-72 grid-cols-1 gap-3 sm:h-80 sm:grid-cols-3">{images.map((src, index) => <div key={src} className={`${index === 0 ? "sm:col-span-2" : ""} relative h-full overflow-hidden rounded-xl border border-white/10`}><img src={src} alt={`${companyName || "Company"} workplace ${index + 1}`} className="h-full w-full object-cover transition duration-500 hover:scale-105" /></div>)}</div> : <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-xs text-gray-500">No workplace photos have been added by this company.</div>}</div>;
}
