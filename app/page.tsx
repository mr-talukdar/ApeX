import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import WhyApex from "@/components/why-apex";
import HowItWorks from "@/components/how-it-works";
import Proof from "@/components/proof";
import CTA from "@/components/cta";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <WhyApex />
        <HowItWorks />
        <Proof />
        <CTA />
      </main>
    </>
  );
}
