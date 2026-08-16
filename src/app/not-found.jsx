"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { motion } from "motion/react";
import { HiArrowLeft, HiHome, HiMagnifyingGlass } from "react-icons/hi2";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#030305] px-6 text-white">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main atmospheric glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 7,
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
            blur-[130px]
          "
        />

        {/* Left floating glow */}
        <motion.div
          animate={{
            x: [0, 70, 0],
            y: [0, -40, 0],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-[10%]
            top-[20%]
            h-48
            w-48
            rounded-full
            bg-purple-500/10
            blur-[90px]
          "
        />

        {/* Right floating glow */}
        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 50, 0],
            opacity: [0.05, 0.18, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-[15%]
            right-[10%]
            h-52
            w-52
            rounded-full
            bg-indigo-400/10
            blur-[100px]
          "
        />

        {/* Subtle grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
            bg-size-[50px_50px]
          "
        />

        {/* Center vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030305_75%)]" />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 flex w-full max-w-xl flex-col items-center text-center"
      >
        {/* =====================================================
            404 NUMBER
        ====================================================== */}

        <div className="relative">
          {/* Glow behind number */}
          <motion.div
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              inset-0
              rounded-full
              bg-indigo-500/20
              blur-[50px]
            "
          />

          <motion.h1
            initial={{
              opacity: 0,
              scale: 0.6,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              type: "spring",
              stiffness: 150,
              damping: 15,
            }}
            className="
              relative
              text-[110px]
              font-semibold
              leading-none
              tracking-[-0.08em]
              text-white
              sm:text-[150px]
            "
          >
            404
          </motion.h1>
        </div>

        {/* =====================================================
            LABEL
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.35,
            duration: 0.5,
          }}
          className="
            mt-2
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/3
            px-3
            py-1.5
            backdrop-blur-md
          "
        >
          <motion.span
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="h-1.5 w-1.5 rounded-full bg-indigo-400"
          />

          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400">
            Page not found
          </span>
        </motion.div>

        {/* =====================================================
            HEADING
        ====================================================== */}

        <motion.h2
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.45,
            duration: 0.6,
          }}
          className="
            mt-5
            text-3xl
            font-semibold
            tracking-[-0.045em]
            text-white
            sm:text-4xl
          "
        >
          This page took a wrong turn.
        </motion.h2>

        {/* =====================================================
            DESCRIPTION
        ====================================================== */}

        <motion.p
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.55,
            duration: 0.6,
          }}
          className="
            mt-4
            max-w-md
            text-sm
            leading-6
            text-gray-500
          "
        >
          The page you&aposre looking for doesn&apost exist or may have been
          moved. Let&aposs get you back on track.
        </motion.p>

        {/* =====================================================
            BUTTONS
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.7,
            duration: 0.6,
          }}
          className="
            mt-7
            flex
            flex-col
            gap-3
            sm:flex-row
          "
        >
          {/* GO BACK */}
          <motion.div
            whileHover={{
              y: -2,
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 18,
            }}
          >
            <Button
              onPress={() => window.history.back()}
              radius="sm"
              variant="bordered"
              startContent={<HiArrowLeft className="text-sm" />}
              className="
                h-10
                border-white/10
                bg-white/3
                px-5
                text-xs
                font-medium
                text-gray-300
                backdrop-blur-md
                transition-all
                hover:border-white/20
                hover:bg-white/[0.07]
                hover:text-white
              "
            >
              Go Back
            </Button>
          </motion.div>

          {/* HOME */}
          <Link href="/">
            <motion.div
              whileHover={{
                y: -2,
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 18,
              }}
            >
              <Button
                radius="sm"
                startContent={<HiHome className="text-sm" />}
                className="
                  h-10
                  bg-indigo-500
                  px-5
                  text-xs
                  font-medium
                  text-white
                  shadow-[0_8px_30px_rgba(99,102,241,0.2)]
                  transition-all
                  hover:bg-indigo-400
                  hover:shadow-[0_8px_35px_rgba(99,102,241,0.3)]
                "
              >
                Back to Home
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* =====================================================
            SEARCH SUGGESTION
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1,
            duration: 0.7,
          }}
          className="
            mt-10
            flex
            items-center
            gap-2
            text-[10px]
            text-gray-600
          "
        >
          <HiMagnifyingGlass className="text-gray-600" />

          <span>Try browsing our latest job opportunities instead.</span>
        </motion.div>

        {/* =====================================================
            BOTTOM ACCENT
        ====================================================== */}

        <motion.div
          initial={{
            width: 0,
            opacity: 0,
          }}
          animate={{
            width: 80,
            opacity: 1,
          }}
          transition={{
            delay: 1.1,
            duration: 0.8,
            ease: "easeOut",
          }}
          className="
            mt-8
            h-px
            bg-linear-to-r
            from-transparent
            via-indigo-400/40
            to-transparent
          "
        />
      </motion.div>
    </main>
  );
}
