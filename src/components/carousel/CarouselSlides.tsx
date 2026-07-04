import type { ComponentType } from "react";
import type { Slide, VisualKind } from "@/data/projects/football-pipeline";
import { BarsVisual } from "./visuals/BarsVisual";
import { DemoVisual } from "./visuals/DemoVisual";
import { DeliverablesVisual } from "./visuals/DeliverablesVisual";
import { EquationVisual } from "./visuals/EquationVisual";
import { FlowVisual } from "./visuals/FlowVisual";
import { LeversVisual } from "./visuals/LeversVisual";
import { LimitsVisual } from "./visuals/LimitsVisual";
import { ScenariosVisual } from "./visuals/ScenariosVisual";
import { ScissorsVisual } from "./visuals/ScissorsVisual";
import { SourcesVisual } from "./visuals/SourcesVisual";
import { SqlVisual } from "./visuals/SqlVisual";
import { SplitVisual } from "./visuals/SplitVisual";
import { StagesVisual } from "./visuals/StagesVisual";
import { TreeVisual } from "./visuals/TreeVisual";

export const VISUALS: Record<VisualKind, ComponentType> = {
  bars: BarsVisual,
  demo: DemoVisual,
  flow: FlowVisual,
  sql: SqlVisual,
  split: SplitVisual,
  stages: StagesVisual,
  tree: TreeVisual,
  levers: LeversVisual,
  sources: SourcesVisual,
  equation: EquationVisual,
  scenarios: ScenariosVisual,
  scissors: ScissorsVisual,
  limits: LimitsVisual,
  deliverables: DeliverablesVisual,
};

export function CoverSlide({ slide }: { slide: Slide }) {
  const renderThesis = () => {
    if (!slide.thesis) return null;
    const accent = slide.thesisAccent;
    if (accent) {
      const idx = slide.thesis.lastIndexOf(accent);
      if (idx !== -1) {
        return (
          <p className="pc-thesis">
            {slide.thesis.slice(0, idx)}
            <span className="pc-thesis-accent">{accent}</span>
          </p>
        );
      }
    }
    return <p className="pc-thesis">{slide.thesis}</p>;
  };

  return (
    <div className="pc-cover">
      {slide.label && <span className="pc-label">{slide.label}</span>}
      <div className="pc-cover-rule" aria-hidden="true" />
      {renderThesis()}
      {slide.sub && <p className="pc-sub">{slide.sub}</p>}
      {slide.file && <code className="pc-file">{slide.file}</code>}
    </div>
  );
}

export function StepSlide({ slide }: { slide: Slide }) {
  const VisualComponent = slide.visual ? VISUALS[slide.visual] : null;
  return (
    <div className="pc-step">
      {slide.label && <span className="pc-label">{slide.label}</span>}
      {slide.headline && <h4 className="pc-headline">{slide.headline}</h4>}
      {slide.body && <p className="pc-body">{slide.body}</p>}
      {VisualComponent && (
        <div className="pc-visual" aria-hidden="true">
          <VisualComponent />
        </div>
      )}
      {slide.links?.length ? (
        <div className="pc-links">
          {slide.links.map((link) => (
            <a
              key={link.url}
              className="pc-link"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
