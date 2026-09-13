# Galerie AVANT / APRÈS — boucle UI

> Ordre antéchronologique : le chantier le plus récent est en haut.
> Chaque paire est capturée sur les révisions git réelles (voir MISSION-UI.md §7bis).
> Captures : viewports 390 et 1440 par défaut — un bloc peut en indiquer d'autres quand la preuve du chantier vit à une largeur que cette paire ne couvre pas. `.webp` qualité 80, largeur max 1200 px.

---
## Cycle 038 — 2026-09-13 · Rythme vertical Education/Languages sur /cv (mobile)

> Le gap vertical entre Education et Languages doublait (104px) le double margin-bottom + grid-gap au lieu du rythme de 56px du reste de la page, en dessous de 768px.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-038/cv-two-col-gap-390-avant.webp) | ![après 390](shots/cycle-038/cv-two-col-gap-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-038/cv-two-col-gap-1440-avant.webp) | ![après 1440](shots/cycle-038/cv-two-col-gap-1440-apres.webp) |

`fd91727`

## Cycle 037 — 2026-09-13 · Outillage `/cv` (ui-audit.mjs, ui-evidence-probe.mjs) + CLS diagnostiqué

> Pas de paire AVANT/APRÈS : le chantier de ce cycle est un ajout d'outillage
> (`--path=<route>` sur `ui-audit.mjs`/`ui-evidence-probe.mjs`, aucun fichier
> `src/` touché) et un diagnostic, pas une correction visuelle — il n'y a donc
> aucun état de page à comparer. Preuve mesurable, non une image : premier run
> complet de `ui-audit.mjs` sur `/cv` (10 combinaisons) → 0 overflow, 0
> violation axe-core, 0 erreur console, et une anomalie de CLS isolée et
> confirmée reproductible (tablet-768 + FR : **0.1603**, contre ≤ 0.012 sur les
> neuf autres combinaisons), tracée à un reflow de police web à froid via un
> test cache-chaud (`page.reload()` → CLS 0). Correctif non livré ce cycle
> (touche le chargement de police de tout le site, bloqué en pratique sur
> `QUESTIONS.md` Q5) — voir `docs/ui-loop/AUDIT-2026-09-13-cycle-037.md` et
> `BACKLOG.md` pour la reproduction complète.

`a11a1dd`

## Cycle 036 — 2026-09-13 · Le lien /cv "View case study" ouvre enfin une etude de cas

> Le lien promettait une etude de cas et se contentait de faire defiler jusqu'a la carte resume ; il ouvre desormais la modale de cas, comme le bouton homepage de meme libelle.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-036/le-lien-cv-view-case-study-ouvre-enfin-une-etude-de-cas-390-avant.webp) | ![après 390](shots/cycle-036/le-lien-cv-view-case-study-ouvre-enfin-une-etude-de-cas-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-036/le-lien-cv-view-case-study-ouvre-enfin-une-etude-de-cas-1440-avant.webp) | ![après 1440](shots/cycle-036/le-lien-cv-view-case-study-ouvre-enfin-une-etude-de-cas-1440-apres.webp) |

`ca1022d`

## Cycle 035 — 2026-09-13 · En-tete /cv sans repetition du nom

> Le kicker au-dessus du h1 repetait exactement Axel Corral, la toute premiere chose lue deux fois sur la page.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-035/cv-header-kicker-390-avant.webp) | ![après 390](shots/cycle-035/cv-header-kicker-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-035/cv-header-kicker-1440-avant.webp) | ![après 1440](shots/cycle-035/cv-header-kicker-1440-apres.webp) |

`e6ecf21` · `0adcdd1`

## Cycle 034 — 2026-09-12 · Contraste, cibles tactiles et mesure de lecture de /cv

> Page jamais visitee par aucun outil d'audit de la boucle ; kicker/print-note/dates sous 4.5:1, liens email/GitHub a 40px, puces de mission a 111 caracteres/ligne (voir PROGRESS.md pour le detail des trois defauts hors cadre).

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-034/contraste-cibles-tactiles-et-mesure-de-lecture-de-cv-390-avant.webp) | ![après 390](shots/cycle-034/contraste-cibles-tactiles-et-mesure-de-lecture-de-cv-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-034/contraste-cibles-tactiles-et-mesure-de-lecture-de-cv-1440-avant.webp) | ![après 1440](shots/cycle-034/contraste-cibles-tactiles-et-mesure-de-lecture-de-cv-1440-apres.webp) |

`a47fe85`

## Cycle 033 — 2026-09-12 · Contraste des eyebrows du case-study projet (ProjectDetailModal)

> Deux libelles partages par les 6 modales projet mesuraient 4.28:1 et 4.02:1, sous le plancher de 4.5:1 (§6) ; portes a 5.46:1 (alpha 0.58).

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-033/contraste-des-eyebrows-du-case-study-projet-projectdetailmod-390-avant.webp) | ![après 390](shots/cycle-033/contraste-des-eyebrows-du-case-study-projet-projectdetailmod-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-033/contraste-des-eyebrows-du-case-study-projet-projectdetailmod-1440-avant.webp) | ![après 1440](shots/cycle-033/contraste-des-eyebrows-du-case-study-projet-projectdetailmod-1440-apres.webp) |

`fc41f49`

## Cycle 032 — 2026-09-12 · Modale de détail projet — cible tactile des onglets, mesure de lecture, scroll clavier

> Onglets sous 44px, paragraphe à 81 caract/ligne et zone scrollable non focusable au clavier, mesures jamais faites sur ce composant.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-032/modale-de-detail-projet-cible-tactile-des-onglets-mesure-de--390-avant.webp) | ![après 390](shots/cycle-032/modale-de-detail-projet-cible-tactile-des-onglets-mesure-de--390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-032/modale-de-detail-projet-cible-tactile-des-onglets-mesure-de--1440-avant.webp) | ![après 1440](shots/cycle-032/modale-de-detail-projet-cible-tactile-des-onglets-mesure-de--1440-apres.webp) |

`b444223` · `e6305ff`

## Cycle 031 — 2026-09-13 · Suppression de la page fantôme `/projet/:slug`

> Pas de paire AVANT/APRÈS générée par `scripts/ui-gallery.mjs` : le chantier
> supprime une route inatteignable depuis toute page réellement visitable du
> site (aucun lien n'y menait, confirmé par grep exhaustif) — l'outil de
> galerie ne navigue que vers la racine et cette preuve ne relève pas de la
> surface qu'il documente. Preuve alternative, authentique mais non
> commitée : capture Playwright ad hoc de `/projet/jobtrackr` avant
> suppression (texte français sans variante EN, chiffres JobTrackr
> divergents de la vraie carte) puis après (page vide, seul le sélecteur de
> langue global reste) — voir `docs/ui-loop/AUDIT-2026-09-13-cycle-031.md`.
> Preuve mesurable committée : bundle JS 693,28 → 679,80 kB, CSS
> 96,77 → 87,19 kB (`npm run build`).

`f0686d2`

## Cycle 030 — 2026-09-12 · Redondance cover/description retiree (JobTrackr, Analyse video football) — section `#project-02 .pc-cover`

> Le sous-titre du slide cover redisait la description statique presque mot pour mot ; retire sans perte d'information (rotation A).

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-030/redondance-cover-description-retiree-jobtrackr-analyse-video-project-02-pc-cover-390-avant.webp) | ![après 390](shots/cycle-030/redondance-cover-description-retiree-jobtrackr-analyse-video-project-02-pc-cover-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-030/redondance-cover-description-retiree-jobtrackr-analyse-video-project-02-pc-cover-1440-avant.webp) | ![après 1440](shots/cycle-030/redondance-cover-description-retiree-jobtrackr-analyse-video-project-02-pc-cover-1440-apres.webp) |

`04a678e`

## Cycle 030 — 2026-09-12 · Redondance cover/description retiree (JobTrackr, Analyse video football) — section `#project-06 .pc-cover`

> Le sous-titre du slide cover redisait la description statique presque mot pour mot ; retire sans perte d'information (rotation A).

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-030/redondance-cover-description-retiree-jobtrackr-analyse-video-project-06-pc-cover-390-avant.webp) | ![après 390](shots/cycle-030/redondance-cover-description-retiree-jobtrackr-analyse-video-project-06-pc-cover-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-030/redondance-cover-description-retiree-jobtrackr-analyse-video-project-06-pc-cover-1440-avant.webp) | ![après 1440](shots/cycle-030/redondance-cover-description-retiree-jobtrackr-analyse-video-project-06-pc-cover-1440-apres.webp) |

`04a678e`

## Cycle 029 — 2026-09-12 · Hero : CTA duplique supprime

> Les deux boutons de l'etat d'ouverture du hero menaient au meme endroit (#selected-work) ; un seul suffit, l'autre etait du bruit pur.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-029/hero-cta-duplique-supprime-390-avant.webp) | ![après 390](shots/cycle-029/hero-cta-duplique-supprime-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-029/hero-cta-duplique-supprime-1440-avant.webp) | ![après 1440](shots/cycle-029/hero-cta-duplique-supprime-1440-apres.webp) |

`ce479ca` · `a4684a4`

## Cycle 028 — 2026-09-12 · Reperes d'accessibilite : landmarks uniques et role du switch de langue — section `#viewport:.language-toggle@40`

> Trois violations axe-core persistantes depuis 27 cycles (aria-prohibited-attr, landmark-unique, region) corrigees ; aucun changement visuel attendu, confirme par ces captures.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-028/reperes-d-accessibilite-landmarks-uniques-et-role-du-switch--viewport-language-toggle-40-390-avant.webp) | ![après 390](shots/cycle-028/reperes-d-accessibilite-landmarks-uniques-et-role-du-switch--viewport-language-toggle-40-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-028/reperes-d-accessibilite-landmarks-uniques-et-role-du-switch--viewport-language-toggle-40-1440-avant.webp) | ![après 1440](shots/cycle-028/reperes-d-accessibilite-landmarks-uniques-et-role-du-switch--viewport-language-toggle-40-1440-apres.webp) |

`77904d9` · `64dde59` · `db4cc52`

## Cycle 028 — 2026-09-12 · Reperes d'accessibilite : landmarks uniques et role du switch de langue — section `#.pc-nav`

> Trois violations axe-core persistantes depuis 27 cycles (aria-prohibited-attr, landmark-unique, region) corrigees ; aucun changement visuel attendu, confirme par ces captures.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-028/reperes-d-accessibilite-landmarks-uniques-et-role-du-switch--pc-nav-390-avant.webp) | ![après 390](shots/cycle-028/reperes-d-accessibilite-landmarks-uniques-et-role-du-switch--pc-nav-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-028/reperes-d-accessibilite-landmarks-uniques-et-role-du-switch--pc-nav-1440-avant.webp) | ![après 1440](shots/cycle-028/reperes-d-accessibilite-landmarks-uniques-et-role-du-switch--pc-nav-1440-apres.webp) |

`77904d9` · `64dde59` · `db4cc52`

## Cycle 027 — 2026-09-12 · Fleches Previous/Next des carousels projet portees a 44px

> Seul controle bouton pour naviguer un carousel sans le clavier, .pc-arrow mesurait 30x30px sur les 6 carousels projet (01 a 06).

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-027/pc-arrow-size-390-avant.webp) | ![après 390](shots/cycle-027/pc-arrow-size-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-027/pc-arrow-size-1440-avant.webp) | ![après 1440](shots/cycle-027/pc-arrow-size-1440-apres.webp) |

`cba1747`

## Cycle 027 — 2026-09-12 · CTA Contact du header porte a 44px

> Le bouton Contact du nav mesurait 70x36px (min-height fixe a 36px), sous le plancher tactile de 44px sur le controle le plus visible de la page.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-027/nav-contact-cta-390-avant.webp) | ![après 390](shots/cycle-027/nav-contact-cta-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-027/nav-contact-cta-1440-avant.webp) | ![après 1440](shots/cycle-027/nav-contact-cta-1440-apres.webp) |

`cba1747`

## Cycle 026 — 2026-09-12 · Integration d'Analyse video football (carte, page, demo)

> Troisieme et dernier chantier §4 livre : carte projet, case study en 4 sections et carousel de trois schemas abstraits reconstruits (pipeline, homographie, ré-identification), aucune capture reelle ni lien repo/demo (projet non public).

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | — (section nouvelle, pas d'état antérieur) | ![après 390](shots/cycle-026/integration-d-analyse-video-football-carte-page-demo-390-apres.webp) |
| **1440** | — (section nouvelle, pas d'état antérieur) | ![après 1440](shots/cycle-026/integration-d-analyse-video-football-carte-page-demo-1440-apres.webp) |

`7119fcf`

## Cycle 025 — 2026-09-12 · Integration d'Ombrair (carte, page, demo live)

> Deuxieme des trois chantiers §4 livre : carte projet, case study complet et demo iframe embarquee vers ombrair.vercel.app, poster cadre sur le visualiseur 3D.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | — (section nouvelle, pas d'état antérieur) | ![après 390](shots/cycle-025/integration-d-ombrair-carte-page-demo-live-390-apres.webp) |
| **1440** | — (section nouvelle, pas d'état antérieur) | ![après 1440](shots/cycle-025/integration-d-ombrair-carte-page-demo-live-1440-apres.webp) |

`78c0d8f` · `fd39663`

## Cycle 024 — 2026-09-12 · Integration de Vers l'Elysee (carte, page, demo live)

> Premier des trois chantiers §4 livre : carte projet, case study complet et demo iframe embarquee vers political-destiny.vercel.app.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | — (section nouvelle, pas d'état antérieur) | ![après 390](shots/cycle-024/integration-de-vers-l-elysee-carte-page-demo-live-390-apres.webp) |
| **1440** | — (section nouvelle, pas d'état antérieur) | ![après 1440](shots/cycle-024/integration-de-vers-l-elysee-carte-page-demo-live-1440-apres.webp) |

`6e66d36`

## Cycle 023 — 2026-09-12 · Le chapo d'Analytical profile, relie a sa preuve

> Analytical profile affirmait 537 caracteres sans un seul geste de verification, le seul bloc de toute la page dans ce cas ; l'affirmation d'ouverture pointe desormais vers /cv#experience, deja utilisee par la carte 01 de Capabilities.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-023/le-chapo-d-analytical-profile-relie-a-sa-preuve-390-avant.webp) | ![après 390](shots/cycle-023/le-chapo-d-analytical-profile-relie-a-sa-preuve-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-023/le-chapo-d-analytical-profile-relie-a-sa-preuve-1440-avant.webp) | ![après 1440](shots/cycle-023/le-chapo-d-analytical-profile-relie-a-sa-preuve-1440-apres.webp) |

`9f9b57e`

## Cycle 023 — 2026-09-12 · Le lien de preuve, redirige vers la preuve annoncee

> A 1440 et 1920, dans les deux langues, cliquer sur See Football Data Pipeline depuis le bas de page affichait Retirement Sustainability Model : les trois slides sticky declarent la meme position une fois le lecteur passe sous l'empilement.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-023/le-lien-de-preuve-redirige-vers-la-preuve-annoncee-390-avant.webp) | ![après 390](shots/cycle-023/le-lien-de-preuve-redirige-vers-la-preuve-annoncee-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-023/le-lien-de-preuve-redirige-vers-la-preuve-annoncee-1440-avant.webp) | ![après 1440](shots/cycle-023/le-lien-de-preuve-redirige-vers-la-preuve-annoncee-1440-apres.webp) |

`1961935`

## Cycle 022 — 2026-09-12 · L'entree des cartes Capabilities, resserree

> Grille calee a 560 px du haut et figee sans delai : les quatre cartes entrent ensemble, le decalage ne donnait donc aucun ordre de lecture — il laissait la carte 04 sous le plancher de contraste pendant 727 ms.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-022/cascade-cartes-capabilities-390-avant.webp) | ![après 390](shots/cycle-022/cascade-cartes-capabilities-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-022/cascade-cartes-capabilities-1440-avant.webp) | ![après 1440](shots/cycle-022/cascade-cartes-capabilities-1440-apres.webp) |

`3727306` · `493805a` · `abc9949`

## Cycle 022 — 2026-09-12 · La cascade du titre, plafonnee

> Fige 900 ms apres l'entree du bloc : avant, la fin de la phrase n'est pas encore peinte — la duree du titre suivait le nombre de mots (26 mots = 2,2 a 2,4 s).

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-022/cascade-titre-about-390-avant.webp) | ![après 390](shots/cycle-022/cascade-titre-about-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-022/cascade-titre-about-1440-avant.webp) | ![après 1440](shots/cycle-022/cascade-titre-about-1440-apres.webp) |

`3727306` · `493805a` · `abc9949`

## Cycle 022 — 2026-09-12 · Les jambages des titres de la zone, rendus

> Le masque de revelation coupait l'encre de tous les mots des deux titres d'affichage — 2424 pixels de difference a delta 207/255, exactement sous les descendantes du segment serif italique.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-022/jambages-titres-zone-390-avant.webp) | ![après 390](shots/cycle-022/jambages-titres-zone-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-022/jambages-titres-zone-1440-avant.webp) | ![après 1440](shots/cycle-022/jambages-titres-zone-1440-apres.webp) |

`3727306` · `493805a` · `abc9949`

## Cycle 021 — 2026-09-12 · Le kicker de la zone rentre dans sa regle partagee

> Trois sections, un seul role editorial, deux definitions typographiques : le kicker de #about etait peint exactement a la luminance de son propre corps de texte (13,66:1) quand les deux autres tiennent l'eyebrow a 5,4:1.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-021/kicker-about-390-avant.webp) | ![après 390](shots/cycle-021/kicker-about-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-021/kicker-about-1440-avant.webp) | ![après 1440](shots/cycle-021/kicker-about-1440-apres.webp) |

`b704c84` · `0466c87` · `d6eb2d1`

## Cycle 021 — 2026-09-12 · Le numero de carte repasse au-dessus du plancher de contraste

> Les numeros 01-04 etaient peints a 3,47:1 mesures sur les pixels reellement peints, sous le plancher de 4,5:1 que la mission impose a 12px — et axe-core ne pouvait pas le voir.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-021/numero-de-carte-390-avant.webp) | ![après 390](shots/cycle-021/numero-de-carte-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-021/numero-de-carte-1440-avant.webp) | ![après 1440](shots/cycle-021/numero-de-carte-1440-apres.webp) |

`b704c84` · `0466c87` · `d6eb2d1`

## Cycle 021 — 2026-09-12 · Le parcours de conversion reprend le poids que portait la sortie

> Le lien « retour en haut » etait le texte le plus clair de toute la zone (16,76:1) et le seul objet dessine comme un bouton ; les trois liens de conversion etaient les plus sourds de leur propre bloc (7,65:1). L'ordre tonal est inverse.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-021/footer-conversion-390-avant.webp) | ![après 390](shots/cycle-021/footer-conversion-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-021/footer-conversion-1440-avant.webp) | ![après 1440](shots/cycle-021/footer-conversion-1440-apres.webp) |

`b704c84` · `0466c87` · `d6eb2d1`

## Cycle 020 — 2026-09-12 · Descente du bas de page

> Le blanc sous la grille Capabilities valait 306 px à 1920 pour 96 déclarés, et `#contact` et le footer étaient figés à toutes les largeurs : la fin de page est désormais décidée, et tout le parcours de conversion tient dans un écran.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **1440** | ![avant 1440](shots/cycle-020/descente-du-bas-de-page-1440-avant.webp) | ![après 1440](shots/cycle-020/descente-du-bas-de-page-1440-apres.webp) |
| **1920** | ![avant 1920](shots/cycle-020/descente-du-bas-de-page-1920-avant.webp) | ![après 1920](shots/cycle-020/descente-du-bas-de-page-1920-apres.webp) |

`4ace013`

## Cycle 020 — 2026-09-12 · Mesure de lecture des sous-titres de section

> Une seule règle en `max-width: 42rem` produisait 58, 95 et 102 caractères par ligne selon le bloc ; les sous-titres passent au token `--measure-lede` et tiennent tous sous le plafond de 75.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-020/mesure-des-sous-titres-390-avant.webp) | ![après 390](shots/cycle-020/mesure-des-sous-titres-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-020/mesure-des-sous-titres-1440-avant.webp) | ![après 1440](shots/cycle-020/mesure-des-sous-titres-1440-apres.webp) |

`d8ec9cc`

## Cycle 020 — 2026-09-12 · Lien de carte tronqué au bord de la carte

> De 1024 à 1279 px le libellé le plus long sortait de sa carte et `overflow: hidden` le coupait en plein mot — 247 px de texte dans une carte de 232 px en FR, sans flèche ni ellipse. Il passe désormais à la ligne.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **1024** | ![avant 1024](shots/cycle-020/lien-de-carte-tronque-1024-avant.webp) | ![après 1024](shots/cycle-020/lien-de-carte-tronque-1024-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-020/lien-de-carte-tronque-1440-avant.webp) | ![après 1440](shots/cycle-020/lien-de-carte-tronque-1440-apres.webp) |

`3dc9597`

## Cycle 019 — 2026-09-12 · Sélecteur de langue escamoté au scroll descendant

> Contrôle fixed sans stratégie d'évitement : du texte de page passait dessous sur 24 des 49 positions de scroll de la zone à 390px — ici le mot « with » du titre Analytical profile, coupé en deux.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-019/language-toggle-tuck-390-avant.webp) | ![après 390](shots/cycle-019/language-toggle-tuck-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-019/language-toggle-tuck-1440-avant.webp) | ![après 1440](shots/cycle-019/language-toggle-tuck-1440-apres.webp) |

`64f7bb2` · `42333f3`

## Cycle 019 — 2026-09-12 · Mesure et alignement du paragraphe Analytical profile

> Le paragraphe composait 108 à 110 caractères par ligne sur desktop et neuf lignes centrées à neuf bords gauches différents sur 390 ; il est désormais ferré à gauche sur une mesure de 58ch (70 caractères au pire).

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-019/about-lede-mesure-390-avant.webp) | ![après 390](shots/cycle-019/about-lede-mesure-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-019/about-lede-mesure-1440-avant.webp) | ![après 1440](shots/cycle-019/about-lede-mesure-1440-apres.webp) |

`64f7bb2` · `b164c62`

## Cycle 018 — 2026-09-11 · Les trois liens du footer deviennent des cibles tactiles de 44px

> Email 31.9, GitHub 40, CV 17.7 px de large : le dernier point de conversion de la page etait plus etroit que le plancher WCAG 2.5.8. Ils font desormais 44px minimum, a espacement percu constant.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-018/footer-cibles-tactiles-390-avant.webp) | ![après 390](shots/cycle-018/footer-cibles-tactiles-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-018/footer-cibles-tactiles-1440-avant.webp) | ![après 1440](shots/cycle-018/footer-cibles-tactiles-1440-apres.webp) |

`1cb67ee` · `6416659`

## Cycle 018 — 2026-09-11 · Les trois kickers de section passent au-dessus du seuil de contraste

> 0.52 mesurait 4.49:1 a 11px : la conformite tenait a la troisieme decimale, sur un fond texture. 0.58 donne 5.35:1. Ecart mesure, faiblement photogenique : c'est l'eyebrow du haut qui change, de six centiemes d'opacite.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-018/kickers-contraste-390-avant.webp) | ![après 390](shots/cycle-018/kickers-contraste-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-018/kickers-contraste-1440-avant.webp) | ![après 1440](shots/cycle-018/kickers-contraste-1440-apres.webp) |

`b95e3ef` · `1cb67ee`

## Cycle 018 — 2026-09-11 · Le kicker de contact rejoint le systeme d'eyebrow de la page

> La derniere section de la page s'annoncait en 16px gris froid la ou les deux sections au-dessus utilisent un eyebrow de 11px ivoire : une collision de selecteurs, pas un choix.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-018/kicker-contact-390-avant.webp) | ![après 390](shots/cycle-018/kicker-contact-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-018/kicker-contact-1440-avant.webp) | ![après 1440](shots/cycle-018/kicker-contact-1440-apres.webp) |

`b103eb0` · `b95e3ef`

## Cycle 017 — 2026-09-11 · Entrée des cartes Capabilities par translation au lieu d'une mise à l'échelle

> Capture figée 520 ms après l'entrée. L'écart se lit sur la position et la taille des cartes, pas sur leur luminosité : le scale co-animait avec l'opacité, il n'est donc pas photogénique — la preuve est mesurée (carte 375px au lieu de 394, liens 41.8px au lieu de 44, bordure 1px amincie à 0.95px pendant 650 ms ; 44.00px partout après).

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-017/capabilities-entree-translation-390-avant.webp) | ![après 390](shots/cycle-017/capabilities-entree-translation-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-017/capabilities-entree-translation-1440-avant.webp) | ![après 1440](shots/cycle-017/capabilities-entree-translation-1440-apres.webp) |

`8a25b54` · `4c7aa53`

## Cycle 017 — 2026-09-11 · Stagger des cartes Capabilities calé sur la colonne réelle

> Capture figée 300 ms après l'entrée de la 4e carte : en une colonne elle attendait 450 ms d'un stagger d'index qui ne correspondait à aucune sœur entrant en même temps.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-017/capabilities-stagger-390-avant.webp) | ![après 390](shots/cycle-017/capabilities-stagger-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-017/capabilities-stagger-1440-avant.webp) | ![après 1440](shots/cycle-017/capabilities-stagger-1440-apres.webp) |

`8a25b54` · `6d8b1ad`

## Cycle 017 — 2026-09-11 · Lisibilité du paragraphe Analytical profile pendant sa révélation

> Le paragraphe restait à 0.2 d'opacité (1.64:1 mesuré) alors qu'il occupait tout l'écran ; plancher porté à 0.58 (5.2:1) et fin de révélation ramenée au centre du viewport au lieu du bord haut.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-017/about-reveal-lisible-390-avant.webp) | ![après 390](shots/cycle-017/about-reveal-lisible-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-017/about-reveal-lisible-1440-avant.webp) | ![après 1440](shots/cycle-017/about-reveal-lisible-1440-apres.webp) |

`8a25b54` · `d614ce8`

## Cycle 016 — 2026-09-11 · Lisibilité du sélecteur de langue flottant

> Sur 390px le toggle fixe EN · FR s'imprimait directement sur le texte des cartes (deux textes clairs superposés, contraste non défini) : voile radial sans bord sous le contrôle, le parti typographie nue est conservé.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-016/language-toggle-lisible-390-avant.webp) | ![après 390](shots/cycle-016/language-toggle-lisible-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-016/language-toggle-lisible-1440-avant.webp) | ![après 1440](shots/cycle-016/language-toggle-lisible-1440-apres.webp) |

`264d58e`

## Cycle 016 — 2026-09-11 · Cible tactile du bouton retour en haut

> Dernière cible sous le seuil de la zone prioritaire (39px mesuré) alors que les liens voisins sont déjà à 44px : le bouton passe à 44px de hauteur tactile sans changer son dessin.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-016/footer-cible-tactile-390-avant.webp) | ![après 390](shots/cycle-016/footer-cible-tactile-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-016/footer-cible-tactile-1440-avant.webp) | ![après 1440](shots/cycle-016/footer-cible-tactile-1440-apres.webp) |

`d0548d3`

## Cycle 016 — 2026-09-11 · Rythme et hiérarchie de la section Capabilities

> Titre de section à 20px sur mobile, vides subis d'une hauteur de carte fixe et gap qui rétrécissait quand le viewport grandissait : la section se lisait comme une dalle striée sans titre perçu.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-016/capabilities-rythme-390-avant.webp) | ![après 390](shots/cycle-016/capabilities-rythme-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-016/capabilities-rythme-1440-avant.webp) | ![après 1440](shots/cycle-016/capabilities-rythme-1440-apres.webp) |

`8c77001`

## Cycle 015 — 2026-09-11 · Identite visuelle du bloc Analytical profile

> Le bloc n'avait ni cadre ni rythme propre et se fondait dans la section suivante : ajout d'un radial-gradient ambre discret pour qu'il se lise comme une section a part entiere.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-015/identite-visuelle-du-bloc-analytical-profile-390-avant.webp) | ![après 390](shots/cycle-015/identite-visuelle-du-bloc-analytical-profile-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-015/identite-visuelle-du-bloc-analytical-profile-1440-avant.webp) | ![après 1440](shots/cycle-015/identite-visuelle-du-bloc-analytical-profile-1440-apres.webp) |

`dfc78db` · `b1c77a5` · `4d289d4`

## Cycle 003 — 2026-09-11 · Preuves concretes et rythme vertical des Capabilities

> Les 4 cartes de competence pointaient toutes vers un #contact generique : chacune renvoie desormais vers une preuve reelle (CV, pipeline, projet, GitHub), et le vide vertical autour de la section a ete resserre.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-003/preuves-concretes-et-rythme-vertical-des-capabilities-390-avant.webp) | ![après 390](shots/cycle-003/preuves-concretes-et-rythme-vertical-des-capabilities-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-003/preuves-concretes-et-rythme-vertical-des-capabilities-1440-avant.webp) | ![après 1440](shots/cycle-003/preuves-concretes-et-rythme-vertical-des-capabilities-1440-apres.webp) |

`0f6ebdf` · `06314b8`

## Cycle 002 — 2026-09-11 · Rythme de scroll, reduced-motion et footer de cloture — section `#about`

> La section About ignorait prefers-reduced-motion et le panneau contact flottait sans cloture : ajout d'un vrai footer, d'un lien CV, et respect du reglage systeme d'animation.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-002/about-contact-about-390-avant.webp) | ![après 390](shots/cycle-002/about-contact-about-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-002/about-contact-about-1440-avant.webp) | ![après 1440](shots/cycle-002/about-contact-about-1440-apres.webp) |

`10eacfb` · `85140a2` · `00691e7` · `1a756ce`

## Cycle 002 — 2026-09-11 · Rythme de scroll, reduced-motion et footer de cloture — section `#contact`

> La section About ignorait prefers-reduced-motion et le panneau contact flottait sans cloture : ajout d'un vrai footer, d'un lien CV, et respect du reglage systeme d'animation.

|          | AVANT | APRÈS |
| -------- | ----- | ----- |
| **390** | ![avant 390](shots/cycle-002/about-contact-contact-390-avant.webp) | ![après 390](shots/cycle-002/about-contact-contact-390-apres.webp) |
| **1440** | ![avant 1440](shots/cycle-002/about-contact-contact-1440-avant.webp) | ![après 1440](shots/cycle-002/about-contact-contact-1440-apres.webp) |

`10eacfb` · `85140a2` · `00691e7` · `1a756ce`
