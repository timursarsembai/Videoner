---
title: Les options -audio et -hd : télécharger sans choisir la qualité
summary: Ajoutez -audio après un lien et le bot envoie aussitôt le son en mp3 ; ajoutez -hd pour la vidéo dans la meilleure qualité. Fonctionne en conversation privée et dans les groupes.
date: 2026-10-31
---
Le bot [@VideonerBot](https://t.me/VideonerBot) comprend désormais les options — de courts mots placés après un lien. Avec elles, inutile d’appuyer sur un bouton de qualité : le bot commence le téléchargement immédiatement.

## Options disponibles

- **-audio** — le son uniquement, en mp3. Pratique pour la musique, les podcasts et les cours.
- **-hd** — la vidéo dans la meilleure qualité qui tient dans Telegram (jusqu’à 2 Go).

## Comment les utiliser

Envoyez un lien suivi d’un espace et d’une option, par exemple :

`https://youtu.be/... -audio`

Si un message contient plusieurs liens, l’option s’applique à tous. Vous pouvez mettre un tiret long au lieu d’un trait d’union — les téléphones le remplacent souvent automatiquement, et le bot comprendra. Au lieu de -audio, vous pouvez aussi utiliser -mp3.

## Dans les groupes

Les options fonctionnent de la même façon dans les groupes :

- **-audio** — le bot envoie le son au lieu de la vidéo.
- **-hd** — la vidéo dans la meilleure qualité, même si 720p est choisi dans les /settings du groupe.

Si la suppression des messages contenant des liens est activée dans le groupe, le message « lien + option » est lui aussi supprimé une fois le fichier arrivé.

Sans option, tout fonctionne comme avant : en conversation privée, le bot affiche les boutons de qualité, et dans un groupe, il télécharge selon les réglages du groupe.
