---
title: Video tanpa memilih kualitas: mode «Video langsung» dan unduh otomatis
summary: Bot tidak lagi melewati tautan Anda jika Anda belum sempat memilih kualitas: setelah 2 menit, bot mengirim video 720p sendiri. Dan di /settings Anda bisa mengaktifkan mode «Video langsung» — video datang seketika, dengan tombol MP3 di bawahnya.
date: 2026-11-12
time: 12:40:00
---
Bot [@VideonerBot](https://t.me/VideonerBot) kini lebih nyaman bagi Anda yang tidak ingin memilih kualitas setiap kali. Perubahan ini muncul atas permintaan pengguna kami — terima kasih sudah menulis kepada kami!

## Belum sempat memilih — bot kirim videonya sendiri

Dulu sering begini: Anda mengirim tautan, beralih ke urusan lain, lalu saat kembali melihat «Tidak ada kualitas yang dipilih — tautan ini dilewati».

Sekarang, jika dalam **2 menit** Anda tidak mengetuk tombol apa pun, bot sendiri mengunduh **video 720p** (atau kualitas terdekat yang muat di Telegram) dan mengirimkannya. Sebagai ganti tombol, akan muncul keterangan mengapa video datang tanpa pilihan.

Jika Anda sudah mulai memilih — misalnya membuka subtitel — bot tidak memutuskan apa pun untuk Anda dan menunggu pilihan Anda, seperti sebelumnya.

## Mode «Video langsung»

Jika Anda hampir selalu hanya butuh videonya, aktifkan mode di mana bot sama sekali tidak menanyakan kualitas:

1. Kirim perintah **/settings** ke bot (ada juga di menu).
2. Ketuk **⚡ Video langsung** — ✅ muncul di sebelahnya.
3. Ketuk **✅ Selesai**.

Sekarang untuk setiap tautan bot langsung mengirim video 720p, dengan tombol **🎵 MP3** di bawahnya. Butuh suaranya saja? Ketuk tombol itu, dan bot mengirim mp3.

Butuh kualitas lain, misalnya 1080p? Matikan mode dengan tombol yang sama di /settings — pilihan biasa kembali. Secara bawaan mode ini mati, jadi bagi yang terbiasa memilih sendiri, tidak ada yang berubah.

## Ada juga flag

Kalau hanya sekali pakai, tanpa pengaturan, tambahkan flag setelah tautan: **-audio** — langsung suara dalam mp3, **-hd** — video dalam kualitas terbaik. Selengkapnya di artikel [Flag -audio dan -hd: unduh tanpa memilih kualitas](https://videoner.download/id/blog/link-flags).
