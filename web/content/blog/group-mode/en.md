---
title: Group mode: the bot posts videos for links shared in the chat
summary: Add @VideonerBot to a group, and it will reply with the video to links posted there. Admins configure its behavior with the /settings command.
date: 2026-10-30
---
You can now add [@VideonerBot](https://t.me/VideonerBot) to a group chat. When someone drops a link to a video, the bot replies with the video itself. Nobody has to open the link or switch to the bot.

## How to set it up

1. Open [@VideonerBot](https://t.me/VideonerBot) and tap /start.
2. Tap the **"Add to a group"** button and choose a chat.
3. That's it — the bot will say hello and get to work.

## How the bot behaves in a group

- It downloads videos **up to 15 minutes** long on its own, no commands needed, picking the quality automatically.
- It doesn't reply to regular messages or butt into the conversation.
- If a video can't be downloaded, the bot quietly removes its message instead of cluttering the chat with errors.
- Links work even without https:// — the bot recognizes them too.

## Settings for admins

Group admins can configure the bot with the **/settings** command:

- **Delete links** — once the video arrives, the message with the link disappears, and only the video stays in the chat.
- **Caption** — full, title and source only, or no caption.
- **Quality** — the highest, or 720p if the group wants to save data.
- **Long videos** — allow them or keep the 15-minute limit.

Settings are stored separately for each group and are kept even if the group becomes a supergroup. Only admins can change them.

Try it in a chat with friends or in a work group — and tell us what's missing at [@VideonerBot](https://t.me/VideonerBot).
