"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";

const productLinks = [
  { label: "Job discovery", href: "/jobs" },
  { label: "Worker AI", href: "/worker-ai" },
  { label: "Companies", href: "/companies" },
  { label: "Salary data", href: "/salary-data" },
];

const navigationLinks = [
  { label: "Help center", href: "/help" },
  { label: "Career library", href: "/career-library" },
  { label: "Contact", href: "/contact" },
];

const resourceLinks = [
  { label: "Brand Guideline", href: "/brand-guideline" },
  { label: "Newsroom", href: "/newsroom" },
];

const footerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const footerItem = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const linkItem = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 bg-[#121212] px-6 py-12 text-gray-400">
      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        viewport={{
          once: true,
          amount: 0.1,
        }}
        transition={{
          duration: 1.2,
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-56
          w-150
          -translate-x-1/2
          rounded-full
          bg-indigo-600/5
          blur-[120px]
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <motion.div
        variants={footerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.15,
        }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-between gap-12"
      >
        {/* =================================================
            TOP SECTION
        ================================================== */}

        <div className="flex flex-col justify-between gap-10 md:flex-row">
          {/* =================================================
              BRAND
          ================================================== */}

          <motion.div
            variants={footerItem}
            className="flex max-w-xs flex-col gap-4"
          >
            <Link href="/" className="group flex items-center">
              <motion.span
                whileHover={{
                  x: 2,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="text-2xl font-black tracking-tight text-white"
              >
                hire
                <span className="text-blue-500 transition-colors duration-300 group-hover:text-blue-400">
                  l
                </span>
                <span className="text-orange-500 transition-colors duration-300 group-hover:text-orange-400">
                  oop
                </span>
              </motion.span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-400">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>
          </motion.div>

          {/* =================================================
              NAVIGATION COLUMNS
          ================================================== */}

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            {/* Product */}

            <motion.div variants={footerItem} className="flex flex-col gap-3">
              <h3 className="font-semibold tracking-wider text-blue-500">
                Product
              </h3>

              <motion.div
                variants={footerContainer}
                className="flex flex-col gap-3"
              >
                {productLinks.map((link) => (
                  <FooterLink
                    key={link.label}
                    href={link.href}
                    label={link.label}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Navigation */}

            <motion.div variants={footerItem} className="flex flex-col gap-3">
              <h3 className="font-semibold tracking-wider text-blue-500">
                Navigations
              </h3>

              <motion.div
                variants={footerContainer}
                className="flex flex-col gap-3"
              >
                {navigationLinks.map((link) => (
                  <FooterLink
                    key={link.label}
                    href={link.href}
                    label={link.label}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Resources */}

            <motion.div variants={footerItem} className="flex flex-col gap-3">
              <h3 className="font-semibold tracking-wider text-blue-500">
                Resources
              </h3>

              <motion.div
                variants={footerContainer}
                className="flex flex-col gap-3"
              >
                {resourceLinks.map((link) => (
                  <FooterLink
                    key={link.label}
                    href={link.href}
                    label={link.label}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* =================================================
            BOTTOM SECTION
        ================================================== */}

        <motion.div
          variants={footerItem}
          className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-6 sm:flex-row"
        >
          {/* =================================================
              SOCIAL ICONS
          ================================================== */}

          <div className="flex items-center gap-3">
            {/* Facebook */}

            <SocialButton href="https://facebook.com" label="Facebook">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </SocialButton>

            {/* Pinterest */}

            <SocialButton href="https://pinterest.com" label="Pinterest">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.223 7.462-1.214 0-2.352-.63-2.74-1.379l-.749 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </SocialButton>

            {/* LinkedIn */}

            <SocialButton href="https://linkedin.com" label="LinkedIn">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </SocialButton>
          </div>

          {/* =================================================
              COPYRIGHT
          ================================================== */}

          <div className="flex flex-col items-center gap-4 text-xs text-gray-500 sm:flex-row">
            <span>Copyright 2026 — Hire Loop</span>

            <div className="hidden h-1 w-1 rounded-full bg-gray-700 sm:block" />

            <div className="flex gap-4">
              <AnimatedFooterLink href="/terms" label="Terms & Policy" />

              <span>-</span>

              <AnimatedFooterLink href="/privacy" label="Privacy Guideline" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}

/* =========================================================
   FOOTER LINK
========================================================= */

function FooterLink({ href, label }) {
  return (
    <motion.div variants={linkItem}>
      <Link
        href={href}
        className="group relative inline-block w-fit text-gray-400 transition-colors duration-300 hover:text-white"
      >
        {label}

        <motion.span
          initial={{
            scaleX: 0,
          }}
          whileHover={{
            scaleX: 1,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className="
            absolute
            -bottom-1
            left-0
            h-px
            w-full
            origin-left
            bg-indigo-400
          "
        />
      </Link>
    </motion.div>
  );
}

/* =========================================================
   SOCIAL BUTTON
========================================================= */

function SocialButton({ href, label, children }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{
        y: -4,
        scale: 1.08,
      }}
      whileTap={{
        scale: 0.92,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 18,
      }}
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        border-white/10
        bg-[#1c1c1e]
        text-gray-300
        transition-colors
        duration-300
        hover:border-indigo-400/30
        hover:bg-indigo-500/10
        hover:text-white
      "
    >
      {children}
    </motion.a>
  );
}

/* =========================================================
   LEGAL LINK
========================================================= */

function AnimatedFooterLink({ href, label }) {
  return (
    <Link
      href={href}
      className="relative text-gray-500 transition-colors duration-300 hover:text-gray-300"
    >
      {label}

      <motion.span
        initial={{
          scaleX: 0,
        }}
        whileHover={{
          scaleX: 1,
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className="
          absolute
          -bottom-1
          left-0
          h-px
          w-full
          origin-left
          bg-gray-400
        "
      />
    </Link>
  );
}
