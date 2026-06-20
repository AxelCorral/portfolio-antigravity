# Build 05 — Manège 3D réel + section épinglée + tracé courbe + détail au survol
> À lancer dans Claude Code : `Get-Content -Raw prompt.md | claude`
> Repo : `D:\Project_claude_code\portfolio` (builds 01→04 en place).

---

## CONTEXTE
Le Build 04 a posé un carrousel + un tracé + un détail au scroll. **5 problèmes à corriger.** Certains changent des partis pris du Build 04 (lis bien les tâches 3, 4 et 5).

---

## PROBLÈME 1 — Premier cran « vide » à supprimer
Le premier scroll mène à une étape quasi vide (Manifeste). **Supprime ce cran mort.** Le texte du manifeste ne doit PAS occuper une étape plein écran à lui seul : intègre-le comme **transition courte entre le Hero et le carrousel** (overlay/legende qui apparaît puis cède la place), ou fusionne-le avec la sortie du Hero. Aucune étape ne doit afficher un viewport quasi vide. Si une étape n'a pas de focal clair → fusionne-la.

## PROBLÈME 2 — Tracé de l'orbe : courbe naturelle, pas des segments droits
Aujourd'hui le tracé est fait de **segments rectilignes** (monte tout droit, descend tout droit) → pas naturel.
- Construis **UN seul tracé continu et lisse** qui passe par tous les points d'ancrage **dans l'ordre du parcours** (spline **Catmull-Rom → Bézier cubique**, ou MotionPath avec `curviness` sur un tableau de points). Courbure douce et **continue** (tangentes continues), jamais de segment droit ni de cassure brutale.
- **Le même spline** sert à la fois au déplacement de l'orbe (MotionPath) et à la ligne visible (DrawSVG) — ils doivent être identiques.
- Le flux général doit rester cohérent (pas d'allers-retours erratiques). Recalcule le spline au resize / quand les ancres bougent, mais garde-le lisse et continu.

## PROBLÈME 3 — Épingler le carrousel (il ne doit PAS défiler vers le haut)
Bug actuel : pendant qu'on scrolle, la page descend et le carrousel s'échappe par le haut alors qu'il devrait **rester en place et tourner**.
- Pendant toute la durée de la section carrousel (toutes ses sous-étapes), la section reste **fixe et centrée dans le viewport** (pin). **Aucun drift vertical de la page.** Seul le manège tourne sur place.
- Plus largement : confirme que le modèle est bien « sections fixes plein écran + transitions animées » (piloté par Observer), et **pas** basé sur la position de scroll réelle. Si un reste de scroll natif provoque le drift, corrige-le.

## PROBLÈME 4 — Un VRAI manège 3D (cylindre en profondeur)
Référence : un **filtre d'aspirateur cylindrique** — chaque pli = un projet, disposés autour d'un axe, et scroller fait **tourner le cylindre** vers le projet suivant.
- Implémente un **vrai cylindre 3D** : container `transform-style: preserve-3d` + `perspective`. Chaque carte placée sur l'anneau via `rotateY(i * 360/N) translateZ(R)`. **N = 4 projets** (90° entre chaque), rayon `R` et perspective à **calibrer** pour que les cartes latérales se lisent « en profondeur » (pas invisibles, pas écrasées).
- **Un cran de scroll = une rotation** du cylindre de `360/N°` → le projet suivant arrive face caméra ; le précédent part en profondeur (vers l'arrière). Profondeur : cartes non-frontales **assombries + légèrement floutées + opacité réduite** selon leur angle ; carte de dos masquée (`backface-visibility:hidden`).
- **Pas de zoom automatique** au scroll. Le scroll ne fait QUE tourner.
- Séquence des sous-étapes : `P1 (face) → P2 (face) → P3 (face) → P4 (face) → sortie vers section suivante`. Un cran vers le haut sur P1 remonte à la section précédente.

## PROBLÈME 5 — Détail au SURVOL (plus au scroll)
Retire le mécanisme « le scroll ouvre le détail ». À la place :
- **Au survol du titre du projet frontal (ou d'un bouton dédié)** : la fenêtre du projet **s'agrandit** (GSAP **Flip**, expansion douce depuis la carte) pour révéler **plus de détails** — une **zone média** (vidéo qui se lance / démo de site / capture), du texte étendu, et le CTA **« Voir le détail complet → »** (vers la cible deep-dive du projet ; DeepDive existant pour le hero, placeholder pour les autres).
- La zone média est en **lazy-load** (la vidéo/démo ne charge/joue qu'à l'agrandissement). Place des **placeholders** pour l'instant (les vraies vidéos viendront plus tard).
- **Fin du survol** → la fenêtre se replie à sa taille de carte.
- **Mobile / tactile** : pas de hover → déclenche l'agrandissement au **tap** sur le titre/bouton, re-tap (ou bouton fermer) pour replier.

---

## CONSERVER (ne pas casser)
- Sorties de secours : clavier (↓/PageDown/Espace, ↑/PageUp, Home/End), marqueurs cliquables (sauter à toute étape, y compris à un projet précis du manège), focus visible.
- Fallback reduced-motion **ET** mobile (<768px) : pas de hijack ni de cylindre 3D lourd → carrousel en **scroll horizontal natif `scroll-snap-x`** (ou pile verticale), détail accessible au tap, orbe positionnée sans grosse animation.
- Tokens / easings / DA inchangés. transform + opacity (+ blur/filter parcimonieux). 60 fps.

## NE PAS FAIRE
Pas de contenu deep-dive complet par projet (juste le lien + cible placeholder), pas de vraie vidéo finale (placeholders lazy), pas de WebGL.

## QUALITÉ & VÉRIF (utilise ton skill de visualisation pour capturer chaque état)
- Aucun cran vide ; le manifeste n'occupe plus une étape à lui seul.
- Le tracé est une **courbe lisse continue** (aucun segment droit) et l'orbe la suit naturellement.
- Le carrousel **reste fixe et tourne sur place** (zéro drift vertical) ; on voit bien chaque projet arriver face caméra.
- Le manège est un **vrai cylindre 3D** en profondeur (calibre rayon/perspective/dim pour que ce soit lisible et élégant).
- Survol titre/bouton → agrandissement Flip avec zone média lazy + CTA ; tap en fallback mobile.
- Clavier + marqueurs OK, focus visible. reduced-motion + 390px → fallback natif, aucun blocage.
- `npx tsc -b` + `npm run build` OK, zéro erreur console.

Termine en listant l'état + ce qui reste pour **build 06** (cibles deep-dive détaillées + vraies vidéos/démos lazy) et **build 07** (signature WebGL de l'orbe/hero, perf Lighthouse, déploiement Vercel + OVH).
