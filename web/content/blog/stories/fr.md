---
title: Stories Instagram et comptes connectés
summary: L’extension télécharge les stories Instagram, et le bot télécharge les stories et les publications privées grâce à votre compte connecté. Connectez-le avec un bouton dans l’extension ; gérez-le avec /accounts.
date: 2026-10-30
---
Les stories et les publications privées ne sont visibles que par les utilisateurs connectés : le serveur Videoner ne peut donc pas les récupérer. Il existe désormais deux solutions.

## Les stories dans l’extension

L’[extension Videoner](https://videoner.download/fr/extension) télécharge les **stories Instagram** directement dans le navigateur, avec votre connexion. Ouvrez une story et cliquez sur « Télécharger » : les vidéos sont enregistrées en mp4, les photos en jpg.

## Connecter un compte au bot

Pour que le bot télécharge lui aussi les stories et les publications privées, connectez-lui votre compte :

1. Connectez-vous au site de la plateforme dans un navigateur où l’extension Videoner est installée.
2. Cliquez sur l’icône Videoner puis, en bas de la fenêtre, sur **« Connecter votre compte au bot »**.
3. Autorisez l’accès quand le navigateur vous le demande : l’extension affichera un code.
4. Envoyez ce code à [@VideonerBot](https://t.me/VideonerBot) en conversation privée. Le code est valable 10 minutes.

Vous pouvez connecter **Instagram, Facebook, YouTube, X, VK et TikTok**. Aucun mot de passe n’est nécessaire : seules les données de connexion de cette plateforme sont envoyées au serveur, chiffrées.

Ensuite, le bot télécharge à partir de vos liens aussi bien les stories que les publications privées. Si vous envoyez le lien d’un profil qui a des stories, le bot enverra les stories en cours sous forme d’album ; si cela ne fonctionne pas, il vous demandera le lien d’une story précise.

Conseil : les plateformes n’aiment pas les téléchargements automatisés et peuvent restreindre le compte — mieux vaut connecter un compte secondaire, pas votre compte principal.

## Pour les groupes

Pour que le bot télécharge les stories pour tout le groupe, envoyez **/connect CODE** dans ce groupe. Qui peut connecter des comptes — les administrateurs uniquement ou tout le monde — se règle dans /settings. Si aucun compte n’est connecté pour le groupe, le bot télécharge votre lien avec votre connexion personnelle.

## Gérer les connexions

- **/accounts** — la liste de vos connexions : vous pouvez en supprimer une ou toutes d’un coup.
- Le bouton **« Mes connexions dans le bot »** de l’extension ouvre la même liste.
- Le bouton **« Retirer l’accès aux cookies »** de l’extension retire l’autorisation : l’extension ne lit plus les données de connexion. Les comptes déjà connectés restent dans le bot ; vous pouvez les supprimer via /accounts.
