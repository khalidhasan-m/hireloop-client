"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { motion } from "motion/react";

export default function Hero() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const stats = [
    {
      value: "50K",
      label: "Active Jobs",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 7h-5V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8" />
        </svg>
      ),
    },
    {
      value: "12K",
      label: "Companies",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01"
          />
        </svg>
      ),
    },
    {
      value: "2M",
      label: "Job Seekers",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 20c.8-3.4 3.2-5 7-5s6.2 1.6 7 5"
          />
        </svg>
      ),
    },
    {
      value: "97%",
      label: "Satisfaction Rate",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m12 3 2.7 5.5 6 .9-4.4 4.3 1 6-5.3-2.8L6.7 20l1-6-4.4-4.3 6-.9L12 3Z"
          />
        </svg>
      ),
    },
  ];

  const trendingPositions = [
    "Product Designer",
    "AI Engineering",
    "Dev-ops Engineer",
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#030305] px-4 pt-10 pb-10 text-white sm:px-6 lg:px-8">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* very subtle top glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute left-1/2 -top-30 h-105 w-212.5 -translate-x-1/2 rounded-full bg-indigo-500/2"
        />

        {/* Globe atmospheric glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="
            absolute
            left-1/2
            top-93.75
            h-75
            w-212.5
            -translate-x-1/2
            rounded-[50%]
            bg-[radial-gradient(ellipse_at_center,rgba(75,60,255,0.22)_0%,rgba(52,40,190,0.10)_35%,transparent_72%)]
          "
        />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-linear-to-t from-[#030305] to-transparent" />
      </div>

      {/* =====================================================
          STARS
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {[
          ["left-[7%]", "top-[43%]", "bg-white/60"],
          ["left-[14%]", "top-[49%]", "bg-blue-300/70"],
          ["left-[22%]", "top-[54%]", "bg-white/60"],
          ["left-[28%]", "top-[45%]", "bg-indigo-300/70"],
          ["left-[37%]", "top-[52%]", "bg-white/50"],
          ["left-[62%]", "top-[47%]", "bg-blue-300/70"],
          ["left-[71%]", "top-[52%]", "bg-white/60"],
          ["left-[79%]", "top-[44%]", "bg-indigo-300/70"],
          ["left-[89%]", "top-[51%]", "bg-white/60"],
          ["right-[7%]", "top-[39%]", "bg-blue-300/70"],
        ].map(([horizontal, vertical, color], index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 2 + (index % 3),
              delay: index * 0.15,
              repeat: 0,
              ease: "easeInOut",
            }}
            className={`absolute ${horizontal} ${vertical} h-0.5 w-0.5 rounded-full ${color}`}
          />
        ))}
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ===================================================
            BADGE
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#131318]/80 px-3.5 py-1.5 shadow-[0_0_20px_rgba(0,0,0,.25)] backdrop-blur-md">
            <span className="text-[10px]">💼</span>

            <span className="text-[10px] font-medium tracking-[0.14em] text-white">
              50,000+
            </span>

            <span className="text-[9px] uppercase tracking-[0.17em] text-gray-500">
              New Jobs This Month
            </span>
          </div>
        </motion.div>

        {/* ===================================================
            HERO TITLE
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="mx-auto mt-7 max-w-3xl text-center"
        >
          <h1 className="text-[38px] font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl md:text-[51px]">
            Find Your Dream Job Today
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.35,
              ease: "easeOut",
            }}
            className="mx-auto mt-4 max-w-2xl text-[13px] leading-6 text-gray-500 sm:text-sm"
          >
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </motion.p>
        </motion.div>

        {/* ===================================================
            SEARCH
        ==================================================== */}

        <motion.form
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.5,
            ease: "easeOut",
          }}
          onSubmit={handleSearch}
          className="mx-auto mt-6 flex h-12.25 w-full max-w-192.5 items-center rounded-xl border border-white/15 bg-[#0a0a0d]/95 p-1.5 shadow-[0_15px_50px_rgba(0,0,0,.3)]"
        >
          {/* Keyword */}
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3 sm:px-4">
            <svg
              className="h-3.75 w-3.75 shrink-0 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <circle cx="11" cy="11" r="7.5" />
              <path strokeLinecap="round" d="m16.5 16.5 4 4" />
            </svg>

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title, skill or company"
              className="w-full bg-transparent text-[11px] text-white outline-none placeholder:text-gray-500"
            />
          </div>

          {/* Divider */}
          <div className="hidden h-7 w-px bg-white/10 sm:block" />

          {/* Location */}
          <div className="hidden min-w-0 flex-1 items-center gap-3 px-4 sm:flex">
            <svg
              className="h-3.75 w-3.75 shrink-0 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z"
              />
              <circle cx="12" cy="10" r="2.5" />
            </svg>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location or Remote"
              className="w-full bg-transparent text-[11px] text-white outline-none placeholder:text-gray-500"
            />
          </div>

          {/* Search button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
          >
            <Button
              type="submit"
              isIconOnly
              aria-label="Search jobs"
              className="h-9 w-9 min-w-9 rounded-lg bg-indigo-500 text-white transition hover:bg-indigo-400"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7.5" />
                <path strokeLinecap="round" d="m16.5 16.5 4 4" />
              </svg>
            </Button>
          </motion.div>
        </motion.form>

        {/* ===================================================
            TRENDING
        ==================================================== */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.65,
              },
            },
          }}
          className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 text-[9px] sm:text-[10px]"
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4 },
              },
            }}
            className="mr-1 text-gray-500"
          >
            Trending Position
          </motion.span>

          {trendingPositions.map((position) => (
            <motion.button
              key={position}
              type="button"
              variants={{
                hidden: { opacity: 0, y: 10, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.4 },
                },
              }}
              whileHover={{
                y: -2,
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.96,
              }}
              onClick={() => setKeyword(position)}
              className="rounded-full border border-white/10 bg-[#111116]/80 px-3 py-1.5 text-gray-400 transition hover:border-white/20 hover:bg-white/6 hover:text-white"
            >
              {position}
            </motion.button>
          ))}
        </motion.div>

        {/* ===================================================
            GLOBE COMPOSITION
        ==================================================== */}

        <div className="relative mt-7 h-131.25 w-full sm:mt-8 sm:h-135">
          {/* -----------------------------------------------
              Globe glow
          ------------------------------------------------ */}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [0.95, 1.02, 0.95],
            }}
            transition={{
              duration: 5,
              repeat: 0,
              ease: "easeInOut",
            }}
            className="
              absolute
              left-1/2
              top-30
              h-82.5
              w-212.5
              -translate-x-1/2
              rounded-[50%]
              bg-indigo-600/10
            "
          />

          {/* -----------------------------------------------
              THE ACTUAL GLOBE
          ------------------------------------------------ */}

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.8,
              ease: "easeOut",
            }}
            className="
              absolute
              left-1/2
              top-0
              h-150
              w-257.5
              -translate-x-1/2
              overflow-hidden
              rounded-[50%_50%_0_0]
            "
          >
            <motion.div
              animate={{
                scale: [1, 1.015, 1],
              }}
              transition={{
                duration: 12,
                repeat: 0,
                ease: "easeInOut",
              }}
              className="
                absolute
                left-1/2
                -top-10
                h-155
                w-260
                -translate-x-1/2
                bg-cover
                bg-center
                bg-no-repeat
              "
              style={{
                backgroundImage: "url('/images/globe_2.jpg')",
              }}
            />

            {/* subtle top atmosphere */}
            <div className="absolute inset-0 bg-linear-to-b from-linear-400/[0.05] via-transparent to-[#030305]/80" />

            {/* fade the lower part */}
            <div className="absolute bottom-0 left-0 right-0 h-60 bg-linear-to-t from-[#030305] via-[#030305]/60 to-transparent" />
          </motion.div>

          {/* -----------------------------------------------
              HERO TEXT OVER GLOBE
          ------------------------------------------------ */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 1.1,
              ease: "easeOut",
            }}
            className="
              absolute
              left-1/2
              top-75
              z-20
              w-full
              -translate-x-1/2
              text-center
            "
          >
            <p className="text-2xl font-light leading-[1.35] tracking-[-0.035em] text-gray-300 sm:text-[23px]">
              Assisting over{" "}
              <span className="font-medium text-white">15,000 job seekers</span>
            </p>

            <p className="text-2xl font-light leading-[1.35] tracking-[-0.035em] text-gray-300 sm:text-[23px]">
              find their dream positions.
            </p>
          </motion.div>

          {/* -----------------------------------------------
              STATS
          ------------------------------------------------ */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 1.3,
                },
              },
            }}
            className="
              absolute
              bottom-4
              left-1/2
              z-30
              grid
              w-full
              max-w-200
              -translate-x-1/2
              grid-cols-2
              gap-3
              sm:grid-cols-4
            "
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 25,
                    scale: 0.95,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut",
                    },
                  },
                }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  transition: {
                    duration: 0.2,
                  },
                }}
                className="
                  relative
                  h-28.5
                  overflow-hidden
                  rounded-lg
                  border
                  border-white/10
                  bg-[#0b0b0e]/95
                  p-3.5
                  shadow-[0_15px_45px_rgba(0,0,0,.5)]
                  sm:h-29.5
                  sm:p-4
                "
              >
                {/* top border shine */}
                <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />

                {/* icon */}
                <motion.div
                  whileHover={{
                    rotate: 8,
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-300"
                >
                  {stat.icon}
                </motion.div>

                {/* value */}
                <div className="absolute bottom-3.5 left-3.5 sm:bottom-4 sm:left-4">
                  <div className="text-[29px] font-medium leading-none tracking-[-0.04em] text-white">
                    {stat.value}
                  </div>

                  <div className="mt-1.5 text-[9px] text-gray-500 sm:text-[10px]">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom black fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-50 h-24 bg-linear-to-t from-[#030305] to-transparent" />
    </section>
  );
}