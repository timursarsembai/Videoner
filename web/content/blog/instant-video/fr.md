---
title: La vidéo sans choisir la qualité : le mode « Vidéo directe » et le téléchargement automatique
summary: Le bot n’abandonne plus votre lien si vous n’avez pas choisi la qualité à temps : au bout de 2 minutes, il envoie lui-même la vidéo en 720p. Et dans /settings, vous pouvez activer le mode « Vidéo directe » : la vidéo arrive aussitôt, avec un bouton MP3 en dessous.
date: 2026-11-12
time: 12:40:00
---
Le bot [@VideonerBot](https://t.me/VideonerBot) est devenu plus pratique pour ceux qui ne veulent pas choisir la qualité à chaque fois. Ces changements viennent de demandes de nos utilisateurs — merci de nous écrire !

## Vous n’avez pas choisi à temps : le bot envoie la vidéo tout seul

Avant, cela se passait ainsi : vous envoyez un lien, vous passez à autre chose, et à votre retour vous voyez « Aucune qualité choisie — ce lien est ignoré ».

Désormais, si vous n’appuyez sur aucun bouton pendant **2 minutes**, le bot télécharge lui-même la **vidéo en 720p** (ou la qualité la plus proche qui tient dans Telegram) et vous l’envoie. À la place des boutons apparaît une note expliquant pourquoi la vidéo est arrivée sans choix.

Si vous avez commencé à choisir — par exemple en ouvrant les sous-titres —, le bot ne décide rien à votre place et attend votre choix, comme avant.

## Le mode « Vidéo directe »

Si vous voulez presque toujours simplement la vidéo, activez le mode dans lequel le bot ne demande jamais la qualité :

1. Envoyez au bot la commande **/settings** (elle figure aussi dans le menu).
2. Appuyez sur **⚡ Vidéo directe** — un ✅ apparaît à côté.
3. Appuyez sur **✅ Terminé**.

Désormais, pour chaque lien, le bot envoie aussitôt une vidéo en 720p, avec un bouton **🎵 MP3** en dessous. Besoin du son ? Appuyez dessus et le bot envoie un mp3.

Besoin d’une autre qualité, par exemple 1080p ? Désactivez le mode avec le même bouton dans /settings : le choix habituel revient. Le mode est désactivé par défaut, donc rien ne change pour ceux qui aiment choisir eux-mêmes.

## Et il y a aussi les options

Pour un usage ponctuel, sans réglages, ajoutez une option après le lien : **-audio** — le son tout de suite en mp3, **-hd** — la vidéo dans la meilleure qualité. Plus de détails dans l’article sur [les options -audio et -hd : télécharger sans choisir la qualité](https://videoner.download/fr/blog/link-flags).
