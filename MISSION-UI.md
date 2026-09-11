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

---

## 3. ZONE PRIORITAIRE ABSOLUE

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

Traite ces sections comme si elles étaient la première chose que voit un recruteur.
Chaque cycle doit y consacrer au moins un chantier tant qu'elles ne sont pas au
niveau du haut de page.

Le reste du site (hero, slides projets, navigation) est audité aussi, à chaque cycle,
mais n'est corrigé qu'en P2 — sauf régression ou bug bloquant.

---

## 4. INTÉGRATION DES NOUVEAUX PROJETS (de A à Z)

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
