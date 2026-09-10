import CTASection from "@/components/home/CTASection";
import FeaturedJobs from "@/components/home/FeaturedJobs";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import PricingSection from "@/components/home/PricingSection";

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
