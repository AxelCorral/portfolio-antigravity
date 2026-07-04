import type { Slide } from "./football-pipeline";

const GITHUB_URL = "https://github.com/AxelCorral/retraites-cor2026";

export const retirementAnalysisSlidesEn: readonly Slide[] = [
  {
    kind: "cover",
    label: "Project 03 · Open Data Analysis",
    thesis:
      "There is no single collapse date for a pension system — only a choice of which lever absorbs the shock.",
    thesisAccent: "which lever absorbs the shock.",
    sub: "An open, reproducible accounting model of the French pay-as-you-go pension system, built on Insee 2026 projections and benchmarked against the COR 2026 report.",
    file: "retraites-cor2026/",
  },
  {
    kind: "step",
    visual: "levers",
    label: "Step 01 — The question",
    headline: "\"Is the system going to collapse?\" is the wrong question.",
    body: "Financial balance rests on three adjustment margins: the contribution rate, the relative pension level, and the effective retirement age. Any reform is a combination of the three.",
  },
  {
    kind: "step",
    visual: "sources",
    label: "Step 02 — Data",
    headline: "Five demographic scenarios, three institutional sources.",
    body: "Population projections come from Insee's June 2026 release (IP2108). Economic benchmarks and pension levels are taken from the COR 2026 report and DREES 2025 — documented inputs, never adjusted to fit the output.",
  },
  {
    kind: "step",
    visual: "equation",
    label: "Step 03 — Method",
    headline: "An aggregate accounting model, not a microsimulation.",
    body: "The equilibrium contribution rate is the product of two ratios: economic dependency and relative pension level. Every parameter lives in one sourced config file — nothing is hard-coded.",
  },
  {
    kind: "step",
    visual: "scenarios",
    label: "Step 04 — Assumptions",
    headline: "Every parameter sourced and dated — including the one that isn't from 2026.",
    body: "Five Insee scenarios and a 0.7%/year productivity reference come from the COR's June 2026 report. The projected 2070 activity-rate target is carried over from the COR's June 2025 report — a documented, mixed-vintage limit.",
  },
  {
    kind: "step",
    visual: "scissors",
    label: "Step 05 — Results",
    headline: "±2.4% off the COR's own numbers — with zero calibration.",
    body: "Under current law, the equilibrium contribution rate barely moves (30.5% → 30.8%) because pensions absorb the shock instead, sliding from 55% to ~40% of average wage. Keeping parity would cost +11 points instead.",
  },
  {
    kind: "step",
    visual: "limits",
    label: "Step 06 — Limits",
    headline: "The honest gap: −10.7% on relative pensions, by design.",
    body: "The \"constant legislation\" scenario indexes pensions on prices only — a stylized floor. It lands 10.7% below the COR's own reference by 2070, because it excludes the Agirc-Arrco revaluation the COR applies from 2038.",
  },
  {
    kind: "step",
    visual: "deliverables",
    label: "Step 07 — Deliverables",
    headline: "Open enough to be rerun, not just read.",
    body: "A ~20-page report, a 21-test calibration suite, and a 7-slide LinkedIn summary — all built from one sourced config file. Code under MIT, report and figures under CC BY 4.0.",
    links: [{ label: "GitHub", url: GITHUB_URL }],
  },
];

export const retirementAnalysisSlidesFr: readonly Slide[] = [
  {
    kind: "cover",
    label: "Projet 03 · Analyse open data",
    thesis:
      "Il n'existe pas de date d'effondrement des retraites — seulement un choix de qui absorbe le choc démographique.",
    thesisAccent: "qui absorbe le choc démographique.",
    sub: "Une maquette comptable agrégée, ouverte et reproductible, du système de retraite par répartition français, construite sur les projections Insee 2026 et confrontée au rapport du COR 2026.",
    file: "retraites-cor2026/",
  },
  {
    kind: "step",
    visual: "levers",
    label: "Étape 01 — La question",
    headline: "« Le système va-t-il s'effondrer ? » C'est la mauvaise question.",
    body: "L'équilibre financier repose sur trois marges d'ajustement : le taux de cotisation, le niveau relatif des pensions, et l'âge effectif de départ. Toute réforme en est une combinaison.",
  },
  {
    kind: "step",
    visual: "sources",
    label: "Étape 02 — Données",
    headline: "Cinq scénarios démographiques, trois sources institutionnelles.",
    body: "Les projections de population viennent de la publication Insee de juin 2026 (IP2108). Les repères économiques et niveaux de pension sont repris du rapport COR 2026 et de la DREES 2025 — des entrées documentées, jamais ajustées sur les résultats.",
  },
  {
    kind: "step",
    visual: "equation",
    label: "Étape 03 — Méthode",
    headline: "Une maquette comptable agrégée, pas une microsimulation.",
    body: "Le taux de cotisation d'équilibre est le produit de deux ratios : la dépendance économique et le niveau relatif des pensions. Chaque paramètre vit dans un fichier de config unique et sourcé — rien n'est codé en dur.",
  },
  {
    kind: "step",
    visual: "scenarios",
    label: "Étape 04 — Hypothèses",
    headline: "Chaque paramètre sourcé et daté — y compris celui qui ne vient pas de 2026.",
    body: "Cinq scénarios Insee et une productivité de référence de 0,7 %/an viennent du rapport COR de juin 2026. La cible de taux d'activité 2070 est reprise du COR de juin 2025 — une limite documentée, à millésime mixte.",
  },
  {
    kind: "step",
    visual: "scissors",
    label: "Étape 05 — Résultats",
    headline: "Écart de ±2,4 % avec les chiffres du COR — sans aucun calage.",
    body: "À législation inchangée, la cotisation d'équilibre bouge à peine (30,5 % → 30,8 %) car les pensions absorbent le choc, glissant de 55 % à ~40 % du salaire moyen. Maintenir la parité coûterait +11 points.",
  },
  {
    kind: "step",
    visual: "limits",
    label: "Étape 06 — Limites",
    headline: "L'écart assumé : −10,7 % sur la pension relative, par construction.",
    body: "Le scénario « législation constante » indexe les pensions sur les seuls prix — une borne basse stylisée. Il se situe 10,7 % sous la référence du COR en 2070, car il exclut la revalorisation Agirc-Arrco intégrée par le COR dès 2038.",
  },
  {
    kind: "step",
    visual: "deliverables",
    label: "Étape 07 — Livrables",
    headline: "Assez ouvert pour être rejoué, pas seulement lu.",
    body: "Un rapport de ~20 pages, une suite de 21 tests de calage, et une synthèse LinkedIn en 7 slides — tout est construit depuis un fichier de config unique et sourcé. Code sous MIT, rapport et figures sous CC BY 4.0.",
    links: [{ label: "GitHub", url: GITHUB_URL }],
  },
];
