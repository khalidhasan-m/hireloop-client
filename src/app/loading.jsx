"use client";

import { motion } from "motion/react";

export default function Loading() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#030305] text-white">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Main atmospheric glow */}
        <motion.div
          animate={{
            opacity: [0.12, 0.28, 0.12],
            scale: [0.9, 1.15, 0.9],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-1/2
            top-1/2
            h-125
            w-125
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-indigo-600/20
            blur-[140px]
          "
        />

        {/* Secondary violet glow */}
        <motion.div
          animate={{
            x: ["-50%", "-45%", "-50%"],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-1/2
            top-[15%]
            h-100
            w-200
            -translate-x-1/2
            rounded-full
            bg-purple-600/10
            blur-[120px]
          "
        />

        {/* =================================================
            FUTURISTIC GRID
        ================================================== */}

        <motion.div
          animate={{
            opacity: [0.015, 0.04, 0.015],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            inset-0
            bg-[linear-gradient(rgba(129,140,248,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(129,140,248,0.4)_1px,transparent_1px)]
            bg-size-[55px_55px]
          "
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030305_85%)]" />
      </div>

      {/* =====================================================
          MAIN SYSTEM
      ====================================================== */}

      <div className="relative z-10 flex flex-col items-center">
        {/* =================================================
            FUTURISTIC CORE
        ================================================== */}

        <div className="relative h-64 w-64">
          {/* -----------------------------------------------
              OUTER ROTATING HUD
          ------------------------------------------------ */}

          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute
              inset-0
              rounded-full
              border
              border-indigo-400/10
            "
          >
            {/* HUD segments */}
            <div className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-indigo-400/70" />
            <div className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-indigo-400/30" />
            <div className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-indigo-400/50" />
            <div className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-indigo-400/30" />
          </motion.div>

          {/* -----------------------------------------------
              SECOND HUD RING
          ------------------------------------------------ */}

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute
              inset-5
              rounded-full
              border
              border-dashed
              border-indigo-400/15
            "
          />

          {/* -----------------------------------------------
              THIRD RING
          ------------------------------------------------ */}

          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.03, 1],
            }}
            transition={{
              rotate: {
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="
              absolute
              inset-10
              rounded-full
              border
              border-indigo-300/20
              shadow-[0_0_30px_rgba(99,102,241,0.08)]
            "
          />

          {/* -----------------------------------------------
              SCANNING ARC
          ------------------------------------------------ */}

          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute
              inset-10
              rounded-full
              border
              border-transparent
              border-t-indigo-400
              border-r-indigo-400/20
            "
          />

          {/* -----------------------------------------------
              INNER CORE
          ------------------------------------------------ */}

          <motion.div
            animate={{
              scale: [0.92, 1, 0.92],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              left-1/2
              top-1/2
              h-20
              w-20
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-indigo-400/20
              bg-indigo-500/5
              shadow-[0_0_60px_rgba(99,102,241,0.15)]
            "
          />

          {/* Core */}
          <motion.div
            animate={{
              scale: [0.7, 1, 0.7],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              left-1/2
              top-1/2
              h-3
              w-3
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-indigo-300
              shadow-[0_0_20px_rgba(129,140,248,0.9)]
            "
          />

          {/* -----------------------------------------------
              ORBITING PARTICLE
          ------------------------------------------------ */}

          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-8 rounded-full"
          >
            <span
              className="
                absolute
                -top-1
                left-1/2
                h-1.5
                w-1.5
                -translate-x-1/2
                rounded-full
                bg-indigo-300
                shadow-[0_0_12px_rgba(129,140,248,0.9)]
              "
            />
          </motion.div>

          {/* -----------------------------------------------
              CROSSHAIR
          ------------------------------------------------ */}

          <div className="absolute left-1/2 top-1/2 h-28 w-px -translate-x-1/2 -translate-y-1/2 bg-indigo-400/5" />

          <div className="absolute left-1/2 top-1/2 h-px w-28 -translate-x-1/2 -translate-y-1/2 bg-indigo-400/5" />
        </div>

        {/* =================================================
            BRAND
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
            filter: "blur(8px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="-mt-1"
        >
          <div className="text-2xl font-black tracking-tighter">
            hire
            <span className="text-blue-500">l</span>
            <span className="text-orange-500">oop</span>
          </div>
        </motion.div>

        {/* =================================================
            SYSTEM STATUS
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.45,
            duration: 0.6,
          }}
          className="mt-4 flex items-center gap-2"
        >
          <motion.span
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-1.5 w-1.5 rounded-full bg-indigo-400"
          />

          <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-gray-500">
            Initializing system
          </span>
        </motion.div>

        {/* =================================================
            DATA STREAM
        ================================================== */}

        <div className="mt-5 flex h-3 items-center gap-1 overflow-hidden">
          {[...Array(18)].map((_, index) => (
            <motion.span
              key={index}
              animate={{
                opacity: [0.15, 0.8, 0.15],
                scaleY: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.05,
                ease: "easeInOut",
              }}
              className="h-2 w-px bg-indigo-400/70"
            />
          ))}
        </div>

        {/* =================================================
            BOTTOM SYSTEM TEXT
        ================================================== */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-5 flex items-center gap-4 text-[7px] uppercase tracking-[0.2em] text-white/20"
        >
          <span>Talent</span>

          <span className="h-px w-5 bg-white/10" />

          <span>Opportunity</span>

          <span className="h-px w-5 bg-white/10" />

          <span>Match</span>
        </motion.div>
      </div>

      {/* =====================================================
          CORNER HUD
      ====================================================== */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="
          pointer-events-none
          absolute
          left-6
          top-6
          font-mono
          text-[7px]
          uppercase
          tracking-[0.2em]
          text-white/10
        "
      >
        SYSTEM / 01
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="
          pointer-events-none
          absolute
          right-6
          top-6
          font-mono
          text-[7px]
          uppercase
          tracking-[0.2em]
          text-white/10
        "
      >
        ONLINE
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="
          pointer-events-none
          absolute
          bottom-6
          left-6
          font-mono
          text-[7px]
          uppercase
          tracking-[0.2em]
          text-white/10
        "
      >
        HIRELOOP // 2026
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="
          pointer-events-none
          absolute
          bottom-6
          right-6
          font-mono
          text-[7px]
          uppercase
          tracking-[0.2em]
          text-white/10
        "
      >
        CONNECTING...
      </motion.div>
    </main>
  );
}
