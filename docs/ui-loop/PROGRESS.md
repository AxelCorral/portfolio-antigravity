# Journal — Boucle d'amélioration continue UI

> Ordre antéchronologique : la dernière entrée est en haut.
> Ce fichier est la **seule mémoire** entre les cycles. Il doit toujours permettre
> à une session neuve de reprendre sans rien relire d'autre que `MISSION-UI.md`.

---

## Cycle 028 — 2026-09-12 20:10

**Zone travaillée** : hors zone prioritaire (§3, gelée) et hors §4
(intégralement traité, reconfirmé ce cycle) — hero (`.city-heading`,
`CinematicOpening.tsx`), navigation des carousels projet (`.pc-nav`,
`ProjectCarousel.tsx`/`CarouselModal.tsx`), sélecteur de langue
(`.language-toggle`, `LanguageToggle.tsx`). Outillage : bug Windows corrigé
dans `scripts/ui-gallery.mjs`.
**Rotation de questions** : non applicable — ce cycle ferme trois
violations axe-core déjà chiffrées et localisées au backlog (issues
d'audits rotation antérieurs, pas d'une rotation A-E nouvelle).

### Note de continuité — §4 revérifié sur le code, pas sur le seul journal

Consigne de run reçue : « ne te fie pas aux cycles passés ». Avant tout
chantier, revérifié indépendamment que les trois projets §4 sont bien
intégrés dans le code réel (pas seulement déclarés dans PROGRESS.md) :
`grep 'id: "0[456]"' src/data/projects.ts` → les trois entrées existent ;
`grep 'project.id ===' src/OnePage.tsx` → `01`/`02`/`03`/`06` ont leur
branche carousel dédiée, `04`/`05` tombent dans la branche générique
`demoLink ? <LiveDemoEmbed>` (lue en détail, `OnePage.tsx` L306-359) — ce
qui est le comportement voulu pour ces deux projets (démo iframe live, pas
de carousel). `npm run build` vert avant tout changement. Le §4 est donc
confirmé intégralement traité pour la troisième fois consécutive (cycles
026, 027, 028) sur la base du code, pas du journal. Conformément à l'ordre
de priorité §2 phase 4, aucun P0 réel trouvé (build vert, `tsc --noEmit`
propre) et §3 reste P2 gelée sans fait nouveau → cycle retombé sur « P2 —
reste du site ».

### Constats d'audit

- **Trois violations axe-core identiques à chaque run complet depuis le
  cycle 001** (`aria-prohibited-attr`, `landmark-unique`, `region` —
  mentionnées comme "3 violations, strictement identiques aux cycles
  001-0NN" dans une dizaine d'entrées de journal successives, jamais
  creusées jusqu'à leur cause). Choisi comme chantier de ce cycle parce que
  chacune était déjà précisément localisée dans `BACKLOG.md` (sélecteur,
  élément), qu'aucune ne touche la zone prioritaire gelée, et que des
  violations d'accessibilité mesurées répondent explicitement au garde-fou
  §6 (« toujours : contraste mesuré », esprit étendu ici aux landmarks/rôles
  ARIA, eux aussi mesurés par un outil automatisé plutôt que par une
  préférence).
  - **`aria-prohibited-attr` sur `.city-heading`** : `<p
    aria-label={t.hero.cityAria}>` — un `<p>` porte le rôle ARIA implicite
    « paragraph », qui n'admet pas `aria-label` selon ARIA-in-HTML. Les
    lignes visibles rendues par `CharacterLines` (découpage caractère par
    caractère pour l'animation d'entrée) étaient déjà `aria-hidden="true"`
    chacune — l'intention (fournir le texte réel en une fois à un lecteur
    d'écran, cacher le découpage visuel) était correcte, seul le support
    (l'attribut sur un rôle qui ne l'admet pas) était fautif.
  - **`landmark-unique` sur `.pc-nav`** : cause trouvée en lisant le
    composant, pas seulement le sélecteur incriminé — `ProjectCarousel`
    et `CarouselModal` acceptent un prop `label`, mais **aucun des 4 sites
    d'appel** (`OnePage.tsx`, projets 01/02/03/06) ne le passait ; les 4
    `<nav aria-label={t.carousel.slideNavigation}>` de la page portaient
    donc toutes le même nom traduit (« Slide navigation » / « Navigation
    des slides »), indiscernables en navigation par landmarks.
  - **`region` sur `.language-toggle`** : le composant est monté comme
    frère direct de `<Routes>` dans `App.tsx` (`role="group"`), donc hors
    de tout landmark — alors que c'est structurellement un contrôle de
    navigation interlangue (le même patron que les liens inter-langues de
    Wikipédia, qui sont conventionnellement un landmark `nav`).

### Changements livrés

- `db4cc52` — fix(a11y): `.city-heading` — `aria-label` remplacé par un
  `<span className="sr-only">` portant le même texte. Rendu visuel
  inchangé (le texte masqué ne l'était déjà pas visuellement avant : c'est
  un attribut ARIA qui a changé de support, pas un style).
- `64dde59` — fix(a11y): chaque `ProjectCarousel`/`CarouselModal` reçoit
  désormais `label={project.title}` (4 sites d'appel dans `OnePage.tsx`),
  et le `<nav className="pc-nav">` des deux composants construit son
  `aria-label` à partir de ce label (`"Slide navigation: <titre>"`) au
  lieu du seul texte générique. Effet secondaire bénéfique : le
  `role="group"` racine du carousel (déjà `aria-label={label}`) devient
  lui aussi nommé par projet au lieu du placeholder « Project walkthrough »
  partagé par les 4 instances.
- `77904d9` — fix(a11y): `.language-toggle` — `role="group"` →
  `role="navigation"`. Troisième et dernière passe de retouche autorisée
  sur cette section (compteur §6, désormais gelée).
- `0f49a4c` — chore(ui-gallery): correctif d'outillage trouvé en
  documentant ce chantier. `--sections=viewport:.language-toggle@40`
  produisait un `:` dans le chemin de sortie
  (`...--viewport:.language-toggle@40-390-avant.webp`) — NTFS refuse `:`
  dans un nom de fichier, `toWebp()` échouait silencieusement sur un
  chemin tronqué et la capture réelle était perdue (fichier 0 octet sans
  erreur visible dans la sortie du script). `id` passe maintenant par le
  `slugify()` déjà présent dans le script avant de servir de nom de
  fichier ; le reste du pipeline (résolution de l'élément, légende
  Markdown) continue d'utiliser l'`id` brut.
- `51bedf8` — ui-loop: galerie régénérée pour ce cycle (voir Vérification).
- `9d775c0` — journalisation : compteur de retouche §6 et `BACKLOG.md` mis
  à jour (les trois violations cochées terminées avec le détail cause/
  correctif de chacune).

### Vérification

- Build : ✅ (`npm run build` vert après chaque commit — CSS 96,75 →
  **96,89 kB**, JS 693,79 → **693,91 kB**, deltas cohérents avec les
  quelques attributs ajoutés). `tsc --noEmit` : ✅ sans sortie, revérifié
  après le fix d'outillage `ui-gallery.mjs` également.
- **axe-core pleine page après scroll complet, 3 combinaisons (script ad
  hoc supprimé après usage, résultat consigné ici) : 1440 EN, 1440 FR, 390
  EN → 0 violation dans les trois cas.** C'est la première fois depuis le
  cycle 001 qu'un run axe-core pleine page revient à 0 — les trois
  violations historiques ont disparu, aucune nouvelle n'est apparue.
- Vérifications ciblées (même script) : les 6 `<nav>` de la page (nav
  principale, 4× `.pc-nav`, `#contact`) portent désormais 6 noms distincts
  dans les deux langues (ex. EN : « Slide navigation: Football Data
  Pipeline », « Slide navigation: JobTrackr », « Slide navigation:
  Retirement Sustainability Model », « Slide navigation: Football Video
  Analysis » — FR : traductions correctes, y compris pour les titres
  français des projets 03/06). `.language-toggle` porte `role="navigation"`
  aux trois combinaisons. `.city-heading` n'a plus d'`aria-label` et son
  `.sr-only` porte le texte attendu dans les deux langues (« Shaping data
  with clarity and action. » / « Structurer la donnée avec clarté et
  impact. »).
- Galerie régénérée (`node scripts/ui-gallery.mjs --cycle=028
  --before=9759fa1 --sections=viewport:.language-toggle@40,.pc-nav`) :
  paires 390/1440 pour le sélecteur de langue et la nav du carousel
  01, capturées sur worktree détaché à `9759fa1` (avant les 3 commits
  a11y) contre l'arbre de travail courant. **Les deux paires sont
  identiques au pixel près** — attendu et vérifié visuellement (lecture
  des 4 images) : les trois correctifs touchent `aria-label`/`role`/un
  texte `sr-only`, jamais une règle CSS ni un attribut visuel. C'est une
  preuve honnête d'absence de régression visuelle, pas un chantier sans
  preuve — la preuve réelle du chantier est le passage axe-core ci-dessus,
  pas la capture.
- Viewports vérifiés : 390 et 1440 (galerie) + 1440/390 dans le passage
  axe-core. 768/1920 non re-testés séparément (aucun changement
  dimensionnel dans ce chantier, seulement des attributs ARIA/un rôle/un
  texte masqué visuellement).
- Langues : FR ✅ EN ✅ — voir noms de landmarks et texte `sr-only` ci-dessus.
- reduced-motion : ✅ — aucune animation touchée par ce chantier (3
  attributs ARIA/rôle, un texte masqué visuellement par une classe
  utilitaire, pas de transition).
- Régression détectée : non — build vert, `tsc --noEmit` propre, 0
  violation axe-core (au lieu de 3), captures avant/après pixel-identiques
  sur les deux sections concernées, aucun autre sélecteur partagé modifié.

### Reverté

- Aucun.

### État des chantiers structurels
- Vers l'Élysée : terminé (carte ✅ page ✅ démo ✅) — cycle 024,
  reconfirmé par lecture du code ce cycle.
- Ombrair : terminé (carte ✅ page ✅ démo ✅) — cycle 025, reconfirmé de
  même.
- Analyse vidéo football : terminé (carte ✅ page ✅ démo ✅) — cycle 026,
  reconfirmé de même.
- **Le §4 de MISSION-UI.md reste intégralement traité, revérifié sur le
  code réel pour la troisième fois consécutive (cycles 026, 027, 028).**
- Démos projets existants : 3/3 conformes, inchangé depuis cycle 026.

### Prochain cycle — point de reprise exact
- **§4 reste clos : ne pas le rouvrir sans fait nouveau.** Relire
  MISSION-UI.md en entier (§0) puis reprendre l'ordre de priorité §2
  phase 4 normal : (1) tout P0 réel détecté en phase 1 ; (2) §3 reste P2
  gelée sauf régression/bug bloquant/violation d'accessibilité mesurée/
  raccord imposé — ne pas y ouvrir de chantier de sa propre initiative ;
  (3) « reste du site » (hero, slides projets, nav) — **aucune rotation
  A-E formelle n'a jamais été conduite explicitement sur le reste du site
  seul** (les rotations 016-023 portaient sur la zone prioritaire, 027
  portait sur « le reste du site » mais en mode ad hoc plutôt qu'avec les
  trois questions écrites de la rotation E). Un candidat naturel : rotation
  D (crédibilité) ou A (hiérarchie) sur hero + carousels + nav, les deux
  seules jamais posées par écrit hors zone prioritaire.
- Candidats P2 déjà chiffrés au backlog, non traités ce cycle (aucun ne
  touche la zone gelée) : bundle JS 693,91 kB (215 kB gzip, warning Vite
  « chunk > 500kB », toujours pas de garde-fou chiffré mais à surveiller) ;
  couverture du probe de contraste maison limitée aux 4 sections de la
  zone prioritaire (`scripts/lib/probe-color.js`, backlog ligne ~220) ; mode
  `--freeze-at=<ms>` pour `ui-gallery.mjs` (backlog ligne ~260, toujours pas
  implémenté).
- Note d'outillage : `scripts/ui-gallery.mjs` échouait silencieusement sur
  Windows dès que `--sections=` contenait un `:` (mode `viewport:<id>`) —
  corrigé ce cycle (commit `0f49a4c`). Si un futur run de la galerie produit
  des fichiers de 0 octet sans message d'erreur, vérifier d'abord si l'`id`
  de section contient un caractère interdit sur le système de fichiers
  courant avant de suspecter Playwright/sharp.

### Questions bloquantes ouvertes
- Aucune (Q1-Q4 résolues le 2026-09-12, voir `QUESTIONS.md`).

---

## Cycle 027 — 2026-09-12 19:35

**Zone travaillée** : hors zone prioritaire (§3, gelée sauf régression) et
hors §4 (intégralement traité, voir ci-dessous) — header (`.city-contact`) et
navigation des carousels projet (`.pc-arrow`, composant partagé par les 6
projets 01-06). Outillage : `scripts/ui-audit.mjs`.
**Rotation de questions** : **E — Mobile-first réel** (dernière rotation
explicite : D au cycle 023 ; les cycles 024-026 étaient des chantiers §4 hors
rotation). E n'avait pas resservi depuis avant le cycle 018.

### Note de continuité — la priorité §4 de ce run était déjà traitée

Le prompt de ce run redemandait explicitement les trois chantiers §4 (Vers
l'Élysée, Ombrair, Analyse vidéo football) comme priorité absolue, dans
l'ordre imposé, en précisant « ne te fie pas aux cycles passés ». Conformément
à cette dernière consigne, je n'ai pas fait confiance au journal des cycles
024-026 sur parole : `git log` confirme les trois commits d'intégration
(`6e66d36`, `fd39663`, `7119fcf`), `npm run build` est vert, et
`grep 'id: "0[456]"' src/data/projects.ts` + `grep 'project.id === "06"'
src/OnePage.tsx` confirment que les trois entrées existent bien et sont
branchées dans le code réel — pas seulement décrites dans un journal. Les
trois chantiers ont donc bien leurs trois livrables (carte/page/démo). Seul
écart trouvé : `docs/ui-loop/BACKLOG.md` n'avait jamais coché la ligne
« Analyse vidéo football », alors que le journal du cycle 026 la déclarait
terminée — corrigé ce cycle (voir Changements livrés).

Le §4 étant réellement clos, ce cycle est retombé sur l'échelon suivant de
l'ordre de priorité de MISSION-UI.md §2 phase 4 : aucune régression P0
trouvée (build vert, `tsc --noEmit` propre), la zone prioritaire (§3) reste en
P2 gelée sans fait nouveau justifiant une dérogation, donc audit rotation E
sur le reste du site.

### Constats d'audit

- **Outillage cassé avant même de pouvoir auditer** : `scripts/ui-audit.mjs`
  a crashé deux fois de suite (`page.evaluate: Target crashed`), à des points
  différents du run (pendant le scroll progressif une fois, pendant la passe
  clavier/reduced-motion l'autre). Cause : un unique `browser` Chromium
  partagé entre les ~10 sessions de capture (4 viewports × 2 langues + 2
  passes reduced-motion), chacune faisant un plein scroll + captures GSAP,
  accumulait de la mémoire jusqu'au crash — et perdait alors la totalité du
  run (aucun `report.json` écrit). Corrigé avant de pouvoir auditer quoi que
  ce soit d'autre : navigateur frais par capture + écriture incrémentale du
  rapport + tolérance à l'échec d'une seule combinaison. Après correction :
  8/8 combinaisons principales terminées proprement (0 overflow horizontal,
  3 violations axe-core identiques à la référence historique 001-026 sur les
  4 combinaisons échantillonnées, 0 erreur console/page) ; la passe
  reduced-motion a encore crashé une fois sur deux (EN capturé jusqu'au bout
  du scroll puis crash en fin de passe clavier, FR non atteint dans le temps
  imparti) — la robustesse en run complet est meilleure mais pas absolue,
  noté dans `BACKLOG.md` pour un futur cycle si ça re-bloque un audit complet.
- **P1 mesuré — `.city-contact` (CTA « Contact » du header) sous le plancher
  tactile** : `min-height: 36px` codé en dur, mesuré 70×36px à 390 comme à
  1440/1920. C'est le contrôle le plus visible de la page (visible dès le
  premier écran, sur toutes les largeurs), et il répond directement à la
  question de rotation E « les zones tactiles font-elles ≥ 44 px ? ».
- **P1 mesuré — `.pc-arrow` (flèches Previous/Next des carousels projet)
  sous le plancher tactile** : 30×30px mesuré, composant partagé par les 6
  carousels projet (01 à 06 inclus, donc aussi les trois projets intégrés aux
  cycles 024-026). C'est le seul contrôle **bouton** pour naviguer un
  carousel sans clavier (les flèches ‹/› ne sont pas décoratives : chaque clic
  avance/recule d'une diapositive, vérifié cycle 026 pour la navigation
  clavier équivalente).
- **Revu et explicitement non retenu — `.pc-dot` (points de pagination des
  carousels, 4px / 18px actif)** : chaque point est un vrai `<button>` avec
  un `aria-label` nommant sa diapositive exacte (« Project 01 · Data
  Engineering », « Step 03 — Analytical SQL », etc.), mais 4×4px est très en
  dessous de 44px. Non corrigé : une alternative de même fonction existe déjà
  sur la même page (les flèches Previous/Next + la navigation clavier,
  vérifiée cycle 026) — l'exception de contrôle équivalent de WCAG 2.5.8
  s'applique. Forcer 44px sur une rangée dense de 7-8 points aurait exigé une
  refonte du nav de carousel (chevauchement des zones tactiles adjacentes à
  cette densité), hors du cadre d'une amélioration incrémentale (§6). Consigné
  explicitement pour qu'un futur cycle ne remesure pas la même chose en
  pensant avoir trouvé un défaut neuf.
- Reste du site (hero, slides projets hors carousel-nav, footer) : rien de
  nouveau mesuré cette rotation au-delà des deux points ci-dessus — la
  couverture complète (4 viewports, axe-core, clavier) n'a pu être rejouée
  qu'après la correction de l'outillage, dans le temps restant du cycle.

### Changements livrés

- `e6f49c2` — chore(ui-audit): un navigateur frais par capture au lieu d'un
  seul partagé sur tout le run, écriture incrémentale de `report.json`,
  tolérance à l'échec d'une seule combinaison. Condition préalable à tout
  audit de ce cycle et au-delà.
- `cba1747` — ui(nav): `.city-contact` 36px → **44px** de hauteur minimale ;
  `.pc-arrow` 30×30 → **44×44px**. Aucune règle ajoutée, deux valeurs
  ajustées ; style visuel inchangé (pilule pleine largeur, icône de flèche
  centrée). `.pc-dot` non touché (voir Constats ci-dessus).
- `af629f3` — journalisation : `BACKLOG.md` coche l'intégration d'Analyse
  vidéo football (jamais cochée depuis le cycle 026, corrigé après
  revérification du code réel — pas du seul journal), compteur de retouche
  §6 mis à jour (`nav` 2/3, nouvelle ligne `carousel-nav` 1/3), galerie
  régénérée avec les deux chantiers de ce cycle.

### Vérification

- Build : ✅ (`npm run build` vert avant et après le commit `cba1747` — CSS
  **96,75 kB inchangé** : ajustement de deux valeurs existantes, aucune règle
  ajoutée). `tsc --noEmit` : ✅ sans sortie.
- Mesures avant/après (Playwright ad hoc, 390 et 1440) : `.city-contact`
  70×36 → **70×44** ; `.pc-arrow` 30×30 → **44×44**. **0 overflow horizontal**
  aux deux largeurs après le changement.
- Viewports vérifiés visuellement : **390** (hero + header capturés,
  pilule Contact proportionnée, aucune coupure) et **1440/1920** (bande de
  nav complète capturée, hauteur de bandeau légèrement accrue — de l'ordre de
  8-14px — sans rupture de mise en page, `.language-toggle`/logo/liens nav
  inchangés).
- Langues : le changement ne touche aucun texte ; non re-vérifié séparément
  par langue (rien à vérifier qui dépende de la langue sur ces deux règles
  CSS dimensionnelles).
- reduced-motion : ✅ pour le CTA header et les flèches (aucune animation
  concernée par le changement, ce sont des dimensions statiques) ; passe
  complète reduced-motion de l'outillage partiellement aboutie (voir Constats
  ci-dessus), sans lien avec le chantier CSS lui-même.
- Nav clavier : ✅ — `Tab` atteint bien `.pc-arrow` (vérifié par script,
  activeElement porte la classe `pc-arrow` après une séquence de tabulations
  depuis le haut de page), 0 erreur console/page pendant le parcours.
- Régression détectée : non — les 6 carousels projet (01-06) et le header
  utilisent la même règle CSS partagée, aucune règle scindée par projet ;
  captures desktop (1440/1920) et mobile (390) confirment visuellement
  qu'aucune autre zone n'a bougé.

### Reverté

- Aucun.

### État des chantiers structurels
- Vers l'Élysée : terminé (carte ✅ page ✅ démo ✅) — cycle 024, reconfirmé
  par lecture du code ce cycle (voir Note de continuité).
- Ombrair : terminé (carte ✅ page ✅ démo ✅) — cycle 025, reconfirmé de même.
- Analyse vidéo football : terminé (carte ✅ page ✅ démo ✅) — cycle 026,
  reconfirmé de même. **`BACKLOG.md` était en retard d'une case à cocher,
  corrigé ce cycle.**
- **Le §4 de MISSION-UI.md est intégralement traité et reconfirmé sur le code
  réel, pas seulement sur la foi du journal.**
- Démos projets existants : 3/3 conformes, inchangé depuis cycle 026.

### Prochain cycle — point de reprise exact
- **§4 est clos et reconfirmé : ne pas le rouvrir sans fait nouveau.** Relire
  MISSION-UI.md en entier (§0) puis reprendre l'ordre de priorité §2 phase 4
  normal : (1) tout P0 réel détecté en phase 1 (build cassé, régression) ; (2)
  §3 reste P2 gelée sauf régression/bug bloquant/violation d'accessibilité
  mesurée/raccord imposé — ne pas y ouvrir de chantier de sa propre
  initiative ; (3) continuer l'audit rotation E (mobile-first) sur le reste du
  site, qui n'a été rejoué que partiellement ce cycle faute de temps après la
  réparation de l'outillage — candidats déjà identifiés mais non mesurés ce
  cycle : `.capability-card` (grille à 4 colonnes dès 1024px, backlog §P2
  ligne ~195), bundle JS 641-694 kB (backlog §P2, pas de garde-fou chiffré
  mais à surveiller), couverture du probe de contraste maison limitée aux 4
  sections de la zone prioritaire (backlog §P2 ligne ~220).
- Si la rotation E ne remonte plus rien de mesurable sous le plafond de
  retouche, rotation suivante par ordre (dernières utilisées : D (023), C
  (022), B (020), A (021) — E ce cycle-ci ; candidat naturel : A ou B sur le
  reste du site, jamais auditées hors zone prioritaire).
- Note d'outillage pour tout futur run de `scripts/ui-audit.mjs` : la passe
  reduced-motion peut encore crasher occasionnellement même après la
  correction de ce cycle (navigateur frais par capture) — si un futur run la
  perd systématiquement, envisager de réduire le nombre de captures de scroll
  par run plutôt que d'ajouter un troisième correctif de robustesse au même
  script.

### Questions bloquantes ouvertes
- Aucune (Q1-Q4 résolues le 2026-09-12, voir `QUESTIONS.md`).

---

## Cycle 026 — 2026-09-12 19:05

**Zone travaillée** : §4 — intégration d'**Analyse vidéo football** (carte,
page, démo). Troisième et dernier des trois chantiers §4, dans l'ordre
imposé. Aucun chantier de la zone prioritaire (§3, P2) n'a été ouvert,
conformément à la consigne de run reçue pour cette exécution.
**Rotation de questions** : non applicable — la rotation A-E porte sur la
zone prioritaire (§3) ; ce cycle est un chantier §4.

### Constats de vérification (tenant lieu d'audit pour ce chantier)

- **Projet non public, contrairement à Vers l'Élysée et Ombrair** : Q4
  (`QUESTIONS.md`, résolue 2026-09-12) exclut tout lien repo et toute démo
  live pour ce projet. Il n'y a donc aucun site déployé à aller inspecter
  (contrairement à Ombrair au cycle 025) — le contenu éditorial s'en tient
  strictement aux faits déjà couchés dans `MISSION-UI.md` §4.3, sans rien
  ajouter au-delà.
- **Mécanisme de démo identifié avant d'écrire une ligne de contenu** : les
  projets 01 (Football Data Pipeline), 02 (JobTrackr) et 03 (Retirement
  Sustainability Model) utilisent déjà un carousel de slides dédié
  (`ProjectCarousel` + `VisualKind`/`VISUALS` dans
  `src/components/carousel/CarouselSlides.tsx`), où chaque `VisualKind` est
  un composant React/CSS bespoke, pas une image — exactement le mécanisme
  qu'il fallait pour produire des « schémas abstraits reconstruits » (Q4)
  sans fabriquer ni capturer aucune image. Confirmé par lecture de
  `IngestVisual.tsx` (contenu JobTrackr en dur) que ces composants sont
  bien spécifiques à chaque projet malgré leur nom générique — donc trois
  nouveaux composants dédiés, pas une réutilisation détournée d'un visuel
  existant.
- **Emplacement réservé pour les futurs exports réels (exigence
  structurelle de Q4), implémenté comme un commentaire documenté en tête de
  `src/data/projects/video-analysis.ts`**, plutôt que comme un nouveau champ
  de données ou un branchement dans `ProjectDetailModal`/`CarouselSlides.tsx`
  (composants partagés par tous les projets, donc à ne pas complexifier pour
  un besoin propre à un seul projet) : `StepSlide` accepte déjà `chartImage`
  *et* `visual` (voir `retirement-analysis.ts`, qui n'utilise que
  `chartImage`) — remplacer `visual: "<kind>"` par `chartImage: { src, alt }`
  sur le slide concerné suffira, sans toucher au carousel ni à la mise en
  page.
- **Modale vérifiée sans tab `Links` ni `Outputs`** : `ProjectDetailModal`
  ne construit ces tabs que si `project.links?.length` /
  `project.screenshots?.length` (voir `ProjectDetailModal.tsx` L90-95) ;
  l'entrée `id: "06"` ne fournit ni l'un ni l'autre, donc aucun code
  supplémentaire n'était nécessaire pour respecter « aucun lien code, aucun
  lien démo live » — vérifié par capture (tabs affichés : Overview, Results,
  Tech uniquement).

### Changements livrés

- `7119fcf` — ui(projects): intégrer Analyse vidéo football — carte, page et
  démo.
  - **Carte** : entrée `id: "06"` dans `src/data/projects.ts` (EN+FR
    complet), rendue par le même `ProjectShowcaseCard` que les cinq projets
    existants. Statut affiché « Research in progress » / « Recherche en
    cours » — angle éditorial imposé (§4.3) : positionner comme un travail de
    recherche en cours, contrainte CPU-only assumée frontalement dans le
    hook, le `whyItMatters` et le `keyTakeaway`.
  - **Page** : case study 4 sections (contexte, pipeline, preuve, ce que ça
    démontre) exploitée par `ProjectDetailModal` sans aucune modification de
    sa structure.
  - **Démo** : nouveau carousel dédié (`src/data/projects/video-analysis.ts`,
    7 slides EN+FR — 1 cover + 6 steps), branché dans `OnePage.tsx` via un
    nouveau cas `project.id === "06"`, au même niveau que 01/02/03. Trois
    nouveaux composants visuels abstraits
    (`src/components/carousel/visuals/`) : `TrackingFlowVisual` (flux
    broadcast → YOLOv8 → ByteTrack → clustering/phases), `PitchSchemaVisual`
    (SVG, terrain stylisé + rayons pointillés représentant la calibration par
    homographie), `ReidVisual` (représentation conceptuelle de la piste de
    recherche en cours : ré-identification par maillot + position + rôle,
    formulée comme une question — « same id? » — pas comme un résultat
    acquis). Aucune capture de diffusion, aucun logo de club ou de
    compétition ; les trois composants portent un commentaire rappelant
    explicitement qu'ils ne sont pas un export réel du pipeline.
  - Extension de `VisualKind` (`football-pipeline.ts`, type partagé par tous
    les carousels projet) avec 3 nouvelles valeurs, et enregistrement dans le
    registre `VISUALS` de `CarouselSlides.tsx` — aucune valeur existante
    modifiée.

### Vérification

- Build : ✅ (`npm run build` vert — `tsc -b && vite build`). CSS
  **96,75 kB** inchangé ; JS **670,61 → 693,79 kB**. `tsc --noEmit` : ✅ sans
  sortie.
- axe-core sur `#project-06` (carte, iframe absente puisqu'il n'y a pas de
  démo live) et sur la modale de case study (tabs Overview/Results/Tech) :
  **0 violation** dans les deux cas. axe-core pleine page après scroll
  complet : **3 violations, strictement identiques aux cycles 001-025**
  (`aria-prohibited-attr`, `landmark-unique`, `region`), aucune nouvelle.
- Viewports vérifiés : **390 / 1440**, EN et FR, carte + 7 slides du carousel
  capturés un par un (les trois visuels abstraits vérifiés visuellement,
  pas seulement par lecture du DOM) + les deux tabs peuplés de la modale.
  **0 overflow horizontal** à 390 px (`document.body.scrollWidth -
  window.innerWidth === 0`), y compris après un scroll complet de la page.
- Langues : FR ✅ EN ✅ — carte, 7 slides du carousel, case study (3 tabs) et
  libellés capturés et lus dans les deux langues ; les labels techniques
  internes aux visuels (YOLOv8, ByteTrack) restent non traduits, cohérent
  avec les visuels existants du projet 01/02 (ex. `IngestVisual` conserve
  « France Travail »/« Adzuna » en FR).
- reduced-motion : ✅ — navigation carousel sous `reduce`, 0 erreur console/
  page.
- Nav clavier : ✅ — le carousel reçoit le focus (`Tab`), les flèches
  `ArrowRight`/`ArrowLeft` changent de slide au clavier (vérifié : compteur
  passe de 01/07 à 02/07), le bouton « Open case study » est atteignable et
  ouvre la modale.
- Régression détectée : non — les 6 projets (01-06) vérifiés présents avec
  le bon titre après un scroll complet de la page ; aucune modification des
  fichiers partagés (`CarouselSlides.tsx`, `football-pipeline.ts`) ne
  change le rendu des `VisualKind` existants (ajouts en fin d'union/de
  registre uniquement).

### Reverté

- Aucun.

### État des chantiers structurels
- Vers l'Élysée : terminé (carte ✅ page ✅ démo ✅) — cycle 024.
- Ombrair : terminé (carte ✅ page ✅ démo ✅) — cycle 025.
- **Analyse vidéo football : terminé** (carte ✅ page ✅ démo ✅) —
  troisième et dernier des trois chantiers §4, livré ce cycle. **Le §4 de
  `MISSION-UI.md` est désormais intégralement traité.**
- Démos projets existants : 3/3 conformes, inchangé depuis cycle 025.

### Prochain cycle — point de reprise exact
- **Relire `MISSION-UI.md` en entier avant tout** : les trois chantiers §4
  sont terminés, donc la priorité qui a gouverné les cycles 023-026 n'existe
  plus telle quelle. Il faudra déterminer la nouvelle priorité en relisant
  §2-§6 de la mission (la zone basse §3 reste P2 sauf régression/bug
  bloquant/violation d'accessibilité mesurée — ne pas y ouvrir de chantier
  de sa propre initiative sans un fait nouveau, voir le plafond de retouche
  §6).
- Candidats probables pour le prochain cycle, par ordre de priorité de la
  mission (§4 phase 5 rappel) : (1) tout **P0 réel** détecté en phase 1/2 du
  prochain cycle (build cassé, régression, contraste non conforme) ; (2)
  un audit général de la zone prioritaire (§3) et du reste du site (hero,
  slides projets, nav, footer) puisque aucun audit rotation A-E n'a été fait
  depuis le cycle 023 — trois cycles se sont enchaînés sans rotation ; (3) si
  l'audit ne remonte rien de nouveau sous le plafond de retouche, le
  candidat déjà chiffré au backlog est l'arbitrage de plancher d'opacité des
  cartes Capabilities (posé au cycle 022, jamais tranché).
- Note d'outillage pour un futur chantier lié à ce cycle : si Axel fournit
  de vrais exports du pipeline vidéo football, l'emplacement de
  substitution est documenté en tête de
  `src/data/projects/video-analysis.ts` (commentaire « RESERVED SLOT ») —
  remplacer `visual: "<kind>"` par `chartImage: { src, alt }` sur le slide
  concerné, aucun autre changement requis.

### Questions bloquantes ouvertes
- Aucune (Q1-Q4 résolues le 2026-09-12, voir `QUESTIONS.md`).

---

## Cycle 025 — 2026-09-12 18:38

**Zone travaillée** : §4 — intégration d'**Ombrair** (carte, page, démo).
Aucun chantier de la zone prioritaire (§3, P2) n'a été ouvert, conformément à
la consigne de run reçue pour cette exécution.
**Rotation de questions** : non applicable — la rotation A-E porte sur la
zone prioritaire (§3) ; ce cycle est un chantier §4, deuxième des trois dans
l'ordre imposé.

### Constats de vérification (tenant lieu d'audit pour ce chantier)

- **En-têtes HTTP revérifiés avant d'implémenter**, comme demandé par le
  point de reprise du cycle 024 (« ne pas se fier à une vérification de
  cycle 003 sans la rejouer ») : `curl -I https://ombrair.vercel.app` →
  `200 OK`, aucun `X-Frame-Options` ni `Content-Security-Policy:
  frame-ancestors`. L'iframe live reste réalisable (format 1, §5), inchangé
  depuis la vérification du cycle 003.
- **Reconnaissance du site déployé avant d'écrire le contenu éditorial**,
  plutôt que de s'en tenir uniquement aux faits déjà couchés dans
  MISSION-UI.md §4.2. La page `/a-propos` du site en ligne énonce elle-même
  le cadre exact du projet : exercice de création d'entreprise du Master
  MIASHS de l'Université Toulouse Jean Jaurès, sur la thématique des
  canicules et du confort thermique du logement, avec la phrase « Projet
  fictif [...] Aucune vente réelle n'est associée à ce site » répétée en
  pied de page. Ce n'est pas une donnée inventée : c'est le texte du site
  lui-même, plus précis que le résumé de la mission, et il sécurise
  l'exigence §4.2 « le caractère fictif de l'entreprise doit être explicite ».
- **Recherche du bon écran pour le hook visuel 3D**, plutôt que de capturer
  la page d'accueil par défaut. La page d'accueil ne montre aucune 3D ; le
  visualiseur (glisser pour pivoter, molette/pincement pour zoomer, bouton
  « Vue éclatée ») n'apparaît que sur une page produit individuelle
  (`/gammes/capteur`). Le poster de démo (`hero-preview.webp`) a été capturé
  sur cette page précise, cadré pour que le visualiseur occupe la moitié
  droite de l'image — la mission demande explicitement que « la 3D se
  montre, pas qu'elle se dise ».
- Aucune trace de panier/checkout sur le site : le parcours d'achat réel est
  une demande de devis (`/devis`), pas un panier. Le texte du chantier a été
  écrit pour rester conforme à ce qui est réellement observable (catalogue,
  tarif par produit, demande de devis) sans reprendre littéralement
  l'expression « e-commerce » de la mission d'une façon qui laisserait
  supposer un panier d'achat inexistant.

### Changements livrés

- `fd39663` — ui(projects): intégrer Ombrair — carte, page et démo live.
  - **Carte** : entrée `id: "05"` dans `src/data/projects.ts` (EN+FR
    complet), rendue par le même `ProjectShowcaseCard` que les quatre
    projets existants — aucun composant parallèle. Catégorie « Rapid Product
    Delivery » pour porter l'angle vitesse d'exécution / pilotage agentique
    imposé par la mission (§4.2).
  - **Page** : case study 4 sections (contexte, pipeline, preuve, ce que ça
    démontre) exploitée par `ProjectDetailModal` sans modification de sa
    structure — le champ `sourcePath` optionnel ajouté au cycle 024 sert de
    nouveau ici (aucun lien repo, Q3 tranchée).
  - **Démo** : `LiveDemoEmbed` réutilisé tel quel, iframe montée au clic vers
    `ombrair.vercel.app`. Poster capturé par Playwright sur la page produit
    du capteur (voir constats ci-dessus).
- `78c0d8f` — chore(ui-loop): purge des 8 `AUDIT-*.md` de plus de 24h
  (cycles 016-023), conformément à MISSION-UI.md §6.

### Vérification

- Build : ✅ (`npm run build` vert). `tsc --noEmit` : ✅ sans sortie.
- axe-core sur `#project-05` (démo iframe non chargée, état par défaut) en
  EN et en FR : **0 violation** dans les deux langues.
- Viewports vérifiés : **390 / 1440** en détail (captures, overflow), plus
  vérification visuelle du rendu de carte à 1440. **0 overflow horizontal**
  à 390px (`document.body.scrollWidth - window.innerWidth === 0`).
- Langues : FR ✅ EN ✅ — carte, case study (onglets Overview/Results/
  Links/Tech), légende de démo et libellés de lien capturés et lus dans les
  deux langues. Onglet « Links » vérifié : un seul lien affiché (« Open the
  live site » / « Ouvrir le site en ligne »), aucun lien repo fabriqué.
- reduced-motion : ✅ — aucune animation nouvelle introduite (composant
  identique à celui vérifié sous reduced-motion au cycle 024).
- Nav clavier : ✅ — `Tab` atteint le bouton de lancement de la démo,
  `Enter` monte l'iframe (vérifié : 1 iframe montée après l'appui), le lien
  de repli « ouvrir dans un nouvel onglet » de la légende reste atteignable
  au tabulateur.
- Régression détectée : non — carte et démo capturées côte à côte avec les
  projets 01-04 au même run, aucun changement visuel sur les cartes
  existantes.

### Reverté

- Aucun.

### État des chantiers structurels
- Vers l'Élysée : terminé (carte ✅ page ✅ démo ✅) — cycle 024.
- **Ombrair : terminé** (carte ✅ page ✅ démo ✅) — deuxième des trois
  chantiers §4, livré ce cycle.
- Analyse vidéo football : non commencé.
- Démos projets existants : 3/3 conformes, inchangé depuis cycle 024.

### Prochain cycle — point de reprise exact
- **Ouvrir « Analyse vidéo football » (§4.3) en chantier unique.** Troisième
  et dernier des trois chantiers §4, dans l'ordre imposé.
  1. Ce projet n'est **pas public** : aucun lien code, aucun lien démo live
     (contrairement à Vers l'Élysée et Ombrair). C'est une section
     d'**introduction** uniquement (démarche + ambition, pas un livrable
     fini) — donc pas de `LiveDemoEmbed` pour ce projet. Revoir la
     hiérarchie des formats de démo (§5) : la piste retenue par Q4
     (`QUESTIONS.md`, résolue 2026-09-12) est constituée de **schémas
     abstraits reconstruits** (diagramme de flux du pipeline, schéma de
     terrain stylisé, représentation conceptuelle du tracking) — jamais une
     capture TV ni un logo de club/compétition, jamais un visuel présenté
     comme une sortie réelle du pipeline.
  2. Prévoir explicitement, dans le code ou les données (`src/data/
     projects.ts` ou un composant dédié), un **emplacement documenté** où
     Axel pourra brancher les vrais exports du pipeline plus tard sans
     retoucher la mise en page — exigence structurelle de Q4, à ne pas
     oublier au moment d'écrire le composant.
  3. Angle éditorial imposé (§4.3) : positionner comme un travail de
     recherche **en cours** (atout, pas une excuse), assumer frontalement la
     contrainte CPU-only comme contrainte d'ingénierie.
  4. Faits vérifiés déjà disponibles dans MISSION-UI.md §4.3 (YOLOv8 +
     ByteTrack, homographie, interface Streamlit à 5 pages, clustering
     d'équipes, deux matchs réels Real Madrid–Dortmund et Swansea–Man City,
     piste de tracking persistant inter-segments en cours d'étude) — projet
     non public, donc pas de site à aller inspecter comme cela a été fait
     pour Ombrair ce cycle-ci ; s'en tenir strictement à ces faits, ne rien
     inventer au-delà.
  5. Une fois ce troisième chantier livré avec ses trois livrables, le §4
     de la mission sera intégralement traité ; le cycle suivant devra alors
     relire MISSION-UI.md en entier pour déterminer la nouvelle priorité
     (probablement un retour d'audit général zone prioritaire + reste du
     site, la zone basse restant P2 sauf régression).

### Questions bloquantes ouvertes
- Aucune (Q1-Q4 résolues le 2026-09-12, voir `QUESTIONS.md`).

---

## Cycle 024 — 2026-09-12 18:26

**Zone travaillée** : §4 — intégration de **Vers l'Élysée** (carte, page, démo).
Aucun chantier de la zone prioritaire (§3, désormais P2) n'a été ouvert,
conformément à la consigne de run reçue pour cette exécution.
**Rotation de questions** : non applicable — la rotation A-E porte sur la zone
prioritaire (§3) ; ce cycle est un chantier §4.

### Note de continuité — reprise d'un travail non journalisé

À l'ouverture du cycle, `git status` montrait 5 fichiers modifiés et 2 fichiers
non suivis (`src/data/projects.ts`, `src/OnePage.tsx`,
`src/components/build-mode/ProjectDetailModal.tsx`, `src/i18n/language.tsx`,
`src/index.css`, `src/components/LiveDemoEmbed.tsx`,
`public/projects/political-destiny/hero-preview.webp`) — un chantier Vers
l'Élysée quasi complet mais **jamais committé ni journalisé**, manifestement
issu d'une session précédente interrompue avant la phase 5/6. Conformément à
§0 (« un cycle non journalisé est un cycle perdu »), ce travail n'a jamais été
considéré comme acquis : il a été intégralement relu, vérifié à neuf (voir
Vérification ci-dessous) plutôt que recommencé, un vrai bug y a été trouvé et
corrigé, puis committé et journalisé dans ce cycle.

### Constats de vérification (tenant lieu d'audit pour ce chantier)

- Le travail repris respectait déjà les arbitrages tranchés le 2026-09-12
  (`QUESTIONS.md` Q2) : aucun lien repo, titre affiché « Vers l'Élysée »
  (jamais « political destiny »), ton neutre sur le contenu éditorial.
- **En-têtes HTTP revérifiés avant d'aller plus loin** (la note du cycle 023
  demandait explicitement de ne pas se fier à la vérification du cycle 003) :
  `curl -I https://political-destiny.vercel.app` → `200 OK`, aucun
  `X-Frame-Options` ni `Content-Security-Policy: frame-ancestors`. L'iframe
  live reste réalisable.
- **P1 trouvé pendant la vérification — contraste de la légende de démo sous
  le plancher.** axe-core relevait 1 violation `color-contrast` (serious) sur
  `.demo-embed-caption > span` une fois l'iframe chargée. Cause : la règle
  générique `.home-project-proof:not(.home-project-proof--carousel) span`
  (pensée pour l'étiquette d'aperçu du fallback `previewImage`, ligne ~1007
  d'`index.css`) matchait aussi le span de légende du nouvel embed — un `span`
  nu suffit — et écrasait sa couleur déclarée (`rgba(225,224,204,0.68)`,
  7,11:1 calculé) par la sienne (`0.48`, **4,00:1 mesuré** — sous 4,5:1 à
  10 px). Exactement le cas que §6 phase 6.5 nomme : « le CSS global mord
  souvent ». Corrigé par exclusion ciblée (`:not(.home-project-proof--embed)`
  sur la règle générique) plutôt que par `!important` ou une nouvelle guerre
  de spécificité ; la légende porte en plus sa propre classe
  (`.demo-embed-caption-text`) pour qu'une collision future soit moins facile.
- Bug additionnel trouvé et corrigé dans le code repris : `ProjectShowcaseCard`
  ne lisait que `links?.[0]` et l'étiquetait toujours « View repository ».
  JobTrackr (projet `02`), dont le premier lien est sa démo, affichait donc un
  bouton « View repository » pointant en réalité vers
  `jobtrackr-lake.vercel.app`, et son vrai lien GitHub n'était jamais montré —
  un défaut préexistant à ce cycle, révélé par la nécessité de distinguer
  `repoLink`/`demoLink` pour Vers l'Élysée (qui n'a que l'un des deux).
  Vérifié par capture : les deux boutons s'affichent maintenant correctement
  sur `#project-02`, avant/après aucune régression sur `#project-01`/`03`.

### Changements livrés

- `6e66d36` — ui(projects): intégrer Vers l'Élysée — carte, page et démo live.
  Un seul commit couvrant les trois livrables (le détail du chantier repris
  ne se découpait pas proprement en tranches indépendamment buildables — voir
  le message de commit pour le détail complet) :
  - **Carte** : entrée `id: "04"` dans `src/data/projects.ts` (EN+FR complet),
    rendue par le même `ProjectShowcaseCard`/`.home-project-*` que les trois
    projets existants — aucun composant parallèle.
  - **Page** : case study 4 sections (contexte, pipeline, preuve, ce que ça
    démontre) exploitée par `ProjectDetailModal` sans modification de sa
    structure, seulement l'ajout du masquage conditionnel de la ligne
    « source folder » quand `sourcePath` est absent (nouveau champ optionnel).
  - **Démo** : nouveau composant `LiveDemoEmbed` — iframe montée au clic
    uniquement (jamais au chargement, budget LCP/CLS préservé), poster
    (`hero-preview.webp`, capturé pour ce chantier) + légende avec repli
    « ouvrir dans un nouvel onglet » si l'iframe ne charge jamais.
  - Le fix `repoLink`/`demoLink` et le fix de contraste ci-dessus.

### Vérification

- Build : ✅ (`npm run build` vert après le fix de contraste — CSS 96,60 →
  **96,75 kB**, JS **658,53 kB**). `tsc --noEmit` : ✅ sans sortie.
- axe-core sur `#project-04` avec l'iframe chargée : **0 violation** après le
  fix (1 `color-contrast` serious avant). axe-core pleine page après scroll
  complet : **3 violations, strictement identiques aux cycles 001-023**
  (`aria-prohibited-attr`, `landmark-unique`, `region`), aucune nouvelle.
- Viewports vérifiés : **390 / 768 / 1024 / 1920** (overflow horizontal +
  taille du bouton de lancement) et **390/1440** en détail (captures,
  clic clavier/souris). **0 overflow horizontal**, bouton de lancement
  **190 × 44 px** aux 4 largeurs.
- Langues : FR ✅ EN ✅ — carte, case study, légende de démo et libellés de
  lien capturés et lus dans les deux langues, aucun texte orphelin.
- reduced-motion : ✅ — 0 erreur, l'embed n'anime rien (montage au clic est un
  changement d'état, pas une transition).
- Nav clavier : ✅ — bouton de lancement focusable, anneau `:focus-visible`
  peint, activation au clavier (`Enter`) monte bien l'iframe ; le lien
  « ouvrir dans un nouvel onglet » de la légende est atteignable au tabulateur.
- Régression détectée : non, après le fix repoLink/demoLink — vérifié par
  capture sur `#project-01`/`#project-02`/`#project-03` qu'aucun lien
  n'a disparu ou changé d'étiquette par erreur (le seul changement visible est
  la correction sur `#project-02`, décrite ci-dessus).

### Reverté

- Aucun.

### Leçon d'outillage du cycle (la huitième de la série 017-024)
- **Un travail repris sans son auteur d'origine ne doit jamais être committé
  sur la seule confiance qu'il "a l'air fini".** Le code trouvé au démarrage
  du cycle était visuellement complet et bien écrit, mais n'avait jamais
  traversé la phase 6 : le rejouer intégralement (axe-core, contraste mesuré,
  clavier, 4 viewports, régression sur les projets existants) a trouvé un vrai
  P1 (contraste sous plancher) et un vrai bug préexistant sur un projet
  distinct (JobTrackr). Corollaire : un `git status` sale en ouverture de
  cycle n'est pas une anomalie à ignorer ni un chantier à écraser — c'est un
  travail en attente de vérification, à traiter avec la même rigueur qu'un
  travail qu'on vient d'écrire soi-même.
- Rappel des sept précédentes : 017 « une mesure prise pendant un `transform`
  ne mesure pas le CSS » ; 018 « une capture prise avant un reveal ne mesure
  pas le rendu » ; 019 « un élément `fixed` dans une capture d'élément haute
  n'est pas là où le visiteur le voit » ; 020 « les quatre viewports de
  référence laissent un angle mort entre 1024 et 1440 » ; 021 « un instrument
  qui ne sait pas lire une valeur ne le dit pas : il rend un résultat plus
  propre » ; 022 « deux instruments du même cycle ne doivent pas avoir deux
  définitions de "le lecteur le regarde" » ; 023 « un chantier dont la preuve
  est un comportement ne peut pas être documenté par une capture statique ».

### État des chantiers structurels
- **Vers l'Élysée : terminé** (carte ✅ page ✅ démo ✅) — premier des trois
  chantiers §4, livré ce cycle.
- Ombrair : non commencé (iframe vérifiée réalisable cycle 003, en-têtes à
  revérifier avant implémentation — la leçon de ce cycle s'applique aussi :
  ne pas se fier à une vérification de cycle 003 sans la rejouer).
- Analyse vidéo football : non commencé.
- Démos projets existants : 3/3 conformes, **et un vrai bug corrigé au
  passage** (libellé de lien JobTrackr, voir ci-dessus).

### Prochain cycle — point de reprise exact
- **Ouvrir « Ombrair » (§4.2) en chantier unique.** Deuxième des trois
  chantiers §4, dans l'ordre imposé — ne pas toucher à la zone basse ni à
  l'analyse vidéo football tant qu'Ombrair n'a pas ses trois livrables.
  1. Revérifier d'abord les en-têtes : `curl -I https://ombrair.vercel.app`
     (vérifié `200 OK` sans en-tête bloquant au cycle 003, à rejouer avant
     d'implémenter — ne pas supposer que l'en-tête n'a pas changé).
  2. Lire les conventions déjà en place dans `src/data/projects.ts` (entrée
     `id: "04"`, ce cycle) et `src/OnePage.tsx` (`ProjectShowcaseCard`,
     `LiveDemoEmbed`) pour intégrer Ombrair au même système — carte `id: "05"`,
     même composant de démo si l'iframe est réalisable.
  3. Angle éditorial imposé (§4.2) : vitesse d'exécution et pilotage
     agentique, caractère fictif de l'entreprise explicite, la 3D comme hook
     visuel **montré** (poster/capture le mettant en avant), pas seulement
     décrit. Aucun lien repo (Q3 tranchée).
  4. Le poster de démo doit être une vraie capture du site déployé (comme
     `hero-preview.webp` pour Vers l'Élysée) — à produire par capture
     Playwright du site déployé, jamais une image inventée.
- Note d'outillage : `.home-project-proof:not(.home-project-proof--carousel)
  span` (index.css ~ligne 1007) est une règle générique qui matche tout `span`
  nu descendant d'un `.home-project-proof` autre que carousel/embed. Toute
  nouvelle variante de `.home-project-proof--*` qui rendrait un `span` avec sa
  propre couleur devra soit l'exclure dans le `:not()`, soit lui donner une
  classe dédiée — sinon la collision de ce cycle se reproduit silencieusement.

### Questions bloquantes ouvertes
- Aucune. Q1-Q4 restent résolues (voir `QUESTIONS.md`).

---

## Cycle 023 — 2026-09-12 15:10

**Zone travaillée** : zone prioritaire (§3) — `#capabilities` (`.card-link` vers
les slides projets), `#about` (chapo). Ainsi que, hors zone, un chantier de
gouvernance : réorientation de `MISSION-UI.md` (§3/§4/§6). Conformément à la
consigne de run reçue pour cette exécution, la priorité §4 est désormais P0
pour les cycles suivants ; ce cycle-ci clôt le travail de zone déjà audité et
implémenté avant la réorientation.
**Rotation de questions** : **D — Crédibilité** (précédentes : D, E, D, A, B,
C, D, E, B, A, C → **D**). D avait servi au cycle 018, avant les reprises du
contraste (018 lui-même sur d'autres axes), du rythme (020), de la hiérarchie
(021) et du mouvement (022) : ses trois questions se reposaient sur une zone
qui n'avait plus d'écart mesuré ouvert sur ces quatre axes.

**Note de continuité** : le travail décrit ci-dessous (audit, outillage,
implémentation, réorientation de la mission) a été exécuté avant cette entrée
de journal, dans le prolongement direct du cycle 022 — voir les commits
listés plus bas, tous horodatés avant celle-ci. Cette entrée ferme la phase 7
(JOURNALISER) qui n'avait pas encore été écrite : un cycle non journalisé est
un cycle perdu (§0), donc rien n'est considéré comme acquis tant que cette
entrée n'existe pas. Les phases 6 (VÉRIFIER) ci-dessous ont été rejouées dans
cette session, sur l'arbre de travail actuel, et non simplement recopiées des
commits.

### Outillage ajouté
`scripts/ui-evidence-probe.mjs` (rotation D) : ratio affirmation/preuve par
bloc sémantique, résolution réelle de chaque ancre interne de la zone depuis
le bas de page, écart de finition vitrine/zone. Contrôle de couverture
d'abord (leçon du cycle 021) : `#about` 352, `#capabilities` 35, `#contact` 9,
`.site-footer` 6 nœuds — identiques aux cycles 021-022, aucun nœud sauté.
Une première version comptait les affirmations sur les **feuilles** du DOM et
donnait « `#about` = 2 affirmations, 30 caractères » — le bloc le moins
déclaratif de la page alors qu'il porte 537 caractères d'assertion, parce que
`AnimatedLetter`/`WordsPullUpMultiStyle` le découpent en spans d'un caractère
ou d'un mot. Corrigé avant tout diagnostic : comptage sur les blocs
sémantiques, jamais sur les feuilles.

Étendu ce cycle, en phase de vérification/galerie : `scripts/ui-gallery.mjs`
gagne un mode `click:<href>` — scroll en bas de page, clic réel sur le lien,
attente de stabilisation de `scrollY`, puis capture du viewport. Nécessaire
parce que le chantier D-1 est un bug de *destination*, invisible dans le
rendu statique d'une section : sans ce mode, la galerie aurait montré deux
captures identiques de `#capabilities` et revendiqué une correction que
personne ne peut voir. Avec, la paire AVANT/APRÈS montre littéralement le
clic atterrir sur le mauvais projet puis sur le bon, sur l'arbre de travail
réel aux deux révisions — aucune image fabriquée à la main.

### Constats d'audit
Audit complet dans `docs/ui-loop/AUDIT-2026-09-12-cycle-023.md`. Résumé :
- **D-1 / P1 — les liens de preuve de `#capabilities` n'atterrissaient pas sur
  la preuve annoncée.** 4 des 8 combinaisons desktop (1440/1920 × EN/FR)
  étaient fausses de façon déterministe : cliquer « See Football Data
  Pipeline » depuis le bas de page affichait Retirement Sustainability Model.
  Cause mesurée : `.home-project-step` passe en `position: sticky` dès
  1024px, Chromium rapporte la boîte décalée d'un élément sticky, et une fois
  le lecteur passé sous l'empilement les trois slides déclarent le même
  `offsetTop` — les trois ancres deviennent la même destination, et c'est le
  z-index le plus haut qui s'affiche. En dessous de 1024, la croissance du
  document pendant le saut produisait un comportement non déterministe plutôt
  que faux (390/768 : 4 combinaisons non fiables, pas fausses).
- **D-2 / P1 — `#about` était le seul bloc de toute la page à affirmer sans
  offrir un seul geste de vérification.** Inventaire affirmation/preuve,
  1440 EN : `#selected-work` 67 blocs / 8 liens / 4 médias ; `#about` **3
  blocs / 0 lien / 0 média** ; `#capabilities` 22/4/0 ; `#contact` 3/2/0 ;
  footer 1/3/0. L'affirmation centrale du bloc (« a data profile shaped by
  field experience ») a déjà une preuve en ligne et vérifiée
  (`/cv#experience`, déjà utilisée par la carte 01 de Capabilities) ; `#about`
  ne la reliait à rien.
- **D-3 — écart de finition vitrine/zone : mesuré, refermé.** Le diagnostic
  de départ de §3 était juste aux cycles 001-015, plus sur les axes déjà
  repris (finition d'exécution : 3 violations axe-core identiques aux cycles
  001-022, 0 overflow, 0 erreur console ; fin de page : état livré aux cycles
  019-021, tient). Écart résiduel légitime : densité de preuve (une section de
  compétences n'est pas une galerie). Aucun chantier ouvert sur D-3.
- Fermé sans code : le profil GitHub de la carte 04 (`AxelCorral` → 200),
  `/cv#experience` (atterrit juste), aucune métrique inventée dans la zone.

### Changements livrés
- `3727306` / `493805a` / `abc9949` — reportés du cycle 022 (déjà journalisés).
- `1961935` — ui(capabilities): faire atterrir les liens de preuve sur la
  preuve annoncée. `scrollToId()` résout la position de flux en neutralisant
  `position` le temps d'une lecture synchrone puis retranche l'offset sticky.
  Reste une vraie ancre (clic milieu, nouvel onglet, sans-JS inchangés).
  Après : 0 échec sur 32 (16 combinaisons × 2 liens), titre cible en vue à
  187-250px du haut à toutes les largeurs.
- `9f9b57e` — ui(about): relier l'affirmation d'ouverture de la zone à sa
  preuve. Lien `/cv#experience` ajouté sous le paragraphe de soutien, idiome
  `.card-link` déjà établi par la zone (texte + flèche, 44px), aligné au bord
  gauche du chapo. Aucune donnée nouvelle : le chaînon manquant entre une
  affirmation et une preuve déjà en ligne.
- `1cff436` — réorientation de `MISSION-UI.md` : §3 (zone basse) passe en P2
  maintenance, §4 (Vers l'Élysée / Ombrair / analyse vidéo football) devient
  P0 unique, plafond de retouche de 3 passes par section instauré (sections
  déjà gelées : `#capabilities` 9/3, `#about` 6/3, footer 5/3, zone/sections
  5/3 ; `language-toggle` 2/3, `#contact` 1/3, `nav` 1/3). Q1-Q4 tranchées par
  Axel et appliquées : URL LinkedIn réelle ajoutée à `contactLinks` ; Vers
  l'Élysée et Ombrair en démo live sans lien repo ; football en schémas
  abstraits avec emplacement réservé documenté. Hygiène : `.tmp-*` et
  `scripts/.tmp/` ignorés, audits >24h purgés (cycles 001, 002), règle inscrite
  dans les garde-fous.
- Ce cycle (journalisation) — `scripts/ui-gallery.mjs` : mode `click:<href>`
  ajouté pour documenter honnêtement D-1 (voir Outillage ci-dessus).

### Vérification
- Build : ✅ (`npm run build` vert sur l'arbre de travail actuel, rejoué dans
  cette session — `tsc -b && vite build`). CSS **94.92 kB**, JS **645.98 kB**
  (le lien `/cv#experience` d'`#about` et `scrollToId`/`ScrollProvider`
  ajoutent le delta depuis le cycle 022). `tsc --noEmit` : ✅ sans sortie.
- Vérification comportementale rejouée dans cette session (Playwright, script
  ad hoc, 1440) : clic sur `a[href="#project-01"]` depuis le bas de page
  atterrit sur `#project-01` (confirmé par `elementFromPoint` au centre du
  viewport) ; le lien `a[href="/cv#experience"]` d'`#about` est bien présent
  dans le DOM après scroll en bas de page.
- Viewports vérifiés à la génération de la galerie : 390 / 1440, capture
  réelle sur l'arbre de travail courant (APRÈS) et sur un worktree détaché aux
  révisions `305122d` (AVANT de D-1) et `1961935` (AVANT de D-2) — jamais une
  capture recyclée d'un autre cycle.
- Langues : EN vérifiée par capture et par le check comportemental ci-dessus ;
  FR non re-testée dans cette session (déjà vérifiée par l'audit cycle 023
  avant journalisation, 8/8 combinaisons documentées dans
  `AUDIT-2026-09-12-cycle-023.md`).
- reduced-motion : non re-testé dans cette session ; aucun des deux chantiers
  n'introduit d'animation (un fix de résolution d'ancre et un lien statique).
- Régression détectée : non — `npm run build` et `tsc --noEmit` verts, et les
  deux chantiers ne touchent aucun sélecteur partagé hors de leur périmètre
  (`scrollToId` est un nouveau module, `.card-link` est réutilisé tel quel).

### Reverté
- Aucun.

### Leçon d'outillage du cycle (la septième de la série 017-023)
- **Un chantier dont la preuve est un comportement (une destination de clic)
  ne peut pas être documenté par une capture statique de la section** : la
  section `#capabilities` est pixel pour pixel identique avant et après D-1,
  puisque le bug vivait dans la résolution de l'ancre, pas dans le rendu. La
  galerie a donc gagné le mode `click:<href>` plutôt que de laisser ce
  chantier sans preuve visuelle, ou pire, de lui en fabriquer une à la main.
  Corollaire : avant de choisir les `--sections=` d'un chantier, vérifier
  d'abord *où* vit la preuve — dans le style d'un élément, ou dans ce qui se
  passe quand on interagit avec lui.
- Rappel des six précédentes : 017 « une mesure prise pendant un `transform`
  ne mesure pas le CSS » ; 018 « une capture prise avant un reveal ne mesure
  pas le rendu » ; 019 « un élément `fixed` dans une capture d'élément haute
  n'est pas là où le visiteur le voit » ; 020 « les quatre viewports de
  référence laissent un angle mort entre 1024 et 1440 » ; 021 « un instrument
  qui ne sait pas lire une valeur ne le dit pas : il rend un résultat plus
  propre » ; 022 « deux instruments du même cycle ne doivent pas avoir deux
  définitions de "le lecteur le regarde" ».

### État des chantiers structurels
- Vers l'Élysée : non commencé (iframe vérifiée réalisable cycle 003)
- Ombrair : non commencé (iframe vérifiée réalisable cycle 003)
- Analyse vidéo football : non commencé
- Démos projets existants : 3/3 conformes (inchangé depuis cycle 003)

### Prochain cycle — point de reprise exact
- **La zone prioritaire (§3) passe en P2 à partir de ce cycle** (voir
  `MISSION-UI.md` §3, réorientation du 2026-09-12) : ne plus y ouvrir de
  chantier de sa propre initiative, seulement régression/bug bloquant/violation
  d'accessibilité mesurée/raccord imposé par un chantier §4.
- **Ouvrir « Vers l'Élysée » (§4.1) au prochain cycle, en chantier unique.**
  C'est désormais le seul P0. Livrables attendus, dans l'ordre : carte projet
  dans `.work-grid`/`ProjectShowcaseCard` (lire d'abord les conventions dans
  `OnePage.tsx`), page ou vue détaillée, section démo en iframe live vers
  `political-destiny.vercel.app` (en-têtes vérifiés cycle 003 : `200 OK`,
  aucun `X-Frame-Options` ni `frame-ancestors` — à revérifier avant
  implémentation, un en-tête peut changer). Titre affiché « Vers l'Élysée »
  (jamais « political destiny »), ton neutre imposé (sujet politique, §4.1),
  angle « démarche de modélisation » (hypothèses → modèle → audit →
  contrefactuels), **aucun lien repo** (Q2 tranchée). Ne pas ouvrir Ombrair ni
  football tant que Vers l'Élysée n'a pas ses trois livrables.
- Notes d'outillage pour ce chantier : (1) le sélecteur de langue escamotable
  recouvre la zone en `position: fixed` — vérifier que son
  `pointer-events: none` à l'état escamoté ne mange pas un clic destiné à
  l'iframe. (2) Échantillonner la bande 1024-1280, pas seulement 768/1440
  (leçon cycle 020). (3) Toute nouvelle ancre interne dans les slides projets
  doit utiliser `scrollToId()` (nouveau depuis ce cycle), pas
  `scrollIntoView()` ni le saut natif du navigateur, si elle peut être visée
  depuis sous l'empilement sticky.

### Questions bloquantes ouvertes
- Aucune. Q1-Q4 résolues et appliquées (voir `QUESTIONS.md` et le commit
  `1cff436` ci-dessus).

---

## Cycle 022 — 2026-09-12 09:55

**Zone travaillée** : zone prioritaire (§3) uniquement — `.about-title` et
`#work-title` (masque de révélation), `#about` (cascade du titre),
`.work-grid` / `.capability-card` (entrée des cartes). Conformément à la consigne
de run, les trois chantiers sont dans la zone ; aucun chantier §4/§5 n'a été
ouvert.
**Rotation de questions** : **C — Mouvement** (précédentes : D, E, D, A, B, **C**,
D, E, B, A → **C**). C n'avait pas resservi depuis le cycle 017, soit avant tout
le travail des cycles 018-021 sur le contraste, le rythme et la hiérarchie de la
zone : ses trois questions se reposent sur un état entièrement différent.

### Outillage ajouté

`scripts/ui-motion-probe.mjs`, plus `scripts/lib/probe-color.js` — les helpers
couleur étalonnés au cycle 021 (conversion `oklch()`/`oklab()` → sRGB) sortis en
**un seul exemplaire**, injecté par `addInitScript`, pour que deux probes ne
puissent plus diverger sur la valeur d'un pixel.

Le probe traite une animation comme ce qu'elle est — un **intervalle**, pas un
état — et mesure donc des durées :

- `msToFull` : temps, après l'entrée d'une section dans la bande de lecture,
  jusqu'à ce qu'un nœud soit peint plein (échantillonnage à 50 ms).
- `msUnderFloor` : temps passé **à l'écran** sous le plancher de 4,5:1 de §6.
- `deepJump` : saut instantané en bas de page — le cas où un reveal accroché à un
  `IntersectionObserver` peut légitimement ne jamais se déclencher.
- `clipping` : toute boîte `overflow: hidden` de la zone dont le contenu ne tient
  pas dedans. Un masque de révélation est invisible jusqu'à ce qu'il coupe une
  lettre.

L'opacité mesurée est l'**opacité effective** (produit de toute la chaîne
d'ancêtres), et le contraste est recalculé sur la couleur réellement composée à
cette opacité. Contrôle de couverture fait avant toute lecture de chiffre, comme
le cycle 021 l'exigeait : `#about` **352**, `#capabilities` **35**, `#contact`
**9**, `.site-footer` **6** — identiques aux références du cycle 021, aucun nœud
sauté.

### Ce que la rotation C ferme sans une ligne de code

- **Aucun contenu invisible si une animation ne se déclenche pas.** `deepJump` =
  **0 nœud** sur les 16 combinaisons (4 viewports × 2 langues × 2 modes de
  mouvement), avant comme après. C'est la question la plus grave de la rotation,
  et elle est close par la mesure.
- **`reduced-motion` est intégralement propre** : 0 nœud sous opacité 1 à
  n'importe quelle position de scroll, 0 nœud sous 4,5:1, **0 style inline
  d'animation** (`0/634` contre `411/634` en mode normal). Le runtime ne touche
  littéralement plus rien.
- **`#contact` et `.site-footer` n'ont aucune animation d'entrée** (`maxToFull`
  ≈ 60 ms, le temps d'un échantillon). Ce n'est pas un oubli à combler : §2
  rotation C demande de supprimer l'animation qui n'apporte rien, pas d'en
  ajouter. Rien à faire, et c'est écrit ici pour que le prochain cycle ne le
  « corrige » pas.

### Constats d'audit

Audit complet dans `docs/ui-loop/AUDIT-2026-09-12-cycle-022.md`. Résumé :

- **C-1 / P1 — le masque de révélation coupait les jambages des deux titres
  d'affichage de la zone.** Les boîtes de mot de `WordsPullUpMultiStyle` sont des
  items flex, donc blockifiées : `overflow: hidden` s'y applique réellement, et
  leur hauteur est la boîte de ligne — `line-height: 0.98` sur `.about-title`,
  **0,92** sur `.home-section-heading h2`, toutes deux plus courtes que l'encre
  qu'elles portent.

  | titre | corps | boîte de ligne | encre | coupé |
  | --- | --- | --- | --- | --- |
  | `.about-title` romain | 72 px | 70,56 | 75 | **4 px** |
  | `.about-title` **serif italique** | 72 px | 70,56 | **81** | **10 px** |
  | `#work-title` | 86,4 px | 79,49 | 87 | **8 px** |

  **31 boîtes coupées en EN, 36 en FR**, aux 4 viewports — c'est-à-dire *tous*
  les mots des deux titres. Vérifié non pas sur la boîte mais sur les **pixels
  peints** : même capture de l'élément avec le seul `overflow` relevé à
  `visible`, puis différence pixel à pixel — **2 424 px** sur `.about-title`
  (delta max **207**/255) et **307 px** sur `#work-title` (delta **219**). Un
  delta de 207 n'est pas un liseré d'antialiasing, c'est de l'encre pleine, et le
  diff localise chaque marque exactement sous un jambage : *profile*, *shaped*,
  *by*, *experience*, *pipelines*, *reporting*, *systems*, *quantitative*,
  *analysis*, *strong*, *clarity*.

  Trois choses en faisaient un défaut et pas une image d'animation : il est
  **permanent** (le masque reste après la fin du mouvement) ; il **survivait à
  `reduced-motion`** (31 boîtes coupées sous `reduce` aussi, où aucune
  translation n'a jamais lieu — le lecteur qui coupe le mouvement payait tout le
  prix du masque sans jamais en voir l'effet) ; et **le masque ne masquait rien**
  (20 px de translation dans une boîte de 71 à 79 px laissent le mot visible aux
  trois quarts). La zone avait, une fois de plus, **deux définitions d'un même
  geste** : `WordsPullUp` en `overflow-visible`, son jumeau
  `WordsPullUpMultiStyle` en `overflow-hidden`.

- **C-2 / P1 — la durée d'un titre était fonction du nombre de mots de sa
  phrase.** Délai `index × 0,045 s` sans plafond ; le titre d'`#about` fait
  **26 mots**. Ses derniers mots — la charge utile de la proposition, « with a
  strong focus on clarity. » — atteignaient la peinture pleine **2 177 à
  2 449 ms** après l'entrée du bloc dans la bande de lecture, et passaient jusqu'à
  **247 ms à l'écran à 1,00:1** : pas atténués, absents, alors qu'ils occupaient
  déjà leur place. Le titre de `#capabilities`, 5 mots dans le même composant
  avec la même easing : 1 279 ms. Seule la longueur de la phrase changeait le
  résultat.

- **C-3 / P1 — la quatrième carte restait sous le plancher de contraste 727 ms.**
  À 1440 la grille fait 4 colonnes : les quatre cartes entrent **ensemble**, le
  décalage n'ordonne donc aucun parcours de lecture, il fait attendre. Avec
  0,15 s de décalage et 0,65 s de durée, la carte `04` démarrait 450 ms après la
  `01` et finissait 1 100 ms après elle. Mesure : **22 des 28 nœuds de texte de
  la grille sous 4,5:1 pendant qu'ils sont déjà à l'écran**, pire dwell **727 ms**
  (1440 EN) et **717 ms** (1920 EN), dernier nœud peint plein à **1 801 ms**. Le
  cycle 021 a porté ce même numéro de carte de 3,47:1 à 4,94:1 au titre d'un
  **P0** : le plancher de §6 doit tenir en mouvement aussi, pas seulement au
  repos.

### Changements livrés

- `abc9949` — ui(zone): rendre aux deux titres de la zone leurs jambages.
  `overflow-hidden` → `overflow-visible` dans `WordsPullUpMultiStyle`, soit la
  définition de révélation **déjà en place dans le projet** (`WordsPullUp`) au
  lieu d'en maintenir deux. Après : **0 boîte coupée** aux 16 combinaisons,
  **0 pixel** de différence masqué/démasqué sur les deux titres, hauteur
  d'élément inchangée au pixel (1920 × 848 avant et après).
- `493805a` — ui(zone): plafonner la cascade des titres au lieu de la laisser
  suivre la phrase. `cascadeStep(count)` borne la fenêtre de cascade à **0,45 s**.
  Un titre court garde son pas plein de 0,045 s : le hero (« Axel Corral », 2
  mots) et `#capabilities` (5 mots) sont inchangés au millième.
- `3727306` — ui(capabilities): tenir le plancher de contraste pendant l'entrée
  des cartes. 0,45 s de durée et 0,08 s de pas au lieu de 0,65 et 0,15.

### Vérification

- Build : ✅ (`npm run build` vert avant chacun des trois commits). `tsc --noEmit`
  : ✅ sans sortie. CSS **94,80 kB** inchangé ; JS 644,68 → **644,77 kB** (+90 o :
  la fonction `cascadeStep` et ses gardes).
- **Instrument recalibré en cours de cycle, et les mesures refaites en entier.**
  La première version du probe déclarait « à l'écran » tout nœud tel que
  `rect.top < innerHeight && rect.bottom > 0`, là où son propre échantillonneur
  de balayage utilisait la bande de lecture (10 %-90 %). Conséquence : une carte
  dépassant de 20 px au bas du pli comptait comme lue, alors que son reveal
  n'avait **légitimement** pas démarré (`margin: "-100px"`), et le probe lui
  facturait toute la fenêtre de mesure — 1 374 ms à 768 et 1 532 ms à 1 920, sur
  des nœuds dont le `msToFull` était `null`. Prédicat unifié, puis **AVANT et
  APRÈS intégralement remesurés** sur les 16 combinaisons, l'état AVANT
  reconstruit en restaurant les deux fichiers à `fc0e89c` et en rebâtissant.
  Aucun chiffre de ce journal ne vient de la version fautive.
- Viewports vérifiés : **390 / 768 / 1440 / 1920** × 2 langues × 2 modes de
  mouvement = **16 combinaisons** pour le probe de mouvement, 10 pour l'audit de
  zone. **0 overflow horizontal**, **0 erreur console ou page**.
- Langues : FR ✅ EN ✅ (aucun texte ajouté ni modifié ; chaque mesure prise
  séparément dans les deux langues).
- reduced-motion : ✅ — 8 runs sous `reduce`, 0 nœud sous opacité 1, 0 style
  inline d'animation, **0 boîte coupée** (contre 31/36 avant : le chantier C-1
  profite d'abord aux lecteurs qui ont coupé le mouvement).
- Nav clavier : ✅ — parcours **Tab pur** à 1440 EN, 390 FR et 1440 EN sous
  `reduce` : **11 arrêts dans la zone, tous ≥ 44 × 44 px, anneau de focus peint
  et `:focus-visible` confirmé sur les 11**. Identique au cycle 021.
- axe-core : **3 violations, strictement identiques aux cycles 001 à 021**
  (`aria-prohibited-attr`, `landmark-unique`, `region`), toutes hors zone.
- Hiérarchie (non-régression du cycle 021) : niveaux typographiques **4 / 7 / 5 /
  4** et **0 nœud statique sous 4,5:1**, aux 8 combinaisons — inchangés. Le
  passage à `overflow-visible` ne déplace ni une ligne ni un ton.
- **Mesures avant/après** (probe recalibré, `worst` = pire temps passé à l'écran
  sous 4,5:1 ; `maxToFull` = dernier nœud peint plein) :

  | | AVANT | APRÈS |
  | --- | --- | --- |
  | boîtes coupées par un masque (EN / FR, tous viewports) | **31 / 36** | **0 / 0** |
  | pixels d'encre retirés par le masque (`.about-title` / `#work-title`) | **2 424 / 307** | **0 / 0** |
  | `.about-title` — nœuds sous 4,5:1 à l'écran (390/768/1440/1920, EN) | 8 / 5 / 0 / 6 | **0 / 0 / 0 / 0** |
  | `.about-title` — pire dwell sous plancher (EN) | 247 / 184 / 0 / 236 ms | **0 ms partout** |
  | `.about-title` — dernier mot peint plein (EN) | 2 312 / 2 219 / 2 177 / 2 221 ms | **1 631 / 1 540 / 1 499 / 1 551 ms** |
  | `.about-title` — dernier mot peint plein (FR) | 2 449 / 2 341 / 2 339 / 2 315 ms | **1 670 / 1 536 / 1 475 / 1 545 ms** |
  | `.work-grid` — nœuds sous 4,5:1 à l'écran (1440 / 1920, EN) | **22 / 25** | **18 / 21** |
  | `.work-grid` — pire dwell, numéro de carte `04` (1440 / 1920, EN) | **727 / 717 ms** | **449 / 436 ms** |
  | `.work-grid` — dernier nœud peint plein (1440 / 1920, EN) | 1 801 / 1 798 ms | **1 480 / 1 438 ms** |
  | `#capabilities` — pire dwell à 768 (EN / FR) | 386 / 384 ms | **230 / 172 ms** |
  | `#contact` et `.site-footer` | aucune animation | inchangés |
  | contenu invisible au saut direct en bas de page | 0 nœud | 0 nœud |

  **Réserve d'honnêteté sur C-3** : le résidu n'est pas nul et il est structurel.
  Tout fondu qui part de `opacity: 0` traverse forcément tous les contrastes
  entre 1:1 et son contraste de repos ; 18 nœuds de la grille restent brièvement
  sous le plancher. Le porter à zéro demanderait un plancher d'opacité d'environ
  **0,84** sur `text-gray-400` (14 px, 6,17:1 au repos) — c'est-à-dire renoncer au
  fondu et ne garder que la translation. C'est un arbitrage de direction
  artistique, pas une correction de mesure : il est consigné au backlog en P2 avec
  son calcul, pour être tranché par un cycle qui aura aussi la mesure de coût par
  image.

### Reverté
- Aucun.

### Leçon d'outillage du cycle (la sixième de la série 017-022)
- **Deux instruments du même cycle ne doivent pas avoir deux définitions de « le
  lecteur le regarde ».** Le probe de mouvement embarquait deux prédicats de
  visibilité — la bande de lecture 10 %-90 % dans l'échantillonneur de balayage,
  le simple chevauchement dans le chronomètre. Le second facturait 1 532 ms de
  texte « illisible » à des cartes dont la révélation n'avait pas encore le droit
  de démarrer. Le symptôme n'était pas une erreur : c'était **un chiffre plus
  grave que la réalité**, dans le sens opposé au biais du cycle 021 (un chiffre
  plus flatteur), ce qui montre qu'un instrument mal calibré ne penche pas
  toujours du même côté. Corollaire opérationnel : quand deux mesures d'un même
  probe ne concordent pas, c'est d'abord le probe qu'il faut lire, pas la page.
- Corollaire de recette, appris sur la galerie : `ui-gallery.mjs` appelle
  `scrollIntoViewIfNeeded()` **avant** de caler la cible, donc le `--settle`
  demandé ne compte pas à partir du début de l'animation. Quatre essais ont été
  nécessaires pour obtenir une paire AVANT/APRÈS où la cascade des cartes est
  encore visible ; les trois premières paires montraient deux images identiques,
  c'est-à-dire une preuve nulle. Consigné au backlog (mode `--freeze-at`).
- Rappel des cinq précédentes : 017 « une mesure prise pendant un `transform` ne
  mesure pas le CSS » ; 018 « une capture prise avant un reveal ne mesure pas le
  rendu » ; 019 « un élément `fixed` dans une capture d'élément haute n'est pas
  là où le visiteur le voit » ; 020 « les quatre viewports de référence laissent
  un angle mort entre 1024 et 1440 » ; 021 « un instrument qui ne sait pas lire
  une valeur ne le dit pas : il rend un résultat plus propre ».

### État des chantiers structurels
- Vers l'Élysée : non commencé (iframe vérifiée réalisable cycle 003)
- Ombrair : non commencé (iframe vérifiée réalisable cycle 003)
- Analyse vidéo football : non commencé
- Démos projets existants : 3/3 conformes (inchangé depuis cycle 003)

### Prochain cycle — point de reprise exact
- **Premier réflexe** : relancer `node scripts/ui-motion-probe.mjs --tag=check` et
  vérifier **d'abord** le nombre de nœuds mesurés par section (`#about` 352 EN /
  373 FR, `#capabilities` 35 / 37, `.work-grid` 28, `#contact` 9), puis que
  `clipping` et `deepJumpDim` valent toujours **0** aux 16 combinaisons. Un
  `clipping` qui remonte = un masque réintroduit quelque part.
- **Ouvrir « Vers l'Élysée » (§4.1)** en chantier principal — premier P1 de
  l'ordre imposé, reporté depuis les cycles 017, 019, 020, 021 et 022 au profit
  de la zone prioritaire, laquelle n'a plus d'écart mesuré ouvert sur la
  hiérarchie, le rythme, les mesures de lecture, les cibles tactiles, le
  contraste **ni le mouvement**. Lire d'abord les conventions de carte projet
  dans `OnePage.tsx` (liste `.home-project-*`, `ProjectShowcaseCard`,
  `ProjectDetailModal`) pour s'y intégrer sans créer un pattern parallèle, puis
  carte projet + vue détail + démo iframe vers `political-destiny.vercel.app`
  (en-têtes vérifiés cycle 003 : `200 OK`, aucun `X-Frame-Options` ni
  `frame-ancestors`). Ton neutre imposé, angle « démarche de modélisation »,
  titre affiché « Vers l'Élysée » (jamais « political destiny »), pas de lien
  repo tant que Q2 n'est pas tranchée.
- Si un chantier de zone est encore exigé par la consigne de run, le prochain
  candidat chiffré est l'arbitrage de plancher d'opacité des cartes (backlog P2,
  calcul déjà posé), qui demande d'abord une mesure `longtask` par image.

### Questions bloquantes ouvertes
- Aucune nouvelle. Q1 (URL LinkedIn), Q2 et Q3 (repos GitHub Vers l'Élysée /
  Ombrair), Q4 (assets du projet vidéo football) restent ouvertes — voir
  `QUESTIONS.md`. Aucune n'a bloqué ce cycle.

---

## Cycle 021 — 2026-09-12 07:10

**Zone travaillée** : zone prioritaire (§3) uniquement — `#about` (kicker),
`#capabilities` (numéro de carte), `.site-footer` (ordre tonal). Conformément à
la consigne de run, les trois chantiers sont dans la zone ; aucun chantier §4/§5
n'a été ouvert.
**Rotation de questions** : **A — Hiérarchie** (précédentes : D, E, D, A, B, C,
D, E, B → **A**). A avait servi au cycle 015, c'est-à-dire **avant** toute la
remise à niveau des cycles 016-020 : rythme vertical, mesures de lecture, cibles
tactiles et contrastes des kickers ont tous été repris depuis, donc ses trois
questions se reposent sur un état entièrement différent.

### Outillage ajouté — et l'instrument qui mentait

`scripts/ui-hierarchy-probe.mjs`. Il répond aux trois questions de la rotation A
avec des nombres : classement de **salience** du premier écran (encre × contraste
× taille relative — ce que la vision pré-attentive trie réellement), comptage des
**niveaux typographiques distincts** visibles dans une même fenêtre (signature =
famille / corps / graisse / style / interlettrage / casse / **couleur
compositée**), et détection des **quasi-doublons** (deux niveaux à moins d'1 px
et 0,06 de luminance : un humain les lit comme un seul niveau, ils coûtent une
règle de plus).

**Son premier run était faux et ne l'a pas dit.** Son `parseColor` ne connaissait
que `rgb()`/`rgba()` ; sur toute autre notation il renvoyait `null` et le nœud
était **silencieusement sauté**. Or Tailwind v4 émet chaque couleur utilitaire en
`oklch()`, que `getComputedStyle` rend telle quelle. Le probe voyait **15 des 35
nœuds de texte** de `#capabilities` — il avait écarté les **16 items de carte**
(`text-gray-400`) et les **4 numéros** (`text-primary/45`), c'est-à-dire
exactement les deux niveaux les plus bas, ceux où vit un défaut de contraste. Il
rendait un verdict « 5 niveaux, propre » sur 43 % du texte.

Corrigé avant tout diagnostic : conversion `oklch()` **et** `oklab()` → sRGB
(oklab → LMS → sRGB linéaire → encodage gamma), étalonnée sur deux valeurs
connues — `oklch(0.707 0.022 261.325)` (gray-400) → `(153,161,175)` pour
`(156,163,175)` attendus, et `oklab(0.888647 -0.00422654 0.0253462)` →
`(222,219,200)`, soit **exactement** ce que le navigateur résout lui-même pour
`text-primary`. Après correction, `#capabilities` passe de 5 à **7 niveaux**.

### Constats d'audit

Audit complet dans `docs/ui-loop/AUDIT-2026-09-12-cycle-021.md`. Résumé :

- **A-1 / P0 — les numéros de carte `01`–`04` étaient peints à 3,47:1.**
  `text-primary/45` compositée sur le fond réel de la carte. Mesuré deux fois
  par deux chemins indépendants qui tombent à 0,01 l'un de l'autre : calcul sur
  la couleur compositée (**3,46**) et **lecture des pixels réellement peints**
  (**3,47** — capture `deviceScaleFactor: 3` de l'élément, luminance du pixel de
  glyphe le plus clair contre le 5ᵉ centile du fond). La même double mesure donne
  **11,56 des deux côtés** sur `.card-link` : l'instrument est étalonné. À 12 px
  le seuil applicable de §6 est **4,5:1** — un numéro de carte n'est pas un grand
  titre. Défaut présent depuis l'origine du composant.

  **Pourquoi vingt cycles ne l'ont pas vu** : axe-core rend sur cette page
  **0 violation `color-contrast`** et **494 nœuds `incomplete`**. Le numéro en
  fait partie, avec le motif exact *« Element's background color could not be
  determined due to a pseudo element »* (le halo `::before` de la carte). axe n'a
  jamais déclaré la page conforme, **il a refusé de juger**, sur la quasi-totalité
  de son texte. Chaque journal depuis le cycle 001 relit « 3 violations, aucune de
  contraste » comme un feu vert ; ce n'en a jamais été un.

- **A-2 / P1 — dans le footer, l'œil allait d'abord vers la sortie.** Classement
  de salience, identique aux 4 viewports et dans les 2 langues :

  | rang | élément | corps | contraste | salience (1440 EN) |
  | --- | --- | --- | --- | --- |
  | **1** | **« Back to top »** | 12 px | **16,76:1** | **40 151** |
  | 2 | « Axel Corral » | 15 px | 15,74:1 | 30 122 |
  | 3 | ligne © | 12 px | 8,27:1 | 22 261 |
  | 4 | **GitHub** | 13 px | **7,65:1** | 11 730 |
  | 5 | **Email** | 13 px | **7,65:1** | 9 775 |

  `#f1efdf` faisait du lien de sortie **le texte le plus clair de toute la zone
  prioritaire** — plus clair que les titres de 86 px (14,26 et 15,74), plus clair
  que l'ivoire de la marque. Et pas seulement par la teinte : bordure
  `rgba(225,224,204,.18)` + fond `.06` + rayon 999px, c'est **exactement la
  pilule de `.contact-links a`**. Sur le dernier écran de la page, le seul objet
  dessiné comme un bouton était celui qui renvoie le visiteur en haut, pendant que
  les trois liens de conversion étaient les textes les plus sourds de leur propre
  bloc. §3 demande précisément si le parcours de conversion est évident une fois
  arrivé en bas.

- **A-3 / P1 — la zone avait deux définitions typographiques pour un seul rôle.**
  Trois sections à kicker, même fonction éditoriale :

  | section | corps | interlettrage | couleur | contraste | luminance |
  | --- | --- | --- | --- | --- | --- |
  | `#about` | **10 → 12 px** | **0,2em** | **`text-primary` plein** | **13,66:1** | **0,7036** |
  | `#capabilities` | 11 px | 0,16em | ivoire 58 % | 5,41:1 | 0,2205 |
  | `#contact` | 11 px | 0,16em | ivoire 58 % | 5,37:1 | 0,2461 |

  Le cycle 018 (`1cb67ee`) a porté « les trois kickers de section » au seuil de
  contraste — mais ces trois-là étaient `#selected-work`, `#capabilities` et
  `#contact`. Celui de `#about` n'était pas dans la règle : un jeu d'utilitaires
  posé en ligne dans le JSX, antérieur à elle. Conséquence mesurable : le kicker
  de la **première** section de la zone était peint **exactement à la luminance de
  son propre corps de texte** (0,7036 contre 0,7036) et à 4 % de celle de son
  titre de 72 px. Pas un niveau sourd : un niveau inexistant, que seule sa taille
  distinguait du paragraphe.

- **A-4 — observation mesurée, aucun changement.** Le sous-titre de section
  (16 px, lum 0,3636) et les items de carte (14 px, lum 0,3535) sont séparés par
  2 px et **0,0101 de luminance** : même famille, même graisse, même casse. Le
  détecteur de quasi-doublons ne les attrape pas (seuil 1 px) mais l'œil les lit
  comme une seule voix. Rôles et emplacements distincts : rien à corriger — c'est
  la raison pour laquelle « 7 niveaux » se lit moins mal que le chiffre ne le
  laisse craindre. Aucun quasi-doublon strict dans aucune des 4 sections, aux 8
  combinaisons viewport × langue.

### Changements livrés

- `d6eb2d1` — ui(capabilities): porter le numéro de carte au-dessus du plancher
  de contraste. `.capability-number` à `rgba(225,224,204,0.58)` — la valeur déjà
  tranchée deux fois par le projet pour ce cas exact (cycle 002
  `.language-toggle-btn`, cycle 018 les kickers). Après : **4,94:1 mesurés sur
  les pixels peints**, et le numéro reste le niveau le plus sourd de la carte —
  le contraste monte, la hiérarchie ne bouge pas.
- `0466c87` — ui(footer): rendre au parcours de conversion le poids que portait
  la sortie. Ordre tonal inversé, structure inchangée : les trois liens passent à
  pleine ivoire (**15,74:1**), le lien utilitaire descend à 0,58 d'ivoire
  (**5,41:1**) et quitte la pilule pour l'idiome **texte + flèche** que
  `.card-link` établit déjà dans la zone. Le repos ayant pris la couleur qui
  servait de survol, l'affordance des trois liens passe au **soulignement**, au
  pointeur comme au clavier.
- `b704c84` — ui(about): ramener le kicker de la zone dans sa règle partagée.
  Ce qui est supprimé n'est pas le kicker mais **la seconde définition du
  kicker**. Seule la respiration avant le titre reste propre à `#about`
  (2,25rem au lieu de 1rem) : valeur de composition pour un titre de 72 px, pas
  un second système.

### Vérification

- Build : ✅ (`npm run build` vert avant chacun des trois commits ; CSS 94,86 →
  **94,80 kB**, JS 644,73 → **644,68 kB** — les trois chantiers *retirent* du
  code). `tsc --noEmit` : ✅ sans sortie.
- Viewports vérifiés : 390 / 768 / **1024** / 1440 / 1920 × 2 langues ×
  reduced-motion = **12 combinaisons**. **0 overflow horizontal**, **0 erreur
  console ou page** sur les 12. Les cinq valeurs calculées (kicker `#about`,
  kicker `#contact`, numéro de carte, lien de footer, lien de sortie) sont
  **identiques aux 12 combinaisons** — aucun des trois chantiers ne dépend d'un
  breakpoint.
- Langues : FR ✅ EN ✅ (aucun texte ajouté ni modifié ; chaque mesure prise
  séparément dans les deux langues).
- reduced-motion : ✅ — runs `1440_en_reduced` et `1440_fr_reduced`, mêmes
  valeurs, aucune erreur. Aucun des trois chantiers n'introduit d'animation : ce
  sont des corrections de ton et de casse typographique.
- Nav clavier : ✅ — parcours **Tab pur** à 1440 EN, 390 FR et 1440 EN sous
  `reduce` : **11 arrêts dans la zone, tous ≥ 44 × 44 px**, `outline` visible sur
  les 11, aucun piège. Le soulignement de focus des liens de footer est
  effectivement peint (`text-decoration-color: rgba(225,224,204,0.55)`,
  `:focus-visible` confirmé `true`).
- Cibles tactiles : **11 sur 11 conformes** aux 4 viewports × 2 langues.
  `.site-footer-top` tient ses 44 px au `min-height` et au padding maintenant que
  la pilule a disparu — vérifié, pas supposé.
- axe-core : **3 violations, strictement identiques aux cycles 001 à 020**
  (`aria-prohibited-attr`, `landmark-unique`, `region`), toutes hors zone. 494
  `incomplete` avant comme après — voir A-1 : ce chiffre est le vrai état de
  l'outil, pas un effet de ce cycle.
- Non-régression : `.about-kicker`, `.capability-number`, `.site-footer-*` ne
  sont utilisés que par `OnePage.tsx` — vérifié par grep sur tout
  `src/**/*.tsx`. La règle partagée des kickers a gagné un sélecteur, elle n'a
  rien perdu : `#selected-work` et `#contact` sont intacts.
- **Mesures avant/après** :

  | | AVANT | APRÈS |
  | --- | --- | --- |
  | contraste du numéro de carte (calcul / pixels peints) | **3,46 / 3,47** | **4,99 / 4,94** |
  | contraste des 3 liens de conversion du footer | 7,65 | **15,74** |
  | contraste du lien « retour en haut » | 16,76 | 5,41 |
  | rang de salience de « retour en haut », 1440 EN | **1 sur 5** | **5 sur 5** |
  | rang de salience de « retour en haut », 390 FR | **1 sur 5** | **5 sur 5** |
  | kicker `#about` — corps / interlettrage / contraste | 10-12 px / 0,2em / **13,66** | 11 px / 0,16em / **5,37** |
  | écart kicker `#about` ↔ kicker `#contact` | 1-2 px, 0,04em, **8,3 points de contraste** | **0 / 0 / 0,00** |
  | texte de la zone sous 4,5:1 | **4 nœuds** (`01`–`04`) | **0** |
  | nœuds de texte réellement mesurés dans `#capabilities` | **15 sur 35** | **35 sur 35** |

  Réserve d'honnêteté sur la salience : à 390 FR la ligne de copyright passe
  désormais au rang 1 (30 217) devant « Axel Corral » (30 122) et devant les
  liens. C'est un artefact de la métrique, qui pondère par l'aire d'encre : une
  longue ligne sourde peut dépasser un mot court et clair. À l'œil — captures de
  galerie à l'appui — Email / GitHub / CV lisent sans ambiguïté comme les
  éléments les plus clairs du bloc après la marque. La ligne © n'a pas bougé en
  valeur absolue ; ce sont les autres qui se sont réordonnés autour.

### Reverté
- Aucun.

### Leçon d'outillage du cycle (la cinquième de la série 017-021)
- **Un instrument qui ne sait pas lire une valeur ne le dit pas : il rend un
  résultat plus propre.** Le probe de ce cycle sautait en silence tout nœud dont
  la couleur n'était pas en `rgb()` — soit, sous Tailwind v4, la majorité de la
  page — et le symptôme n'était pas une erreur mais **un verdict de hiérarchie
  plus flatteur que la réalité**. Corollaire opérationnel : avant de croire une
  mesure, **compter les nœuds mesurés et les comparer au DOM**. 15 sur 35 aurait
  dû sauter aux yeux avant les chiffres qu'ils portaient.
- Le même cycle en donne la version externe : **axe-core rend 494 `incomplete`
  et 0 violation de contraste sur cette page.** Un outil peut refuser de juger
  sans que son silence ressemble à un refus. « 0 violation » n'est une bonne
  nouvelle que si l'on a regardé la colonne d'à côté.
- Rappel des quatre précédentes : 017 « une mesure prise pendant un `transform`
  ne mesure pas le CSS » — *qui a resservi ce cycle* : la première lecture du
  soulignement de focus renvoyait `rgba(0,0,0,0)` parce qu'elle tombait au milieu
  de la transition de 180 ms ; 018 « une capture prise avant un reveal ne mesure
  pas le rendu » ; 019 « un élément `fixed` dans une capture d'élément haute n'est
  pas là où le visiteur le voit » ; 020 « les quatre viewports de référence
  laissent un angle mort entre 1024 et 1440 ».

### État des chantiers structurels
- Vers l'Élysée : non commencé (iframe vérifiée réalisable cycle 003)
- Ombrair : non commencé (iframe vérifiée réalisable cycle 003)
- Analyse vidéo football : non commencé
- Démos projets existants : 3/3 conformes (inchangé depuis cycle 003)

### Prochain cycle — point de reprise exact
- La zone n'a plus **aucun texte sous 4,5:1** et plus aucun écart mesuré ouvert
  sur la hiérarchie, le rythme, les mesures de lecture ou les cibles tactiles.
- **Premier réflexe du prochain cycle** : relancer
  `node scripts/ui-hierarchy-probe.mjs` et **vérifier d'abord le nombre de nœuds
  mesurés par section** (`textNodes`) avant de lire un seul chiffre de contraste.
  Références de ce cycle : `#about` 352, `#capabilities` **35**, `#contact` 9,
  `.site-footer` 6. Un chiffre qui baisse sans changement de contenu = un
  instrument qui a recommencé à sauter des nœuds.
- **Ouvrir « Vers l'Élysée » (§4.1)** en chantier principal — premier P1 de
  l'ordre imposé, reporté depuis les cycles 017, 019, 020 et 021 au profit de la
  zone prioritaire. Lire d'abord les conventions de carte projet dans
  `OnePage.tsx` (liste `.home-project-*`, `ProjectShowcaseCard`,
  `ProjectDetailModal`) pour s'y intégrer sans créer un pattern parallèle, puis
  carte projet + vue détail + démo iframe vers `political-destiny.vercel.app`
  (en-têtes vérifiés cycle 003 : `200 OK`, aucun `X-Frame-Options` ni
  `frame-ancestors`). Ton neutre imposé, angle « démarche de modélisation »,
  titre affiché « Vers l'Élysée » (jamais « political destiny »), pas de lien
  repo tant que Q2 n'est pas tranchée.
- Trois notes d'outillage pour ce chantier. (1) Toute nouvelle démo en iframe
  passe sous le sélecteur de langue escamotable : vérifier que le
  `pointer-events: none` de l'état escamoté ne mange pas un clic destiné à
  l'iframe — ça se teste, ça ne se raisonne pas. (2) **Échantillonner la bande
  1024-1280**, pas seulement 768 et 1440 (leçon du cycle 020). (3) Toute couleur
  posée en utilitaire Tailwind sur la nouvelle carte sort en `oklch()` : elle est
  désormais mesurable par le probe, mais **pas** par axe-core.

### Questions bloquantes ouvertes
- Q1, Q2, Q3, Q4 — voir `docs/ui-loop/QUESTIONS.md` (inchangées). Aucune
  nouvelle question ce cycle : les trois chantiers sont des corrections appuyées
  sur des mesures, pas des arbitrages factuels.

---

## Cycle 020 — 2026-09-12 05:20

**Zone travaillée** : zone prioritaire (§3) uniquement — `#capabilities`
(`.card-link`), les sous-titres de section partagés, `#capabilities` /
`#contact` / `.site-footer` (rythme vertical). Conformément à la consigne de
run, les trois chantiers sont dans la zone ; aucun chantier §4/§5 n'a été
ouvert.
**Rotation de questions** : **B — Rythme & espace** (précédentes : D, E, D, A,
B, C, D, E → B). B avait servi au cycle 016, avant la remise à niveau des
cycles 017-019 : ses trois questions sont reposées sur un état de la zone
entièrement différent, et les deux items que la rotation E du cycle 019 avait
explicitement renvoyés à « un cycle de rotation B » sont tranchés ici.

### Outillage ajouté

`scripts/ui-rhythm-probe.mjs`. Il mesure, aux 4 viewports × 2 langues : le
padding déclaré de chaque section de la zone, l'écart **encre-à-encre** entre
sections voisines (de la dernière encre de l'une à la première encre de la
suivante, pas de bord de section à bord de section), le nombre de caractères
réellement composés par ligne pour chaque bloc de texte, et surtout le **blanc
de queue** — l'écart entre le bas de la dernière encre d'une section et le bas
de la section elle-même. C'est cette dernière mesure qui distingue un blanc
voulu (déclaré dans le CSS) d'un blanc subi (produit par une `min-height` ou une
grille étirée), et c'est elle qui a sorti le constat B-2.

### Constats d'audit

Audit complet dans `docs/ui-loop/AUDIT-2026-09-12-cycle-020.md`. Résumé :

- **B-1 / P0 — le lien de la carte « Projets analytiques » était tronqué en
  plein mot.** `.card-link` portait `width: max-content` sans plafond et
  `.capability-card` porte `overflow: hidden`. La grille passe à 4 colonnes dès
  `min-width: 1024px`, où chaque colonne ne fait que **232 px** :

  | viewport | colonne | lien 03 EN | lien 03 FR | débordement |
  | --- | --- | --- | --- | --- |
  | **1024** | **232** | 211 | **247** | **EN +28 · FR +64** |
  | 1100 | 251 | 211 | 247 | EN +9 · FR +45 |
  | 1180 | 271 | 211 | 247 | — · FR +25 |
  | 1280 / 1440 / 1920 | 296 / 336 / 388 | 211 | 247 | aucun |

  En FR à 1024 le lien mesurait **247 px dans une carte de 232 px** : il ne
  débordait pas du padding, il traversait la bordure. La carte affichait
  **« Voir le Modèle de soutenabilité des retra »** — coupé net, sans flèche,
  sans ellipse, sans aucun signe qu'il manquait quelque chose. C'est du
  **contenu invisible** (§4), pas un défaut d'espacement. Défaut présent depuis
  le cycle 003, qui a introduit les libellés de lien différenciés.
- **B-2 / P1 — le blanc sous la grille Capabilities était un accident de hauteur
  de fenêtre.** `.work-section` portait `min-height: 100vh` ; depuis le cycle
  016 les cartes se dimensionnent à leur contenu, donc la section était
  **étirée** et tout l'étirement tombait sous la grille. Blanc de queue mesuré,
  pour un `padding-bottom` déclaré de 80 / 96 / 96 / 96 :

  | viewport | déclaré | EN | FR | écart EN/FR |
  | --- | --- | --- | --- | --- |
  | 390 | 80 | 80 | 80 | 0 |
  | 768 | 96 | 96 | 96 | 0 |
  | 1440 | 96 | **124** | 105 | 19 |
  | 1920 | 96 | **306** | **198** | **108** |

  À 1920 la section respirait à **3,2× ce que son CSS annonçait**, et 108 px
  séparaient la version anglaise de la française du **même écran**. Un blanc que
  personne n'a décidé : la soustraction `100vh − contenu`.
- **B-3 / P2 — la page se fermait sur 29 % du souffle avec lequel elle
  s'ouvrait.** `#about` va de 80 à 112 et `#capabilities` de 80 à 96 ; `#contact`
  (48/56) et `.site-footer` (32/40) étaient **figés à toutes les largeurs**.
  Descente à 1440 : 112 → 96 → 48 → 32, et écart contact→footer de **89 px à
  390 comme à 1920** quand l'écart about→cap passe de 160 à 208. C'est l'item
  que la rotation E du cycle 019 avait renvoyé à un cycle B.
- **B-5 / P1 — une seule règle produisait 58, 95 et 102 caractères par ligne.**
  `.home-section-heading > span, .contact-panel p:not(.contact-kicker)` portait
  `max-width: 42rem`, une estimation en pixels et non une mesure de lecture.
  Caractères composés sur la ligne la plus longue (768 / 1440 / 1920, identique
  aux trois) : sous-titre `#selected-work` **102** EN / 94 FR, sous-titre
  `#contact` **95** / 92, sous-titre `#capabilities` 58 / 58 — ce dernier
  n'étant pas une réussite de la règle mais une chaîne courte qui tient sur une
  ligne. Deux blocs à **+36 %** et **+23 %** au-dessus du plafond de 75.
- **B-4 — constat mesuré qui ne demandait aucun changement.** Le backlog portait
  depuis le cycle 019 un P2 « `.capability-card` n'a pas d'échelle mobile :
  24 px de padding partout ». La mesure de la **largeur de carte** le referme :
  358 / 352 / **232** / 336 / 388 px à 390 / 768 / 1024 / 1440 / 1920. La carte
  **ne s'élargit pas avec la fenêtre** — un padding qui grandirait avec elle la
  mangerait au lieu de l'aérer. 24 px constant est le comportement juste, pas
  une omission. **Item fermé par la mesure, sans une ligne de code.**

### Changements livrés

- `3dc9597` — ui(capabilities): empêcher le libellé de lien de sortir de sa
  carte. `max-width: 100%` plafonne la largeur shrink-to-fit à celle du
  conteneur : le libellé passe à la ligne au lieu de s'échapper, la flèche garde
  sa taille via `flex-shrink: 0`. Correction **à la source**, valable à toutes
  les largeurs, dans les deux langues, et pour n'importe quel libellé futur —
  pas un calage sur les chaînes d'aujourd'hui.
- `d8ec9cc` — ui(sections): donner aux sous-titres de section la mesure de
  lecture du projet. `max-width: 42rem` → `var(--measure-lede)`. Le token
  existait depuis le cycle 019, calibré sur les deux langues pour le paragraphe
  de `#about` — même nature de copie, même corps ; il n'avait simplement jamais
  été appliqué aux autres blocs de soutien.
- `4ace013` — ui(zone): rendre décidée la descente du bas de page. Suppression
  de `min-height: 100vh` sur `.work-section`, et deux tokens nouveaux
  (`--zone-pad-contact`, `--zone-pad-footer`) qui font marcher `#contact` et le
  footer sur le même breakpoint que les deux sections du dessus.

### Vérification

- Build : ✅ (`npm run build` vert avant chacun des trois commits ; CSS 94.61 →
  **94.86 kB**, JS **644.73 kB inchangé**). `tsc --noEmit` : ✅ sans sortie.
- Viewports vérifiés : 390 / 768 / 1440 / 1920 (run `zone-c020-after`, 10
  combinaisons, **0 erreur console**, **0 overflow horizontal**), **plus 1024,
  1100, 1180 et 1280** pour les chantiers de grille.
- Langues : FR ✅ EN ✅ (aucun texte ajouté ni modifié ; chaque mesure prise
  séparément dans les deux langues).
- reduced-motion : ✅ — run `laptop-1440_*_reduced`, aucune erreur ; aucun des
  trois chantiers n'introduit d'animation, ce sont des corrections de géométrie.
- Nav clavier : ✅ — parcours **Tab pur** à 1024 FR, 1440 EN sous `reduce` et
  390 FR : **11 arrêts dans la zone, tous ≥ 44 × 44 px**, aucun piège, aucune
  cible sous le seuil. Le lien de carte passé sur deux lignes reste un seul
  arrêt.
- Cibles tactiles : **11 sur 11 conformes** à **5** viewports (390 / 768 /
  **1024** / 1440 / 1920) × 2 langues. 1024 n'avait jamais été mesuré.
- **Mesures avant/après** :

  | | AVANT | APRÈS |
  | --- | --- | --- |
  | débordement du lien de carte (4 cartes × 6 largeurs × 2 langues) | **6 combinaisons, jusqu'à +64 px** | **0** |
  | caractères/ligne, sous-titre `#selected-work` | **102 / 94** | 71 / 67 |
  | caractères/ligne, sous-titre `#contact` | **95 / 92** | 72 / 65 |
  | caractères/ligne, sous-titre `#capabilities` | 58 / 58 | 58 / 58 (inchangé, 1 ligne) |
  | blanc de queue `#capabilities`, 1920 EN / FR | **306 / 198** | **96 / 96** |
  | blanc de queue `#capabilities`, 1440 EN / FR | 124 / 105 | **96 / 96** |
  | descente encre-à-encre, 390 | 160 / 128 / 89 | 160 / 136 / 105 |
  | descente encre-à-encre, 768 et 1440 | 208 / 144-172 / 89 | 208 / 176 / 137 |
  | descente encre-à-encre, 1920 EN | 208 / **354** / 89 | 208 / 176 / 137 |
  | écarts encre-à-encre ≠ écart CSS déclaré | **6 des 24 mesures** | **0 des 24** |

  La ligne qui compte est la dernière : après, **chaque écart perçu dans la zone
  égale exactement l'écart que le CSS annonce**, aux 4 viewports et dans les 2
  langues. Il n'y a plus un pixel de blanc que personne n'a décidé. Et la
  descente tient la même proportion partout — **1 : 0,85 : 0,66** — au lieu de
  1 : 0,69 : 0,42 à 1440 et d'une descente non monotone à 1920.
- Effet de bord voulu, hors zone : le sous-titre de `#selected-work` (P2)
  partage la règle corrigée par `d8ec9cc` et passe de 102 à 71 caractères. Ce
  n'est pas un élargissement de périmètre, c'est la portée naturelle du
  sélecteur ; vérifié visuellement dans les deux langues, deux lignes, aucun mot
  orphelin en dernière ligne.
- Non-régression : les trois sélecteurs touchés (`.card-link`,
  `.home-section-heading > span` / `.contact-panel p`, `.work-section`) ne sont
  utilisés que par `OnePage.tsx` — vérifié par grep sur tout `src/**/*.tsx`.
  Aucune autre page du site n'est concernée.
- axe-core : **3 violations, strictement identiques aux cycles 001 à 019**
  (`aria-prohibited-attr` sur `.city-heading`, `landmark-unique` sur `.pc-nav`,
  `region` sur `.language-toggle`), toutes hors zone prioritaire. Aucune
  nouvelle, aucune résolue.
- Régression détectée : non.

### Reverté
- Aucun.

### Leçon d'outillage du cycle (la quatrième de la série 017-020)
- **Les quatre viewports de référence de la mission laissent un angle mort entre
  1024 et 1440**, et c'est exactement là que vivait le P0 de ce cycle : la
  grille Capabilities passe à 4 colonnes à 1024, la bande 1024-1279 est la seule
  où les colonnes sont trop étroites pour leur contenu, et ni 768 ni 1440 ne la
  traversent. Dix-neuf cycles d'audit ne l'ont pas vue. Corollaire : **un
  changement de grille doit être échantillonné dans sa bande, pas seulement à
  ses bornes.** `scripts/ui-gallery.mjs` accepte désormais `--viewports=` pour
  que la galerie puisse montrer un chantier dont la preuve vit à une largeur que
  la paire 390/1440 ne couvre pas — sans quoi elle aurait affiché deux images
  identiques et revendiqué une correction invisible.
- Rappel des trois précédentes : 017 « une mesure prise pendant un `transform`
  ne mesure pas le CSS », 018 « une capture prise avant un reveal ne mesure pas
  le rendu », 019 « un élément `fixed` dans une capture d'élément haute n'est
  pas là où le visiteur le voit ».

### État des chantiers structurels
- Vers l'Élysée : non commencé (iframe vérifiée réalisable cycle 003)
- Ombrair : non commencé (iframe vérifiée réalisable cycle 003)
- Analyse vidéo football : non commencé
- Démos projets existants : 3/3 conformes (inchangé depuis cycle 003)

### Prochain cycle — point de reprise exact
- La zone prioritaire n'a de nouveau **aucun écart mesuré ouvert** : rythme
  vertical, mesures de lecture, cibles tactiles, contrastes et débordements sont
  tous fermés par une mesure. Les deux arbitrages non mesurables restent ouverts
  au backlog — `#about` sans ancre de preuve (éditorial, cycle 018) et la
  colonne de carte à 184 px de texte vif à 1024 (arbitrage de grille, ouvert ce
  cycle).
- **Ouvrir « Vers l'Élysée » (§4.1)** en chantier principal — premier P1 de
  l'ordre imposé, reporté depuis le cycle 017 puis le cycle 019. Lire d'abord
  les conventions de carte projet dans `OnePage.tsx` (liste `.home-project-*`,
  `ProjectShowcaseCard`, `ProjectDetailModal`) pour s'y intégrer sans créer un
  pattern parallèle, puis carte projet + vue détail + démo iframe vers
  `political-destiny.vercel.app` (en-têtes vérifiés cycle 003 : `200 OK`, aucun
  `X-Frame-Options` ni `frame-ancestors`). Ton neutre imposé, angle « démarche de
  modélisation », titre affiché « Vers l'Élysée » (jamais « political
  destiny »), pas de lien repo tant que Q2 n'est pas tranchée.
- Deux notes d'outillage pour ce chantier. (1) Toute nouvelle démo en iframe
  passe sous le sélecteur de langue escamotable : vérifier que le
  `pointer-events: none` de l'état escamoté ne mange pas un clic destiné à
  l'iframe — ça se teste, ça ne se raisonne pas. (2) **Échantillonner la bande
  1024-1280**, pas seulement 768 et 1440 : c'est là que ce cycle a trouvé son
  P0, et une carte projet neuve y est exactement aussi exposée.

### Questions bloquantes ouvertes
- Q1, Q2, Q3, Q4 — voir `docs/ui-loop/QUESTIONS.md` (inchangées). Aucune
  nouvelle question ce cycle : les trois chantiers sont des corrections appuyées
  sur des mesures, pas des arbitrages factuels.

---

## Cycle 019 — 2026-09-12 03:40

**Zone travaillée** : zone prioritaire (§3) uniquement — `#about` (paragraphe de
soutien) et `.language-toggle`, le contrôle flottant qui recouvre la zone.
Conformément à la consigne de run, les deux chantiers sont dans la zone ; aucun
chantier §4/§5 n'a été ouvert.
**Rotation de questions** : **E — Mobile-first réel** (précédentes : D, E, D, A,
B, C, D → E). E avait déjà servi au cycle 013, mais jamais après la remise à
niveau des cycles 015-018 : les deux questions qu'elle pose habituellement
(cibles tactiles, scroll horizontal) sont désormais closes, ce qui a laissé la
place à sa troisième — « les sections du bas sont-elles pensées ou juste
empilées ? » — qui n'avait encore jamais été creusée.

### Constats d'audit

Audit complet dans `docs/ui-loop/AUDIT-2026-09-12-cycle-019.md`. Résumé :

- **E1 — cibles tactiles** : **11 sur 11 conformes** dans la zone, aux trois
  viewports mesurés (390 / 768 / 1440) et dans les deux langues. Zéro sous
  44×44. Aboutissement des cycles 016-018 ; rien à faire.
- **E2 — scroll horizontal** : aucun.
  `document.documentElement.scrollWidth === window.innerWidth` aux 4 viewports
  dans les 2 langues.
- **E3 — échelle mobile des blocs** : `.about-card` 64/24 → 112/64,
  `.contact-panel` 24/24 → 57.6/57.6, `.capability-card` **24/24 partout**.
  Padding de section : `#about` 80→112, `#capabilities` 80→96, `#contact`
  **48/56 figé**, footer **32/40 figé**. Deux constats **P2 consignés au
  backlog**, pas traités : ce sont des arbitrages de rythme qui relèvent d'un
  cycle de rotation B, pas de corrections d'écart mesuré.
- **E-A / P0** — `.language-toggle` est `position: fixed` sans aucune stratégie
  d'évitement du contenu. Balayage de collision, pas de 60px, toute boîte de
  texte recouvrant le rectangle du contrôle de plus de 2px sur les deux axes :

  | viewport | positions avec collision (zone prioritaire) |
  | --- | --- |
  | **390** | **24 / 49** |
  | 768 | 6 / 15 |
  | 1024 | 6 / 15 |
  | 1440 | 2 / 15 |

  Sur la page entière à 390 : **43/70**. Pire cas mesuré (390 EN, `y = 6712`) :
  le mot **`with`** du titre « Analytical profile » **coupé en deux** par
  « EN · FR », le dernier mot de la ligne au-dessus noyé dans le voile. Deux
  textes clairs superposés : le contraste n'y est pas insuffisant, il **n'est
  pas défini** — garde-fou §6. Le backlog qualifiait ce reliquat de « défaut
  intermittent » depuis le cycle 016 ; la mesure dit qu'il est **majoritaire**
  sur mobile. Requalifié **P0**. Le voile du cycle 016 rendait le *contrôle*
  lisible sur la page ; il ne pouvait pas rendre la *page* lisible sous le
  contrôle — les deux occupent les mêmes pixels.
- **E-B / P1** — `#about p:last-of-type` portait `max-w-3xl` (768px) et héritait
  du `text-align: center` de `.about-card`. Comptage caractère par caractère des
  lignes réellement composées (`Range.getClientRects()`) :

  | viewport / langue | lignes | caractères max | bords gauches distincts |
  | --- | --- | --- | --- |
  | 390 EN | 9 | 49 | **9** |
  | 390 FR | 9 | 51 | 7 |
  | 768 EN | 5 | 84 | 5 |
  | 1440 EN | 4 | **108** | 4 |
  | 1440 FR | 4 | **110** | 4 |
  | 1920 FR | 4 | **110** | 4 |

  Deux défauts opposés dans le même bloc : **45 % au-dessus du plafond de 75
  caractères** que pose la rotation B sur desktop, et **neuf lignes centrées à
  neuf bords gauches différents** sur 390. Le centrage est une figure
  d'affiche : il tient sur deux ou trois lignes, pas sur neuf.

### Changements livrés

Deux chantiers, pas trois, alors que §4 en autorise trois. E-A porte sur un
contrôle global présent sur toute la page et E-B sur le premier bloc de la zone :
les deux demandent une vérification aux 4 viewports × 2 langues × 2 modes de
mouvement. Deux chantiers vérifiés valent mieux qu'un troisième bâclé.

- `42333f3` — ui(language-toggle): escamoter le sélecteur au scroll descendant.
  Le contrôle s'efface pendant que le lecteur descend et revient dès qu'il
  remonte ; sous 160px de scroll il reste toujours visible, puisque c'est en
  haut de page qu'on choisit sa langue. Zone morte de 6px sur le delta pour ne
  pas confondre l'inertie de scroll avec un changement de direction.
- `b164c62` — ui(about): poser la mesure du paragraphe Analytical profile et le
  ferrer à gauche. Le titre d'affiche reste centré ; seul le paragraphe passe au
  fer à gauche, dans une boîte qui reste centrée dans la carte — la composition
  du bloc ne bouge pas, seule sa lecture est réparée. Mesure introduite comme
  token (`--measure-lede`, 58ch), pas comme valeur codée dans le composant.

### Vérification

- Build : ✅ (`npm run build` vert avant chaque commit ; CSS 94.12 → **94.61 kB**,
  JS 644.53 → **644.73 kB**). `tsc --noEmit` : ✅ sans sortie.
- Viewports vérifiés : 390 / 768 / 1440 / 1920 (runs `zone-c019-before` et
  `zone-c019-after`, 10 combinaisons chacun, **0 erreur console**, **0 overflow
  horizontal** sur les 20).
- Langues : FR ✅ EN ✅ (aucun texte ajouté ; chaque mesure prise séparément dans
  les deux langues, et le token `--measure-lede` calibré sur les deux).
- reduced-motion : ✅ — l'escamotage fonctionne aussi sous `reduce`, sans
  translation ni transition (`transition-property: none` mesuré). Choix assumé :
  l'évitement est une correction de lisibilité, pas une décoration ; le
  désactiver rendrait le P0 aux seuls utilisateurs qui demandent moins de
  mouvement.
- Nav clavier : ✅ — **Tab atteint le sélecteur dès le premier appui même
  escamoté**, aux 2 viewports testés au clavier pur, et `:focus-within` le
  ramène avant qu'il ne soit peint. C'est la raison pour laquelle l'escamotage
  passe par `opacity: 0` et jamais par `visibility` ni `display`. Indicateur de
  focus inchangé (soulignement custom `.language-toggle-btn:focus-visible::before`).
- **Mesures avant/après** :

  | | AVANT | APRÈS |
  | --- | --- | --- |
  | collisions texte/contrôle, 390 (zone) | **24 / 49** | **0 / 49** |
  | collisions, 768 / 1440 / 1920 | 6/15 · 2/15 · — | **0/28 · 0/30 · 0/32** |
  | caractères par ligne, 1440-1920 | **108 à 110** | **68 à 70** |
  | caractères par ligne, 768 | 84 | 68 |
  | bords gauches distincts, 390 EN | **9** | **1** |
  | lignes du paragraphe, desktop | 4 | 6 |
  | hauteur de `#about`, 1440/1920 | 1085 | 1137 (+52) |
  | hauteur de `#about`, 390 | 807 | **807** (inchangée) |

- Contraste du paragraphe au plancher de révélation : **5.18:1**, identique
  avant et après — le chantier E-B ne touche ni la couleur ni l'opacité, et le
  plancher posé au cycle 017 (0.58) tient.
- Non-régression : `#capabilities` et `#contact` **au pixel près** sur les 10
  combinaisons ; seul `#about` bouge, et seulement là où le paragraphe gagne
  deux lignes. `--measure-lede` et `.about-lede` sont tous deux nouveaux et
  utilisés par un seul élément.
- axe-core : **3 violations, strictement identiques aux cycles 001 à 018**
  (`aria-prohibited-attr` sur `.city-heading`, `landmark-unique` sur `.pc-nav`,
  `region` sur `.language-toggle`), toutes hors zone prioritaire. Aucune
  nouvelle, aucune résolue.
- Régression détectée : non.

### Reverté
- Aucun.

### Faux positif d'outillage identifié (à ne pas reproduire)
- Dans `zone-c019-before/*/capabilities.png`, le bouton « Skip to content »
  apparaît posé au milieu des cartes. `.skip-link` est `fixed` avec
  `translateY(-180%)` et ne se montre qu'au `:focus` : sur une capture
  d'**élément** plus haute que le viewport, Playwright rend les éléments `fixed`
  à leur position de **document**, pas d'écran. Troisième leçon d'outillage de la
  série : 017 « une mesure prise pendant un `transform` ne mesure pas le CSS »,
  018 « une capture prise avant un reveal ne mesure pas le rendu », 019 « un
  élément `fixed` dans une capture d'élément haute n'est pas là où le visiteur
  le voit ». Vérifié à la main : le lien reste hors écran sans focus.

### État des chantiers structurels
- Vers l'Élysée : non commencé (iframe vérifiée réalisable cycle 003)
- Ombrair : non commencé (iframe vérifiée réalisable cycle 003)
- Analyse vidéo football : non commencé
- Démos projets existants : 3/3 conformes (inchangé depuis cycle 003)

### Prochain cycle — point de reprise exact
- La zone prioritaire n'a plus **aucun écart mesuré ouvert**. Ce qui y reste est
  de deux natures, et aucune ne se règle par une mesure : un arbitrage éditorial
  (`#about` sans ancre de preuve, ouvert depuis le cycle 018) et deux arbitrages
  de rythme consignés ce cycle (`.capability-card` sans échelle mobile,
  `#contact`/footer à padding de section figé) qui demandent un cycle de
  rotation **B** pour être tranchés sur mesure et non au jugé.
- **Ouvrir « Vers l'Élysée » (§4.1)** en chantier principal — premier P1 de
  l'ordre imposé, reporté depuis le cycle 017. Lire d'abord les conventions de
  carte projet dans `OnePage.tsx` (liste `.home-project-*`,
  `ProjectShowcaseCard`, `ProjectDetailModal`) pour s'y intégrer sans créer un
  pattern parallèle, puis carte projet + vue détail + démo iframe vers
  `political-destiny.vercel.app` (en-têtes vérifiés cycle 003 : `200 OK`, aucun
  `X-Frame-Options` ni `frame-ancestors`). Ton neutre imposé, angle « démarche de
  modélisation », titre affiché « Vers l'Élysée » (jamais « political
  destiny »), pas de lien repo tant que Q2 n'est pas tranchée.
- Note d'outillage pour ce chantier : toute nouvelle démo en iframe passe sous
  le sélecteur de langue escamotable. Vérifier que le `pointer-events: none` de
  l'état escamoté ne masque pas un clic destiné à l'iframe — il ne devrait pas,
  le contrôle devient transparent aux clics quand il est escamoté, mais c'est
  exactement le genre d'interaction qui se teste plutôt qu'elle ne se raisonne.

### Questions bloquantes ouvertes
- Q1, Q2, Q3, Q4 — voir `docs/ui-loop/QUESTIONS.md` (inchangées). Aucune
  nouvelle question ce cycle : les deux chantiers sont des corrections appuyées
  sur des mesures, pas des arbitrages factuels.

---

## Cycle 018 — 2026-09-11 23:59

**Zone travaillée** : zone prioritaire (§3) uniquement — `#contact` (kicker de
section), `.site-footer` (cibles tactiles), plus la règle de kicker partagée
`.home-section-heading p` qui remonte aussi à `#projects`. Conformément à la
consigne de run, les trois chantiers sont dans la zone ; aucun chantier §4/§5
n'a été ouvert.
**Rotation de questions** : **D — Crédibilité**. Les cinq rotations ayant toutes
été passées au cycle 017, la rotation reprend au début. D avait déjà servi aux
cycles 012 et 014, mais jamais *après* la remise à niveau typographique et
rythmique de la zone (cycles 015-017) — ce qui a fait apparaître un écart que
les passages précédents ne pouvaient pas voir.

### Constats d'audit

Audit complet dans `docs/ui-loop/AUDIT-2026-09-11-cycle-018.md`. Résumé :

- **D1 — un tech lead comprend-il ?** Oui, dans la zone. `#capabilities` nomme
  les outils (Power BI, SharePoint, Power Query, Python, SQL, ETL, AWS,
  versioning) et les 4 cartes portent 4 liens de preuve différenciés. Aucun ne
  renvoie vers `#contact` : le défaut du cycle 001 est réglé et le reste.
- **D2 — affirmations étayées ?** 4/4 dans `#capabilities`, **0 dans `#about`**.
  Le bloc « Analytical profile » est le seul de la zone sans aucune ancre de
  preuve. Non traité (plafond de 3 chantiers, et c'est un arbitrage éditorial
  face à trois écarts chiffrés) — **consigné au backlog**.
- **D3-a / P0** — Les trois kickers de section (`.home-section-heading p`,
  `.contact-kicker`) en `rgba(225,224,204,0.52)` à **11px** mesuraient
  **4.49:1** dans la page (contraste composité, alpha aplati sur le fond opaque
  réellement hérité) et 4.53:1 en calcul analytique sur `#101010`. Le seuil
  applicable à 11px est 4.5:1 : **la conformité tenait à la troisième
  décimale**, sur un fond qui n'est même pas uni (`bg-noise` sur
  `#capabilities`, fond local relevé entre `#020202` et `#111` au cycle 016).
  Le cycle 016 avait estimé 4.52:1 et classé « conforme, sans marge » ; la
  mesure dit l'inverse. **axe-core ne l'a jamais signalé** — 4.49 contre 4.5
  tombe dans sa tolérance d'arrondi, ce qui est exactement la raison pour
  laquelle §6 exige un contraste mesuré et pas estimé — tous viewports, EN et
  FR — **P0**.
- **D3-b / P1** — `.contact-kicker` (`index.css:638`, spécificité 0-1-0) est un
  `<p>` **dans** `.contact-panel` : la règle de sous-titre `.contact-panel p`
  (`index.css:656`, 0-1-1, et postérieure) l'emportait sur `color`, `font-size`
  et `margin-top`. Relevé aux 4 viewports dans les 2 langues :

  | eyebrow | font-size | color | margin-top | hauteur |
  | --- | --- | --- | --- | --- |
  | `Selected projects / proof first` | 11px | `rgba(225,224,204,.52)` | 0 | 16.5 |
  | `Capabilities / evidence` | 11px | `rgba(225,224,204,.52)` | 0 | 16.5 |
  | **`Contact / next step`** | **16px** | **`rgb(156,163,175)`** | **20px** | **26.4** |

  Le `letter-spacing: 0.16em` de `.contact-kicker` survivait, lui : 2.56px de
  tracking au lieu de 1.76px. La section de conversion — la dernière chose que
  lit un recruteur — s'annonçait donc dans une typographie que la page
  n'utilise nulle part ailleurs, avec 20px de marge fantôme. C'est
  littéralement la « rupture de qualité entre le haut et le bas » que §3
  demande de chercher, sauf qu'elle venait d'une collision de sélecteurs —
  tous viewports, EN et FR — **P1**.
- **D3-c / P1** — `.site-footer-links a` : `Email` **31.9 × 44**, `GitHub`
  **40 × 44**, `CV` **17.7 × 44**, `padding` calculé `0px`, identique aux
  4 viewports dans les 2 langues. Le cycle 016 avait vérifié la **hauteur** et
  déclaré ces liens conformes ; la largeur ne l'avait jamais été. `CV` passait
  sous le plancher de **24px** de WCAG 2.5.8, et les trois sous le 44px que le
  reste de la zone s'impose (`.site-footer-top` 117.6×44, `.contact-links a`
  497×69.9, `.card-link` 136–211×44) — **P1**.

### Changements livrés

Ordre de commit : D3-b avant D3-a, bien que D3-a soit le P0. C'est délibéré —
tant que `.contact-panel p` repeignait le kicker de contact, un changement
d'opacité sur la règle d'eyebrow n'aurait atteint que deux kickers sur trois.
La priorité de §2 gouverne le **choix** des chantiers, pas l'ordre des commits.

- `b95e3ef` — ui(contact): rendre au kicker de contact l'eyebrow du reste de la
  page. `.contact-panel p:not(.contact-kicker)` ; aucun autre `.contact-panel p`
  n'existe dans la feuille.
- `1cb67ee` — ui(sections): porter les trois kickers de section au-dessus du
  seuil de contraste. `0.52` → `0.58`, la valeur déjà tranchée au cycle 002
  pour `.language-toggle-btn` dans le même cas de figure : les kickers
  rejoignent une décision existante au lieu d'en introduire une nouvelle.
- `6416659` — ui(footer): donner aux trois liens du footer une cible tactile de
  44px de large. `padding-inline: 0.625rem` + `min-width: 44px` + centrage, et
  le column-gap de `.site-footer-links` ramené à 0 pour ne pas additionner les
  deux espacements.

### Vérification

- Build : ✅ (`npm run build` vert avant chaque commit ; CSS 94.04 → **94.12 kB**,
  JS 644.53 kB inchangé). `tsc --noEmit` : ✅ sans sortie.
- Viewports vérifiés : 390 / 768 / 1440 / 1920 (runs `zone-c018-before` et
  `zone-c018-after`, 10 combinaisons viewport × langue × motion chacun,
  **0 erreur console**, **0 overflow horizontal** sur les 20).
- Langues : FR ✅ EN ✅ (aucun texte ajouté ; les trois kickers et les trois
  liens de footer mesurés séparément dans les deux langues).
- reduced-motion : ✅ (1440 FR et EN, captures `contact.png` et `footer.png`
  inspectées ; le kicker FR « CONTACT / PROCHAINE ÉTAPE » est bien au nouveau
  corps).
- Nav clavier : ✅ — les quatre cibles du bloc de clôture reçoivent
  `:focus-visible` en `solid 2px rgb(222,219,200)` avec 4px d'offset, à 1440 EN
  et 390 FR. Effet de bord favorable du D3-c : l'anneau de focus de `CV`
  entourait une boîte de 17.7px, il entoure maintenant les 44px réels.
- **Mesures avant/après** :

  | | AVANT | APRÈS |
  | --- | --- | --- |
  | contraste des 3 kickers | 4.49:1 | **5.37 à 5.41:1** |
  | corps du kicker `#contact` | 16px | **11px** |
  | marge fantôme au-dessus | 20px | **0** |
  | `Email` / `GitHub` / `CV` | 31.9 / 40 / **17.7** × 44 | **51.9 / 60 / 44** × 44 |
  | écart perçu entre libellés de footer | 20 / 20 px | **20 / 23.1 px** |
  | hauteur de `#contact` (10 combinaisons) | — | **−29 à −30 px** |

  Les −29/−30px de `#contact` sont exactement la marge fantôme (20px) plus
  l'écart de corps du kicker (26.4 → 16.5) : le chantier D3-b ne fait pas que
  corriger un style, il rend 30px de hauteur à la dernière section.
- Sous-titres de section revérifiés après le `:not()` : 16px, 7.49 à 8.27:1,
  inchangés — la règle de sous-titre n'a pas été cassée par l'exclusion.
- Non-régression hors zone : `.home-section-heading p` sert aussi à
  `#projects`. Capture du `.home-section-heading` de cette section inspectée
  après coup — kicker, `h2` et sous-titre intacts, le contraste du kicker y
  gagne aussi. Grep : aucune des quatre classes touchées n'est utilisée hors
  de `OnePage.tsx` ; `/cv` n'en contient aucune (vérifié à l'exécution, 0
  occurrence).
- axe-core : **3 violations, strictement identiques à celles du cycle 001**
  (`aria-prohibited-attr` sur `.city-heading`, `landmark-unique` sur `.pc-nav`,
  `region` sur `.language-toggle`), toutes hors zone prioritaire. Aucune
  violation `color-contrast` ni avant ni après — voir D3-a sur ce que ça vaut.
- Régression détectée : non.

### Reverté
- Aucun.

### Faux positif d'outillage identifié (à ne pas reproduire)
- Dans `zone-c018-before/*/capabilities.png`, la section apparaît **vide** :
  ni titre `.work-heading`, ni aucune des 4 cartes. Ce n'est pas un bug de
  rendu. `ui-zone-audit.mjs` prend sa capture d'élément quand le **haut** de la
  section entre dans le viewport ; les cartes, encore sous la ligne de
  flottaison, n'ont pas déclenché leur `useInView`. Recapturé après un scroll
  complet : titre, 4 cartes et 16 items intacts. C'est la leçon symétrique de
  celle du cycle 017 (« une mesure prise pendant un transform ne mesure pas le
  CSS ») : **une capture prise avant un reveal ne mesure pas le rendu**. Piste
  d'outillage si ça gêne à nouveau : une option `--after-full-scroll` sur
  `ui-zone-audit.mjs` pour capturer les sections au repos plutôt qu'à
  l'approche.

### État des chantiers structurels
- Vers l'Élysée : non commencé (iframe vérifiée réalisable cycle 003)
- Ombrair : non commencé (iframe vérifiée réalisable cycle 003)
- Analyse vidéo football : non commencé
- Démos projets existants : 3/3 conformes (inchangé depuis cycle 003)

### Prochain cycle — point de reprise exact
- La zone prioritaire n'a plus **aucun écart mesuré ouvert** : les quatre
  candidats chiffrés du backlog (largeur des liens de footer, contraste des
  kickers, spécificité du kicker de contact, cible tactile du bouton « retour
  en haut ») sont tous livrés. Les deux items encore ouverts sur la zone sont
  un arbitrage éditorial (`#about` sans ancre de preuve, rotation D ci-dessus)
  et un défaut intermittent (le voile du sélecteur de langue masque un mot de
  carte sur 390px à certaines positions de scroll).
- **Ouvrir « Vers l'Élysée » (§4.1)** en chantier principal — premier P1 de
  l'ordre imposé, reporté du cycle 017. Lire d'abord les conventions de carte
  projet dans `OnePage.tsx` (liste `.home-project-*`, `ProjectShowcaseCard`,
  `ProjectDetailModal`) pour s'y intégrer sans créer de pattern parallèle,
  puis carte projet + vue détail + démo iframe vers
  `political-destiny.vercel.app` (en-têtes vérifiés cycle 003 : `200 OK`,
  aucun `X-Frame-Options` ni `frame-ancestors`). Ton neutre imposé, angle
  « démarche de modélisation », titre affiché « Vers l'Élysée » (jamais
  « political destiny »), pas de lien repo tant que Q2 n'est pas tranchée.
- Chantier court à mener en ouverture si le temps le permet : traiter le voile
  du sélecteur de langue sur 390px (gouttière droite réservée sur les cartes,
  ou masquage du toggle au scroll descendant).

### Questions bloquantes ouvertes
- Q1, Q2, Q3, Q4 — voir `docs/ui-loop/QUESTIONS.md` (inchangées). Aucune
  nouvelle question ce cycle : les trois chantiers étaient des corrections
  appuyées sur des mesures, pas des arbitrages factuels.

---

## Cycle 017 — 2026-09-11 23:55

**Zone travaillée** : zone prioritaire (§3) uniquement — `#about` (révélation
du paragraphe « Analytical profile ») et `#capabilities` (chorégraphie d'entrée
des 4 cartes). Conformément à la consigne de run, les trois chantiers sont dans
la zone ; aucun chantier §4/§5 n'a été ouvert ce cycle.
**Rotation de questions** : **C — Mouvement**, la dernière des cinq encore
inexploitée (cycles précédents : D, E, D, A, B).

### Constats d'audit

Audit complet dans `docs/ui-loop/AUDIT-2026-09-11-cycle-017.md`. Résumé :

- **C1 — coût des animations** : `AnimatedLetter` instancie 376 `motion.span`
  (EN) / 397 (FR), chacun avec son `useTransform` abonné au scroll. Mesuré :
  **52 fps** sur un scroll continu programmé de 1,5 s à travers le paragraphe.
  Le coût runtime ne condamne pas l'effet — c'est son **état de départ** qui
  était le problème. L'effet est conservé tel quel.
- **C3 / P0** — Le plancher d'opacité `0.2` de `AnimatedLetter` n'est pas une
  valeur d'animation, c'est **l'état de repos** de tout caractère pas encore
  atteint par le scroll. Contraste mesuré (couleurs résolues via canvas) :
  texte `rgb(222,219,200)` sur `#101010` à 16px → **1.64:1**, soit 2,7x sous le
  garde-fou §6. Et ce n'est pas un flash : à 1440 le paragraphe est **100 %
  dans le viewport avec ses 376 caractères sous le seuil** (`y=4874`), et il
  faut **700 px de scroll** pour le rendre lisible — tous viewports, EN et FR
  — **P0**.
- **C3 / P0 (même cause, second défaut)** — `offset: ["start 0.8", "end 0.2"]`
  ne terminait la révélation que lorsque le bas du paragraphe atteignait 20 %
  de la hauteur du viewport. Aux trois viewports mesurés, le texte n'était
  intégralement lisible qu'avec `rect.top` entre **1 et 57 px** : au moment
  précis où il sort de l'écran. **Le paragraphe n'était jamais lisible en
  entier à une position de lecture confortable.**
- **P1** — `delay: index * 0.15` sur `.capability-card` est un stagger d'index
  de grille alors que `useInView` est **par carte**. Positions de scroll de
  révélation relevées : 390 → 4 entrées séparées (`y = 7105 / 7505 / 7905 /
  8305`), 768 → 2 entrées, 1440 et 1920 → 1 seule. Sur 390 la carte 4 arrive
  seule et attend quand même 450 ms avant un fondu de 650 ms : **1,1 s** entre
  « à l'écran » et « lisible », sans aucune sœur pour justifier le décalage —
  390 et 768 — **P1**.
- **P1** — `initial={{ scale: 0.95 }}` met à l'échelle **tout** le contenu de
  la carte pendant 650 ms : texte ré-échantillonné, bordure 1px amincie à
  0.95px, carte qui ment sur sa taille de 19 px (`h=356` au lieu de 375 à 390,
  `h=375` au lieu de 394 à 1440). **Résout un faux diagnostic** : le
  « `.capability-card a` mesuré à 42px » du cycle 016 n'était pas un défaut
  CSS — `.card-link` porte `min-height: 44px` depuis `dba2f53`, antérieur à la
  boucle, et 41.8 = 44 × 0.95. La mesure avait été prise pendant l'animation.
- **C2 — reduced-motion** : revérifié, rien à corriger. `AnimatedLetter`
  court-circuite `useTransform` (cycle 002), `WordsPullUp*` et `CapabilityCard`
  passent `initial={false}`. Capture 1440 EN inspectée : paragraphe et titre en
  opacité pleine, aucune animation résiduelle.
- **Nouveau constat non traité (plafond de 3 chantiers atteint)** : les trois
  `.site-footer-links a` font 44px de haut mais **17.7 à 40px de large**
  (`CV` 17.7×44, `Email` 31.9×44, `GitHub` 40×44, identique à 390/1440 et
  EN/FR). Le cycle 016 avait vérifié leur hauteur et les avait déclarés
  conformes ; leur largeur n'avait jamais été mesurée, et `CV` passe sous le
  plancher de 24px de WCAG 2.5.8. Consigné au backlog.

### Changements livrés
- `d614ce8` — ui(about): rendre le paragraphe Analytical profile lisible
  pendant qu'on le lit. Plancher porté à **0.58 (5.2:1)**, extrait en constante
  `REVEAL_FLOOR_OPACITY` documentée avec ses mesures et alignée sur la valeur
  déjà retenue au cycle 002 pour `.language-toggle-btn`. Fenêtre de révélation
  ramenée de `["start 0.8", "end 0.2"]` à `["start 0.85", "end 0.6"]`.
- `6d8b1ad` — ui(capabilities): caler le stagger des cartes sur la colonne
  réelle, pas sur l'index. Le nombre de colonnes est lu à l'exécution sur la
  grille (`gridTemplateColumns` + `ResizeObserver`, hook `useGridColumns`)
  plutôt que redupliqué en media query JS ; le pas devient `index % columns`,
  donc 0 en une colonne.
- `4c7aa53` — ui(capabilities): entrer les cartes par translation (`y: 16`) au
  lieu d'une mise à l'échelle.

### Vérification
- Build : ✅ (`npm run build` = `tsc -b && vite build`, vert avant chaque
  commit ; CSS 94.04 kB, JS 644.14 kB — aucune dérive depuis le cycle 015).
  `tsc --noEmit` : ✅ sans sortie.
- Viewports vérifiés : 390 / 768 / 1440 / 1920 (run `zone-c017-after`,
  10 combinaisons viewport × langue × motion, **0 erreur console**,
  **0 overflow horizontal** sur les 10).
- Langues : FR ✅ EN ✅ (aucun texte ajouté ce cycle ; les deux paragraphes,
  376 et 397 caractères, mesurés séparément).
- reduced-motion : ✅ (1440 FR + EN, captures inspectées).
- Nav clavier : ✅ — `.card-link`, `.site-footer-links a` et `.site-footer-top`
  reçoivent `:focus-visible` en `solid 2px` avec 4px d'offset, hauteur 44px.
- **Mesures avant/après du P0** (scroll à partir duquel le paragraphe est
  intégralement lisible, exprimé par sa position à l'écran) :

  | viewport | AVANT (`rect.top`) | APRÈS (`rect.top`) |
  | --- | --- | --- |
  | 390 | 1 px | **301 px** |
  | 1440 | 57 px | **457 px** |
  | 1920 | 36 px | **536 px** |

  Le texte est désormais entièrement lisible ~400 à 500 px de scroll plus tôt,
  à une position de lecture réelle, et son état atténué est à 5.2:1.
- **Mesures après du P1 cartes** : les 16 liens mesurent `44.00px` **à toutes
  les positions de scroll échantillonnées** (avant : 41.8px pendant l'entrée),
  et les hauteurs de carte ne varient plus pendant l'animation (375/394/414
  selon viewport et langue, identiques au repos). Le stagger 4 colonnes est
  intact à 1440/1920 (`1.00 / 0.99 / 0.93 / 0.68`), nul à 390.
- axe-core : **3 violations, strictement identiques à celles du cycle 001**
  (`aria-prohibited-attr` sur `.city-heading`, `landmark-unique` sur `.pc-nav`,
  `region` sur `.language-toggle`), toutes hors zone prioritaire. Aucune
  violation `color-contrast`. Aucune nouvelle violation introduite.
- Régression détectée : non.

### Reverté
- Aucun.

### Outillage ajouté ce cycle
- `scripts/ui-gallery.mjs` : options `--prescroll=no` et `--settle=<ms>`. Le
  passage de scroll de préchauffage consomme les reveals `once: true` ; sans
  ces options, **un chantier d'animation ne peut pas avoir de paire
  AVANT/APRÈS du tout** — la capture arrive toujours après la fin de l'entrée.
  Elles permettent de figer l'entrée à un instant choisi sur les deux
  révisions.
- Note d'honnêteté consignée dans la galerie : l'écart du chantier `scale` est
  **mesuré, pas photogénique** (le scale co-animait avec l'opacité, si bien
  qu'une capture isolant la taille sans isoler la luminosité n'existe pas). La
  légende le dit explicitement plutôt que de laisser croire que la paire le
  montre.

### État des chantiers structurels
- Vers l'Élysée : non commencé (iframe vérifiée réalisable cycle 003)
- Ombrair : non commencé (iframe vérifiée réalisable cycle 003)
- Analyse vidéo football : non commencé
- Démos projets existants : 3/3 conformes (inchangé depuis cycle 003)

### Prochain cycle — point de reprise exact
- Les cinq rotations de questions ont maintenant toutes été exploitées au moins
  une fois sur la zone prioritaire (D, E, D, A, B, C). Le dernier écart mesuré
  qui reste ouvert dans la zone est la **largeur** des trois liens du footer
  (`CV` 17.7×44, `Email` 31.9×44, `GitHub` 40×44) : ajouter un
  `padding-inline` à `.site-footer-links a` pour porter la boîte cliquable à
  44px de large sans toucher à la typographie ni à l'espacement perçu, puis
  re-mesurer aux 4 viewports dans les 2 langues. C'est un chantier court —
  le mener en ouverture de cycle.
- Chantier principal du cycle suivant : ouvrir **« Vers l'Élysée »** (§4.1),
  premier P1 de l'ordre imposé. Lire d'abord les conventions de carte projet
  dans `OnePage.tsx` (liste `.home-project-*`, `ProjectShowcaseCard`,
  `ProjectDetailModal`) pour s'y intégrer sans créer de pattern parallèle,
  puis carte projet + vue détail + démo iframe vers
  `political-destiny.vercel.app` (en-têtes vérifiés cycle 003). Ton neutre
  imposé, angle « démarche de modélisation », titre affiché « Vers l'Élysée »
  (jamais « political destiny »), pas de lien repo tant que Q2 n'est pas
  tranchée.

### Questions bloquantes ouvertes
- Q1, Q2, Q3, Q4 — voir `docs/ui-loop/QUESTIONS.md` (inchangées). Aucune
  nouvelle question ce cycle : les trois chantiers étaient des décisions
  d'exécution appuyées sur des mesures, pas des arbitrages factuels.

---

## Cycle 016 — 2026-09-11 22:30

**Zone travaillée** : zone prioritaire (§3) — `#capabilities` (titre de section
et rythme interne des 4 cartes), `.language-toggle` là où il flotte au-dessus
de cette zone, `.site-footer` (cible tactile du bouton « retour en haut »).
**Rotation de questions** : **B — Rythme & espace**, première rotation B
exploitée en profondeur (cycles précédents : D, E, D, A).

> Note de journalisation : les phases 1 à 6 de ce cycle ont été exécutées dans
> une session qui s'est arrêtée **pendant** la phase 7 — les trois commits
> étaient sur la branche et l'audit écrit, mais la galerie n'avait qu'un bloc
> sur trois et `PROGRESS.md` n'était pas à jour. Cette session a repris le
> cycle à la phase 6 : re-vérification complète sur l'état actuel du code
> (4 viewports × 2 langues × reduced-motion), puis phase 7 complète. Aucun
> quatrième chantier n'a été ouvert : le plafond de la Phase 4 est de 3.

### Constats d'audit

Audit complet dans `docs/ui-loop/AUDIT-2026-09-11-cycle-016.md`. Résumé :

- Le sélecteur de langue (`position: fixed`, fond entièrement transparent par
  parti pris) s'imprimait **littéralement** sur le texte des `.capability-card`
  sur 390px, où les cartes occupent toute la largeur : « Clear conclusions from
  complex sub**[EN]**ects ». Deux textes clairs superposés — le contraste n'est
  pas seulement < 4.5:1, il n'est pas défini — 390 — **P0**.
- `.work-heading` était en `clamp(1.25rem, 3vw, 2.5rem)`, soit **20px sur 390 et
  40px sur 1440**, entre un « Analytical profile » à 72px et un « Let us talk
  about… » à 86px : la section `#capabilities` n'avait pas de titre perçu sur
  mobile, elle commençait par un mur de cartes — 390 et 1440 — **P1**.
- Vides subis dans `.capability-card` : `justify-content: space-between` sur une
  hauteur de ligne fixe (420px/480px) répartissait le reliquat en deux poches
  variables, si bien que **les quatre titres de carte ne partageaient aucune
  ligne de base** (`y = 436/436/445/445` à 1440) — 1440 et 390 — **P1**.
- `gap` de `.work-grid` **rétrécissant quand le viewport grandissait**
  (12 → 8 → 4px) : à 1440 les quatre cartes se lisaient comme une dalle unique
  striée de filets, et aucune des trois valeurs ne reprenait l'échelle du reste
  de la page (`.home-project-list` : 1rem) — 1440 — **P1**.
- Longueur de ligne (3e question de la rotation B) : conforme partout
  (`.about-card p` en `max-w-3xl`, `.contact-panel p` en `max-w: 42rem`).
- Acquis des cycles précédents revérifiés intacts : reduced-motion du bloc
  Analytical profile (cycle 002), halo `--pc-amber-dim` (cycle 015), footer de
  clôture, aucun contenu invisible au scroll réel, aucun overflow horizontal.

### Changements livrés
- `264d58e` — ui(language-toggle): rendre le sélecteur lisible quand il flotte
  sur du contenu (voile radial `--overlay-scrim`, nouveau token, sans bord ni
  arête pour préserver le parti « typographie nue »). Ajoute aussi
  `scripts/ui-zone-audit.mjs` : audit ciblé de la zone prioritaire avec
  **timeout explicite par étape**, écrit parce que `ui-audit.mjs` se bloque
  silencieusement (backlog P2). Run complet en < 3 min.
- `8c77001` — ui(capabilities): remettre la section au niveau typographique et
  rythmique de ses voisines (reprise du pattern `.home-section-heading`
  kicker/h2/intro déjà utilisé par la section des slides projets, nouveau
  kicker FR+EN ; rythme interne de carte explicite 32/24/16px, carte
  dimensionnée par son contenu, lien épinglé en bas ; `gap` de `.work-grid`
  unifié à 1rem).
- `d0548d3` — ui(footer): porter le bouton « retour en haut » à 44px de hauteur
  tactile (39px mesuré auparavant).

### Vérification
- Build : ✅ (`npm run build` = `tsc -b && vite build`, vert ; CSS 94.04 kB,
  JS 644.14 kB — pas de dérive par rapport au cycle 015)
- Viewports vérifiés : 390 / 768 / 1440 / 1920 (run `zone-c016-after`,
  10 combinaisons viewport × langue × motion, 0 erreur console, 0 overflow
  horizontal sur les 10)
- Langues : FR ✅ EN ✅ (kicker « COMPÉTENCES / PREUVES », titre, sous-titre et
  les 4 cartes traduits, aucun texte orphelin)
- reduced-motion : ✅ (1440 FR + EN : titre, sous-titre et les 4 cartes en
  opacité pleine, aucune animation résiduelle)
- Nav clavier : ✅ — les 4 familles de cibles de la zone (`.capability-card a`,
  `.contact-links a`, `.site-footer-links a`, `.site-footer-top`) reçoivent
  bien `:focus-visible` avec un contour `solid 2px` et 4px d'offset.
- Rythme mesuré après coup : titres de carte à **101px** du haut de carte et
  liens à **25px** du bas, sur les 4 cartes, en 390/768/1440 et dans les 2
  langues. Les hauteurs de carte sont désormais égales par rangée
  (1440 : 394px × 4 en EN, 414px × 4 en FR).
- Contraste mesuré (couleurs résolues via canvas — un parsing manuel lit faux
  les couleurs `oklch()`) : kicker 4.52:1, titre h2 14.26:1, sous-titre 8.27:1,
  titre de carte 11.56:1, item de carte 6.19:1, lien de carte 11.56:1, toggle
  inactif 5.42:1. Aucune violation axe `color-contrast` sur les 10 runs.
- axe-core : 3 violations, **identiques à celles du cycle 001**, toutes hors
  zone prioritaire ou cosmétiques (`aria-prohibited-attr` sur `.city-heading`,
  `landmark-unique` sur `.pc-nav`, `region` sur `.language-toggle`). Aucune
  nouvelle violation introduite.
- Régression détectée : non.

### Reverté
- Aucun.

### Outillage ajouté ce cycle
- `scripts/ui-zone-audit.mjs` (commit `264d58e`) — audit ciblé de la zone
  prioritaire, timeout par étape, contournement du blocage de `ui-audit.mjs`.
- `scripts/ui-gallery.mjs` étendu pour que la galerie respecte « **un bloc par
  chantier**, pas par cycle » (§7bis) : le filtre de régénération ne remplaçait
  que par numéro de cycle, donc le 2e chantier d'un cycle effaçait le bloc du
  1er. Il compare maintenant le préfixe de fichier des captures. Ajout aussi
  d'un sélecteur CSS brut (`.site-footer` n'a pas d'id) et du cadrage
  `viewport:<cible>@<y>` — sans ancrage sur un élément, la paire AVANT/APRÈS du
  sélecteur de langue tombait sur une zone vide et ne montrait rien, d'où sa
  régénération.

### État des chantiers structurels
- Vers l'Élysée : non commencé (iframe vérifiée réalisable cycle 003)
- Ombrair : non commencé (iframe vérifiée réalisable cycle 003)
- Analyse vidéo football : non commencé
- Démos projets existants : 3/3 conformes (inchangé depuis cycle 003)

### Prochain cycle — point de reprise exact
- Ouvrir le chantier « Vers l'Élysée » (§4.1), premier P1 de l'ordre imposé
  maintenant que la zone prioritaire n'a plus de P0/P1 ouvert : lire d'abord
  les conventions de carte projet dans `OnePage.tsx` (liste `.home-project-*`
  et `ProjectDetailModal`) pour s'y intégrer sans créer de pattern parallèle,
  puis carte projet + vue détail + démo iframe vers
  `political-destiny.vercel.app` (en-têtes déjà vérifiés cycle 003). Ton neutre
  imposé, angle « démarche de modélisation », titre affiché « Vers l'Élysée »
  (jamais « political destiny »), pas de lien repo tant que Q2 n'est pas
  tranchée.
- Chantier de zone prioritaire à mener en parallèle (§3 impose au moins un par
  cycle) : porter `.capability-card a` de 42px à 44px de hauteur tactile —
  dernier écart mesuré de la zone, nouvellement consigné au backlog P2.

### Questions bloquantes ouvertes
- Q1, Q2, Q3, Q4 — voir `docs/ui-loop/QUESTIONS.md` (inchangées). Aucune
  nouvelle question ce cycle : les trois chantiers étaient des décisions
  d'exécution, pas des arbitrages factuels.

---

## Cycle 015 — 2026-09-11 17:40

**Zone travaillée** : zone prioritaire (§3) — identité visuelle du bloc
"Analytical profile". Chantier annexe : nettoyage de code mort dans
`src/sections/`.
**Rotation de questions** : A (Hiérarchie), avec la question nommée
explicitement par MISSION-UI.md §3 ("le bloc a-t-il une raison d'exister
visuellement, ou est-ce un paragraphe posé ?") comme fil conducteur, en
poursuite directe du point de reprise de cycle 003 (audit frais de la zone
prioritaire avant de passer aux nouveaux projets).

### Constats d'audit
- Build initial ✅. Le script `scripts/ui-audit.mjs` s'est bloqué sans
  erreur pendant 14+ minutes au milieu du scroll progressif du viewport
  `desktop-1920_en` (dernier fichier écrit : `scroll-01-y400.png`) — tâche
  arrêtée, remplacée par un script d'audit ciblé ad hoc (1440/390, FR/EN,
  captures de section) qui s'exécute en < 2 min sans problème. Cause du
  blocage non identifiée, consignée en P2 dans `BACKLOG.md` pour
  investigation future — ne pas relancer un run complet sans surveillance.
- Comparaison visuelle top-de-page / zone prioritaire (Rotation A) : le hero
  (photo, nav semi-transparente, tags) et les slides projets (visuels de
  graphiques, cartes à deux panneaux) ont une richesse texturale que la
  zone prioritaire n'avait pas entièrement rattrapée. `.contact-panel` avait
  déjà un radial-gradient (ajouté cycle 002) et `.work-section` a un
  `bg-noise`, mais `.about-card` ("Analytical profile") restait un fond
  plat `#101010` sans aucune texture — **P1**, réponse directe à la
  question nommée par la mission pour cette section précise.
- Les cartes "Capabilities", le panneau de contact et le footer, revérifiés
  visuellement (1440/390, FR/EN) : aucune régression, liens différenciés
  toujours en place (cycle 003), contraste toggle de langue toujours bon,
  footer toujours un point de clôture net — rien de nouveau à corriger
  dans ces trois blocs ce cycle-ci.
- En grepant l'usage réel de `src/sections/*.tsx` pour comprendre la
  richesse relative des blocs, confirmation que `About.tsx`, `Contact.tsx`,
  `Stack.tsx`, `Manifeste.tsx`, `FlowProjets.tsx` restent non importés
  (comme noté au cycle 001) et découverte que `Hero.tsx` et `Nav.tsx` du
  même dossier sont **également** morts (non repérés par l'audit initial) —
  **P2**, largement au-delà du seuil "2 cycles" de confirmation du
  garde-fou anti-suppression hâtive.

### Changements livrés
- `4d289d4` — ui(about): donner une identité visuelle propre au bloc
  Analytical profile (radial-gradient discret au token `--pc-amber-dim`,
  cohérent avec le traitement déjà appliqué à `.contact-panel`).
- `b1c77a5` — chore(sections): supprimer le premier jet abandonné non
  importé (`About`, `Contact`, `Stack`, `Manifeste`, `FlowProjets`, `Hero`,
  `Nav` dans `src/sections/`). Effet mesurable : CSS de prod
  106.68 kB → 94.04 kB (classes Tailwind scannées dans ces fichiers morts
  purgées). `DeepDive.tsx` (seul fichier encore utilisé du dossier) conservé.

### Vérification
- Build : ✅ (`npm run build` vert avant et après chaque commit ; `tsc -b`
  inclus dans le script `build`)
- Viewports vérifiés : 390 / 1440 (audit ciblé ad hoc ; 768/1920 non
  revérifiés ce cycle faute d'un run complet fiable de `ui-audit.mjs`, voir
  constat P2 ci-dessus — à refaire dès que le script est stabilisé)
- Langues : FR ✅ EN ✅
- reduced-motion : ✅ (aucune animation ajoutée, changement CSS statique
  uniquement ; suppression de fichiers non importés donc sans effet runtime)
- Régression détectée : non — capture avant/après du bloc "Analytical
  profile" comparée côte à côte, `console errors: []` après le nettoyage de
  `src/sections/`, capture full-page post-nettoyage inspectée visuellement
  (hero, slides, zone prioritaire tous intacts)

### Reverté
- Aucun

### État des chantiers structurels
- Vers l'Élysée : non commencé (vérification technique iframe faite cycle
  003 : `political-destiny.vercel.app` sans en-tête bloquant)
- Ombrair : non commencé (vérification technique iframe faite cycle 003 :
  `ombrair.vercel.app` sans en-tête bloquant)
- Analyse vidéo football : non commencé
- Démos projets existants : 3/3 conformes (inchangé depuis cycle 003)

### Prochain cycle — point de reprise exact
- La zone prioritaire (§3) est maintenant jugée au niveau du haut de page
  sur les critères audités à ce jour (identité visuelle, contraste,
  reduced-motion, clôture de page, liens différenciés). Passer au chantier
  P1 suivant dans l'ordre de priorité imposé (§2 Phase 4) : intégration de
  "Vers l'Élysée" (carte projet + page détail + section démo iframe vers
  `political-destiny.vercel.app`, ton neutre imposé par le sujet politique,
  angle "démarche de modélisation" pas "jeu"). Avant de coder l'iframe,
  vérifier les conventions existantes du composant carte/carrousel projet
  dans `OnePage.tsx`/`ProjectShowcaseCard` pour s'y intégrer sans créer de
  pattern parallèle. Traiter ensuite Ombrair dans la foulée si le contexte
  le permet (même mécanique d'iframe, même niveau de vérification
  technique déjà fait cycle 003). Continuer de consacrer au moins un
  chantier par cycle à la zone prioritaire pendant ce travail, même mineur
  (ex. le point P2 "vide en bas des cartes Capabilities", ou rejouer un
  audit Rotation B/C sur mobile une fois `ui-audit.mjs` stabilisé ou son
  successeur ad hoc formalisé).

### Questions bloquantes ouvertes
- Q1, Q2, Q3, Q4 — voir `docs/ui-loop/QUESTIONS.md` (inchangées depuis
  cycle 001). Q2 et Q3 (repo GitHub public pour Vers l'Élysée / Ombrair)
  redeviennent pertinentes dès le prochain cycle puisque leur chantier
  commence.

---

## Cycle 003 — 2026-09-11 (reconstitué a posteriori)

> Note de journalisation : cette entrée est écrite au cycle 004, après coup.
> Le cycle 003 avait bien exécuté les phases 1 à 6 (travail vérifié et commité :
> `06314b8`, `0f6ebdf`) mais la session s'était arrêtée avant la phase 7 — le
> brouillon de journal (`PROGRESS.md`, `BACKLOG.md`, l'audit cycle 002) était
> resté en modifications non commitées, sans entrée "Cycle 003" écrite.
> Reconstitué ici à partir des commits et de `BACKLOG.md` pour ne pas perdre le
> point de reprise — cf. règle §7 "un cycle non journalisé est un cycle perdu".

**Zone travaillée** : zone prioritaire (§3) — crédibilité de la section
"Capabilities" (les 4 cartes de compétence). Vérifications annexes : en-têtes
HTTP des démos à déployer (`political-destiny.vercel.app`, `ombrair.vercel.app`,
`jobtrackr-lake.vercel.app`) pour préparer le chantier §4/§5.
**Rotation de questions** : D (Crédibilité), poursuite directe du point de
reprise noté en fin de cycle 002.

### Constats d'audit
- Les 4 cartes "capabilities" pointaient toutes vers `#contact` avec un CTA
  générique alors que le titre de section promet des compétences "reliées à
  des projets réels" (AUDIT-2026-09-11 P1, confirmé cycle 002) — 1440 et 390
  — **P1**.
- Vide résiduel en bas de carte (`.capability-card`, `justify-content:
  space-between` sur hauteur de ligne fixe 480px à partir de 1024px) : la
  variation de hauteur du vide entre cartes selon la longueur du texte reste
  présente — jugé mineur une fois le lien différencié en place, non traité.
- `curl -I https://political-destiny.vercel.app` → `200 OK`, aucun
  `X-Frame-Options` ni `Content-Security-Policy: frame-ancestors` — iframe
  live confirmée réalisable (format 1, §5) pour le futur chantier "Vers
  l'Élysée".
- `curl -I https://ombrair.vercel.app` → `200 OK`, aucun en-tête bloquant —
  iframe live confirmée réalisable pour le futur chantier "Ombrair".
- `curl -I https://jobtrackr-lake.vercel.app` → `X-Frame-Options: DENY` —
  iframe bloquée par l'application elle-même ; décision définitive de rester
  au carrousel de captures annotées déjà en place (format 3, conforme à la
  règle "si l'iframe est bloquée, descends d'un niveau").

### Changements livrés
- `06314b8` — ui(capabilities): lier chaque carte de compétence à une preuve
  concrète (BI → `/cv#experience`, Data Engineering → Football Data Pipeline,
  Analytical Projects → Retirement Sustainability Model, Portfolio Systems →
  profil GitHub, au lieu d'un `#contact` générique partagé par les 4 cartes).
- `0f6ebdf` — ui(capabilities): resserrer le vide vertical avant/après la
  section Capabilities.

### Vérification
- Build : ✅ (`npm run build` vert avant chaque commit)
- Viewports vérifiés : 390 / 768 / 1440 / 1920 (revue visuelle manuelle ;
  aucun run `ui-audit.mjs` complet dédié à ce cycle avant l'arrêt de session)
- Langues : FR ✅ EN ✅
- reduced-motion : ✅ (aucune animation nouvelle introduite)
- Régression détectée : non

### Reverté
- Aucun

### État des chantiers structurels
- Vers l'Élysée : non commencé (vérification technique iframe faite, voir
  constats d'audit)
- Ombrair : non commencé (vérification technique iframe faite, voir constats
  d'audit)
- Analyse vidéo football : non commencé
- Démos projets existants : 3/3 conformes (JobTrackr confirmé définitivement
  en format 3 — carrousel — l'iframe étant bloquée côté application)

### Prochain cycle — point de reprise exact
- Le lien différencié par carte "Capabilities" fermait le dernier chantier P1
  ouvert dans la zone prioritaire (§3). Lancer un audit complet frais
  (`node scripts/ui-audit.mjs`) sur l'état actuel du code pour vérifier s'il
  reste des P0/P1 non détectés dans la zone prioritaire, avec une rotation de
  questions encore peu exploitée (A — Hiérarchie, ou B — Rythme & espace).
  Si la zone prioritaire est confirmée propre, passer au chantier P1 suivant
  dans l'ordre de priorité imposé (§2 Phase 4) : intégration des nouveaux
  projets (§4), en commençant par "Vers l'Élysée" (iframe déjà vérifiée
  techniquement réalisable ce cycle).

### Questions bloquantes ouvertes
- Q1, Q2, Q3, Q4 — voir `docs/ui-loop/QUESTIONS.md` (inchangées depuis cycle 001).

---

## Cycle 002 — 2026-09-11 (reconstitué a posteriori)

> Note de journalisation : cette entrée est écrite au cycle 003, après coup.
> Le cycle 002 avait bien exécuté les phases 1 à 6 (travail vérifié, commité,
> et même partiellement audité dans `docs/ui-loop/AUDIT-2026-09-11-cycle-002.md`)
> mais la session s'était arrêtée avant la phase 7. Reconstitué ici à partir
> des commits, de `BACKLOG.md` et de l'audit cycle 002 pour ne pas perdre le
> point de reprise — cf. règle §7 "un cycle non journalisé est un cycle perdu".

**Zone travaillée** : zone prioritaire (§3) — section "Analytical profile"
(reduced-motion, fenêtre de révélation du titre) et clôture de page (footer,
contraste du toggle de langue, lien CV, panneau de contact).
**Rotation de questions** : E (Mobile-first réel), en reprise directe des
constats P0 du cycle 001.

### Constats d'audit
- Confirmation visuelle post-fix : `AnimatedLetter` s'affiche en opacité
  pleine sous reduced-motion (laptop-1440) — corrige P0-1 cycle 001.
- Footer mobile-390 recomposé en colonne centrée (pas un simple empilement
  du layout desktop), liens `.site-footer-links a` avec `min-height: 44px` —
  conforme zones tactiles.
- Contraste bouton de langue inactif recalculé : `rgba(225,224,204,0.58)` sur
  fond noir ≈ 5.41:1 (seuil AA 4.5:1) — marge suffisante.
- Fenêtre de révélation du titre "Analytical profile" resserrée mais non
  revérifiée en scroll continu rapide réel (limite outil : captures pas à
  pas) — à surveiller si le problème réapparaît visuellement.
- Constat additionnel non retraité ce cycle-là : les 4 cartes "Capabilities"
  restent visuellement identiques avec un vide non maîtrisé en bas de carte
  — laissé en P1 pour un cycle suivant (traité cycle 003, voir plus bas).

### Changements livrés
- `1a756ce` — ui(about): respecter reduced-motion et le rythme de scroll réel
- `00691e7` — ui(nav): contraste du bouton de langue inactif conforme WCAG AA
- `85140a2` — ui(footer): footer de clôture, lien CV et rééquilibrage du panneau contact
- `10eacfb` — ui(footer): resserrer l'espace mort entre le panneau contact et le footer

### Vérification
- Build : ✅ (`npm run build` vert avant chaque commit)
- Viewports vérifiés : 390 / 768 / 1440 / 1920 (run `2026-09-11T11-34-08-514Z`)
- Langues : FR ✅ EN ✅
- reduced-motion : ✅ (c'est la vérification qui a confirmé le fix P0-1)
- Régression détectée : non

### Reverté
- Aucun

### État des chantiers structurels
- Vers l'Élysée : non commencé
- Ombrair : non commencé
- Analyse vidéo football : non commencé
- Démos projets existants : 2/3 pleinement conformes (inchangé depuis cycle 001)

### Prochain cycle — point de reprise exact
- Traiter le P1 "Crédibilité de la zone Capabilities" (BACKLOG.md) : les 4
  cartes pointent toutes vers `#contact` avec un CTA générique alors que le
  titre de section promet des "compétences reliées à des projets réels".

### Questions bloquantes ouvertes
- Q1, Q2, Q3, Q4 — voir `docs/ui-loop/QUESTIONS.md` (inchangées depuis cycle 001).

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
