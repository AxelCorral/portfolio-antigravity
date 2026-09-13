# Questions bloquantes — arbitrage humain requis

> Alimenté quand une décision ne peut pas être prise sans deviner une donnée
> factuelle ou trancher un choix éditorial hors périmètre de la mission. Une
> question reste ouverte tant qu'elle n'a pas été répondue par Axel ; ne jamais
> la retirer silencieusement, marquer `RÉSOLU` avec la réponse une fois
> tranchée.

---

## Ouvertes

### Q5 — Police de corps documentée (« Inter ») vs police réellement chargée (« Almarai »)

**Constat (cycle 037)** : `MISSION-UI.md` §1 documente l'identité comme
« Fraunces (titres), JetBrains Mono (technique), **Inter** (corps) ». Le code
déclare `--font-body: "Inter", system-ui, sans-serif` dans `src/tokens.css`,
mais ce token **n'est référencé nulle part** (`grep -rn "var(--font-body)"
src/` → 0 résultat) et Inter n'est jamais chargé (absent de l'URL Google Fonts
dans `index.html`, qui ne charge qu'Almarai/Fraunces/Instrument Serif/
JetBrains Mono). La police de corps réellement utilisée depuis l'origine du
projet est **Almarai** (`body { font-family: "Almarai", ... }`,
`src/index.css:59`).

**Pourquoi c'est bloquant** : ce cycle a mesuré un CLS de 0.16 sur `/cv`
(tablet-768 + FR), confirmé causé par le reflow de police web (FOUT) d'Almarai
au chargement à froid — voir `BACKLOG.md`. La réparation standard touche
directement quelle police charge et comment (`font-display`, éventuellement
des métriques de repli calibrées). Je ne peux pas savoir si Inter est
l'intention réelle jamais finalisée (auquel cas la bonne réparation est de
finir la migration vers Inter) ou si Almarai est le choix délibéré et la
mention "Inter" dans la mission est simplement restée obsolète (auquel cas on
corrige la doc et on ajuste le chargement d'Almarai en place). Deviner l'un ou
l'autre reviendrait à changer une police ou une identité visuelle sans
arbitrage — interdit par le garde-fou §6 sans décision explicite.

**Question pour Axel** : la police de corps du site doit-elle rester Almarai
(et la mention "Inter" dans `MISSION-UI.md` §1 doit être corrigée), ou
Inter était-elle prévue et jamais chargée (auquel cas il faut l'ajouter à
l'URL Google Fonts et basculer `body` dessus) ?

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
