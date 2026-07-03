import type { ComponentType } from "react";
import type { Slide, VisualKind } from "@/data/projects/football-pipeline";
import { BarsVisual } from "./visuals/BarsVisual";
import { DemoVisual } from "./visuals/DemoVisual";
import { FlowVisual } from "./visuals/FlowVisual";
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
    </div>
  );
}
