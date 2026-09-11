# Journal — Boucle d'amélioration continue UI

> Ordre antéchronologique : la dernière entrée est en haut.
> Ce fichier est la **seule mémoire** entre les cycles. Il doit toujours permettre
> à une session neuve de reprendre sans rien relire d'autre que `MISSION-UI.md`.

---

## Cycle 001 — 2026-09-11 (amorçage)

**Zone travaillée** : infrastructure d'audit + inventaire complet + audit de
la zone prioritaire (§3). Aucun code de production modifié (règle §8 :
"ne code rien d'autre pendant ce cycle").
**Rotation de questions** : D (Crédibilité), avec incursions B (Rythme &
espace) et C (Mouvement) sur des bugs trouvés en cours d'audit.

### Constats d'audit
- AnimatedLetter (paragraphe "Analytical profile") n'a aucune variante
  `prefers-reduced-motion` — texte reste partiellement opaque indépendamment
  du réglage — tous viewports — **P0**.
- Titre "Analytical profile" (`WordsPullUpMultiStyle`) : fenêtre d'animation
  (~2,5 s) plus longue que le temps de traversée de la carte à vitesse de
  scroll normale/rapide sur desktop — texte vu tronqué — 1440 — **P0**.
- Aucun élément de clôture après la section contact (pas de `<footer>`, pas de
  retour en haut, pas de mentions) — fin de page abrupte confirmée — tous
  viewports — **P0**.
- Contraste insuffisant sur le bouton de langue inactif (`.language-toggle-btn`),
  violation axe `color-contrast`, reproduite sur mobile-390 EN/FR — **P0**
  (garde-fou contraste, site-wide).
- 4 cartes "capabilities" visuellement identiques, vide non maîtrisé en bas de
  carte, "Learn more" générique vers `#contact` sans lien vers la preuve
  projet correspondante — 1440 et 390 — **P1**.
- Panneau de contact : `align-items: end` sur la grille laisse un grand vide
  non composé au-dessus des liens (desktop/tablette) — **P1**.
- LinkedIn et lien CV absents du bloc de contact réellement servi (seule une
  version non utilisée de `Contact.tsx` a un lien LinkedIn, en `href="#"`
  placeholder) — **P1**, LinkedIn bloqué en attente d'URL réelle (Q1).
- Violations axe mineures hors zone prioritaire : `aria-prohibited-attr` sur
  `.city-heading`, `landmark-unique` sur `.pc-nav` du carrousel projet 01,
  `region` sur `.language-toggle` — **P2**.
- CLS bas sur tous les runs (0.0004–0.0025, ~0.0245 en reduced-motion —
  toujours < seuil "good"), aucun scroll horizontal parasite, aucune erreur
  console/page — **positif, à ne pas régresser**.
- `src/sections/{About,Contact,Stack,Manifeste,FlowProjets}.tsx` ne sont pas
  importés par la page réellement servie (`OnePage.tsx` via `App.tsx`) —
  probable premier jet abandonné, à confirmer avant suppression — **P2**.

### Changements livrés
- Ajout `scripts/ui-audit.mjs` — script Playwright réutilisable : 4 viewports
  × 2 langues, capture top/scroll progressif (pas 400px)/full-page/sections
  ciblées, passe hover + focus-visible (clavier) + reduced-motion dédiée, scan
  axe-core, métriques CLS/FCP, détection overflow horizontal.
- Création `docs/ui-loop/BACKLOG.md`, `docs/ui-loop/QUESTIONS.md`,
  `docs/ui-loop/AUDIT-2026-09-11-cycle-001.md`.
- `.gitignore` : ajout de `docs/ui-loop/screenshots/` (run initial = 277
  fichiers, 173 Mo — régénérable, ne doit pas entrer dans l'historique git).
- Inventaire complet des projets existants (3 : Football Data Pipeline,
  JobTrackr, Retirement Sustainability Model — tous ont déjà une démo
  conforme §5) et des 3 projets à intégrer de A à Z (Vers l'Élysée, Ombrair,
  Analyse vidéo football — aucun n'a de trace dans le repo à ce stade).

### Vérification
- Build : ✅ (`npm run build` vert avant le premier run d'audit)
- Viewports vérifiés : 390 / 768 / 1440 / 1920
- Langues : FR ✅ EN ✅
- reduced-motion : ✅ vérifié (et c'est ce qui a révélé le bug P0-1)
- Régression détectée : non (aucun code de production modifié ce cycle)

### Reverté
- Aucun (rien à reverter — cycle d'amorçage, audit uniquement)

### État des chantiers structurels
- Vers l'Élysée : non commencé
- Ombrair : non commencé
- Analyse vidéo football : non commencé
- Démos projets existants : 2/3 pleinement conformes (Football Data Pipeline,
  Retirement Sustainability Model) ; JobTrackr a un lien démo live mais pas
  d'iframe embarquée (format 1 non tenté, voir BACKLOG)

### Prochain cycle — point de reprise exact
- Lire `docs/ui-loop/BACKLOG.md` section "P0 — Zone prioritaire". Corriger
  `AnimatedLetter` (`src/components/PortfolioMotion.tsx`) pour respecter
  `useReducedMotion()` (texte à opacité 1 immédiate si reduced-motion), puis
  dans la foulée retravailler la fenêtre de révélation de
  `WordsPullUpMultiStyle` sur le titre "Analytical profile" pour qu'elle
  termine avant que la carte ne sorte du viewport à vitesse de scroll normale.
  Revérifier avec `node scripts/ui-audit.mjs` (captures reduced-motion +
  scroll progressif) avant de passer au chantier P0-3 (footer/fin de page).

### Questions bloquantes ouvertes
- Q1 — URL LinkedIn réelle d'Axel (bloque une partie du chantier "parcours de
  conversion", le lien `/cv` peut avancer sans attendre).
- Q2 — Lien repo GitHub pour Vers l'Élysée ?
- Q3 — Lien repo GitHub pour Ombrair ?
- Q4 — Assets visuels (minimap/heatmap) pour l'introduction Analyse vidéo
  football, projet non public.
- Voir `docs/ui-loop/QUESTIONS.md` pour le détail et l'impact de chacune.

---

## Cycle 000 — amorçage (à remplir par l'agent)

**Zone travaillée** : —
**Rotation de questions** : —

### Constats d'audit
- (aucun — cycle non encore exécuté)

### Changements livrés
- (aucun)

### Vérification
- Build : —
- Viewports vérifiés : —
- Langues : —
- reduced-motion : —
- Régression détectée : —

### État des chantiers structurels
- Vers l'Élysée : non commencé
- Ombrair : non commencé
- Analyse vidéo football : non commencé
- Démos projets existants : 0/? (inventaire à faire au cycle 1)

### Prochain cycle — point de reprise exact
- Exécuter la procédure d'amorçage `MISSION-UI.md` §8 : créer `BACKLOG.md` et
  `QUESTIONS.md`, créer la branche `auto/ui-loop`, écrire `scripts/ui-audit.mjs`,
  faire tourner un premier audit complet de la zone prioritaire (§3), inventorier
  tous les projets et leur format de démo actuel. Ne rien coder d'autre.

### Questions bloquantes ouvertes
- aucune
