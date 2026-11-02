---
title: Mode groupe : le bot publie les vidéos des liens partagés dans la conversation
summary: Ajoutez @VideonerBot à un groupe, et il répondra par la vidéo aux liens qui y sont publiés. Les administrateurs règlent son comportement avec la commande /settings.
date: 2026-10-30
time: 23:18:52
---
Vous pouvez désormais ajouter [@VideonerBot](https://t.me/VideonerBot) à une conversation de groupe. Quand quelqu’un partage le lien d’une vidéo, le bot répond avec la vidéo elle-même. Personne n’a besoin d’ouvrir le lien ni de passer par le bot.

## Comment le configurer

1. Ouvrez [@VideonerBot](https://t.me/VideonerBot) et appuyez sur /start.
2. Appuyez sur le bouton **« Ajouter à un groupe »** et choisissez une conversation.
3. C’est tout : le bot dira bonjour et se mettra au travail.

## Comment le bot se comporte dans un groupe

- Il télécharge tout seul les vidéos **de 15 minutes maximum**, sans commande, en choisissant la qualité automatiquement.
- Il ne répond pas aux messages ordinaires et ne s’immisce pas dans la conversation.
- Si une vidéo ne peut pas être téléchargée, le bot supprime discrètement son message au lieu d’encombrer la conversation de messages d’erreur.
- Les liens fonctionnent même sans https:// : le bot les reconnaît aussi.

## Réglages pour les administrateurs

Les administrateurs du groupe peuvent configurer le bot avec la commande **/settings** :

- **Supprimer les liens** — une fois la vidéo arrivée, le message contenant le lien disparaît, et seule la vidéo reste dans la conversation.
- **Légende** — complète, titre et source uniquement, ou aucune légende.
- **Qualité** — la plus haute, ou 720p si le groupe veut économiser des données.
- **Vidéos longues** — les autoriser ou garder la limite de 15 minutes.

Les réglages sont enregistrés séparément pour chaque groupe et sont conservés même si le groupe devient un supergroupe. Seuls les administrateurs peuvent les modifier.

Essayez-le dans une conversation entre amis ou dans un groupe de travail — et dites-nous ce qui manque sur [@VideonerBot](https://t.me/VideonerBot).
