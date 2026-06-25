import { useLanguage, type Language } from "@/i18n/language";

const languageLabels: Record<Language, string> = {
  en: "EN",
  fr: "FR",
};

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className="language-toggle"
      role="group"
      aria-label="Language selector"
      title={t.switchTo}
    >
      {(["en", "fr"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={language === option}
          aria-label={`${languageLabels[option]} · ${option === "en" ? "English" : "Français"}`}
          onClick={() => setLanguage(option)}
        >
          {languageLabels[option]}
        </button>
      ))}
    </div>
  );
}
