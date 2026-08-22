"use client";

import React from "react";
import { motion } from "motion/react";

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
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16" />
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m7 10 5 5 5-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 21h14" />
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
        <path strokeLinecap="round" d="M10 13h5M10 17h5" />
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7h4v4" />
      </svg>
    ),
  },
];

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.96,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 16,
      mass: 0.7,
    },
  },
};

export default function Features() {
  return (
    <section className="relative w-full overflow-hidden bg-[#121212] px-4 py-20 text-white sm:px-6 lg:px-8">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
        className="pointer-events-none absolute left-1/2 top-0 h-75 w-150 -translate-x-1/2 rounded-full bg-indigo-600/4 blur-[120px]"
      />

      {/* Animated secondary glow */}

      <motion.div
        animate={{
          x: ["-50%", "-47%", "-50%"],
          y: [0, 15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: 0,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-20 h-40 w-80 -translate-x-1/2 rounded-full bg-indigo-500/3 blur-[100px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* =====================================================
            LABEL
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="flex items-center justify-center gap-2"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.15,
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
            className="h-1 w-1 rounded-full bg-indigo-500"
          />

          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400">
            Features
          </span>

          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.15,
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
            className="h-1 w-1 rounded-full bg-indigo-500"
          />
        </motion.div>

        {/* =====================================================
            HEADING
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-3 text-center"
        >
          <h2 className="mx-auto max-w-md text-3xl font-medium leading-[1.05] tracking-[-0.04em] text-white sm:text-4xl">
            Everything you need
            <br />
            to succeed
          </h2>
        </motion.div>

        {/* =====================================================
            FEATURE GRID
        ====================================================== */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{
                y: -7,
                scale: 1.025,
                transition: {
                  type: "spring",
                  stiffness: 350,
                  damping: 20,
                },
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="
                group
                relative
                flex
                min-h-25
                cursor-default
                items-center
                gap-3
                overflow-hidden
                rounded-lg
                border
                border-white/8
                bg-[#181818]/70
                px-3
                py-3
                backdrop-blur-sm
              "
            >
              {/* =================================================
                  HOVER GLOW
              ================================================== */}

              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  h-24
                  w-24
                  rounded-full
                  bg-indigo-500/10
                  blur-2xl
                "
              />

              {/* =================================================
                  TOP SHINE
              ================================================== */}

              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileHover={{
                  scaleX: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="
                  pointer-events-none
                  absolute
                  left-0
                  right-0
                  top-0
                  h-px
                  origin-left
                  bg-indigo-400/40
                "
              />

              {/* =================================================
                  CARD NUMBER
              ================================================== */}

              <span className="absolute right-2.5 top-2 text-[7px] font-medium tracking-widest text-white/10">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* =================================================
                  ICON
              ================================================== */}

              <motion.div
                whileHover={{
                  scale: 1.12,
                  rotate: 6,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
                className="
                  relative
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
                  transition-colors
                  duration-300
                  group-hover:border-indigo-400/20
                  group-hover:text-indigo-200
                "
              >
                {/* Icon glow */}

                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 rounded-md bg-indigo-500/10 blur-md"
                />

                <span className="relative z-10">{feature.icon}</span>
              </motion.div>

              {/* =================================================
                  TEXT
              ================================================== */}

              <div className="relative z-10 min-w-0">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + index * 0.08,
                  }}
                  className="text-[10px] font-medium leading-4 text-white sm:text-[11px]"
                >
                  {feature.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.25 + index * 0.08,
                  }}
                  className="mt-0.5 text-[8px] leading-[1.55] text-gray-500 sm:text-[9px]"
                >
                  {feature.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}