import React from "react";

const features = [
  {
    title: "Smart Search",
    description: "Find your ideal job with advanced filters.",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path strokeLinecap="round" d="m16 16 4.5 4.5" />
      </svg>
    ),
  },
  {
    title: "Salary Insights",
    description: "Get real salary data to negotiate confidently.",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 19V5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 19h16"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m7 14 3-3 3 2 5-6"
        />
      </svg>
    ),
  },
  {
    title: "Top Companies",
    description: "Apply to vetted companies that are hiring.",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 20V10h6v10M10 20V4h6v16M16 20v-7h4v7"
        />
      </svg>
    ),
  },
  {
    title: "Saved Jobs",
    description: "Manage jobs and favorites on your dashboard.",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 4h12v17l-6-4-6 4V4Z"
        />
      </svg>
    ),
  },
  {
    title: "One-Click Apply",
    description: "Simplify job applications for an easier process!",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v12"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m7 10 5 5 5-5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 21h14"
        />
      </svg>
    ),
  },
  {
    title: "Resume Builder",
    description: "Create professional resumes with modern templates.",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 3h7l4 4v14H7V3Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 3v5h5"
        />
        <path
          strokeLinecap="round"
          d="M10 13h5M10 17h5"
        />
      </svg>
    ),
  },
  {
    title: "Skill-Based Matching",
    description: "Discover jobs that match your skills and experience.",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4 15 9l5 3-5 3-3 5-3-5-5-3 5-3 3-5Z"
        />
      </svg>
    ),
  },
  {
    title: "Career Growth Resources",
    description: "Boost your career with quick interview tips.",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4 18 6-6 4 3 6-8"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7h4v4"
        />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section className="w-full relative overflow-hidden bg-[#121212] px-4 py-20 text-white sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-75 w-150 -translate-x-1/2 rounded-full bg-indigo-600/4 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Label */}
        <div className="flex items-center justify-center gap-2">
          <span className="h-1 w-1 rounded-full bg-indigo-500" />

          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400">
            Features
          </span>

          <span className="h-1 w-1 rounded-full bg-indigo-500" />
        </div>

        {/* Heading */}
        <div className="mt-3 text-center">
          <h2 className="mx-auto max-w-md text-3xl font-medium leading-[1.05] tracking-[-0.04em] text-white sm:text-4xl">
            Everything you need
            <br />
            to succeed
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="
                group
                flex
                min-h-25
                items-center
                gap-3
                rounded-lg
                border
                border-white/8
                bg-[#181818]/70
                px-3
                py-3
                backdrop-blur-sm
                transition-all
                duration-300
                hover:border-indigo-500/20
                hover:bg-[#1b1b1b]
              "
            >
              {/* Icon */}
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-white/8
                  bg-[#101010]
                  text-indigo-300
                  transition-all
                  duration-300
                  group-hover:border-indigo-400/20
                  group-hover:text-indigo-200
                "
              >
                {feature.icon}
              </div>

              {/* Text */}
              <div className="min-w-0">
                <h3 className="text-[10px] font-medium leading-4 text-white sm:text-[11px]">
                  {feature.title}
                </h3>

                <p className="mt-0.5 text-[8px] leading-[1.55] text-gray-500 sm:text-[9px]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}