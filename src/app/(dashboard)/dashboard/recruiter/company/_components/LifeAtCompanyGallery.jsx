"use client";

import React from "react";
import Image from "next/image";

const DEMO_GALLERY = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
];

export function LifeAtCompanyGallery({ photos }) {
  const images = photos?.length ? photos : DEMO_GALLERY;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-6 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Life at LuminaTech</h3>
        <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition">
          View Gallery
        </button>
      </div>

      {/* Grid Layout Matching Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 h-72 sm:h-80">
        {/* Large Main Office Photo */}
        <div className="sm:col-span-2 relative h-full rounded-2xl overflow-hidden border border-white/10 group">
          <Image
            src={images[0]}
            alt="Office workspace"
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        </div>

        {/* Two Stacked Side Photos */}
        <div className="grid grid-rows-2 gap-3 h-full">
          <div className="relative h-full rounded-xl overflow-hidden border border-white/10 group">
            <Image
              src={images[1]}
              alt="Team Meeting"
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
          <div className="relative h-full rounded-xl overflow-hidden border border-white/10 group">
            <Image
              src={images[2]}
              alt="Coding Setup"
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
