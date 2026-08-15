import Link from "next/link";
import { Button } from "@heroui/react";
import { HiArrowRight } from "react-icons/hi2";

export default function CTASection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#030305] pt-10 text-white sm:pt-14">
      {/* =====================================================
          CTA BACKGROUND
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl overflow-hidden">
        {/* Main Vivid Violet Glow Layer */}
        <div
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

        {/* Grid Background Image */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-145 w-full -translate-x-1/2 bg-cover bg-top bg-no-repeat opacity-90"
          style={{
            backgroundImage: "url('/images/cta-bg.jpg')",
          }}
        />

        {/* Violet Gradient Overlay (lights up the grid lines) */}
        <div
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

        {/* Bottom Fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-70 bg-linear-to-t from-[#030305] via-[#030305]/85 to-transparent" />

        {/* =================================================
            CONTENT
        ================================================== */}

        <div className="relative z-10 flex min-h-125 flex-col items-center px-4 pt-16 text-center sm:min-h-135 sm:pt-20">
          <h2 className="max-w-2xl text-[36px] font-medium leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl md:text-[52px]">
            Your next role is
            <br />
            already looking for you
          </h2>

          <p className="mt-4 max-w-lg text-[13px] leading-6 text-gray-400 sm:text-sm">
            Build a profile in three minutes. The matches start arriving
            tomorrow morning.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex items-center gap-2.5">
            {/* Create account */}
            <Link href="/signup">
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
                Create a free account
              </Button>
            </Link>

            {/* Pricing */}
            <Link href="/pricing">
              <Button
                radius="sm"
                variant="bordered"
                className="
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
                endContent={<HiArrowRight className="text-[11px]" />}
              >
                View pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
