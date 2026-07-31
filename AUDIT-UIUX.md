# Audit UI/UX — Portfolio Axel Corral

**Méthode :** navigation réelle Playwright/Chromium (pas de lecture de code pour deviner le comportement), sur l'URL de production `https://portfolio-6j2w7itkt-axel-corral-s-projects.vercel.app/`, dans 4 configurations : **A** Desktop 1440×900 EN, **B** Desktop 1440×900 FR, **C** Mobile 390×844 EN, **D** Mobile 390×844 FR. Aucun fichier du repo n'a été modifié dans le cadre de cet audit.

**Captures d'écran :** stockées hors du repo (pour ne pas polluer git) dans un dossier scratch local. Les images ci-dessous sont référencées par chemin absolu — ouvre ce rapport dans un éditeur qui résout les images `file://` (VS Code, par exemple) pour les voir inline, ou ouvre le dossier directement :
`C:\Users\AxelC\AppData\Local\Temp\claude\D--Project-claude-code-portfolio\e12823d7-9153-4904-8c64-f6a0d806dc16\scratchpad\audit-uiux\`

---

## 1. Synthèse exécutive

Le portfolio est visuellement très abouti (double-exposition, transitions GSAP/Lenis soignées, carrousels de case studies riches) et le message central — qui est Axel, quel poste il vise (Analyst/Data Engineer junior), comment voir ses projets et son CV — passe bien en moins de 60 secondes, en desktop comme en mobile. Le problème n'est pas la première impression, c'est ce qu'un recruteur qui creuse un peu (30 secondes de plus) découvre : deux liens de dépôt cassés sur trois projets, une fonctionnalité signature (la "Personal Layer") totalement non traduite en français, un bug d'affichage qui tronque un paragraphe entier de la section Experience, et un PDF de preuve technique qui contient encore un placeholder de brouillon. Ce sont des détails qui, pris individuellement, semblent mineurs, mais qui cumulés donnent une impression de travail pas tout à fait fini — exactement le type de signal qu'un recruteur technique junior ne peut pas se permettre d'envoyer.

**Constats par gravité :** 10 [CASSÉ] · 5 [NUIT À LA CANDIDATURE] · 16 [AMÉLIORABLE] · 6 [SUGGESTION]

**Console navigateur :** propre sur les 4 configurations (0 erreur, 0 warning bloquant, aucun 404 d'asset JS/CSS/image/police).

**Verdict : prêt à être montré à des recruteurs — OUI, après correction des points du TOP 5 (section 4).** Aucun des bugs trouvés n'est structurel (l'architecture, l'i18n de base, la performance et l'accessibilité générale sont saines) ; ce sont des corrections ciblées, dont trois quasi gratuites en effort (liens de repo, PDF), qui suffisent à passer d'un site "presque parfait" à un site sans aspérité pour un œil de recruteur pressé.

---

## 2. Constats [CASSÉ]

### C1 — Débordement de texte horizontal, section About/Experience
**Config :** A, B (desktop) · **Capture :** `desktop-en\04-BUG-about-text-overflow.png`, `desktop-fr\02-about-overflow-bug-fr.png`

La phrase de présentation ("I am currently building my path toward data analysis and data engineering...") ne passe jamais à la ligne et sort de sa carte — la fin de la phrase est invisible. Cause : chaque espace a été remplacé par un `&nbsp;` dans des `<span>` séparés (probablement pour une animation lettre-par-lettre), ce qui supprime tout point de rupture de ligne (`scrollWidth: 2595px` pour un conteneur de `768px`). Section atteignable directement via le lien de nav "Experience" — donc très visible.
**Correctif :** ne pas remplacer les espaces par `&nbsp;` dans le split d'animation ; garder un espace normal entre les mots.

### C2 — Lien GitHub JobTrackr → 404
**Config :** A, B, C, D (tous) · **Capture :** `desktop-en\16-BUG-jobtrackr-github-404.png`, `mobile-en\17-jobtrackr-repo-404.png`

`github.com/AxelCorral/jobtrackr` renvoie une 404 GitHub (signature de repo privé/inexistant), reproductible dans les 4 configurations, y compris dans le CTA final du carrousel mobile ("Deployed. Used daily. Not done." → "View repository"). JobTrackr est justement le projet mis en avant comme "déployé et utilisé quotidiennement" — un recruteur qui va au bout ne peut rien vérifier.
**Correctif :** rendre le repo public, ou corriger l'URL si le repo a été renommé.

### C3 — Lien GitLab football-pipeline → redirection sign-in (403)
**Config :** A, B (via le modal "Open case study", desktop) · **Capture :** `desktop-en\15-BUG-gitlab-signin-redirect.png`, `desktop-fr\05-modal-links-fr.png`

Dans l'onglet "Links/Liens" du modal, le lien GitLab redirige vers `/users/sign_in`. D'autant plus gênant que l'onglet "Results/Résultats" du même modal cite "GitLab CI/CD stages" comme preuve de rigueur — preuve invérifiable.
**Correctif :** rendre le mirror GitLab public, ou retirer ce lien du modal.

### C4 — Modal "Open case study" : Échap ne ferme pas la fenêtre
**Config :** A (testé, comportement probablement identique en B) · **Capture :** `desktop-en\19-modal-escape-check.png`, `19b-modal-escape-check2.png`

Confirmé sur deux appuis consécutifs. Seuls le clic sur le X et le clic extérieur fonctionnent — incohérent avec les autres overlays du site (le modal "Expand to full screen" et les popovers de la Personal Layer se ferment bien à l'Échap).
**Correctif :** brancher le listener Escape sur ce modal comme sur les autres.

### C5 — Modal "Open case study" : aucun focus trap clavier
**Config :** A · **Capture :** `desktop-en\40-BUG-modal-no-focus-trap.png`

En Tab depuis l'intérieur du modal, le focus s'échappe en 1-2 Tab vers la nav de fond, totalement invisible derrière l'overlay. Le contenu de fond n'est pas rendu `inert`/`aria-hidden` pendant l'ouverture (deux "Results" détectés simultanément dans l'arbre d'accessibilité).
**Correctif :** `inert` sur le contenu de fond + focus trap tant que le dialog est ouvert.

### C6 — "Personal Layer" entièrement non traduite en français
**Config :** B, D (desktop et mobile) · **Capture :** `desktop-fr\06-personal-layer-fr.png`, `07-hotspot-untranslated-fr.png`, `mobile-fr\11-personal-layer-fr.png`, `12-accordion-untranslated-fr.png`

Le bouton déclencheur est bien traduit ("Couche personnelle"), mais une fois ouvert, tout le contenu reste en anglais : titre, sous-titre, instruction, les 5 items (hotspots desktop / accordéon mobile) et leur contenu déplié. C'est la fonctionnalité la plus différenciante du site ("storytelling personnel") et elle échappe totalement à l'i18n, en desktop comme en mobile.
**Correctif :** brancher ce composant sur le même système d'i18n que le reste du site — visiblement développé/branché séparément.

### C7 — Badge "PROJECT 01" non traduit dans le header du modal "Open case study"
**Config :** B · **Capture :** `desktop-fr\04-case-study-modal-fr.png`

Sur la carte projet hors modal, c'est bien "PROJET 01" ; dans le modal, l'en-tête affiche "PROJECT 01 · INGÉNIERIE DES DONNÉES" — mélange anglais/français dans la même ligne.
**Correctif :** clé i18n manquante spécifique au header du modal.

### C8 — Bouton "Discover the personal layer" invisible/non cliquable (chevauché par le dernier carrousel)
**Config :** C, D (mobile) · **Capture :** `mobile-en\25c-recheck.png`, `26-check-scroll.png`

Le bouton est bien en flux normal (`.home-projects-footer`) mais `elementFromPoint()` à cette position renvoie le dernier slide du carrousel Projet 3 — le carrousel chevauche visuellement et interactivement le CTA situé juste après lui. Le bouton "Personal layer" alternatif du hero reste heureusement fonctionnel.
**Correctif :** vérifier le z-index/positionnement du dernier slide de carrousel par rapport à `.home-projects-footer` en mobile.

### C9 — Texte d'accroche du scroll tronqué en français ("AITES DÉFILER...")
**Config :** D (mobile FR uniquement) · **Capture :** `mobile-fr\03-scroll-hint-clipped.png`

Le texte "Faites défiler pour passer du contexte au savoir-faire" est affiché en `white-space: nowrap` (410px réels dans un conteneur de 390px, `overflow: hidden`) — le F initial et le "e" final sont coupés. La version anglaise, plus courte, ne déborde pas.
**Correctif :** `white-space: normal` ou réduction de la taille de police sous ce breakpoint pour ce texte spécifique.

### C10 — Aria-labels de navigation des carrousels non traduits en FR
**Config :** D (mobile, vérifié via snapshot d'accessibilité) — couverture non vérifiée en B

Les items du tablist sont bien traduits ("Étape 01 — Ingestion"), mais le label du `<nav>` reste "Slide navigation", le tablist "Go to slide", et les boutons "Previous slide" / "Next slide" / "Expand to full screen" — alors que d'autres aria-labels du site sont bien traduits ("Navigation principale"). Couverture i18n incomplète plutôt qu'absente.
**Correctif :** compléter les clés `aria-label` du composant carrousel partagé pour la locale FR.

---

## 3. Constats [NUIT À LA CANDIDATURE]

### N1 — Aucun lien vers la démo live déployée de JobTrackr
**Config :** A, B · **Capture :** `desktop-en\29-project2-lastslide.png`

Le texte affirme "Deployed. Used daily. Not done." avec mention explicite "Live on Vercel + Neon", mais aucune URL cliquable vers l'app elle-même n'existe (carte, carrousel, modal) — seulement vers le repo GitHub cassé (C2). Impossible de tester le produit annoncé comme déployé.
**Correctif :** ajouter un lien direct vers l'app Vercel déployée.

### N2 — CV téléchargeable disponible uniquement en français, même depuis la version EN du site
**Config :** A, B, C, D · **Capture :** `desktop-en\09-cv-pdf-en.png`, `mobile-en\34-cv-pdf.png`

Le même fichier `cv-axel-corral.pdf` (en français) est pointé par "View CV" qu'on soit en EN ou en FR. Un recruteur anglophone cliquant "CV" depuis la version EN tombe sur un document entièrement en français.
**Correctif :** version EN du CV liée quand le site est en EN, ou a minima mention explicite "CV disponible en français".

### N3 — Zone visuellement "morte" entre les case studies et la section Experience/About
**Config :** A, B · **Capture :** `desktop-en\29-project2-lastslide.png` (bas), `03-scroll-4500.png`

Après la densité des 3 cartes projets, ~200-300px de noir quasi vide avec seulement deux petits liens flottants. Peut donner l'impression que la page s'est interrompue.
**Correctif :** réduire l'espacement ou ajouter un élément de transition visuelle.

### N4 — Toggle de langue EN·FR flottant chevauche les titres de section sur tout le reste de la page
**Config :** C, D (mobile) · **Capture :** `mobile-en\06-project01-card-top.png`, `07-project01-carousel-slide1.png`

`.language-toggle` est `position: fixed`, totalement transparent dès qu'on sort de la nav de l'intro (qui a un fond opaque). Le pill "EN · FR" reste collé en haut à droite en permanence et se superpose visuellement à tout texte qui défile en dessous (titres, kickers de slides). Reste cliquable, mais rendu peu soigné.
**Correctif :** fond opaque/flou permanent sur `.language-toggle`, ou repositionnement en `sticky` dans la nav plutôt qu'en `fixed` global.

### N5 — Le PDF du rapport retraites contient un placeholder visible "[À compléter]"
**Config :** confirmé en C, D · non re-vérifié explicitement en A/B mais fichier identique quel que soit le viewport · **Capture :** `mobile-en\23-report-pdf.png`

Le PDF `memoire-retraites-cor-2026.pdf` s'ouvre sans 404, mais sa première page affiche littéralement "[À compléter]" entre le sous-titre et la date. Ce lien est mis en avant comme preuve de rigueur du projet retraites.
**Correctif :** régénérer le PDF sans le placeholder, ou retirer temporairement le lien "View report".

---

## 4. [AMÉLIORABLE] et [SUGGESTION]

### AMÉLIORABLE

1. Bouton "Open case study" présent uniquement sur le Projet 01, absent des Projets 02/03 (A/B) — incohérence d'affordance entre les 3 case studies.
2. Zone de clic fragile pour "Open case study" pendant le scroll-into-view automatique — clic parfois intercepté par un panneau voisin (A).
3. "Expand to full screen" n'est pas un vrai plein écran, juste une carte agrandie sur fond assombri — libellé trompeur (A/B).
4. Comportement Échap incohérent entre les différents overlays du site (cf. C4) (A).
5. Fermeture de la Personal Layer depuis le haut de page dépose l'utilisateur à ~397px, en pleine frame de crossfade confuse du hero (A).
6. La nav principale disparaît définitivement après ~1500px de scroll et ne revient jamais, sur une page de ~7500px (A/B).
7. Contraste limite sur les libellés "eyebrow" (`rgba(225,224,204,0.52)` sur noir ≈ 4,5:1, marge de sécurité nulle) (A/B).
8. Les 4 cartes "Capabilities" ont toutes un "Learn more" qui saute directement à `#contact` plutôt que d'approfondir la compétence (A/B).
9. Doublons dans l'ordre de tabulation clavier du hero (structure DOM dupliquée pour l'effet de transition scroll) (A).
10. Popover du hotspot "AI playground" visuellement collé au bouton "Close" du dialogue parent (A).
11. Formatage des nombres non localisé en FR : "1752" au lieu de "1 752" (B).
12. Titre d'onglet navigateur non traduit en FR (B).
13. CTA "Voir le repository" (mélange FR/EN, au lieu de "Voir le dépôt" utilisé ailleurs) sur la slide 8/8 JobTrackr (D).
14. Chevauchement de texte bref pendant la transition de scroll de l'intro (~scrollY 400), purement transitoire (C).
15. Contraste réduit sur les liens secondaires "subtle-link" (View CV / GitHub / Contact) — opacité 60% sur fond sombre (C/D).
16. Beaucoup d'espace vide dans la modale plein écran sur les slides courtes des carrousels mobile (C/D).

### SUGGESTION

1. Bouton "retour en haut" flottant, vu la longueur de page et l'absence de nav persistante.
2. Lien direct vers la démo Vercel déployée de JobTrackr (cf. N1).
3. Uniformiser la présence du bouton "Open case study" sur les 3 projets.
4. Version anglaise du CV téléchargeable, ou mention explicite de la langue.
5. Intégrer 1-2 visuels de graphiques Matplotlib réels dans le carrousel retraites (actuellement uniquement des stats textuelles).
6. Ajouter un lien LinkedIn dans la section Contact (canal principal des recruteurs, seuls Email et GitHub sont proposés).

---

## 5. TOP 5 des corrections (quick wins d'abord)

| # | Correction | Impact | Effort |
|---|---|---|---|
| 1 | Rendre publics (ou corriger les URLs) des repos **GitHub JobTrackr** et **GitLab football-pipeline** (C2, C3) | Majeur — crédibilité technique, preuve de code vérifiable | Quasi nul (visibilité de repo ou correction d'URL) |
| 2 | Régénérer le **PDF retraites** sans le placeholder "[À compléter]" (N5) | Majeur — donne une impression de brouillon non nettoyé | Quasi nul (régénération ou retrait temporaire du lien) |
| 3 | Corriger le **débordement de texte de la section About/Experience** (C1) — ne pas casser le word-wrap avec les `&nbsp;` de l'animation lettre-par-lettre | Majeur — contenu illisible sur une section nommée dans la nav | Faible à moyen (fix ciblé du split d'animation) |
| 4 | Traduire entièrement la **Personal Layer** en français (C6, C7, C10) | Majeur — fonctionnalité signature cassée pour tout visiteur FR | Moyen (contenu à traduire + branchement i18n d'un composant visiblement isolé) |
| 5 | Ajouter le **lien vers la démo live déployée de JobTrackr** (N1) | Moyen-élevé — le texte annonce "Deployed. Used daily." sans preuve cliquable | Faible (un lien à ajouter) |

---

## 6. Annexe — Parcours 60 secondes (récit vécu)

### Config A — Desktop, EN (langue par défaut)

**0–5s :** Chargement sur une image de ville en double-exposition très soignée. Logo "AXEL", nav claire (Profile / Projects / Skills / Experience / CV), bouton Contact, toggle EN·FR. Le bandeau "AXEL CORRAL · TOULOUSE / FRANCE" confirme **qui** c'est immédiatement.

**5–15s :** "Data systems built for clarity." puis "Data Analyst / Junior Data Engineer working with Power BI, SQL, Python, dashboards, pipelines and reproducible analysis." → **le poste visé est explicite en moins de 15 secondes.**

**15–25s :** Deux CTA visibles ("View projects" / "View selected work" — légèrement redondants), et "SCROLL TO MOVE FROM CONTEXT TO CRAFT" indique l'action suivante. Les 3 critères (qui / poste / comment voir projets et CV) sont déjà couverts sans avoir scrollé.

**25–40s :** Scroll — transition en fondu vers une deuxième scène (silhouette, ordinateur portable, ciel doré), impressionnante mais "pinnée" assez longtemps (~1000px) sans nouvelle information ; seul moment du parcours où l'esthétique prend le pas sur l'information.

**40–55s :** "Data work you can inspect." → premier projet (Football Data Pipeline) avec stack claire (Python, pandas, AWS S3/Glue/Athena), lien repo et chiffre-clé ("1,752 documented matches") — preuve technique immédiate et convaincante.

**55–60s :** Le temps s'arrête avant d'avoir vu les 3 projets, mais CV et projets sont déjà mémorisés comme accessibles depuis 0-15s. **Aucun des 3 critères imposés n'échoue le test.** Seul point de friction : la zone de transition pinnée (25-40s), non bloquante mais sans gain d'information.

### Config C — Mobile, EN (usage principal attendu : clic depuis LinkedIn)

**0–5s :** Chargement quasi instantané, aucune erreur console. Hero avec photo urbaine, "AXEL" en haut, bouton Contact, toggle EN/FR. Nom et localisation visibles dès l'écran 1 avec "Data systems built for clarity."

**5–15s :** "Data Analyst / Junior Data Engineer working with Power BI, SQL, Python, dashboards, pipelines and reproducible analysis." répond sans ambiguïté à "quel poste ?". Deux CTA visibles dès le premier écran.

**15–35s :** Scroll — l'intro (~240vh) semble un peu longue pour du mobile pressé : entre 800 et 1600px, l'image et le texte central restent quasi figés (léger effet de scroll mort) avant la section suivante. Vers 800-1200px : confirmation du positionnement et accès direct aux liens "View CV · Download · GitHub · Contact" — les 3 informations clés sont déjà réunies avant les case studies.

**35–55s :** Arrivée sur "Data work you can inspect." et le premier project card. Chevauchement visuel immédiat du toggle EN/FR sur le kicker "Analytical SQL" (cf. N4) — détail qui accroche l'œil sans bloquer la lecture. Carrousel clair (pagination 01/08, flèches), tags techniques visibles.

**55–60s :** Bilan : qui est Axel (nom, ville, positionnement), le poste visé (explicite dans le H1), et comment accéder au CV et aux projets (liens visibles dès ~800px de scroll) sont **tous les trois couverts dans la fenêtre des 60 secondes**, mais de justesse sur le 3ᵉ point — le CV n'est pas accessible depuis l'écran 1 pur, il faut scroller un peu. Le point le plus susceptible de décourager un scroll rapide reste la longueur perçue de l'intro pinnée.
