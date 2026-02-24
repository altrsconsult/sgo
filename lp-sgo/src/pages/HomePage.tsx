/**
 * Home Page — Long-scroll para cliente final
 * DevCta após o hero bifurca integradores/devs para /devs
 */

import { Hero } from "@/components/sections/Hero";
import { DevCta } from "@/components/sections/DevCta";
import { ValueProps } from "@/components/sections/ValueProps";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Comparison } from "@/components/sections/Comparison";
import { PricingSection } from "@/components/sections/PricingSection";
import { ModuleShowcase } from "@/components/sections/ModuleShowcase";
import { NexusSection } from "@/components/sections/NexusSection";
import { CTASection } from "@/components/sections/CTASection";
import { CTAFinal } from "@/components/sections/CTAFinal";

export function HomePage() {
  return (
    <div className="sgo-home">
      <Hero />
      <DevCta />
      <ValueProps />
      <HowItWorks />
      <Comparison />
      <PricingSection />
      <ModuleShowcase />
      <NexusSection />
      <CTASection />
      <CTAFinal />
    </div>
  );
}
