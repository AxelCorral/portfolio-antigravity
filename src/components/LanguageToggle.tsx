import { Fragment, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useLanguage, type Language } from "@/i18n/language";

const languageLabels: Record<Language, string> = {
  en: "EN",
  fr: "FR",
};

const switchLabels: Record<Language, string> = {
  en: "Switch to English",
  fr: "Passer en français",
};

/** Above this scroll offset the switch is allowed to tuck away; below it the
 *  reader is still at the top of the page, which is where a language is picked. */
const ALWAYS_VISIBLE_ABOVE = 160;
/** Momentum scrolling and trackpad rubber-banding emit tiny alternating deltas;
 *  anything under this is not a direction change, it is noise. */
const DIRECTION_DEADZONE = 6;

/**
 * Scroll-direction tuck.
 *
 * This control is `position: fixed` for the whole page, and a fixed control with
 * no avoidance strategy prints onto whatever text scrolls under it (cycle 019
 * audit, P0: 24 of 49 scroll positions across the priority zone at 390px). The
 * cycle 016 scrim made the switch legible over the page; it could not make the
 * page legible under the switch. So the switch steps aside while the reader
 * moves down and comes back the instant they move up.
 */
function useTuckedOnScrollDown() {
  const { scrollY } = useScroll();
  const [tucked, setTucked] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (y <= ALWAYS_VISIBLE_ABOVE) {
      setTucked(false);
      return;
    }
    const delta = y - (scrollY.getPrevious() ?? 0);
    if (Math.abs(delta) < DIRECTION_DEADZONE) return;
    setTucked(delta > 0);
  });

  return tucked;
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const tucked = useTuckedOnScrollDown();

  return (
    <div
      className="language-toggle"
      data-tucked={tucked ? "true" : "false"}
      role="navigation"
      aria-label="Language selector"
    >
      {(["en", "fr"] as const).map((option, index) => (
        <Fragment key={option}>
          {index > 0 && (
            <span className="language-toggle-sep" aria-hidden="true">
              ·
            </span>
          )}
          <button
            type="button"
            className="language-toggle-btn"
            aria-current={language === option ? "true" : undefined}
            aria-label={switchLabels[option]}
            onClick={() => setLanguage(option)}
          >
            {languageLabels[option]}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
