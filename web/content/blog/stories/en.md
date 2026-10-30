---
title: Instagram stories and connected accounts
summary: The extension downloads Instagram stories, and the bot downloads stories and private posts via your connected account. Connect with a button in the extension; manage with /accounts.
date: 2026-10-30
---
Stories and private posts are visible only to signed-in users, so the Videoner server can't get them. Now there are two solutions for that.

## Stories in the extension

The [Videoner extension](https://videoner.download/extension) downloads **Instagram stories** right in the browser, using your sign-in. Open a story and click "Download": videos are saved as mp4, photos as jpg.

## Connect an account to the bot

To let the bot download stories and private posts too, connect your account to it:

1. Sign in to the platform's website in a browser with the Videoner extension.
2. Click the Videoner icon and, at the bottom of the popup, **"Connect your account to the bot"**.
3. Allow access when the browser asks — the extension will show a code.
4. Send the code to [@VideonerBot](https://t.me/VideonerBot) in a private chat. The code is valid for 10 minutes.

You can connect **Instagram, Facebook, YouTube, X, VK and TikTok**. No password needed: only that platform's sign-in data goes to the server, encrypted.

After that, the bot downloads both stories and private posts from your links. If you send a link to a profile with stories, the bot will send the current stories as an album; if that doesn't work, it will ask for a link to a specific story.

Tip: platforms dislike automated downloads and may restrict the account — it's better to connect a secondary one, not your main account.

## For groups

To have the bot download stories for the whole group, send **/connect CODE** in that group. Who can connect accounts — admins only or everyone — is set in /settings. If no account is connected for the group, the bot downloads your link using your personal connection.

## Managing connections

- **/accounts** — a list of your connections: you can remove one or all of them at once.
- The **"My connections in the bot"** button in the extension opens the same list.
- The **"Revoke cookie access"** button in the extension removes the permission — the extension no longer reads sign-in data. Accounts you've already connected stay in the bot; you can remove them via /accounts.
