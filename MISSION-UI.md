# MISSION — Boucle d'amélioration continue UI · Portfolio Axel Corral

> Ce fichier est ta **constitution de mission**. Tu le relis intégralement au début de
> chaque cycle. Il prime sur toute autre instruction sauf `CLAUDE.md` du projet.

---

## 0. RÈGLE D'ARRÊT (lis ceci en premier)

Tu ne t'arrêtes **jamais** de ton propre chef.

- Tu ne t'arrêtes que si le fichier `STOP` existe à la racine du repo.
- « Le site me semble bien » n'est **pas** une raison d'arrêter. Il y a toujours un
  niveau de finition au-dessus. Si tu ne trouves plus rien d'évident, tu descends
  d'un cran dans le détail (rythme typographique, courbes d'easing, états focus,
  micro-copie, cohérence des espacements sur 4 breakpoints, contraste réel mesuré…).
- Ne demande jamais la permission de continuer. Ne termine jamais un cycle par une
  question ouverte à l'utilisateur. Tu décides, tu implémentes, tu documentes.
- Si tu es bloqué sur une décision qui exige un arbitrage humain (ex. : une donnée
  factuelle que tu ne peux pas vérifier), tu **ne devines pas** : tu consignes la
  question dans `docs/ui-loop/QUESTIONS.md`, tu marques la tâche `BLOQUÉ`, et tu
  passes à la suivante.

---

## 1. CONTEXTE PROJET

- **Repo** : `D:\Project_claude_code\portfolio`
- **Stack** : Vite + React + TypeScript + Tailwind + GSAP/ScrollTrigger
- **Identité visuelle** : palette sombre chaude « Ambré » — Fraunces (titres),
  JetBrains Mono (technique), Inter (corps). **Tu ne changes pas cette identité.**
  Tu la rends plus rigoureuse, plus cohérente, mieux exécutée.
- **Langue du site** : bilingue EN/FR. Toute section que tu crées ou modifies doit
  exister dans les deux langues, sans texte orphelin.
- **Public cible** : recruteurs et leads techniques data / analytics engineering.
  Le site doit se lire en 90 secondes en diagonale **et** tenir la lecture
  approfondie d'un tech lead qui scrolle jusqu'en bas.

### Contrainte non négociable : rigueur factuelle

Aucune métrique inventée. Aucun chiffre de performance non vérifiable. Aucune
mention d'entreprise, de résultat ou de technologie qui ne soit pas attestée dans
le repo ou dans les notes projet. Si tu as besoin d'un chiffre pour « faire joli »,
tu reformules sans chiffre. C'est une règle absolue, elle prime sur l'esthétique.

---

## 2. LA BOUCLE

Un **cycle** = les 7 phases ci-dessous, exécutées dans l'ordre, sans sauter d'étape.
À la fin du cycle 7, tu recommences au cycle 1. Indéfiniment.

```
┌─→ 1. ORIENT ──→ 2. AUDIT ──→ 3. INTERROGER ──→ 4. PRIORISER ─┐
│                                                               │
└── 7. JOURNALISER ←── 6. VÉRIFIER ←── 5. IMPLÉMENTER ←─────────┘
```

### Phase 1 — ORIENT (≈5 % du cycle)

1. Lis `docs/ui-loop/PROGRESS.md` (le journal). C'est ta seule mémoire entre les runs.
2. Lis `docs/ui-loop/BACKLOG.md` et `docs/ui-loop/QUESTIONS.md`.
3. `git status` + `git log --oneline -15` pour savoir où tu en es réellement.
4. Lance le build (`npm run build`) et le dev server. Si le build est cassé,
   **ta seule tâche du cycle est de le réparer**. Rien d'autre.

### Phase 2 — AUDIT (≈20 % du cycle)

Tu passes en **mode utilisateur**. Tu ne juges pas le code : tu juges ce que voit
un humain. Tu utilises Playwright (déjà présent dans le projet — sinon
`npm i -D playwright` puis `npx playwright install chromium`).

Script d'audit à maintenir dans `scripts/ui-audit.mjs`. Il doit, à chaque run :

- Démarrer sur le site local (`npm run dev` ou `npm run preview`).
- Capturer des screenshots **pleine page ET par section** sur 4 viewports :
  - `390 × 844` (iPhone 14)
  - `768 × 1024` (tablette portrait)
  - `1440 × 900` (laptop — viewport de référence)
  - `1920 × 1080` (desktop large)
- Faire un **scroll progressif** (pas de 400 px) avec capture, pour voir les
  animations GSAP se déclencher comme un vrai visiteur, pas d'un coup.
- Capturer les états : `:hover` sur les éléments interactifs, `:focus-visible` en
  navigation clavier pure (Tab uniquement), `prefers-reduced-motion: reduce`,
  langue FR **et** EN.
- Mesurer : CLS, temps jusqu'au premier rendu, poids des images, nombre de
  reflows sur scroll.
- Lancer un scan d'accessibilité (`@axe-core/playwright`) et logger les violations.

Puis **tu regardes les screenshots** avec l'outil de lecture d'image. Tu ne te
contentes pas de lire le DOM. La question est : *qu'est-ce qui est moche, cassé,
confus ou négligé à l'œil ?*

Tu écris tes constats dans `docs/ui-loop/AUDIT-<date>-<cycle>.md`, avec pour chaque
problème : capture concernée, viewport, gravité (P0/P1/P2), et hypothèse de cause.

### Phase 3 — INTERROGER (≈10 % du cycle)

Avant de toucher au code, tu te poses **explicitement par écrit** ces questions, et
tu y réponds dans l'audit. Change l'angle à chaque cycle (rotation) :

**Rotation A — Hiérarchie**
- Où va l'œil en premier sur cette section ? Est-ce là qu'il devrait aller ?
- Combien de niveaux typographiques sont visibles à l'écran ? Plus de 4 = bruit.
- Qu'est-ce que je peux **supprimer** sans perdre d'information ?

**Rotation B — Rythme & espace**
- Les espacements suivent-ils une échelle (4/8 px) ou sont-ils arbitraires ?
- Les blancs sont-ils voulus ou subis ? Y a-t-il des respirations inégales entre
  sections voisines ?
- La longueur de ligne dépasse-t-elle 75 caractères sur desktop ?

**Rotation C — Mouvement**
- Chaque animation GSAP justifie-t-elle son coût ? Qu'apporte-t-elle à la
  compréhension ? Si la réponse est « rien », supprime-la.
- Le site est-il utilisable et élégant avec `reduced-motion` ? (Beaucoup de
  portfolios GSAP s'effondrent ici.)
- Y a-t-il du contenu qui reste invisible si une animation ne se déclenche pas ?
  C'est un bug critique, pas un détail.

**Rotation D — Crédibilité**
- Un tech lead qui scrolle 15 secondes comprend-il ce qu'Axel sait faire ?
- Les affirmations sont-elles étayées (lien repo, capture, démo) ou déclaratives ?
- Y a-t-il un écart de finition entre les sections « vitrine » et les sections
  du bas ? (Spoiler : oui, c'est le sujet principal de cette mission.)

**Rotation E — Mobile-first réel**
- Sur 390 px, les sections du bas sont-elles pensées ou juste empilées ?
- Les zones tactiles font-elles ≥ 44 px ?
- Y a-t-il du scroll horizontal parasite ? (Vérifie `document.body.scrollWidth`.)

### Phase 4 — PRIORISER (≈5 % du cycle)

Tu choisis **1 à 3 chantiers maximum** pour ce cycle. Pas plus. Un cycle qui
livre une section parfaite vaut mieux qu'un cycle qui touche à dix choses.

Ordre de priorité imposé :

1. **P0 — Régression / build cassé / contenu invisible / contraste non conforme.**
2. **P0 — La zone prioritaire (§3).**
3. **P1 — Intégration des nouveaux projets (§4).**
4. **P1 — Sections démo des projets existants (§5).**
5. **P2 — Reste du site (hero, slides projets, nav, footer).**

### Phase 5 — IMPLÉMENTER (≈35 % du cycle)

- Branche dédiée : `auto/ui-loop`. Tu ne commites jamais sur `main` directement.
- **Commits atomiques** : un commit = un changement compréhensible.
  Format : `ui(<section>): <ce qui change et pourquoi>`
- Tu réutilises les tokens/variables existants. Si tu introduis une valeur nouvelle,
  tu l'ajoutes au système de design, tu ne la codes pas en dur dans un composant.
- Tu t'appuies sur les skills UI installés (`emilkowalski/skill`, `pbakaus/impeccable`,
  `leonxlnx/taste-skill`, `h3nryprod01/design-taste`) — invoque-les explicitement
  quand tu travailles l'animation, la finition ou la direction artistique.
- Références d'inspiration : Aceternity UI (composants animés), Refero (patterns de
  page), Mobbin (flows), Godly (direction artistique). Tu t'en **inspires** :
  structure, hiérarchie, patterns d'interaction. Tu ne copies jamais de code ni
  d'asset propriétaire.

**PUSH** : par défaut tu commites en local uniquement. Tu ne pushes que si le fichier
`ALLOW_PUSH` existe à la racine du repo (déploiement Vercel automatique).

### Phase 6 — VÉRIFIER (≈15 % du cycle)

Tu ne considères jamais un changement comme fait tant que tu ne l'as pas **vu**.

1. `npm run build` doit passer. `tsc --noEmit` doit passer.
2. Tu relances `scripts/ui-audit.mjs` sur les sections touchées.
3. Tu compares **avant / après** en regardant les deux screenshots côte à côte.
4. Tu vérifies les 4 viewports, les 2 langues, `reduced-motion`, et la nav clavier.
5. Tu vérifies qu'aucune autre section n'a régressé (le CSS global mord souvent).
6. Si c'est moins bien qu'avant : `git revert`, et tu notes pourquoi dans le journal.
   **Reverter est un succès, pas un échec.**

### Phase 7 — JOURNALISER (≈10 % du cycle)

Tu mets à jour `docs/ui-loop/PROGRESS.md` (format en §7). C'est ce qui permet au
cycle suivant — potentiellement dans une session neuve, après un reset de crédits —
de reprendre exactement là où tu t'es arrêté. Un cycle non journalisé est un cycle
perdu.

Puis tu régénères **`docs/ui-loop/GALERIE.md`** (format en §7bis). Le journal dit ce
que tu as fait ; la galerie le **montre**. Un chantier livré sans sa paire AVANT/APRÈS
est un chantier invérifiable : c'est le seul endroit où un humain peut constater en
trois secondes que le cycle a amélioré quelque chose plutôt que de te croire sur parole.

```bash
node scripts/ui-gallery.mjs \
  --cycle=NNN \
  --before=<ref-git-juste-avant-le-cycle> \
  --sections=<ids-de-sections-touchées> \
  --label="<intitulé du chantier>" \
  --why="<ce qui a changé et pourquoi, une ligne>"
```

Le script fait tout : il monte un worktree git sur la révision AVANT, capture les
deux états aux viewports **390** et **1440**, compresse en `.webp` et réécrit la
galerie. Tu ne fabriques jamais ces images à la main, et tu ne réutilises jamais une
capture d'un autre cycle en la faisant passer pour l'état AVANT.

---

## 3. ZONE BASSE — MAINTENANCE (P2 depuis le 2026-09-12)

Tout ce qui se trouve **sous les slides de projets**, à partir de la section qui
commence par :

> **Analytical profile**
> *I'm Axel Corral, a data profile shaped by field experience. I work on dashboards,
> pipelines, reporting systems and quantitative analysis with a strong focus on
> clarity.*

… jusqu'au bas de page inclus (footer, contact, CTA, compétences, parcours, etc.).

**Diagnostic de départ à vérifier** : cette partie basse est presque toujours le
parent pauvre d'un portfolio. Le hero et les slides projets ont été travaillés,
le bas a été « fini vite ». Ton premier audit doit répondre à :

- Y a-t-il une rupture visible de qualité entre le haut et le bas ? Où exactement ?
- Le bas de page utilise-t-il le même système d'espacement, de typo, d'animation ?
- « Analytical profile » : le texte est-il lisible, bien mesuré, bien rythmé ?
  Le bloc a-t-il une raison d'exister visuellement, ou est-ce un paragraphe posé ?
- Les sections du bas ont-elles chacune une **identité propre** ou se ressemblent-elles
  toutes ? (Un mur de blocs identiques = abandon de lecture.)
- Le footer est-il un vrai point final ou une fin abrupte ?
- Le parcours de conversion (contact, CV, LinkedIn, GitHub) est-il évident **sans
  scroll supplémentaire** une fois arrivé en bas ?

> ⚠️ **Changement de priorité du 2026-09-12.** Cette zone a été la priorité absolue
> des cycles 001 à 023 et a reçu 26 commits. Le diagnostic ci-dessus est traité :
> la mesure de lecture, le contraste, la hiérarchie typographique, les cibles
> tactiles et le footer de clôture sont au niveau. **Elle passe en P2.**
>
> Tu n'y ouvres plus de chantier de ta propre initiative. Tu n'y interviens que
> pour : une **régression**, un **bug bloquant**, une **violation d'accessibilité
> mesurée**, ou un raccord rendu nécessaire par un chantier §4. Toute intervention
> en P2 doit être justifiée par un constat mesuré, pas par une préférence.

Le reste du site (hero, slides projets, navigation) est audité aussi, à chaque cycle,
mais n'est corrigé qu'en P2 — sauf régression ou bug bloquant.

---

## 4. PRIORITÉ ABSOLUE — INTÉGRATION DES NOUVEAUX PROJETS (P0 depuis le 2026-09-12)

> **C'est désormais ta priorité unique.** Ces trois chantiers sont restés à
> « non commencé » pendant 22 cycles pendant que la zone basse recevait 26 commits.
> Ils étaient bloqués sur des arbitrages ; **ils ne le sont plus** (voir
> `docs/ui-loop/QUESTIONS.md`, Q2/Q3/Q4 tranchées le 2026-09-12).
>
> **Ordre imposé, sans réordonnancement :**
> 1. **Vers l'Élysée** 2. **Ombrair** 3. **Analyse vidéo football**
>
> **Un cycle = un chantier avancé.** Tu ne passes au projet suivant que lorsque le
> précédent a ses trois livrables : **carte**, **page**, **démo**. Tu ne fais pas
> avancer les trois de front. Si un cycle ne peut pas terminer un livrable, il en
> livre une tranche cohérente et consigne dans le journal l'état exact des trois
> livrables du projet en cours.
>
> **Arbitrages déjà tranchés, à ne pas rouvrir :**
> - *Vers l'Élysée* et *Ombrair* : **démo live uniquement, aucun lien repo.**
> - *Analyse vidéo football* : **schémas abstraits reconstruits**, aucune capture
>   inventée, et un **emplacement propre et documenté** où Axel branchera les
>   vrais exports du pipeline sans avoir à retoucher la mise en page.


Trois projets à intégrer entièrement : structure, contenu, visuels, animations,
démo, versions FR/EN. Tu les intègres **dans le système existant** (même grille de
slides projets, mêmes conventions de composants), pas comme des greffons.

Pour chacun, tu produis : un slide/carte projet cohérent avec les existants, une
page ou vue détaillée, et une **section démo** (§5).

### 4.1 — Vers l'Élysée (« political destiny »)

Faits vérifiés, à utiliser tels quels :

- Simulateur narratif et probabiliste de campagne présidentielle française, jouable
  directement dans le navigateur.
- 31 décisions, 9 partis réels, candidats fictifs.
- Déployé sur `political-destiny.vercel.app`.
- Backend Supabase.
- Série LinkedIn associée « Vers l'Élysée — Data Notebook » : 3 épisodes
  (audit du modèle, contrefactuels, décomposition de variance).
- Code implémenté avec Claude Code ; conception, hypothèses, métriques et
  interprétation pilotées par Axel.

Angle éditorial : c'est un projet de **modélisation** rendu jouable, pas un jeu.
Mets en avant la démarche (hypothèses → modèle → audit → contrefactuels), pas le
gameplay. Le nom affiché doit être « Vers l'Élysée » ; « political destiny » est
l'URL, pas le titre.

⚠️ Sujet politique : ton strictement neutre et analytique. Aucun parti pris,
aucune formulation qui suggère une préférence. C'est un objet méthodologique.

### 4.2 — Ombrair

Faits vérifiés :

- Projet universitaire de création d'entreprise fictive, réalisé en quelques jours.
- Site e-commerce complet et fonctionnel, avec **affichage 3D des produits**.
- Construit quasiment de A à Z avec Claude Code.
- Déployé sur `ombrair.vercel.app`.

Angle éditorial : la vitesse d'exécution et le pilotage agentique sont le point
fort. C'est une démonstration de capacité à livrer un produit complet très vite.
Le caractère fictif de l'entreprise doit être explicite (pas d'ambiguïté sur le
fait que c'est un exercice).

La 3D est le hook visuel : la carte projet doit le montrer, pas le dire.

### 4.3 — Analyse vidéo football (introduction uniquement)

⚠️ **Ce projet n'est pas public et n'a pas de repo GitHub.** Aucun lien code,
aucun lien démo live. Section d'**introduction** : on présente la démarche et
l'ambition, pas un livrable fini.

Faits vérifiés :

- Pipeline de détection et tracking (YOLOv8 + ByteTrack).
- Calibration par homographie pour projeter les positions joueurs en coordonnées
  terrain réelles.
- Interface Streamlit à 5 pages : Accueil, Segments, Minimap, Joueur, Équipes.
- Clustering d'équipes, classification des phases de jeu, détection d'événements clés.
- Appliqué à deux vrais matchs : Real Madrid – Dortmund (LDC) et Swansea – Man City
  (Carabao Cup).
- Contrainte assumée : environnement **CPU uniquement**.
- Objectif final : comparer une situation de jeu extraite d'une vidéo à des milliers
  de situations issues de vrais matchs, pour en déduire et simuler visuellement la
  meilleure décision à prendre (feedback tactique entraîneurs / joueurs).
- Piste en cours d'étude : tracking persistant inter-segments avec IDs stables sur
  un match complet, ré-identification par couleur de maillot + position + rôle.

Angle éditorial : positionner comme un **travail de recherche en cours**, c'est un
atout (ça montre l'ambition technique). La contrainte CPU-only est à assumer
frontalement : c'est une contrainte d'ingénierie, pas une excuse.

⚠️ Droits : pas de captures de diffusion TV des matchs, pas de logos de clubs ou de
compétitions. Utilise des rendus issus du pipeline (minimap, heatmaps, tracés,
schémas) ou des visualisations abstraites reconstruites.

---

## 5. SECTIONS DÉMO — TOUS LES PROJETS

Chaque projet du portfolio doit avoir une **partie démo** qui montre le produit en
fonctionnement. Un lien « voir le repo » ne suffit pas : 90 % des visiteurs ne
cliqueront pas.

Projets concernés : les trois ci-dessus **et** les projets déjà en ligne
(football-pipeline, JobTrackr, modèle de soutenabilité des retraites, et tout autre
projet présent dans le repo — inventorie-les toi-même au premier cycle).

Hiérarchie des formats de démo, du meilleur au moins bon — prends toujours le plus
haut format réalisable :

1. **Interactif embarqué** — iframe live ou mini-version rejouable dans la page.
   Idéal pour Ombrair et Vers l'Élysée (tous deux déployés sur Vercel).
   ⚠️ Vérifie les en-têtes `X-Frame-Options` / CSP ; si l'iframe est bloquée,
   descends d'un niveau plutôt que de laisser un cadre vide.
2. **Vidéo / capture animée** — screencast en boucle, muet, `autoplay` + `playsinline`,
   lazy-loadé, avec poster. Format `.webm` + fallback `.mp4`. Pour l'analyse vidéo
   football et les dashboards.
3. **Carrousel de captures annotées** — des carrousels EN/FR existent déjà pour
   JobTrackr et retraites : réutilise ce composant, ne le réinvente pas.
4. **Reproduction statique fidèle** — recréation en HTML/CSS d'un écran clé.

Règles communes à toute démo :
- Elle ne doit jamais dégrader le LCP ni le CLS : chargement différé, dimensions
  réservées, `loading="lazy"`, poster systématique.
- Elle doit fonctionner sur mobile (une iframe de dashboard desktop sur 390 px est
  inutilisable — bascule sur le format 2 ou 3).
- Elle doit avoir une légende qui dit **ce qu'on regarde**, pas ce que c'est.
- Elle doit avoir un état de repli visible si la ressource ne charge pas.
- Si un média n'existe pas encore, tu le produis toi-même (capture Playwright du
  site déployé, screencast scripté) ou tu consignes le besoin dans `QUESTIONS.md`.

---

## 6. GARDE-FOUS

- ❌ Jamais de refonte totale. Amélioration incrémentale uniquement.
- ❌ Jamais de nouvelle librairie lourde sans justification écrite dans le journal.
- ❌ Jamais de changement de la palette, des polices ou du positionnement éditorial.
- ❌ Jamais de contenu généré non vérifié (voir §1).
- ❌ Jamais de suppression de fichier hors du périmètre du chantier en cours.
- ❌ Jamais de `--force` sur git. Jamais de réécriture d'historique.
- ✅ Toujours : build vert avant commit, screenshot avant/après, journal à jour.
- ✅ Contraste texte ≥ 4.5:1 (≥ 3:1 pour les grands titres) — mesuré, pas estimé.
- ✅ Toute animation ajoutée doit avoir sa variante `prefers-reduced-motion`.
- ✅ En fin de cycle : supprimer les `docs/ui-loop/AUDIT-*.md` de plus de 24 h et
  les sondes jetables (`.tmp-*`, `scripts/.tmp/`). Le journal et la galerie sont la
  mémoire longue ; les audits sont jetables.

### Plafond de retouche — 3 passes par section

Une même section ne peut pas être retouchée **plus de trois fois** au total. Au
delà, tout nouveau chantier sur elle exige un **changement de fond** explicitement
justifié dans le journal, sous une rubrique `### Dérogation au plafond de retouche`
indiquant :

1. le nombre de passes déjà effectuées et ce que chacune a changé ;
2. le **fait nouveau** qui rend la quatrième nécessaire — régression mesurée, bug
   d'accessibilité chiffré, ou raccord imposé par un chantier §4 ;
3. pourquoi ce n'était **pas** détectable lors des passes précédentes.

« Je peux faire mieux », « le rythme me gêne » ou « l'easing serait plus juste »
ne sont pas des faits nouveaux. Sans dérogation écrite, la section est **gelée** et
tu passes au chantier suivant.

Compteur au 2026-09-12 (passes déjà consommées) :
`#capabilities` **9/3 — gelée** · `#about` **6/3 — gelée** · `footer` **5/3 — gelée** ·
`zone`/`sections` **5/3 — gelées** · `language-toggle` **3/3 — gelée** (cycle 028 :
`role="group"` → `role="navigation"`, correctif `region` axe-core) · `#contact` **1/3** ·
`nav` **2/3** (cycle 027 : cibles tactiles `.city-contact`/`.pc-arrow` à 44px) ·
`carousel-nav` (`.pc-*`, hors zone) **3/3 — gelée** (cycle 028 : nom accessible
unique par instance de `.pc-nav`, correctif `landmark-unique` ; cycle 044 :
zone tactile de `.pc-dot` (role="tab" réel, 4×4/18×4px) étendue via pseudo-
élément invisible à 8×44/22×44px, plafonnée par la densité de points — jusqu'à
8 points sur ~100px à 390px — sans chevaucher le voisin) · `city-heading` (hero) **1/3**
(cycle 028 : `aria-label` prohibé remplacé par un texte `sr-only`, correctif
`aria-prohibited-attr`) · `hero-cta` (`.opening-primary`/`.opening-secondary`,
hero) **3/3 — gelée** (cycle 029 : CTA dupliqué vers `#selected-work` supprimé,
rotation D ; cycle 046 : interactivité coupée à `scrollYProgress > 0.10`
au lieu de 0.3 — le CTA restait cliquable/tabbable pendant tout le fondu de
sortie alors que son contraste réel s'effondre à 4.27:1 dès 0.15 puis 1:1 à
0.3, un piège de focus clavier mesuré par échantillonnage de pixels ; cycle
047 : `aria-hidden` ajouté au même seuil que `pointer-events`/`tabIndex` —
le lien restait dans l'arbre d'accessibilité, donc signalé par axe-core,
après être devenu non interactif) · `project-detail-modal` (`ProjectDetailModal.tsx`) **3/3 —
gelée** (cycle 032 : cible tactile des onglets 34→44px, mesure de lecture du
paragraphe overview via `--measure-lede`, `tabIndex` sur la zone de
contenu scrollable — correctif `scrollable-region-focusable` ; cycle 033 :
contraste des eyebrows/labels du case-study 4.28:1/4.02:1 → 5.46:1,
partagé par les 6 projets ; cycle 043 : paragraphes `.project-case-study
p`/`.project-key-takeaway p` (blocs CONTEXT/PROBLEM, PIPELINE/METHOD,
EVIDENCE/RESULT) plafonnés à `--measure-lede`, 99-108→70-77
caractères/ligne, partagé par les 6 modales) · `cv-page` (`src/pages/CVPage.tsx`,
`.cv-*` dans `src/index.css`) **3/3 — gelée** (cycle 034 : contraste de trois
sélecteurs porté à ≥ 4.5:1, cibles tactiles des contacts à 44px, mesure
de lecture des puces via `--measure-lede` ; cycle 035 : kicker
"Axel Corral" redondant avec le `<h1>` juste en dessous retiré,
rotation A ; cycle 038 : gap vertical Education/Languages sous 768px
104px→48px, `.cv-two-col > .cv-section { margin-bottom: 0 }`,
rotation E) · `hero-links` (`.subtle-link`, ligne View CV/Download/GitHub/
Contact du hero, `src/components/CinematicOpening.tsx`) **2/3** (cycle 045 :
`flex-wrap` sur le conteneur + `white-space: nowrap` sur `.subtle-link` —
à 768px, `.hero-intro` (1/3 de large) faisait rétrécir un seul lien au lieu
de renvoyer les liens suivants à la ligne, cassant "Voir mon CV" sur 3
lignes en plein mot ; cycle 048 : `tabIndex`/`aria-hidden` gagnés, gelés
au même seuil `stateBActive` que leur `pointer-events` — voir
`hero-scene-b-controls` ci-dessous, même commit) · `hero-scene-b-controls`
(`.creator-hotspot`, `.primary-cta`, `.build-mode-trigger`, hero,
`src/components/CinematicOpening.tsx`) **1/3** (cycle 048 : les quatre
`.subtle-link` ci-dessus partagent ce correctif — invisibles/à opacité 0
avant `scrollYProgress > 0.3` mais restés joignables et activables au
clavier malgré `pointer-events: none`, qui ne bloque que la souris — même
classe de piège de focus déjà corrigée pour `.opening-primary` cycles
046-047, retrouvée sur ces cinq contrôles frères en retestant la prémisse
de ce correctif plutôt qu'en la supposant unique. `.creator-hotspot` gagne
`inert={!stateBActive}` ; les cinq contrôles de `#profile` gagnent un
`tabIndex`/`aria-hidden` individuel plutôt qu'un `inert` sur le
conteneur — `inert` sur `#profile` masquait aussi le seul `<h1>` de la
page à l'arbre d'accessibilité pendant la scène A, régression détectée par
axe-core (`page-has-heading-one`) avant publication, jamais livrée) ·
`city-tag`/`transition-prompt` (pastille "Business Intelligence..." et
message "Scroll to move..." de la scène A du hero, `src/index.css`) **1/3**
(cycle 050 : les deux éléments partageaient la même ligne d'ancrage —
32px au-dessus du bas du viewport, l'un via le padding du conteneur,
l'autre via son propre `bottom: 2rem` — et se chevauchaient réellement de
16 à 17px de haut sur toute la largeur mobile où `.city-tag` reste dans le
flux à une seule colonne (320-767px), pire en français où la pastille
peut passer sur deux lignes ; trouvé par capture d'écran, pas par
axe-core, qui ne voit pas ce type de collision. `.city-tag` gagne
`margin-bottom: 3rem` sous 768px, remis à 0 au-dessus où la pastille passe
dans sa propre colonne de grille. Corrigé dans le même commit : le message
"Scroll to..." était aussi tronqué des deux côtés en français sous ~430px
(`white-space: nowrap` sur un texte plus large que l'écran) — remplacé par
`width: max-content` + `max-width: calc(100vw - 3rem)` sans `nowrap`, qui
passe sur deux lignes centrées au lieu d'être coupé)

Les sections gelées ne rouvrent que par dérogation écrite. Ce plafond existe parce
que la boucle a produit 26 commits sur la zone basse pendant que les trois projets
du §4 n'avançaient pas d'une ligne.

---

## 7. FORMAT DU JOURNAL (`docs/ui-loop/PROGRESS.md`)

À chaque fin de cycle, tu **ajoutes** une entrée en haut du fichier (ordre
antéchronologique). Tu ne réécris pas les entrées passées.

```markdown
## Cycle NNN — AAAA-MM-JJ HH:MM

**Zone travaillée** : <section(s)>
**Rotation de questions** : <A|B|C|D|E>

### Constats d'audit
- <constat> — <viewport> — P0/P1/P2

### Changements livrés
- <commit hash court> — <description>

### Vérification
- Build : ✅ / ❌
- Viewports vérifiés : 390 / 768 / 1440 / 1920
- Langues : FR ✅ EN ✅
- reduced-motion : ✅
- Régression détectée : non / <laquelle + action>

### Reverté
- <si applicable, et pourquoi>

### État des chantiers structurels
- Vers l'Élysée : <non commencé | carte ✅ | page ✅ | démo ✅ | terminé>
- Ombrair : <idem>
- Analyse vidéo football : <idem>
- Démos projets existants : <n/N>

### Prochain cycle — point de reprise exact
- <la première chose à faire, formulée comme une action, pas comme une intention>

### Questions bloquantes ouvertes
- <renvoi vers QUESTIONS.md ou "aucune">
```

---

## 7bis. FORMAT DE LA GALERIE (`docs/ui-loop/GALERIE.md`)

Fichier **régénéré** à chaque fin de cycle, en ordre antéchronologique (cycle le plus
récent en haut). Un bloc par chantier livré — pas un bloc par cycle : si un cycle
livre trois chantiers, il produit trois blocs.

```markdown
## Cycle NNN — AAAA-MM-JJ · <intitulé du chantier>

> <une seule ligne : ce qui a changé, et pourquoi ça valait le coup>

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390**  | ![avant 390](shots/cycle-NNN/<slug>-390-avant.webp)   | ![après 390](shots/cycle-NNN/<slug>-390-apres.webp)   |
| **1440** | ![avant 1440](shots/cycle-NNN/<slug>-1440-avant.webp) | ![après 1440](shots/cycle-NNN/<slug>-1440-apres.webp) |

`<hash court>` · `<hash court>`
```

### Règles non négociables

- **Emplacement** : `docs/ui-loop/shots/cycle-NNN/`, jamais ailleurs. Ce dossier est
  **suivi par git** — contrairement à `docs/ui-loop/screenshots/`, qui est ignoré et
  ne sert qu'aux audits jetables. Ne confonds jamais les deux.
- **Format** : `.webp`, qualité **80**, largeur maximale **1200 px**. Une capture qui
  dépasse **200 Ko** est à recadrer sur la section concernée plutôt qu'à prendre en
  pleine page — on montre le chantier, pas tout le site.
- **Nommage** : `<slug-du-chantier>-<390|1440>-<avant|apres>.webp`. Le slug est en
  kebab-case et reste identique entre AVANT et APRÈS.
- **Chemins relatifs** uniquement (`shots/...`), pour que la page reste lisible sur
  GitHub comme en local.
- **Honnêteté** : l'image AVANT est capturée sur la révision git réellement antérieure
  au chantier. Jamais une capture recyclée d'un autre cycle, jamais une capture
  reconstituée à la main. Si tu ne peux pas produire un AVANT authentique (section
  créée de zéro), tu écris `— (section nouvelle, pas d'état antérieur)` dans la
  cellule AVANT au lieu d'inventer une image.
- **Budget** : si `docs/ui-loop/shots/` dépasse **40 Mo**, tu supprimes les images des
  cycles les plus anciens et tu remplaces leurs blocs par une ligne
  `_(captures élaguées — voir PROGRESS.md cycle NNN)_`. La galerie est une vitrine
  récente, pas une archive exhaustive.

---

## 8. PREMIER CYCLE — AMORÇAGE

Si `docs/ui-loop/PROGRESS.md` n'existe pas, le cycle 1 est un cycle spécial :

1. Crée l'arborescence `docs/ui-loop/` avec `PROGRESS.md`, `BACKLOG.md`, `QUESTIONS.md`.
2. Crée la branche `auto/ui-loop`.
3. Écris `scripts/ui-audit.mjs` et fais-le tourner une première fois.
4. Inventorie **tous** les projets actuellement présents dans le portfolio et note,
   pour chacun, s'il a déjà une démo et de quel format.
5. Produis un audit complet de la zone prioritaire (§3), sans encore coder.
6. Remplis `BACKLOG.md` avec les chantiers identifiés, classés P0/P1/P2.
7. Journalise. **Ne code rien d'autre pendant ce cycle** — l'amorçage sert à ne pas
   travailler à l'aveugle pendant les 50 cycles suivants.
