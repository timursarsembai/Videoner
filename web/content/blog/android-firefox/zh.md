---
title: 现在可以用 Android 手机将账号连接到机器人
summary: 无需电脑：在 Android 上通过 Firefox 和 Cookie-Editor 扩展将 Instagram 连接到 @VideonerBot，机器人就能下载快拍和私密帖子。
date: 2026-10-31
---
要让机器人下载 Instagram 快拍和私密帖子，需要先将你的账号连接到机器人。以前，这需要一台装有 Videoner 扩展的电脑。现在，你可以直接用 **Android** 手机完成连接。

## 准备工作

- 一部 Android 手机。
- Google Play 上的 **Firefox** 浏览器：手机版 Chrome 不支持扩展，而 Firefox 支持。
- Firefox 的 **Cookie-Editor** 扩展。

## 如何连接

1. 安装 Firefox，并在其中登录 instagram.com 上的账号。
2. Firefox 菜单（⋮）→“扩展”→ 搜索并安装 **Cookie-Editor**。
3. 打开 instagram.com，然后点击菜单（⋮）→“扩展”→ Cookie-Editor。
4. 点击 **Export**，选择 **Netscape** 格式，登录数据就会复制到剪贴板。
5. 在私聊中打开 [@VideonerBot](https://t.me/VideonerBot)，把复制的文本作为普通消息粘贴并发送。

机器人会回复账号已连接。之后把快拍链接发给它，它就会用你的登录状态下载。使用 **/accounts** 命令可以查看和断开连接。

## 注意事项

- 这段文本可以访问你的 Instagram 账号。请**只在私聊中发给机器人**，不要发到群组，也不要发给其他人。
- 机器人只保留所需平台的登录数据，并加密存储。
- 平台不喜欢自动下载，可能会限制账号，因此最好连接一个小号，而不是主账号。
- 这种方式只为你个人连接账号。如需为整个群组连接账号，请使用[电脑上的扩展](https://videoner.download/zh/extension)和 /connect 命令。

## iPhone 可以吗？

在 iPhone 上无法这样操作：Safari 不允许导出登录数据。在 iPhone 上，更简单的做法是用电脑上的 Videoner 扩展连接一次账号。
