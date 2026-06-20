# Build 04 — Carrousel projets « manège » + détail en pop-up + ancrage de l'orbe
> À lancer dans Claude Code : `Get-Content -Raw prompt.md | claude`
> Repo : `D:\Project_claude_code\portfolio` (builds 01→03 en place et validés).

---

## ÉTAT ACTUEL
Navigation par étapes (Observer) OK, tracé SVG + orbe lumineux + marqueurs cliquables OK, fallback reduced-motion/mobile OK. **Deux problèmes à corriger** dans ce build :
1. La section **Flow Projets affiche les 4 cartes d'un coup**, sans hiérarchie. → la remplacer par un **carrousel « manège »** piloté au scroll.
2. **L'orbe/tracé se balade de façon décorative** (un peu au hasard). → l'**ancrer aux éléments réels** du portfolio.

## INSTALLER
Ajoute le plugin **Flip** de GSAP (gratuit) pour la transition carte→détail (effet « ouverture d'app macOS ») :
```
gsap.registerPlugin(Flip); // en plus de Observer, MotionPathPlugin, DrawSVGPlugin, ScrollTrigger
```

---

## TÂCHE 1 — Carrousel « manège » (remplace la rangée statique)
Dans la section Flow Projets, dispose les 4 cartes comme un **manège / deck en perspective** :
- **Carte active** : premier plan, centrée, pleine taille, nette, lumineuse.
- **Autres cartes** : reculées en profondeur sur un arc — `scale` réduit (~0.6–0.72), `translateZ` négatif, décalées sur les côtés, `opacity` ~0.3–0.5, léger `blur`.
- Implémentation recommandée (plus simple et responsive que un vrai cylindre 3D pour 4 cartes) : calcule le transform de chaque carte à partir de `offset = cardIndex - activeIndex`. `offset 0` = avant-centre ; `offset > 0` = arrière-droite ; `offset < 0` = **arrière-gauche empilé** (les projets déjà vus s'accumulent à gauche, « comme si le manège avait tourné »). Container avec `perspective`.
- **Rotation** : quand `activeIndex` change, anime toutes les cartes vers leur nouveau slot avec GSAP (`--ease-float`, ~0.8s). transform + opacity (+ blur léger) uniquement.

## TÂCHE 2 — Séquence par étapes (machine à états, précise)
Dans Flow Projets, l'ordre exact des crans de scroll est :
```
P1-focus  →  P1-detail  →  P2-focus  →  P2-detail  →  P3-focus  →  P3-detail  →  P4-focus  →  P4-detail  →  (sortie vers section suivante)
```
- `Pn-focus` : projet n au premier plan, carrousel en place.
- cran suivant → `Pn-detail` : le **détail s'ouvre en pop-up** (cf. tâche 3).
- cran suivant → **referme le détail ET fait tourner le manège** vers `P(n+1)-focus` en **une seule transition combinée** (le projet n recule en arrière-gauche).
- après `P4-detail`, le cran suivant **descend** vers la section d'après ; un cran vers le haut sur `P1-focus` remonte à la section précédente.
- Intègre ces sous-étapes au moteur Observer existant (`currentStep` global). Conserve l'anti-rafale (un geste = une étape, `isAnimating`).

## TÂCHE 3 — Détail en pop-up (« ouverture d'app macOS »)
- À `Pn-detail`, ouvre un **panneau de détail** qui occupe la grande majorité de l'écran, via **GSAP Flip** : la carte active s'**agrandit depuis sa propre position/taille** vers le panneau plein écran (transform-origin = la carte), léger overshoot (`back.out`) → effet d'app qui s'ouvre. Le reste du carrousel passe en retrait (dim/blur).
- Le panneau est **un seul écran résumé** (pas de scroll interne, pas de multi-étapes) : titre, thesis, chiffre clé (garde le tag Fictif), stack, et un **CTA « Voir le détail complet → »**.
- Le CTA pointe vers une **cible de deep-dive par projet** : pour `analyse-video-football`, réutilise la section **DeepDive** existante ; pour les autres, crée une **cible placeholder** (route/ancre `#/projet/<id>` ou section stub) — le contenu détaillé complet sera un build ultérieur. Câble juste la navigation maintenant.
- Fermeture (au cran suivant) : Flip retour de la carte à sa place **pendant** que le manège tourne vers le projet suivant.

## TÂCHE 4 — Ancrer l'orbe et le tracé aux éléments réels
L'orbe doit **suivre les éléments du portfolio**, pas flotter au hasard :
- Marque les éléments d'ancrage avec `data-orb-anchor="<step-id>"` : le label de section, la **carte active** du carrousel, le **panneau de détail** ouvert, les titres des sections (Hero, Stack, About, Contact).
- À chaque étape, calcule la position de l'ancre active via `getBoundingClientRect()` et fais **docker l'orbe à proximité** de cet élément. Construis le **tracé MotionPath à partir de ces points d'ancrage** (MotionPath accepte un tableau de coordonnées) — la ligne relie réellement un élément de contenu au suivant.
- **Recalcule au resize** (et quand le carrousel tourne / le détail s'ouvre, les ancres bougent → met à jour le tracé et la position de l'orbe).
- Le tracé non-parcouru reste discret ; parcouru = plus lumineux (DrawSVG comme avant).

## TÂCHE 5 — Resserrer les étapes « vides » du début
Le Manifeste paraît quasi vide entre le Hero et les projets. Donne-lui une **intention visuelle** : c'est le moment où le tracé se dessine en direction des projets (l'orbe « tire » vers le carrousel), avec le texte du manifeste comme point focal. Pas de cran mort sur du vide. Si une étape n'a pas de focal clair, fusionne-la.

## CONSERVER (ne pas casser)
- Sorties de secours **obligatoires** : clavier (↓/PageDown/Espace, ↑/PageUp, Home/End), marqueurs cliquables (sauter à toute étape, y compris à un projet précis du carrousel), focus visible.
- **Fallback** reduced-motion **ET** mobile (<768px) : pas de hijack. Le carrousel devient un **scroll horizontal natif `scroll-snap-x`** (ou pile verticale), le détail s'ouvre en simple expansion (pas de manège), l'orbe se positionne sans grosse animation.

## NE PAS FAIRE
Pas de contenu deep-dive complet pour les 4 projets (juste le lien + cible placeholder), pas de scrub vidéo, pas de WebGL. Le `HeroField` SVG reste.

## QUALITÉ & VÉRIF
- Le carrousel tourne d'un projet par cran ; le détail s'ouvre/ferme proprement (effet Flip macOS) ; le manège place bien les projets vus en arrière-gauche.
- L'orbe **docke sur les éléments réels** (carte active, panneau de détail) et le tracé les relie ; recalcul correct au resize et à la rotation.
- Clavier + marqueurs OK, focus visible. reduced-motion + 390px → fallback natif, aucun blocage.
- `npx tsc -b` + `npm run build` OK, zéro erreur console.
- Sers-toi du skill de visualisation que tu as installé pour **capturer chaque état** (P1-focus, P1-detail, rotation vers P2, vue mobile) et vérifier visuellement avant de conclure.

Termine en listant l'état + ce qui reste pour **build 05** (cibles deep-dive détaillées par projet + scrub vidéo) et **build 06** (signature WebGL de l'orbe/hero, perf, déploiement).
