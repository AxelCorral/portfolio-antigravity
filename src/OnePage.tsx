import { useEffect } from "react";
import { StepNavProvider, STEPPING_QUERY } from "@/scroll/StepNavContext";
import { consumeReturnPosition } from "@/scroll/returnPosition";
import { PathOrb } from "@/components/PathOrb";
import { ProgressMarkers } from "@/components/ProgressMarkers";
import { Nav } from "@/sections/Nav";
import { Hero } from "@/sections/Hero";
import { Manifeste } from "@/sections/Manifeste";
import { FlowProjets } from "@/sections/FlowProjets";
import { ProjectsRecap } from "@/components/ProjectsRecap";
import { DeepDive } from "@/sections/DeepDive";
import { Stack } from "@/sections/Stack";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";

/** Mirror of StepNavProvider's stepping-mode restoration, for native/mobile/reduced-motion. */
function useNativeScrollRestoration() {
  useEffect(() => {
    if (window.matchMedia(STEPPING_QUERY).matches) return;
    const saved = consumeReturnPosition();
    if (saved?.mode === "native" && saved.scrollY !== undefined) {
      window.scrollTo(0, saved.scrollY);
    }
  }, []);
}

function OnePage() {
  useNativeScrollRestoration();

  return (
    <StepNavProvider>
      <div className="relative overflow-x-hidden bg-void text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-deep focus:px-4 focus:py-2 focus:text-ink"
        >
          Aller au contenu
        </a>
        <PathOrb />
        <ProgressMarkers />
        <Nav />
        <main
          id="main"
          className="max-md:snap-y max-md:snap-mandatory motion-reduce:snap-y motion-reduce:snap-mandatory"
        >
          <Hero />
          <Manifeste />
          <FlowProjets />
          <ProjectsRecap />
          <DeepDive />
          <Stack />
          <About />
          <Contact />
        </main>
      </div>
    </StepNavProvider>
  );
}

export default OnePage;
