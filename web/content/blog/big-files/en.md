---
title: Videos over 2 GB: the bot shows where to download them
summary: Telegram doesn't let bots send files over 2 GB. Now the bot explains this and offers buttons right away to download the same video on the website or with the extension.
date: 2026-10-31
---
Telegram has a limit: a bot can't send a file larger than **2 GB**. A long video in high quality easily exceeds it — for example, a multi-hour lecture in 1080p.

## What the bot does now

- **Heavy qualities.** If some qualities are known to exceed 2 GB, the bot hides them and explains why. Two buttons appear under the quality picker: **«🌐 Download on the website»** and **«🧩 Download with the extension»**.
- **Even the lowest quality is over 2 GB.** In the bot you can download only the audio, and the video — via the same buttons.
- **The file turned out to be over 2 GB after downloading.** This happens when the size isn't known in advance. The bot explains what happened and offers the same two buttons — or you can pick a lower quality.

## Why the website and the extension can do it

The [videoner.download](https://videoner.download) website and the [browser extension](https://videoner.download/extension) have no Telegram limit: the file is saved straight to your device. The bot's buttons open them with this video already loaded — no need to paste the link again.
