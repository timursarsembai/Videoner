---
title: Video without choosing quality: "Instant video" mode and auto-download
summary: The bot no longer drops your link if you didn't pick a quality in time: after 2 minutes it sends the 720p video by itself. And in /settings you can turn on "Instant video" mode, where the video arrives right away with an MP3 button under it.
date: 2026-11-12
time: 12:40:00
---
The [@VideonerBot](https://t.me/VideonerBot) bot just got more convenient for anyone who doesn't want to choose a quality every time. These changes came from our users' requests — thank you for writing to us!

## Didn't choose in time? The bot sends the video itself

It used to go like this: you send a link, switch to something else, and when you come back you see "no quality chosen — skipping this link".

Now, if you don't tap a single button within **2 minutes**, the bot downloads **720p video** (or the closest quality that fits in Telegram) and sends it. Instead of the buttons you'll see a note explaining why the video arrived without a choice.

If you've started choosing — for example, opened the subtitles — the bot decides nothing for you and waits for your choice, as before.

## "Instant video" mode

If you almost always just want the video, turn on a mode where the bot never asks about quality:

1. Send the bot the **/settings** command (it's in the menu too).
2. Tap **⚡ Instant video** — a ✅ appears next to it.
3. Tap **✅ Done**.

Now for every link the bot immediately sends a 720p video, with a **🎵 MP3** button under it. Need just the sound? Tap it and the bot sends an mp3.

Need a different quality, say 1080p? Turn the mode off with the same button in /settings and the usual choice comes back. The mode is off by default, so nothing changes for those who like to choose themselves.

## And there are flags

For a one-off, without touching settings, add a flag after the link: **-audio** — sound as mp3 right away, **-hd** — video in the best quality. More in the article on [the -audio and -hd flags: download without choosing quality](https://videoner.download/en/blog/link-flags).
