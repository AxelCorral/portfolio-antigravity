import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { railProjects } from "@/content/projects";
import { deepDives } from "@/content/deepdives";
import { useDocumentMeta } from "@/scroll/useDocumentMeta";

function FictifTag() {
  return (
    <span className="inline-flex flex-none items-center gap-1.5 rounded-full border border-white/[0.14] px-2 py-1 font-mono text-[9.5px] tracking-[0.16em] text-ink-muted uppercase">
      <span className="h-1.25 w-1.25 rounded-full bg-ink-muted" />
      Fictif
    </span>
  );
}

/** Reserves aspect-ratio up front (zero CLS) and only "activates" once scrolled into view. */
function LazyMediaSlot({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className="flex aspect-video w-full items-center justify-center rounded-[16px] border border-white/10 bg-deep/40 transition-opacity duration-500"
      style={{ opacity: inView ? 1 : 0.4 }}
    >
      <span className="max-w-[34ch] px-4 text-center font-mono text-[11px] tracking-[0.14em] text-ink-muted uppercase">
        {label}
      </span>
    </div>
  );
}

export function DeepDivePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const index = railProjects.findIndex((p) => p.id === slug);
  const project = index >= 0 ? railProjects[index] : undefined;
  const content = slug ? deepDives[slug] : undefined;
  const nextProject = project ? railProjects[(index + 1) % railProjects.length] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus();
  }, [slug]);

  useDocumentMeta(
    project ? `${project.title} — Deep dive · Axel Corral` : "Projet introuvable · Axel Corral",
    project?.thesis,
  );

  const goBack = () => navigate("/");

  if (!project || !content) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-void px-6 text-center text-ink">
        <h1 ref={headingRef} tabIndex={-1} className="m-0 font-display text-2xl font-semibold text-ink">
          Projet introuvable
        </h1>
        <Link to="/" className="font-mono text-xs tracking-[0.08em] text-[#9FB0FF] uppercase">
          ← Retour à l'accueil
        </Link>
      </main>
    );
  }

  const badge = project.statutLabel.toLowerCase().includes("deep dive")
    ? project.statutLabel
    : `Deep dive · ${project.statutLabel}`;

  return (
    <main className="relative min-h-dvh bg-void px-6 py-14 text-ink sm:px-10 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={goBack}
          className="mb-10 inline-flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-ink-muted uppercase"
        >
          <span>←</span> Retour
        </button>

        <header className="mb-14">
          <span className="font-mono text-xs tracking-[0.22em] text-ink-muted uppercase">{badge}</span>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="m-0 mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl"
          >
            {project.title}
          </h1>
          <p className="mt-4 max-w-[62ch] text-md leading-relaxed text-ink-muted">{project.thesis}</p>

          <div className="mt-7 flex flex-wrap items-end gap-8">
            <div>
              <div className="font-mono text-3xl leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
                {project.chiffreCle}
              </div>
              <div className="mt-1.5 flex items-start gap-2">
                <span className="max-w-[28ch] text-[12.5px] text-ink-muted">{project.chiffreCleLabel}</span>
                {project.placeholder && <FictifTag />}
              </div>
            </div>
            {project.chiffreSecondaire && (
              <div>
                <div className="font-mono text-2xl leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
                  {project.chiffreSecondaire}
                </div>
                <div className="mt-1.5 flex items-start gap-2">
                  <span className="max-w-[28ch] text-[12.5px] text-ink-muted">{project.chiffreSecondaireLabel}</span>
                  {project.placeholderSecondaire && <FictifTag />}
                </div>
              </div>
            )}
          </div>

          <div className="mt-7 flex flex-wrap gap-1.75">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 px-2.25 py-1 font-mono text-[11px] text-ink-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-5">
            {content.links.map((link) => {
              const isKnown = Boolean(link.value) && !link.value.includes("À COMPLÉTER");
              const href = isKnown
                ? link.value.startsWith("http")
                  ? link.value
                  : `https://${link.value}`
                : undefined;
              return (
                <span key={link.label} className="font-mono text-xs tracking-[0.06em] text-ink-muted uppercase">
                  {link.label} ·{" "}
                  {isKnown ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#9FB0FF] no-underline hover:underline"
                    >
                      {link.value} ↗
                    </a>
                  ) : (
                    <span className="text-ink-muted">[À COMPLÉTER]</span>
                  )}
                </span>
              );
            })}
          </div>
        </header>

        <section aria-labelledby="problem-heading" className="mb-10">
          <h2
            id="problem-heading"
            className="mb-3 font-mono text-xs tracking-[0.22em] text-ink-muted uppercase"
          >
            Problème
          </h2>
          {content.problem.map((p, i) => (
            <p key={i} className="m-0 mb-3 max-w-[68ch] text-[15px] leading-relaxed text-ink last:mb-0">
              {p}
            </p>
          ))}
        </section>

        <section aria-labelledby="approach-heading" className="mb-10">
          <h2
            id="approach-heading"
            className="mb-3 font-mono text-xs tracking-[0.22em] text-ink-muted uppercase"
          >
            Approche
          </h2>
          {content.approach.map((p, i) => (
            <p key={i} className="m-0 mb-3 max-w-[68ch] text-[15px] leading-relaxed text-ink last:mb-0">
              {p}
            </p>
          ))}
        </section>

        <section aria-labelledby="result-heading" className="mb-12">
          <h2
            id="result-heading"
            className="mb-3 font-mono text-xs tracking-[0.22em] text-ink-muted uppercase"
          >
            Résultat
          </h2>
          {content.result.map((p, i) => (
            <p key={i} className="m-0 mb-3 max-w-[68ch] text-[15px] leading-relaxed text-ink last:mb-0">
              {p}
            </p>
          ))}
        </section>

        {content.media.length > 0 && (
          <section aria-label="Médias" className="mb-12 grid gap-5 sm:grid-cols-2">
            {content.media.map((m, i) => (
              <LazyMediaSlot key={i} label={m} />
            ))}
          </section>
        )}

        <section aria-labelledby="tech-heading" className="mb-16">
          <h2 id="tech-heading" className="mb-3 font-mono text-xs tracking-[0.22em] text-ink-muted uppercase">
            Points techniques
          </h2>
          <ul className="m-0 list-none p-0">
            {content.techPoints.map((t, i) => (
              <li
                key={i}
                className="mb-2.5 max-w-[64ch] border-l-2 border-white/10 pl-4 text-[14px] leading-relaxed text-ink-muted last:mb-0"
              >
                {t}
              </li>
            ))}
          </ul>
        </section>

        <nav className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <button
            type="button"
            onClick={goBack}
            className="font-mono text-xs tracking-[0.08em] text-ink-muted uppercase"
          >
            ← Retour à l'accueil
          </button>
          {nextProject && (
            <Link
              to={`/projet/${nextProject.id}`}
              className="font-mono text-xs tracking-[0.08em] text-[#9FB0FF] uppercase no-underline"
            >
              Projet suivant · {nextProject.title} →
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
