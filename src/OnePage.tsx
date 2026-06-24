import {
  ArrowRight,
  BarChart3,
  Boxes,
  Check,
  Database,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import { motion, useInView, useReducedMotion, useScroll } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { BuildMode } from "@/components/BuildMode";
import { CinematicOpening } from "@/components/CinematicOpening";
import { AnimatedLetter, WordsPullUpMultiStyle } from "@/components/PortfolioMotion";

const capabilities: Array<{
  number: string;
  title: string;
  icon: LucideIcon;
  items: string[];
}> = [
  {
    number: "01",
    title: "Business Intelligence.",
    icon: BarChart3,
    items: [
      "Power BI dashboards and reporting models",
      "SharePoint, Power Query and data preparation",
      "KPI design, filters and visual hierarchy",
      "Business-readable analytics",
    ],
  },
  {
    number: "02",
    title: "Data Engineering.",
    icon: Database,
    items: [
      "Python and SQL data workflows",
      "ETL logic, cleaning and transformation",
      "AWS-oriented pipeline architecture",
      "Versioned datasets and reproducible outputs",
    ],
  },
  {
    number: "03",
    title: "Analytical Projects.",
    icon: LineChart,
    items: [
      "Quantitative analysis and methodology",
      "Open-source portfolio projects",
      "Data storytelling and technical writing",
      "Clear conclusions from complex subjects",
    ],
  },
  {
    number: "04",
    title: "Portfolio Systems.",
    icon: Boxes,
    items: [
      "GitHub projects and versioning",
      "Clear technical documentation",
      "Reviewable project structures",
      "Method-focused project storytelling",
    ],
  },
];

function CapabilityCard({
  capability,
  index,
}: {
  capability: (typeof capabilities)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduceMotion = useReducedMotion();
  const Icon = capability.icon;

  return (
    <motion.article
      ref={ref}
      className="capability-card"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.65, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start justify-between">
        <span className="icon-frame" aria-hidden="true">
          <Icon size={21} strokeWidth={1.6} />
        </span>
        <span className="text-xs text-primary/45">{capability.number}</span>
      </div>

      <div>
        <h3 className="mb-7 text-2xl font-normal leading-none text-primary">
          {capability.title}
        </h3>
        <ul className="space-y-4">
          {capability.items.map((item) => (
            <li className="flex gap-3 text-sm leading-snug text-gray-400" key={item}>
              <Check className="mt-0.5 shrink-0 text-primary" size={15} strokeWidth={1.8} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <a className="card-link group" href="#contact">
        Learn more
        <ArrowRight
          className="transition-transform duration-300 group-hover:translate-x-1"
          size={16}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </a>
    </motion.article>
  );
}

function OnePage() {
  const [buildModeOpen, setBuildModeOpen] = useState(false);
  const openBuildMode = useCallback(() => setBuildModeOpen(true), []);
  const closeBuildMode = useCallback(() => setBuildModeOpen(false), []);
  const aboutText =
    "I am currently building my path toward data analysis and data engineering, with experience across business intelligence, Power BI, SQL, Python, reporting automation and open data projects. My work combines technical execution with a practical understanding of business needs, from production dashboards to portfolio projects designed to demonstrate method, rigor and autonomy.";
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ["start 0.8", "end 0.2"],
  });

  return (
    <div className="portfolio-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <main id="main">
        <CinematicOpening onOpenBuildMode={openBuildMode} />

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="about-card">
            <p className="mb-9 text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">
              Analytical profile
            </p>
            <h2 id="about-title" className="about-title">
              <WordsPullUpMultiStyle
                segments={[
                  { text: "I’m Axel Corral,", className: "font-normal" },
                  {
                    text: "a data profile shaped by field experience.",
                    className: "font-serif italic",
                  },
                  {
                    text: "I work on dashboards, pipelines, reporting systems and quantitative analysis with a strong focus on clarity.",
                    className: "font-normal",
                  },
                ]}
              />
            </h2>

            <p
              ref={paragraphRef}
              className="mx-auto mt-14 max-w-3xl text-sm leading-relaxed text-primary sm:text-base"
            >
              {Array.from(aboutText).map((character, index) => (
                <AnimatedLetter
                  character={character}
                  index={index}
                  key={`${character}-${index}`}
                  scrollYProgress={scrollYProgress}
                  total={aboutText.length}
                />
              ))}
            </p>
          </div>
        </section>

        <section
          className="work-section bg-noise"
          id="selected-work"
          aria-labelledby="work-title"
        >
          <div className="relative z-10 mx-auto max-w-[1600px]">
            <h2 id="work-title" className="work-heading">
              <span className="block text-primary">
                <WordsPullUpMultiStyle
                  align="left"
                  segments={[{ text: "Practical data work, built with precision." }]}
                />
              </span>
              <span className="block text-gray-500">
                <WordsPullUpMultiStyle
                  align="left"
                  segments={[
                    { text: "Dashboards, pipelines, models and analytical storytelling." },
                  ]}
                />
              </span>
            </h2>

            <div className="work-grid">
              {capabilities.map((capability, index) => (
                <CapabilityCard capability={capability} index={index} key={capability.number} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <BuildMode open={buildModeOpen} onClose={closeBuildMode} />
    </div>
  );
}

export default OnePage;
