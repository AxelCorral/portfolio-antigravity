# Journal — Boucle d'amélioration continue UI

> Ordre antéchronologique : la dernière entrée est en haut.
> Ce fichier est la **seule mémoire** entre les cycles. Il doit toujours permettre
> à une session neuve de reprendre sans rien relire d'autre que `MISSION-UI.md`.

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
