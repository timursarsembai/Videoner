---
title: Flag -audio dan -hd: unduh tanpa memilih kualitas
summary: Tambahkan -audio setelah tautan, dan bot langsung mengirim suaranya dalam mp3; tambahkan -hd untuk video dalam kualitas terbaik. Berfungsi di chat pribadi dan grup.
date: 2026-10-31
time: 01:12:42
---
Bot [@VideonerBot](https://t.me/VideonerBot) kini memahami flag — kata pendek setelah tautan. Dengan flag, Anda tidak perlu mengetuk tombol kualitas: bot langsung mulai mengunduh.

## Flag yang tersedia

- **-audio** — hanya suara, dalam mp3. Praktis untuk musik, podcast, dan kuliah.
- **-hd** — video dalam kualitas terbaik yang muat di Telegram (hingga 2 GB).

## Cara menggunakannya

Kirim tautan diikuti spasi dan flag, misalnya:

`https://youtu.be/... -audio`

Jika pesan berisi beberapa tautan, flag berlaku untuk semuanya. Anda bisa memakai tanda pisah alih-alih tanda hubung — ponsel sering menggantinya secara otomatis, dan bot tetap memahaminya. Selain -audio, Anda juga bisa memakai -mp3.

## Di grup

Flag berfungsi dengan cara yang sama di grup:

- **-audio** — bot mengirim suaranya, bukan video.
- **-hd** — video dalam kualitas terbaik, meskipun 720p dipilih di /settings grup.

Jika di grup diaktifkan penghapusan pesan berisi tautan, pesan "tautan + flag" juga dihapus setelah file tiba.

Tanpa flag, semuanya berjalan seperti sebelumnya: di chat pribadi bot menampilkan tombol kualitas, dan di grup bot mengunduh sesuai pengaturan grup.
