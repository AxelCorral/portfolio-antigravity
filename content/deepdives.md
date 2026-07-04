# content/deepdives.md
<!--
  Source de contenu des pages deep-dive (/projet/:slug). Un bloc "## <slug>"
  par projet, slug = id dans src/content/projects.ts. Édite ce fichier
  librement ; ne mets jamais de chiffre/claim qui n'est pas confirmé —
  utilise [À COMPLÉTER] à la place (voir build07 prompt, règle de contenu).
-->

## analyse-video-football

### Problème
Un coach de football qui veut analyser le positionnement de ses joueurs n'a généralement accès qu'à la vidéo brute du match — sans capteur GPS ni caméra de tracking dédiée, il est très difficile de savoir qui était où, et quand, pendant la rencontre.

### Approche
Le pipeline détecte les joueurs sur chaque frame avec YOLOv8, puis les suit dans le temps avec ByteTrack pour garder une identité stable par joueur. Une étape d'homographie (OpenCV) reprojette les positions pixel vers les coordonnées réelles du terrain, avec un lissage de trajectoire par optical flow (Lucas-Kanade) et un clustering pour distinguer les deux équipes. Le résultat est exposé dans une interface Streamlit pour parcourir le match image par image.

### Résultat
[À COMPLÉTER] — précision et couverture réelles du tracking (FPS de traitement, durée de match analysable bout-en-bout). Le repère affiché ailleurs sur le site (22 joueurs suivis · 90 min) est une valeur fictive en attendant cette mesure.

### Média
- [vidéo : overlay tracking joueurs + heatmap]
- [capture : reconstruction du terrain par homographie]

### Points techniques
- Détection par frame avec YOLOv8
- Tracking multi-frame avec ByteTrack (identités stables)
- Reconstruction du terrain par homographie (OpenCV)
- Lissage de trajectoire (optical flow Lucas-Kanade) + clustering d'équipes
- Interface de visualisation Streamlit, parcours image par image

### Liens
- GitHub: https://github.com/AxelCorral
- Démo: [À COMPLÉTER]

---

## football-pipeline

### Problème
Les données football utiles à un dashboard (matchs, statistiques) sont dispersées et changent en continu — les récupérer et les mettre en forme à la main, projet par projet, ne tient pas dans la durée.

### Approche
Un pipeline Python automatise la collecte et la mise en forme des données, avec un déploiement continu (GitHub + GitLab) vers un dashboard Streamlit accessible en ligne — pensé comme un produit maintenu plutôt qu'un notebook ponctuel.

### Résultat
Dashboard déployé et accessible publiquement. [À COMPLÉTER] — source de données précise, volume réel de matchs et fréquence de rafraîchissement (le repère ~2 000 matchs affiché ailleurs sur le site est une valeur fictive).

### Média
- [screen-rec : dashboard Streamlit live]
- [capture : pipeline de collecte / CI GitHub + GitLab]

### Points techniques
- Pipeline de collecte automatisé en Python
- Déploiement continu via GitHub + GitLab
- Dashboard Streamlit en production
- [À COMPLÉTER] — source de données précise

### Liens
- Démo: football-pipeline-axel.streamlit.app
- GitHub: https://github.com/AxelCorral

---

## jobtrackr

### Problème
Chercher un emploi implique de suivre des candidatures et de surveiller des offres dispersées sur plusieurs plateformes — sans outil central, on perd la vue d'ensemble et du temps.

### Approche
JobTrackr centralise la recherche dans un « Career OS » : agrégation automatique d'offres depuis plusieurs sources (France Travail, Adzuna, RSS), suivi des candidatures, et scoring de compatibilité par IA (Gemini) à partir du CV.

### Résultat
3 sources d'offres agrégées automatiquement (France Travail, Adzuna, RSS) — chiffre réel. Application déployée sur Vercel. [À COMPLÉTER] — nombre réel de candidatures suivies (le repère 180+ affiché ailleurs sur le site est une valeur fictive) et toute métrique de qualité du scoring IA.

### Média
- [démo : JobTrackr Kanban]
- [capture : scoring de compatibilité Gemini]

### Points techniques
- Agrégation automatique multi-sources (France Travail, Adzuna, RSS)
- Scoring de compatibilité CV/offre via Gemini
- Stack Next.js + PostgreSQL (Neon), déployé sur Vercel
- [À COMPLÉTER] — détail du suivi Kanban des candidatures

### Liens
- Démo: [À COMPLÉTER]
- GitHub: https://github.com/AxelCorral
