import type { Slide } from "./football-pipeline";
import chartCiseaux from "@/assets/retraites/chart-ciseaux.png";
import chartFrontiere from "@/assets/retraites/chart-frontiere.png";
import chartValidation from "@/assets/retraites/chart-validation.png";
import chartNatalite from "@/assets/retraites/chart-natalite.png";

const GITHUB_URL = "https://github.com/AxelCorral/retraites-cor2026";

export const retirementAnalysisSlidesEn: readonly Slide[] = [
  {
    kind: "cover",
    label: "Project 03 · Open Data Analysis",
    thesis:
      "I rebuilt the COR's 2026 pension diagnosis — in the open.",
    thesisAccent: "in the open.",
    sub: "The Conseil d'orientation des retraites published its report on June 11. Within days, I had rebuilt it: transparent, reproducible, auditable.",
    file: "retraites-cor2026/",
  },
  {
    kind: "step",
    label: "The question",
    headline: "\"Is the system going to collapse?\"",
    body: "That's the wrong question. There is no collapse date. Everything depends on who pays for the adjustment: workers, retirees, or the retirement age.",
    list: [
      { number: "01", title: "Contributions", sub: "What workers pay" },
      { number: "02", title: "Pension level", sub: "What retirees receive" },
      { number: "03", title: "Retirement age", sub: "Time spent working" },
    ],
  },
  {
    kind: "step",
    label: "Under current law",
    headline: "Under current law, pensions slip.",
    body: "Contributions stay stable, but the average pension falls from 55% to about 40% of the average wage by 2070. Demographic pressure is absorbed by retirees.",
    stat: {
      value: "55% → ~40%",
      caption: "Average pension / average wage, 2026 → 2070",
    },
    chartImage: {
      src: chartCiseaux,
      alt: "Chart: equilibrium contribution rate rising and relative pension falling, 2026-2070",
    },
  },
  {
    kind: "step",
    label: "The price of parity",
    headline: "Keep pensions level? +11 points of contributions.",
    body: "To keep pensions at the level of wages, contributions would need to rise by about 11 points. Delaying retirement by two years erases close to half of that increase.",
    stat: {
      value: "+11",
      caption: "Contribution points needed to keep pension parity",
    },
    chartImage: {
      src: chartFrontiere,
      alt: "Chart: 2070 equilibrium frontier by retirement age lever",
    },
  },
  {
    kind: "step",
    label: "The validation",
    headline: "My open model reproduces the official numbers.",
    body: "Gap with the COR over 44 years: ±2.4% (−0.6% by 2070). With no tuning on its outputs — the assumptions are inputs, everything else is computed.",
    stat: {
      value: "±2.4%",
      caption: "Average gap with the COR over 44 years · −0.6% by 2070",
    },
    chartImage: {
      src: chartValidation,
      alt: "Chart: open model vs COR 2026, economic dependency ratio",
    },
  },
  {
    kind: "step",
    label: "Fertility",
    headline: "Fertility doesn't matter until 2048.",
    body: "A child born in 2028 doesn't start contributing until 2050. The shock of the next two decades is already written into the age pyramid — it doesn't depend on fertility.",
    stat: {
      value: "2048",
      caption: "First noticeable effect of fertility on the system",
    },
    chartImage: {
      src: chartNatalite,
      alt: "Chart: sensitivity of the equilibrium contribution rate to demographic scenarios",
    },
  },
  {
    kind: "step",
    label: "Why it matters",
    headline: "Why it matters.",
    body: "This project isn't an opinion on pensions — that's a matter of collective choice. It's a demonstration: a public-finance diagnosis can be rebuilt, rerun and audited by anyone.",
    links: [
      {
        label: "Code + full report",
        sub: "github.com/AxelCorral/retraites-cor2026",
        url: GITHUB_URL,
      },
    ],
  },
];

export const retirementAnalysisSlidesFr: readonly Slide[] = [
  {
    kind: "cover",
    label: "Projet 03 · Analyse open data",
    thesis:
      "J'ai reconstruit le diagnostic retraites 2026 du COR — en open source.",
    thesisAccent: "en open source.",
    sub: "Le Conseil d'orientation des retraites a publié son rapport le 11 juin. En quelques jours, je l'avais refait : transparent, reproductible, auditable.",
    file: "retraites-cor2026/",
  },
  {
    kind: "step",
    label: "La question",
    headline: "« Le système va-t-il s'effondrer ? »",
    body: "C'est mal posé. Il n'existe pas de date d'effondrement. Tout dépend de qui paie l'ajustement : les actifs, les retraités, ou l'âge de départ.",
    list: [
      { number: "01", title: "Cotisations", sub: "Ce que paient les actifs" },
      { number: "02", title: "Niveau des pensions", sub: "Ce que touchent les retraités" },
      { number: "03", title: "Âge de départ", sub: "La durée passée au travail" },
    ],
  },
  {
    kind: "step",
    label: "À loi inchangée",
    headline: "À loi inchangée, les pensions décrochent.",
    body: "Les cotisations restent stables, mais la pension moyenne passe de 55 % à environ 40 % du salaire moyen d'ici 2070. La pression démographique est absorbée par les retraités.",
    stat: {
      value: "55 % → ~40 %",
      caption: "Pension moyenne / salaire moyen, 2026 → 2070",
    },
    chartImage: {
      src: chartCiseaux,
      alt: "Graphique : cotisation d'équilibre en hausse, pension relative en baisse, 2026-2070",
    },
  },
  {
    kind: "step",
    label: "Le prix de la parité",
    headline: "Maintenir les pensions ? +11 points de cotisations.",
    body: "Pour garder les pensions au niveau des salaires, les cotisations devraient grimper d'environ 11 points. Reculer l'âge de départ de deux ans efface près de la moitié de cette hausse.",
    stat: {
      value: "+11",
      caption: "Points de cotisation pour maintenir la parité des pensions",
    },
    chartImage: {
      src: chartFrontiere,
      alt: "Graphique : frontière d'équilibre à l'horizon 2070 selon le levier âge de départ",
    },
  },
  {
    kind: "step",
    label: "La validation",
    headline: "Mon modèle ouvert reproduit les chiffres officiels.",
    body: "Écart avec le COR sur 44 ans : ±2,4 % (−0,6 % en 2070). Sans aucun réglage sur ses résultats — les hypothèses sont des entrées, tout le reste est calculé.",
    stat: {
      value: "±2,4 %",
      caption: "Écart moyen avec le COR sur 44 ans · −0,6 % en 2070",
    },
    chartImage: {
      src: chartValidation,
      alt: "Graphique : maquette ouverte vs COR 2026, ratio de dépendance économique",
    },
  },
  {
    kind: "step",
    label: "La natalité",
    headline: "La natalité ne joue pas avant 2048.",
    body: "Un enfant né en 2028 ne cotise pas avant 2050. Le choc des deux prochaines décennies est déjà inscrit dans la pyramide des âges — il ne dépend pas de la fécondité.",
    stat: {
      value: "2048",
      caption: "Premier effet sensible de la fécondité sur le système",
    },
    chartImage: {
      src: chartNatalite,
      alt: "Graphique : sensibilité du taux de cotisation d'équilibre aux scénarios démographiques",
    },
  },
  {
    kind: "step",
    label: "Pourquoi ça compte",
    headline: "Pourquoi ça compte.",
    body: "Ce projet n'est pas une opinion sur les retraites — c'est un sujet de choix collectif. C'est une démonstration : un diagnostic de finances publiques peut être reconstruit, rejoué et audité par n'importe qui.",
    links: [
      {
        label: "Code + mémoire complet",
        sub: "github.com/AxelCorral/retraites-cor2026",
        url: GITHUB_URL,
      },
    ],
  },
];
