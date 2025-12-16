import Navigation from "@/components/navigation";
import Philosophy from "@/components/philosophy";
import WhatApexIs from "@/components/what-apex-is";
import WhatApexIsNot from "@/components/what-apex-is-not";
import SafetyDisclaimer from "@/components/safety-disclaimer";

export default function About() {
  return (
    <>
      <Navigation />
      <main>
        <Philosophy />
        <WhatApexIs />
        <WhatApexIsNot />
        <SafetyDisclaimer />
      </main>
    </>
  );
}
