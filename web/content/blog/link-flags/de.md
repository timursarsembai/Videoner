---
title: Die Flags -audio und -hd: Herunterladen ohne Qualitätsauswahl
summary: Häng -audio an einen Link, und der Bot schickt sofort den Ton als mp3; mit -hd kommt das Video in bester Qualität. Funktioniert in privaten Chats und in Gruppen.
date: 2026-10-31
---
Der Bot [@VideonerBot](https://t.me/VideonerBot) versteht jetzt Flags – kurze Wörter nach einem Link. Damit musst du keinen Qualitäts-Button antippen: Der Bot fängt sofort mit dem Download an.

## Verfügbare Flags

- **-audio** – nur der Ton, als mp3. Praktisch für Musik, Podcasts und Vorlesungen.
- **-hd** – Video in der besten Qualität, die in Telegram passt (bis 2 GB).

## So nutzt du sie

Schick einen Link, gefolgt von einem Leerzeichen und einem Flag, zum Beispiel:

`https://youtu.be/... -audio`

Enthält eine Nachricht mehrere Links, gilt das Flag für alle. Statt eines Bindestrichs kannst du auch einen Gedankenstrich verwenden – Handys ersetzen ihn oft automatisch, und der Bot versteht das. Statt -audio kannst du auch -mp3 schreiben.

## In Gruppen

Flags funktionieren in Gruppen genauso:

- **-audio** – der Bot schickt den Ton statt des Videos.
- **-hd** – Video in bester Qualität, selbst wenn in den /settings der Gruppe 720p eingestellt ist.

Ist in der Gruppe das Löschen von Nachrichten mit Links eingeschaltet, wird auch die Nachricht „Link + Flag“ gelöscht, sobald die Datei da ist.

Ohne Flag funktioniert alles wie bisher: Im privaten Chat zeigt der Bot Qualitäts-Buttons, in einer Gruppe lädt er nach den Einstellungen der Gruppe herunter.
