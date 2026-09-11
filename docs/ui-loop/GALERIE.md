# Galerie AVANT / APRÈS — boucle UI

> Ordre antéchronologique : le chantier le plus récent est en haut.
> Chaque paire est capturée sur les révisions git réelles (voir MISSION-UI.md §7bis).
> Captures : viewports 390 et 1440, `.webp` qualité 80, largeur max 1200 px.

---
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
