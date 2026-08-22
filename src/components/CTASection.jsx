"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import { HiArrowRight } from "react-icons/hi2";
import { motion } from "motion/react";

export default function CTASection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    authClient.getSession().then(({ data }) => {
      if (active) setIsAuthenticated(Boolean(data?.user || data?.session?.user));
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#030305] pt-10 text-white sm:pt-14">
      {/* =====================================================
          CTA BACKGROUND
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl overflow-hidden">
        {/* =================================================
            MAIN VIOLET GLOW
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0.7,
            scale: 1,
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            pointer-events-none
            absolute
            left-1/2
            -top-5
            h-100
            w-187.5
            -translate-x-1/2
            rounded-full
            bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.55)_0%,rgba(124,58,237,0.35)_40%,transparent_75%)]
            blur-[50px]
          "
        />

        {/* =================================================
            GRID BACKGROUND
        ================================================== */}

        <motion.div
          initial={{
            scale: 1,
          }}
          animate={{
            scale: [1, 1.015, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-145
            w-full
            -translate-x-1/2
            bg-cover
            bg-top
            bg-no-repeat
            opacity-90
          "
          style={{
            backgroundImage: "url('/images/cta-bg.jpg')",
          }}
        />

        {/* =================================================
            VIOLET GRADIENT OVERLAY
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0.7,
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-95
            w-full
            -translate-x-1/2
            bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.3)_0%,rgba(79,70,229,0.15)_50%,transparent_80%)]
          "
        />

        {/* =================================================
            FLOATING LIGHT
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0.2,
            x: "-50%",
            y: 0,
          }}
          animate={{
            x: ["-50%", "-42%", "-50%"],
            y: [0, 15, 0],
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-12
            h-32
            w-80
            -translate-x-1/2
            rounded-full
            bg-indigo-400/10
            blur-[80px]
          "
        />

        {/* =================================================
            BOTTOM FADE
        ================================================== */}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-70 bg-linear-to-t from-[#030305] via-[#030305]/85 to-transparent" />

        {/* =================================================
            CONTENT
        ================================================== */}

        <div className="relative z-10 flex min-h-125 flex-col items-center px-4 pt-16 text-center sm:min-h-135 sm:pt-20">
          {/* =================================================
              HEADING
          ================================================== */}

          <motion.h2
            initial={{
              opacity: 0,
              y: 35,
              filter: "blur(8px)",
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-2xl text-[36px] font-medium leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl md:text-[52px]"
          >
            Your next role is
            <br />
            <motion.span
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                delay: 0.25,
                ease: "easeOut",
              }}
            >
              already looking for you
            </motion.span>
          </motion.h2>

          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.7,
              delay: 0.35,
              ease: "easeOut",
            }}
            className="mt-4 max-w-lg text-[13px] leading-6 text-gray-400 sm:text-sm"
          >
            Build a profile in three minutes. The matches start arriving
            tomorrow morning.
          </motion.p>

          {/* =================================================
              BUTTONS
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.7,
              delay: 0.5,
              ease: "easeOut",
            }}
            className="mt-6 flex items-center gap-2.5"
          >
            {/* Create Account / Dashboard */}

            <Link href={isAuthenticated ? "/dashboard" : "/auth/signup"}>
              <motion.div
                whileHover={{
                  scale: 1.04,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 18,
                }}
              >
                <Button
                  radius="sm"
                  className="
                    h-9
                    bg-white
                    px-4
                    text-[11px]
                    font-medium
                    text-black
                    shadow-[0_5px_25px_rgba(255,255,255,.08)]
                    transition
                    hover:bg-gray-100
                    sm:h-10
                    sm:px-5
                    sm:text-xs
                  "
                >
                  {isAuthenticated ? "Go to dashboard" : "Create a free account"}
                </Button>
              </motion.div>
            </Link>

            {/* Pricing */}

            <Link href="/pricing">
              <motion.div
                whileHover={{
                  scale: 1.04,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 18,
                }}
              >
                <Button
                  radius="sm"
                  variant="bordered"
                  className="
                    group
                    h-9
                    border-white/15
                    bg-[#0d0d12]/70
                    px-4
                    text-[11px]
                    font-medium
                    text-gray-300
                    backdrop-blur-sm
                    transition
                    hover:border-white/25
                    hover:bg-white/6
                    sm:h-10
                    sm:px-5
                    sm:text-xs
                  "
                  endContent={
                    <motion.span
                      whileHover={{
                        x: 3,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                    >
                      <HiArrowRight className="text-[11px]" />
                    </motion.span>
                  }
                >
                  View pricing
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* =================================================
              BOTTOM ACCENT
          ================================================== */}

          <motion.div
            initial={{
              width: 0,
              opacity: 0,
            }}
            whileInView={{
              width: 90,
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 1,
              delay: 0.8,
              ease: "easeOut",
            }}
            className="
              absolute
              bottom-8
              h-px
              bg-linear-to-r
              from-transparent
              via-indigo-400/40
              to-transparent
            "
          />
        </div>
      </div>
    </section>
  );
}
