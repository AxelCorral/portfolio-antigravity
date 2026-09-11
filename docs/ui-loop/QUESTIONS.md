# Questions bloquantes — arbitrage humain requis

> Alimenté quand une décision ne peut pas être prise sans deviner une donnée
> factuelle ou trancher un choix éditorial hors périmètre de la mission. Une
> question reste ouverte tant qu'elle n'a pas été répondue par Axel ; ne jamais
> la retirer silencieusement, marquer `RÉSOLU` avec la réponse une fois
> tranchée.

---

## Ouvertes

### Q1 — URL LinkedIn réelle d'Axel
**Contexte** : MISSION-UI.md §3 exige que le parcours de conversion en bas de
page (contact, CV, LinkedIn, GitHub) soit évident sans scroll supplémentaire.
Le bloc de contact actuel (`OnePage.tsx`, `contactLinks`) n'a qu'Email et
GitHub. Une ancienne version non utilisée du site (`src/sections/Contact.tsx`)
contient une entrée "LinkedIn" mais avec un `href="#"` placeholder — aucune
URL réelle n'existe nulle part dans le repo, et je n'invente jamais d'URL
(règle absolue).
**Décision nécessaire** : fournir l'URL LinkedIn réelle d'Axel à publier.
**Impact si non résolu** : le chantier "Parcours de conversion" (BACKLOG P1)
reste bloqué sur la partie LinkedIn ; le lien CV peut avancer sans attendre.

### Q2 — Repo GitHub public pour "Vers l'Élysée" ?
**Contexte** : MISSION-UI.md §4.1 mentionne un déploiement
(`political-destiny.vercel.app`) et un backend Supabase, mais ne mentionne
aucun repo GitHub, contrairement aux autres projets. La carte projet doit-elle
inclure un lien "View repository", ou seulement un lien vers la démo live ?
**Décision nécessaire** : confirmer si le code est public/à lier, ou si la
carte doit se limiter à démo + contexte éditorial (comme le projet vidéo
football, qui n'a explicitement pas de repo).
**Impact si non résolu** : la carte "Vers l'Élysée" sera construite sans lien
repo par défaut (posture prudente, aucune preuve mentionnée dans la mission).

### Q3 — Repo GitHub public pour Ombrair ?
**Contexte** : même question que Q2 pour Ombrair
(`ombrair.vercel.app`, "construit quasiment de A à Z avec Claude Code").
MISSION-UI.md ne fournit pas d'URL de repo.
**Décision nécessaire** : lien repo à ajouter ou non.
**Impact si non résolu** : carte construite avec démo live uniquement.

### Q4 — Assets visuels pour l'introduction "Analyse vidéo football"
**Contexte** : MISSION-UI.md §4.3 interdit les captures de diffusion TV et les
logos de clubs/compétitions ; il faut utiliser des rendus du pipeline
(minimap, heatmaps, tracés) ou des visualisations abstraites reconstruites.
Aucun asset de ce type n'existe actuellement dans `public/` ou `src/assets/`.
**Décision nécessaire** : Axel peut-il fournir des exports du pipeline
(minimap/heatmap/tracking overlay) pour ce projet non public ? À défaut, je
produirai une visualisation abstraite reconstruite (schéma) plutôt que
d'inventer une capture qui laisserait croire à un rendu réel du pipeline.
**Impact si non résolu** : la section d'introduction sera construite en
priorité sur le texte (démarche, ambition, contrainte CPU-only) avec une démo
en format 4 (reproduction/scéma statique) le temps que des exports réels
soient fournis.

---

## Résolues

_(aucune pour l'instant)_
