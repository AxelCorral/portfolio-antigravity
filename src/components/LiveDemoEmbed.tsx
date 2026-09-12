import { ExternalLink, Play } from "lucide-react";
import { useState } from "react";

/**
 * Click-to-load iframe embed for a project's live deployment. The iframe is
 * only mounted after an explicit click — not just `loading="lazy"` — so a
 * heavy third-party app never costs LCP/CLS budget for a visitor who never
 * interacts with it. The caption sits in its own row below the frame rather
 * than overlaid on top of it, so it never blocks a control inside the live
 * app once loaded, and it doubles as the visible fallback: the "open in a
 * new tab" link works whether or not the embed itself renders.
 */
export function LiveDemoEmbed({
  src,
  frameTitle,
  posterSrc,
  posterAlt,
  launchLabel,
  captionLabel,
  openLabel,
}: {
  src: string;
  frameTitle: string;
  posterSrc?: string;
  posterAlt: string;
  launchLabel: string;
  captionLabel: string;
  openLabel: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="demo-embed">
      <div className="demo-embed-frame">
        {loaded ? (
          <iframe src={src} title={frameTitle} loading="lazy" />
        ) : (
          <>
            {posterSrc ? (
              <img className="demo-embed-poster" src={posterSrc} alt={posterAlt} loading="lazy" />
            ) : null}
            <button
              type="button"
              className="demo-embed-launch"
              onClick={() => setLoaded(true)}
            >
              <span className="demo-embed-launch-btn">
                <Play size={16} strokeWidth={1.8} aria-hidden="true" />
                {launchLabel}
              </span>
            </button>
          </>
        )}
      </div>
      <div className="demo-embed-caption">
        <span className="demo-embed-caption-text">{captionLabel}</span>
        <a href={src} target="_blank" rel="noreferrer">
          {openLabel}
          <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
