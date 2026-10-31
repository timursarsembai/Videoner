---
title: The -audio and -hd flags: download without choosing quality
summary: Add -audio after a link and the bot sends the sound as mp3 right away; add -hd for video in the best quality. Works in private chats and groups.
date: 2026-10-31
---
The [@VideonerBot](https://t.me/VideonerBot) bot now understands flags — short words after a link. With them you don't need to tap a quality button: the bot starts downloading right away.

## Available flags

- **-audio** — sound only, as mp3. Handy for music, podcasts and lectures.
- **-hd** — video in the best quality that fits in Telegram (up to 2 GB).

## How to use them

Send a link followed by a space and a flag, for example:

`https://youtu.be/... -audio`

If a message contains several links, the flag applies to all of them. You can use a dash instead of a hyphen — phones often replace it automatically, and the bot will understand. Instead of -audio you can also use -mp3.

## In groups

Flags work the same way in groups:

- **-audio** — the bot sends the sound instead of the video.
- **-hd** — video in the best quality, even if 720p is selected in the group's /settings.

If the group has deletion of messages with links turned on, the "link + flag" message is deleted too once the file arrives.

Without a flag, everything works as before: in a private chat the bot shows quality buttons, and in a group it downloads according to the group's settings.
