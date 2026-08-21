import CTASection from "@/components/CTASection";
import FeaturedJobs from "@/components/FeaturedJobs";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import PricingSection from "@/components/PricingSection";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-[#030305]">
      <Hero />
      <FeaturedJobs />
      <Features />
      <PricingSection />
      <CTASection />
    </div>
  );
}
