import { ArrowUpRight, Download, GitBranch, Mail } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDocumentMeta } from "@/scroll/useDocumentMeta";
import { useLanguage } from "@/i18n/language";

const GITHUB_URL = "https://github.com/AxelCorral";
const CV_PDF = "/cv-axel-corral.pdf";

export function CVPage() {
  const { t } = useLanguage();
  const r = t.resume;

  useDocumentMeta(`Axel Corral — ${r.identity.title} · ${r.pageTitle}`, r.metaDescription);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const frame = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="cv-page">
      <div className="cv-shell">
        <div className="cv-topbar">
          <Link to="/" className="cv-back">
            {r.backToSite}
          </Link>
          <a className="cv-download" href={CV_PDF} download="cv-axel-corral.pdf">
            <Download size={15} aria-hidden="true" />
            {r.downloadPdf}
          </a>
        </div>

        <header className="cv-header">
          <p className="cv-kicker">Axel Corral</p>
          <h1 className="cv-name">Axel Corral</h1>
          <p className="cv-title">{r.identity.title}</p>

          <div className="cv-meta">
            <span>{r.identity.location}</span>
            <span className="cv-availability">{r.identity.availability}</span>
          </div>

          <div className="cv-contacts">
            <a href={`mailto:${r.identity.email}`}>
              <Mail size={14} aria-hidden="true" />
              {r.identity.email}
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <GitBranch size={14} aria-hidden="true" />
              {r.identity.github}
            </a>
          </div>
        </header>

        <p className="cv-hook">{r.hook}</p>

        <section id="experience" className="cv-section">
          <h2 className="cv-section-kicker">{r.sectionLabels.experience}</h2>
          <ol className="cv-timeline">
            {r.experience.map((job) => (
              <li key={`${job.org}-${job.dates}`}>
                <div className="cv-timeline-head">
                  <h3>{job.org}</h3>
                  <span className="cv-timeline-dates">{job.dates}</span>
                </div>
                <p className="cv-timeline-role">{job.role}</p>
                {"roleNote" in job && job.roleNote ? (
                  <p className="cv-timeline-note">{job.roleNote}</p>
                ) : null}
                <ul className="cv-timeline-bullets">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className="cv-section" id="projects">
          <h2 className="cv-section-kicker">{r.sectionLabels.projects}</h2>
          <div className="cv-projects-grid">
            {r.projects.map((project) => (
              <a key={project.id} href={`/#project-${project.id}`} className="cv-project-card">
                <span className="cv-project-title">{project.title}</span>
                <p>{project.line}</p>
                <span className="cv-project-link">
                  {r.viewCaseStudy}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </section>

        <div className="cv-two-col">
          <section className="cv-section">
            <h2 className="cv-section-kicker">{r.sectionLabels.education}</h2>
            <ul className="cv-education">
              {r.education.map((entry) => (
                <li key={entry.degree}>
                  <strong>{entry.degree}</strong>
                  {"detail" in entry && entry.detail ? (
                    <span className={"highlight" in entry && entry.highlight ? "cv-highlight" : undefined}>
                      {entry.detail}
                    </span>
                  ) : null}
                  {entry.institution ? <span>{entry.institution}</span> : null}
                  <span className="cv-education-dates">{entry.dates}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="cv-section">
            <h2 className="cv-section-kicker">{r.sectionLabels.languages}</h2>
            <ul className="cv-languages">
              {r.languages.map((language) => (
                <li key={language}>{language}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="cv-section">
          <h2 className="cv-section-kicker">{r.sectionLabels.skills}</h2>
          <div className="cv-skills-groups">
            {r.skills.groups.map((group, index) => (
              <div className={`cv-skill-group cv-skill-group--${index + 1}`} key={group.label}>
                <h3>{group.label}</h3>
                <div className="cv-skill-tags">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="cv-print-note">{r.printNote}</p>
      </div>
    </main>
  );
}
