# Build 06 — Parcours projets en zigzag (orbe qui suit le contenu) + fenêtre récap « carrousel radial »
> À lancer dans Claude Code : `Get-Content -Raw prompt.md | claude`
> Repo : `D:\Project_claude_code\portfolio` (builds 01→05 en place).

---

## CONTEXTE — 3 changements de modèle (important)
1. **Supprime le « hover qui agrandit la fenêtre »** → on l'abandonne.
2. **Le manège n'est plus le navigateur principal des projets.** Les projets se parcourent désormais en **zigzag défilant** (cf. Partie A). Le carrousel radial devient un **récap** à la fin (cf. Partie B).
3. **Pour la section projets : abandonne le sous-stepping Observer** au profit d'un **défilement scrubbé épinglé** (ScrollTrigger `pin` + `scrub`). C'est ce qui corrige le tracé erratique : l'orbe suit une courbe scrubbée au lieu de sauter entre ancres.

---

## PARTIE A — Parcours projets en ZIGZAG (le cœur de ce build)

### Disposition
- Section projets **épinglée** (`pin:true`), durée de scroll longue (`end:'+=300%'` à calibrer).
- Les 4 projets sont disposés en **zigzag descendant** : projet 1 **à droite**, projet 2 **à gauche**, projet 3 **à droite**, projet 4 **à gauche** (alternance), à des **hauteurs croissantes** (on descend). Chaque projet = sa carte (titre, thesis, chiffre clé + tag Fictif, stack, lien « Voir le détail → »).
- À mesure qu'on scrolle (scrubbé), le projet courant entre en focus (opacity/scale/translate depuis sa profondeur, `--ease-float`), puis cède au suivant sur le côté opposé. 1 projet bien lisible à la fois, le précédent/suivant esquissés.

### L'orbe suit le contenu (right↔left, top→bottom)
- **Un seul tracé continu et lisse** (Bézier cubique / Catmull-Rom) qui **passe par les ancres des projets dans l'ordre**, en **zigzag descendant** : droite → gauche → droite → gauche, toujours vers le bas. **Jamais de boucle, jamais de remontée, jamais de segment droit.**
- Le déplacement de l'orbe (MotionPath) et le dessin de la ligne (DrawSVG) sont **scrubbés sur la progression du scroll** de la section épinglée → l'orbe descend en suivant réellement les projets de gauche à droite et de haut en bas.
- Marque chaque carte projet avec `data-orb-anchor` ; construis le spline à partir de ces positions réelles ; recalcule au resize.

> Principe directeur : **c'est la disposition alternée + descendante qui rend le tracé naturel.** L'orbe ne « décide » pas d'un chemin — il suit la courbe qui relie le contenu.

---

## PARTIE B — Fenêtre récap « carrousel radial » (style filtre)

Quand **tous les projets ont défilé**, le cran/scroll suivant fait **s'ouvrir une fenêtre devant l'écran** (style **ouverture de fenêtre macOS** : scale depuis le centre + léger overshoot + fondu, via GSAP Flip/scale). Cette fenêtre contient le **carrousel radial récap** :

- **Disposition en cercle autour d'un point central** (réf. image filtre d'aspirateur) : les N projets sont des **panneaux disposés radialement autour d'un axe/hub central** — `transform-style:preserve-3d` + `perspective`, chaque panneau `rotateY(i*360/N) translateZ(R)`.
- **Les projets non-sélectionnés DOIVENT être visibles** autour/derrière celui de devant (c'est le point qui manque aujourd'hui) : panneaux latéraux/arrière présents, **assombris + légèrement floutés selon leur profondeur**, hub central visible derrière le panneau de devant. Calibre rayon `R`, perspective et dim pour que ça lise comme une **roue de projets** élégante (pas un seul panneau visible, pas un fouillis).
- **Interaction** : on peut **faire tourner** le carrousel (flèches ←/→, drag, ou scroll dans la fenêtre) pour amener n'importe quel projet à l'avant ; un clic sur un panneau → la **cible deep-dive** du projet (DeepDive existant pour le hero, placeholder pour les autres).
- C'est un **récap/overview** de tous les projets dispos — pas une étape obligatoire pour avancer. Un bouton **fermer** (ou scroll) referme la fenêtre et poursuit vers la section suivante (Stack).

---

## CONSERVER (ne pas casser)
- Sorties de secours : clavier (flèches/PageUp-Down/Espace/Home-End), marqueurs de progression cliquables, focus visible.
- **Fallback** reduced-motion **ET** mobile (<768px) : pas de scrub lourd ni de 3D — projets en **pile verticale** simple avec `scroll-snap`, le récap radial devient une **grille/liste** de projets, la fenêtre s'ouvre en simple fondu. Aucun hijack du touch.
- Tokens / easings / DA inchangés. transform + opacity (+ blur/filter parcimonieux). 60 fps.
- Vérifie au passage qu'il ne reste **aucun cran vide** au début (manifeste = transition courte, pas une étape à lui seul).

## NE PAS FAIRE
Pas de hover-expand (supprimé), pas de contenu deep-dive complet par projet (juste le lien + cible), pas de vraie vidéo finale, pas de WebGL.

## QUALITÉ & VÉRIF (utilise ton skill de visualisation pour capturer les états)
- L'orbe **descend en zigzag en suivant les projets** (droite↔gauche, haut→bas), courbe lisse, **aucune boucle ni segment droit**.
- La section projets **reste épinglée** pendant le parcours (zéro drift parasite), 1 projet lisible à la fois.
- La fenêtre récap **s'ouvre style macOS** et montre **le carrousel radial avec tous les projets visibles** en cercle autour du hub ; rotation + clic vers deep-dive OK.
- Clavier + marqueurs OK, focus visible. reduced-motion + 390px → fallback natif, aucun blocage.
- `npx tsc -b` + `npm run build` OK, zéro erreur console.

Termine en listant l'état + ce qui reste pour **build 07** (cibles deep-dive détaillées + vraies vidéos/démos lazy) et **build 08** (signature WebGL de l'orbe/hero, perf Lighthouse, déploiement Vercel + OVH).
