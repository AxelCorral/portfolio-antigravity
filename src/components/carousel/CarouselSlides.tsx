import type { ComponentType } from "react";
import type { Slide, VisualKind } from "@/data/projects/football-pipeline";
import { BarsVisual } from "./visuals/BarsVisual";
import { DemoVisual } from "./visuals/DemoVisual";
import { FlowVisual } from "./visuals/FlowVisual";
import { IngestVisual } from "./visuals/IngestVisual";
import { SqlVisual } from "./visuals/SqlVisual";
import { SplitVisual } from "./visuals/SplitVisual";
import { StagesVisual } from "./visuals/StagesVisual";
import { TreeVisual } from "./visuals/TreeVisual";

export const VISUALS: Record<VisualKind, ComponentType> = {
  bars: BarsVisual,
  demo: DemoVisual,
  flow: FlowVisual,
  ingest: IngestVisual,
  sql: SqlVisual,
  split: SplitVisual,
  stages: StagesVisual,
  tree: TreeVisual,
};

/** Splits `text` around `accent` (last occurrence) into three parts, wrapping the accent in `className`. */
function renderAccentedText(text: string, accent: string | undefined, className: string) {
  if (accent) {
    const idx = text.lastIndexOf(accent);
    if (idx !== -1) {
      return (
        <>
          {text.slice(0, idx)}
          <span className={className}>{accent}</span>
          {text.slice(idx + accent.length)}
        </>
      );
    }
  }
  return text;
}

export function CoverSlide({ slide }: { slide: Slide }) {
  return (
    <div className="pc-cover">
      {slide.label && <span className="pc-label">{slide.label}</span>}
      <div className="pc-cover-rule" aria-hidden="true" />
      {slide.thesis && (
        <p className="pc-thesis">
          {renderAccentedText(slide.thesis, slide.thesisAccent, "pc-thesis-accent")}
        </p>
      )}
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
      {slide.headline && (
        <h4 className="pc-headline">
          {renderAccentedText(slide.headline, slide.headlineAccent, "pc-headline-accent")}
        </h4>
      )}
      {slide.body && <p className="pc-body">{slide.body}</p>}
      {slide.metaStrip && <p className="pc-meta-strip">{slide.metaStrip}</p>}

      {slide.list?.length ? (
        <div className="pc-list">
          {slide.list.map((item) => (
            <div className="pc-list-item" key={item.number}>
              <span className="pc-list-number">{item.number}</span>
              <div>
                <strong className="pc-list-title">{item.title}</strong>
                <span className="pc-list-sub">{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {slide.stat ? (
        <div className="pc-stat">
          <span className="pc-stat-value">{slide.stat.value}</span>
          <span className="pc-stat-caption">{slide.stat.caption}</span>
        </div>
      ) : null}

      {slide.chartImage ? (
        <div className="pc-chart">
          <img src={slide.chartImage.src} alt={slide.chartImage.alt} loading="lazy" />
        </div>
      ) : null}

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
              className="pc-cta"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <strong className="pc-cta-label">{link.label}</strong>
                {link.sub && <span className="pc-cta-sub">{link.sub}</span>}
              </span>
              <span className="pc-cta-arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
