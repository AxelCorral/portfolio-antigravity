# Questions bloquantes — arbitrage humain requis

> Alimenté quand une décision ne peut pas être prise sans deviner une donnée
> factuelle ou trancher un choix éditorial hors périmètre de la mission. Une
> question reste ouverte tant qu'elle n'a pas été répondue par Axel ; ne jamais
> la retirer silencieusement, marquer `RÉSOLU` avec la réponse une fois
> tranchée.

---

## Ouvertes

_(aucune — les quatre questions ouvertes ont été tranchées par Axel le 2026-09-12)_

---

## Résolues

### Q1 — URL LinkedIn réelle d'Axel — **RÉSOLU 2026-09-12**
**Réponse d'Axel** : `https://www.linkedin.com/in/axelcorral`
**Appliqué** : entrée `LinkedIn` ajoutée à `contactLinks` dans `src/OnePage.tsx`.
Elle alimente à la fois le panneau de contact et la barre de liens du footer,
qui dérivent tous deux de la même source. Le parcours de conversion est donc
complet : Email, GitHub, LinkedIn, CV.

### Q2 — Repo GitHub public pour "Vers l'Élysée" ? — **RÉSOLU 2026-09-12**
**Réponse d'Axel** : démo live uniquement, **pas de lien repo**.
**À appliquer** : la carte et la page projet ne portent qu'un lien vers la démo
déployée. Ne jamais ajouter de lien "View repository" pour ce projet.

### Q3 — Repo GitHub public pour Ombrair ? — **RÉSOLU 2026-09-12**
**Réponse d'Axel** : démo live uniquement, **pas de lien repo**. Même règle que Q2.

### Q4 — Assets visuels pour "Analyse vidéo football" — **RÉSOLU 2026-09-12**
**Réponse d'Axel** : aucun export du pipeline disponible pour l'instant.
**Consigne** : construire la section avec des **schémas abstraits reconstruits**
(diagramme de flux du pipeline, schéma de terrain stylisé, représentation
conceptuelle du tracking). **Aucune capture inventée** ne doit laisser croire à
un rendu réel du pipeline, et aucun visuel ne doit être présenté comme une
sortie du système.
**Exigence structurelle** : prévoir un **emplacement propre et documenté** où
Axel branchera les vrais visuels — un composant ou un tableau d'assets isolé,
avec un commentaire indiquant explicitement quoi remplacer et par quoi, pour
que la substitution n'exige pas de retoucher la mise en page.
