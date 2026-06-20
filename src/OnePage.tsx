import { ScrollProvider } from "@/scroll/ScrollProvider";
import { PathOrb } from "@/components/PathOrb";
import { ProgressMarkers } from "@/components/ProgressMarkers";
import { Nav } from "@/sections/Nav";
import { Hero } from "@/sections/Hero";
import { Manifeste } from "@/sections/Manifeste";
import { FlowProjets } from "@/sections/FlowProjets";
import { DeepDive } from "@/sections/DeepDive";
import { Stack } from "@/sections/Stack";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";

function OnePage() {
  return (
    <ScrollProvider>
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
        <main id="main">
          <Hero />
          <Manifeste />
          <FlowProjets />
          <DeepDive />
          <Stack />
          <About />
          <Contact />
        </main>
      </div>
    </ScrollProvider>
  );
}

export default OnePage;
