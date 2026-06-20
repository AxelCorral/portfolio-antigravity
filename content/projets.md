# content/projets.md
<!--
  Source de contenu des case studies du portfolio.
  Un bloc = un projet. Schéma identique pour chaque (id, role, statut, thesis,
  chiffre_cle, placeholder, stack, a_remplacer).
  Pour le build : pioche directement ici. Les champs `chiffre_cle` avec
  `placeholder: true` sont des valeurs FICTIVES temporaires.
-->

> 🔴 **RAPPEL** — Tous les `chiffre_cle` marqués `placeholder: true` sont **fictifs et temporaires**.
> À remplacer par les vraies valeurs avant tout déploiement. Cherche `placeholder: true` pour les retrouver.

---

## analyse-video-football
- **role** : hero + deep dive
- **statut** : en cours
- **thesis** : Transformer une simple vidéo de match en données de positionnement exploitables par un coach — qui était où, et quand — sans capteur ni caméra spécialisée.
- **chiffre_cle** : 22 joueurs suivis image par image sur 90 min de match
- **placeholder** : true 🔴
- **stack** : Python · YOLOv8 · ByteTrack · OpenCV (homographie, optical flow Lucas-Kanade) · clustering d'équipes · Streamlit
- **a_remplacer** : mesurer le chiffre réel (nb joueurs trackés, FPS de traitement, ou durée de match analysable bout-en-bout)

---

## football-pipeline
- **role** : rail
- **statut** : en cours
- **thesis** : Automatiser la collecte et la mise en forme de données football jusqu'à un dashboard live, déployé et maintenu comme un vrai produit (pas un notebook).
- **chiffre_cle** : ~2 000 matchs agrégés, rafraîchis quotidiennement
- **placeholder** : true 🔴
- **stack** : Python · Streamlit · source de données (à préciser) · GitHub + GitLab
- **lien** : football-pipeline-axel.streamlit.app
- **a_remplacer** : préciser la source de données + le vrai volume (matchs/saisons) et la fréquence de rafraîchissement

---

## scout-ia
- **role** : rail
- **statut** : en cours (démarrage)
- **thesis** : Construire un outil de scouting qui transforme les données d'événements StatsBomb en métriques de joueurs comparables, avec une couche de transformation versionnée et testée.
- **chiffre_cle** : 3,1 M d'événements StatsBomb modélisés via 40 modèles dbt
- **placeholder** : true 🔴
- **stack** : Python · dbt · StatsBomb Open Data · SQL
- **a_remplacer** : vrai nombre d'événements / matchs traités + nombre réel de modèles dbt

---

## jobtrackr
- **role** : rail
- **statut** : déployé
- **thesis** : Un « Career OS » qui centralise toute une recherche d'emploi — du suivi des candidatures à l'agrégation automatique d'offres et au scoring IA de compatibilité.
- **chiffre_cle** : 3 sources d'offres agrégées automatiquement (France Travail, Adzuna, RSS)
- **placeholder** : false ✅ (chiffre réel et défendable)
- **chiffre_secondaire** : 180+ candidatures suivies
- **placeholder_secondaire** : true 🔴
- **stack** : Next.js · PostgreSQL (Neon) · Vercel · APIs France Travail/Adzuna · Gemini (extraction CV + scoring)
- **a_remplacer** : le chiffre secondaire (nb réel de candidatures suivies) si tu veux l'afficher

---

## Bandeau crédibilité (section À propos — pas dans le rail)
- **energy-eda** : pipeline EDA sur 14M lignes de conso énergétique, enrichi via API Open-Meteo (DJU Toulouse-Blagnac). *(volume réel)*
- **ecr-dsm-firmenich** : digitalisation du workflow Engineering Change Request (SharePoint Online + Power Automate) en entreprise.

---

<!-- Note : Réformes2027 / contenu politique volontairement exclu du portfolio public
     (risque de polariser un recruteur ; cf. plan d'actions §0.2). -->
