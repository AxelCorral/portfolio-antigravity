import { Fragment } from "react";
import { useLanguage, type Language } from "@/i18n/language";

const languageLabels: Record<Language, string> = {
  en: "EN",
  fr: "FR",
};

const switchLabels: Record<Language, string> = {
  en: "Switch to English",
  fr: "Passer en français",
};

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-toggle" role="group" aria-label="Language selector">
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
