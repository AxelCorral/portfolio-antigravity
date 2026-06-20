# Plan d'actions v2 — Portfolio « Antigravity »
### Scroll continu · vidéos foreground au scroll · flow horizontal · signature WebGL · qualité concours

> **Décisions verrouillées**
> - **Deadline : 6 semaines.**
> - **Objectif n°1 : décrocher des entretiens** → la perf, la clarté et l'authenticité priment ; le spectacle sert le contenu, jamais l'inverse.
> - **Budget : 0 € de plus.** Outils dispo uniquement : **Claude (+ Claude Code), ChatGPT, Genspark** + sources libres.
> - **Signature WebGL : OUI**, mais construite comme une **couche isolée et retirable** (filet de sécurité deadline).
> - **Sélection projets : faite pour toi** (voir §0.2).

---

## 0. Cadrage

### 0.1 Message central (thesis de la home)
> *« Je transforme des flux de données bruts en systèmes qui bougent. »*
Le mouvement **est** la démo : la donnée lévite, se réorganise, se rejoue. Mais comme l'objectif est l'entretien, chaque section répond aussi à la question du recruteur : *qu'est-ce qu'il a construit, et quel impact ?*

### 0.2 Sélection des projets (verrouillée)
Choix orienté **Data / ML Engineering + preuve de livraison**. J'écarte volontairement le politique (voir note).

| # | Projet | Pourquoi il est là | Rôle |
|---|---|---|---|
| ★ | **Analyse vidéo football** (YOLOv8 + ByteTrack + homographie) | Le plus **visuel** ET le plus **ML**. Tu as de la vraie footage (tracking, heatmaps) = authentique et spectaculaire. | **Hero + Deep dive** |
| 1 | **football-pipeline** (Streamlit live, pipeline industrialisé, GitHub/GitLab) | End-to-end, déployé, industrialisé = data engineering + produit. | Rail |
| 2 | **scout-ia** (StatsBomb + **dbt** + Python) | dbt = modern data stack, exactement ce que cherchent les postes Data Eng. Crédibilité technique. | Rail |
| 3 | **JobTrackr** (Next.js full-stack, Vercel, features IA Gemini) | Full-stack + produit + tu as **shippé**. Montre l'étendue. | Rail |
| + | **Energy EDA** (14M lignes, enrichi API Open-Meteo) & **ECR DSM-Firmenich** (Power Automate/SharePoint) | Crédibilité « entreprise » + volumétrie réelle. | Bandeau « À propos » |

**Note — Réformes2027 / contenu politique : écarté du portfolio public.** Pour un objectif « décrocher des entretiens », un projet politique polarise un recruteur sur 2. Le travail web reste valorisable, mais je te conseille de ne pas l'exposer ici (ou de le neutraliser en « projet web Next.js » sans le fond). Tu peux override, mais c'est un vrai risque.

### 0.3 Arborescence (scroll unique)
```
[00] HERO        → thesis + signature WebGL (ambient spatial) + 1 plan vidéo qui surgit
[01] MANIFESTE   → 1-2 phrases, amorce du déplacement latéral
[02] FLOW PROJETS→ rail horizontal droite→gauche : pipeline · scout-ia · jobtrackr · (vidéo)
[03] DEEP DIVE   → Analyse vidéo football plein écran, vidéo scrub (scrollytelling)
[04] STACK       → compétences en « champ gravitationnel » (depth)
[05] À PROPOS    → parcours + bandeau crédibilité (Energy EDA, ECR), sobre
[06] CONTACT     → CTA unique (mail/LinkedIn/GitHub), reboucle visuellement sur le hero
```

---

## 1. Direction artistique

### 1.1 « Google Antigravity » → tokens
| Axe | Lecture | Décision |
|---|---|---|
| Lumière | volumétrique, rare, dirigée | 1 source + halo radial, reste sombre |
| Profondeur | objets flottants multi-plans | échelle z-depth 4 plans |
| Mouvement | défie la gravité, inertie | easing « lourd » en sortie, longue décélération |
| Couleur | noir profond ≠ noir pur, bleus-violets froids | palette ci-dessous (pas le défaut noir + vert acide) |
| Matière | grain, lueur, verre | grain SVG + glow + soupçon de glass sur la nav |

### 1.2 Design tokens
**Palette**
```
--bg-void   #06070D   /* fond profond, jamais #000 */
--bg-deep   #0C0F1C   /* surfaces secondaires */
--ink       #EAECF5   /* texte principal (~13:1) */
--ink-muted #8A90A8   /* texte secondaire (≥4.5:1) */
--halo      #5B6CFF   /* bleu lévitation */
--halo-2    #9B6BFF   /* violet, profondeur */
--ember     #F2B65A   /* doré chaud — 1 seul usage = CTA = point de mémorisation */
```
**Typographie** : Display caractérielle (*Clash Display* / *PP Neue Montreal*, tracking −2%) · Body variable (*Inter* / *Geist*) · **Mono tabulaire** (*Geist Mono*) pour les chiffres de tes projets (xG, FPS, lignes, users) — cohérent avec le sujet data.
Échelle : `12 · 14 · 16 · 20 · 28 · 44 · 72 · 120` (clamp() fluide).

**Easing (vocabulaire de mouvement)**
```
--ease-float cubic-bezier(0.16, 1, 0.3, 1)   /* entrée, décéléra. longue */
--ease-fall  cubic-bezier(0.7, 0, 0.84, 0)   /* sortie, plus rapide */
--ease-drift cubic-bezier(0.45, 0, 0.55, 1)  /* scrub/ambient */
micro 150–300ms · transitions ≤400ms · ambient 600–1200ms · sortie ≈ 65% de l'entrée
```

### 1.3 Règles d'animation
transform + opacity **uniquement** · 1–2 éléments animés max/vue · 1 moment orchestré > effets dispersés · tout interruptible · `prefers-reduced-motion` = posters + fondus, zéro scrub.

### 1.4 À produire (DA)
Moodboard (12–16 réfs) · planche tokens validée · « motion sheet » (5 anims clés : durée/easing/propriété).

---

## 2. Architecture technique

### 2.1 Stack final (100% gratuit)
- **Base** : React + **Vite** + **Tailwind** + **shadcn/ui**, **scaffoldée et construite avec Claude Code** (ton workflow `Get-Content prompt.md | claude`). Plus de Lovable → pas d'export/réimport, et Claude Code gère mieux l'animation custom.
- **Spine d'animation** (tout gratuit, confirmé) :
  - **Lenis** — smooth scroll (base du scrub).
  - **GSAP + ScrollTrigger** — pin, scrub, timelines, horizontal. **100% gratuit depuis 2025, tous plugins inclus (SplitText, ScrollSmoother…), usage commercial OK.**
  - **Framer Motion** — *uniquement* micro-interactions de composants (jamais le même élément que GSAP).
  - **WebGL signature** : **OGL** (léger, ~quelques KB) recommandé plutôt que Three.js complet — suffisant pour un champ de particules / grain animé / displacement, et bien plus tenable côté perf et deadline.

### 2.2 Pourquoi Claude Code et pas Genspark AI Developer ?
Genspark a un « AI Developer » qui scaffolde des sites — utilisable en dépannage. Mais pour du scroll-driven + WebGL custom, **Claude Code** est supérieur, tu le maîtrises déjà, et il n'entame pas tes crédits Genspark (réservés à la vidéo, §3). SEO compensé par meta + OpenGraph + pré-rendu de la home.

### 2.3 Structure des composants
```
src/
 ├ app/            # shell, providers (Lenis, GSAP context)
 ├ scroll/         # useLenis · useScrollScene · matchMedia (desktop vs mobile)
 ├ sections/       # Hero · Manifeste · FlowProjets · DeepDive · Stack · About · Contact
 ├ media/          # ScrubVideo · LazyVideo · FrameSequence (canvas)
 ├ webgl/          # GrainLayer · ParticleField  (couche isolée, retirable)
 ├ tokens/         # CSS vars, type scale
 └ content/        # data projets (JSON/MDX)
```

### 2.4 Performance (cadre)
Vidéos `preload="none"` + poster, lecture in-view (IntersectionObserver), `muted playsinline`. Formats **WebM (AV1/VP9) + MP4 (H.264)** ≤1080p, bitrate plafonné. **Scrub = séquence d'images AVIF/WebP sur `<canvas>`** (contourne les limites Safari). `aspect-ratio` partout → CLS < 0.1. Fonts variables, `font-display: swap`. Budget frame < 16 ms (60 fps). WebGL = 1 couche, import dynamique.

---

## 3. Pipeline assets (recâblé, 0 €)

> Principe clé : **remplacer la vidéo IA payante par 3 sources gratuites** — (a) **WebGL procédural** pour l'ambient/spatial (gratuit, léger, infiniment réglable), (b) **ta vraie footage** (tracking foot, screen-recordings Streamlit/JobTrackr) = le plus crédible pour un recruteur, (c) **vidéo IA via Genspark** (crédits gratuits) + **stock libre** pour 2-3 plans d'ambiance seulement.

### 3.1 WebGL procédural (remplace 70% de la vidéo IA)
La home « Antigravity » (particules, poussière d'étoiles, grain animé, displacement) se fait **en temps réel** via OGL → aucun fichier vidéo, perf maîtrisée, c'est aussi ta **signature**. Cf §4(d) et §2.1.

### 3.2 Ta vraie footage (le cœur recruteur)
- **Analyse vidéo foot** : exporte des clips de l'overlay tracking + heatmaps + reconstruction terrain. C'est TON plan hero le plus fort.
- **football-pipeline / JobTrackr** : screen-recordings propres (OBS gratuit), curseur masqué, 1080p, courts (5–8s en boucle).
- **scout-ia** : visualisations dbt lineage / dashboards en capture animée.

### 3.3 Vidéo IA via Genspark (crédits gratuits)
Genspark route vers **Sora 2 / Kling / Veo** → tu génères 2–3 plans d'ambiance « zéro-g » max (économise les ~100 crédits/jour). Prompts type :
1. *« Données lumineuses en lévitation, vide noir profond, dolly avant lent, lumière volumétrique bleue, cinématique, 16:9, 6s »*
2. *« Maillage de terrain de foot se reconstruisant en apesanteur, points de tracking qui s'allument, dérive latérale, glow violet, 16:9, 6s »*
> ⚠️ **Vérifie les droits d'usage commercial des sorties en tier gratuit** Genspark avant publication (l'usage commercial est explicite sur les offres payantes ; à confirmer côté gratuit). En cas de doute → stock libre (3.4) ou WebGL (3.1).

### 3.4 Stock & son libres (remplace Artlist)
- **Vidéo** : Pexels, Pixabay, Mixkit, Coverr — gratuits, usage commercial, sans attribution.
- **Musique** : Pixabay Music (sans attribution) ou Uppbeat (gratuit avec attribution). **Recommandation vu l'objectif : pas de musique, ou off par défaut** (un recruteur juge la perf, pas la BO).
- **SFX** : Freesound (filtre CC0), Mixkit. Whooshes de transition seulement, discrets.
- Jamais d'autoplay audio (blocage navigateur + accessibilité).

### 3.5 Optimisation (ffmpeg)
```bash
# MP4 H.264 muet
ffmpeg -i in.mov -an -c:v libx264 -crf 23 -preset slow -vf "scale=1920:-2,format=yuv420p" -movflags +faststart out.mp4
# WebM VP9
ffmpeg -i in.mov -an -c:v libvpx-vp9 -crf 32 -b:v 0 -vf "scale=1920:-2" out.webm
# Poster
ffmpeg -i in.mp4 -vframes 1 -q:v 2 poster.jpg     # -> AVIF/WebP via squoosh/sharp
# Séquence d'images pour SCRUB
ffmpeg -i in.mp4 -vf "fps=30,scale=1280:-2" frames/%04d.webp
```
Cibles : hero ≤ 2–3 MB (poster-first), clips ≤ 1–1.5 MB.

---

## 4. Mécaniques d'interaction (le cœur — inchangé)

Init commun :
```js
const lenis = new Lenis({ smoothWheel: true, lerp: 0.1 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

### (a) Vidéo foreground : apparition / repli / disparition
```js
gsap.timeline({ scrollTrigger:{ trigger:'#deep', start:'top top', end:'+=120%', scrub:1, pin:true }})
 .fromTo(video,{ scale:1.15, opacity:0, clipPath:'inset(15% 15% 15% 15%)' },
              { scale:1, opacity:1, clipPath:'inset(0% 0% 0% 0%)', ease:'none' })
 .to(video,   { scale:0.85, opacity:0, clipPath:'inset(20% 35% 20% 35%)', ease:'none' }); // repli
```

### (a-bis) Scrub vidéo (scrollytelling) — séquence d'images canvas
```js
ScrollTrigger.create({ trigger:'#story', start:'top top', end:'+=300%', scrub:true, pin:true,
  onUpdate:(s)=>{ const i=Math.round(s.progress*(images.length-1));
    ctx.drawImage(images[i],0,0,canvas.width,canvas.height); }});
```

### (b) Flow horizontal (droite→gauche)
```js
const track=document.querySelector('.rail-track');
const dist=track.scrollWidth-window.innerWidth;
gsap.to(track,{ x:-dist, ease:'none',
  scrollTrigger:{ trigger:'.rail', start:'top top', end:()=>'+='+dist, scrub:1, pin:true }});
```
⚠️ Conflit gestuel mobile → converti (§6).

### (c) Scroll « infini » → **boucle perçue** (recommandé vu l'objectif)
Narration finie qui reboucle visuellement Contact→Hero. Site honnête pour SEO/recruteur, sensation d'infini préservée. (Le vrai infini casse SEO/footer/restauration de scroll → écarté.)

### (d) Transitions
Morph de fond (couleur/halo interpolés au scroll) · handoff vidéo→vidéo (timelines chevauchées ~20%) · push de profondeur (scale↓ + blur léger en z) · **signature WebGL** : transition par displacement (OGL), couche isolée.

---

## 5. Production avec Claude Code (ordre de build)

**Tout en local, prompts successifs.** Ordre :
1. **Scaffold + tokens** : Vite+React+Tailwind+shadcn, dark only, colle palette/type/easing, shell + 7 sections vides.
2. **Contenu & structure** : remplis chaque section (contenu projet réel), HTML sémantique h1→h3, alt text.
3. **Style statique** : grain SVG, glow radial hero, nav glass, type fluide clamp().
4. **Responsive + a11y** : mobile-first 375/768/1024/1440, focus visible, contraste AA, min-h-dvh.
5. **Spine** : Lenis + GSAP, reveal/fold, scrub canvas, rail horizontal, transitions, boucle perçue.
6. **Signature WebGL** : OGL ParticleField + GrainLayer, en couche isolée derrière un flag (`ENABLE_WEBGL`) → retirable d'un switch si la deadline serre.
7. **Micro-interactions** : Framer Motion sur cartes/nav uniquement.

**Astuce prompts** : un sujet par fichier `prompt.md`, donne les tokens explicitement, demande du sémantique + Tailwind, fais valider une section en POC avant de généraliser.

---

## 6. Performance & accessibilité

**Budget (Lighthouse mobile ≥ 90)** : LCP < 2.5s (poster-first, jamais une vidéo en LCP) · CLS < 0.1 · INP < 200ms · JS initial < ~300 KB (WebGL en import dynamique).

**A11y** : `gsap.matchMedia()` pour `prefers-reduced-motion` (scrub/parallax off, posters, fondus courts) · focus visible 2–4px · clavier complet + skip-link · contraste ≥4.5:1 (palette OK) · toggle son explicite · rail atteignable au clavier (focus → scroll programmatique).

**Mobile vs desktop**
| Effet | Desktop | Mobile |
|---|---|---|
| Lenis | oui | oui (doux) |
| Vidéo foreground | scrub + reveal | poster + clip court in-view |
| **Rail horizontal** | pin + translate X | **converti** : pile verticale OU `scroll-snap` natif + affordance |
| WebGL signature | oui | **off** (grain CSS seul) |
| Boucle perçue | oui | oui (allégée) |
> `gsap.matchMedia('(min-width:1024px)')` isole les effets lourds. La fluidité desktop n'est pas transposable telle quelle.

---

## 7. Roadmap — 6 semaines (objectif : entretiens)

> Réaliste en parallèle de ton poste. La **semaine 2 attaque le WebGL tôt** : c'est l'item à risque, on veut pouvoir le couper sans tout casser.

**S1 — Cadrage, DA & contenu** *(le vrai levier recruteur)*
Valider DA + tokens + motion sheet. **Rédiger les narratifs projets** (1 thesis + 1 chiffre clé chacun : xG, FPS, users, lignes). Collecter/recorder la vraie footage (OBS, exports tracking). Repo + Claude Code + POC Lenis/GSAP sur 1 section reveal. ⏱ ~14h

**S2 — Signature WebGL (R&D) + Hero**
OGL ParticleField + grain, derrière `ENABLE_WEBGL`. Construire le hero complet. **Décision Go/No-Go WebGL en fin de semaine.** ⏱ ~16h

**S3 — Sections + rail horizontal**
Build des 7 sections (Claude Code), contenu intégré, rail droite→gauche pin + parallaxe sobre. ⏱ ~16h

**S4 — Foreground vidéo + scrub + transitions**
Reveal/fold, scrub canvas (deep dive foot), transitions de section. Clips Genspark + stock optimisés (ffmpeg). ⏱ ~16h

**S5 — Mobile + perf + a11y**
matchMedia, conversions mobile, lazy video, reduced-motion, passes Lighthouse jusqu'au vert. ⏱ ~14h

**S6 — QA, polish, déploiement**
Cross-browser (**Safari** : scrub via frames), polish timing, SEO/OG/favicon, analytics, **buffer**. ⏱ ~12h

### Checklist QA
- [ ] Safari : scrub fluide (frames) · rail clavier + reduced-motion OK
- [ ] CLS < 0.1, LCP < 2.5s mobile · vidéos lazy + poster, sous budget
- [ ] Pas de scroll horizontal accidentel mobile · couture de boucle invisible
- [ ] WebGL coupable via flag sans casse · OG image + meta + favicon
- [ ] Droits assets vérifiés (Genspark gratuit, stock libre)

### Déploiement
Vercel (preview par PR) · domaine OVH → Vercel · analytics **Plausible/Umami** (léger, n'impacte pas les CWV) · repo GitHub `AxelCorral`.

---

## 8. Risques & alternatives

| Risque | Prob. | Repli |
|---|---|---|
| WebGL menace la deadline | moyenne | flag `ENABLE_WEBGL` → ship sans (version GSAP/CSS reste forte) |
| Crédits Genspark gratuits insuffisants | élevée | WebGL procédural + stock libre (Pexels/Mixkit) |
| Droits commerciaux vidéo IA gratuite flous | moyenne | basculer sur stock libre sans attribution |
| Scrub vidéo saccadé (Safari) | élevée | séquence d'images canvas (déjà prévu) |
| Poids vidéos → LCP | élevée | poster-first, lazy in-view, moins de clips |
| Fluidité mobile non transposable | élevée | rail → vertical/scroll-snap, WebGL off |
| Jank (2 moteurs d'anim) | moyenne | GSAP = spine unique ; Framer Motion = composants only |
| Stock libre « déjà vu » | moyenne | privilégier ta vraie footage + WebGL procédural |

---

## 9. ✅ Démarrage immédiat (5 actions cette semaine)

1. **Écrire les 4 narratifs projets** (thesis + 1 chiffre clé chacun) — c'est ce qui décroche l'entretien, fais-le avant le pixel.
2. **Recorder/exporter ta vraie footage** : clips tracking foot + screen-recordings Streamlit/JobTrackr (OBS, 1080p, curseur masqué).
3. **Geler les tokens** dans `tokens.css` (palette + type + 3 easings).
4. **Initialiser le repo** (Vite+React+Tailwind+shadcn) et brancher **Lenis + GSAP** en POC sur une seule section reveal/fold pour valider la sensation.
5. **POC WebGL** : un `ParticleField` OGL minimal en plein écran derrière un flag — valider la perf 60fps avant d'investir en S2.
