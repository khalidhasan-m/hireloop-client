"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "motion/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const router = useRouter();

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      setIsOpen(false);

      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Unable to log out. Please try again.");
        return;
      }

      toast.success("Logged out successfully!");

      router.push("/auth/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);

      toast.error("Something went wrong while logging out.");
    } finally {
      setLogoutLoading(false);
    }
  };

  const navLinks = [
    {
      label: "Browse Jobs",
      href: "/jobs",
    },
    {
      label: "Companies",
      href: "/companies",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
  ];

  const dashboardLink =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "recruiter"
        ? "/dashboard/recruiter"
        : user?.role === "seeker"
          ? "/dashboard/seeker"
          : null;

  return (
    <div className="relative z-100 flex w-full justify-center bg-[#030305] px-4 pt-4">
      <div className="relative w-full max-w-6xl">
        {/* =====================================================
            NAVBAR
        ====================================================== */}

        <motion.nav
          initial={{
            opacity: 0,
            y: -20,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            z-100
            flex
            w-full
            items-center
            justify-between
            rounded-2xl
            border
            border-white/10
            bg-[#1c1c1e]/80
            px-6
            py-3
            shadow-lg
            backdrop-blur-md
          "
        >
          {/* =====================================================
              LOGO
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="flex items-center"
          >
            <Link href="/" className="flex items-center">
              <motion.span
                whileHover={{
                  scale: 1.03,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="text-2xl font-black tracking-tight text-white"
              >
                hire
                <span className="text-blue-500">l</span>
                <span className="text-orange-500">oop</span>
              </motion.span>
            </Link>
          </motion.div>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}

          <div className="hidden items-center gap-8 md:flex">
            {/* Navigation Links */}

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.25,
              }}
              className="flex items-center gap-6 text-sm font-medium text-gray-300"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative py-1 transition-colors hover:text-white"
                >
                  {link.label}

                  <motion.span
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-px
                      w-full
                      origin-left
                      bg-indigo-400
                    "
                    initial={{
                      scaleX: 0,
                      opacity: 0,
                    }}
                    whileHover={{
                      scaleX: 1,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                  />
                </Link>
              ))}
            </motion.div>

            {/* Divider */}

            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.35,
              }}
              className="h-4 w-px bg-white/20"
            />

            {/* =================================================
                AUTH
            ================================================== */}

            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut",
              }}
              className="flex items-center gap-4"
            >
              {isPending ? (
                <motion.div
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: 0,
                    ease: "easeInOut",
                  }}
                  className="h-8 w-24 rounded-lg bg-white/5"
                />
              ) : user ? (
                <>
                  {/* Dashboard */}

                  {dashboardLink && (
                    <Link href={dashboardLink}>
                      <motion.div
                        whileHover={{
                          y: -1,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                      >
                        <Button
                          type="button"
                          className="
                            bg-transparent
                            px-0
                            text-sm
                            font-medium
                            text-gray-300
                            transition-colors
                            hover:bg-transparent
                            hover:text-white
                          "
                        >
                          Dashboard
                        </Button>
                      </motion.div>
                    </Link>
                  )}

                  {/* User Name */}

                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-32 truncate text-sm font-medium text-gray-300"
                  >
                    Hi, {user.name || "User"}
                  </motion.span>

                  {/* Logout */}

                  <motion.div
                    whileHover={{
                      scale: 1.03,
                      y: -1,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >
                    <Button
                      type="button"
                      onPress={handleLogout}
                      isDisabled={logoutLoading}
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-white/5
                        px-5
                        py-2
                        font-medium
                        text-gray-300
                        transition-all
                        hover:bg-white/10
                        hover:text-white
                      "
                    >
                      {logoutLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          Logging out...
                        </span>
                      ) : (
                        "Log Out"
                      )}
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Sign In */}

                  <Link href="/auth/login">
                    <motion.div
                      whileHover={{
                        y: -1,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                    >
                      <Button
                        type="button"
                        className="
                          bg-transparent
                          px-0
                          text-sm
                          font-medium
                          text-gray-300
                          transition-colors
                          hover:bg-transparent
                          hover:text-white
                        "
                      >
                        Sign In
                      </Button>
                    </motion.div>
                  </Link>

                  {/* Get Started */}

                  <Link href="/auth/signup">
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
                        type="button"
                        className="
                          rounded-xl
                          bg-indigo-500
                          px-5
                          py-2
                          font-medium
                          text-white
                          shadow-md
                          transition-all
                          hover:bg-indigo-400
                          hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]
                        "
                      >
                        Get Started
                      </Button>
                    </motion.div>
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* =====================================================
              MOBILE MENU BUTTON
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="flex items-center md:hidden"
          >
            <motion.button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              whileTap={{
                scale: 0.88,
              }}
              whileHover={{
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
              className="rounded-lg p-1 text-gray-300 transition-colors hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              <motion.svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{
                  rotate: isOpen ? 90 : 0,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </motion.svg>
            </motion.button>
          </motion.div>
        </motion.nav>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{
                opacity: 0,
                y: -10,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.98,
              }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                absolute
                left-0
                right-0
                top-full
                z-999
                mt-2
                rounded-2xl
                border
                border-white/10
                bg-[#1c1c1e]
                p-6
                shadow-2xl
                md:hidden
              "
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.06,
                      delayChildren: 0.08,
                    },
                  },
                }}
                className="flex flex-col gap-4"
              >
                {/* Navigation */}

                {navLinks.map((link) => (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: {
                        opacity: 0,
                        x: -15,
                      },
                      visible: {
                        opacity: 1,
                        x: 0,
                      },
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="
                        block
                        py-1
                        text-sm
                        font-medium
                        text-gray-300
                        transition-colors
                        hover:text-white
                      "
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Divider */}

                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      scaleX: 0,
                    },
                    visible: {
                      opacity: 1,
                      scaleX: 1,
                    },
                  }}
                  className="my-1 h-px w-full origin-left bg-white/10"
                />

                {/* =================================================
                    MOBILE AUTH
                ================================================== */}

                {isPending ? (
                  <motion.div
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: 0,
                      ease: "easeInOut",
                    }}
                    className="h-9 w-full rounded-lg bg-white/5"
                  />
                ) : user ? (
                  <>
                    {/* Dashboard */}

                    {dashboardLink && (
                      <motion.div
                        variants={{
                          hidden: {
                            opacity: 0,
                            y: 10,
                          },
                          visible: {
                            opacity: 1,
                            y: 0,
                          },
                        }}
                      >
                        <Link
                          href={dashboardLink}
                          onClick={() => setIsOpen(false)}
                          className="
                            block
                            py-1
                            text-sm
                            font-medium
                            text-gray-300
                            transition-colors
                            hover:text-white
                          "
                        >
                          Dashboard
                        </Link>
                      </motion.div>
                    )}

                    {/* User Name */}

                    <motion.div
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 10,
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                        },
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <p className="text-[10px] text-gray-500">Signed in as</p>

                      <p className="mt-1 truncate text-sm font-medium text-white">
                        {user.name || "User"}
                      </p>

                      {user.role && (
                        <p className="mt-1 text-[10px] capitalize text-gray-500">
                          {user.role}
                        </p>
                      )}
                    </motion.div>

                    {/* Mobile Logout */}

                    <motion.div
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 10,
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                        },
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                    >
                      <Button
                        type="button"
                        onPress={handleLogout}
                        isDisabled={logoutLoading}
                        className="
                          w-full
                          rounded-xl
                          border
                          border-white/10
                          bg-white/5
                          py-2
                          font-medium
                          text-gray-300
                          transition-all
                          hover:bg-white/10
                          hover:text-white
                        "
                      >
                        {logoutLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                            Logging out...
                          </span>
                        ) : (
                          "Log Out"
                        )}
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* Mobile Sign In */}

                    <motion.div
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 10,
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                        },
                      }}
                    >
                      <Link
                        href="/auth/login"
                        onClick={() => setIsOpen(false)}
                        className="block w-full"
                      >
                        <Button
                          type="button"
                          className="
                            w-full
                            justify-start
                            bg-transparent
                            px-0
                            py-1
                            text-left
                            text-sm
                            font-medium
                            text-gray-300
                            transition-colors
                            hover:bg-transparent
                            hover:text-white
                          "
                        >
                          Sign In
                        </Button>
                      </Link>
                    </motion.div>

                    {/* Mobile Get Started */}

                    <motion.div
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 10,
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                        },
                      }}
                      whileHover={{
                        scale: 1.02,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                    >
                      <Link
                        href="/auth/signup"
                        onClick={() => setIsOpen(false)}
                        className="block w-full"
                      >
                        <Button
                          type="button"
                          className="
                            w-full
                            rounded-xl
                            bg-indigo-500
                            py-2
                            font-medium
                            text-white
                            shadow-md
                            transition-all
                            hover:bg-indigo-400
                          "
                        >
                          Get Started
                        </Button>
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
