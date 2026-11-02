---
title: Penanda -audio dan -hd: muat turun tanpa memilih kualiti
summary: Tambahkan -audio selepas pautan dan bot terus menghantar audio dalam mp3; tambahkan -hd untuk video dalam kualiti terbaik. Berfungsi dalam sembang peribadi dan kumpulan.
date: 2026-10-31
time: 01:12:42
---
Bot [@VideonerBot](https://t.me/VideonerBot) kini memahami penanda — perkataan pendek selepas pautan. Dengan penanda, anda tidak perlu mengetik butang kualiti: bot terus mula memuat turun.

## Penanda yang tersedia

- **-audio** — audio sahaja, dalam mp3. Sesuai untuk muzik, podcast dan kuliah.
- **-hd** — video dalam kualiti terbaik yang muat dalam Telegram (sehingga 2 GB).

## Cara menggunakannya

Hantar pautan diikuti dengan jarak dan penanda, contohnya:

`https://youtu.be/... -audio`

Jika mesej mengandungi beberapa pautan, penanda digunakan untuk kesemuanya. Anda boleh menggunakan sengkang panjang dan bukannya tanda sempang — telefon sering menggantikannya secara automatik, dan bot tetap akan faham. Selain -audio, anda juga boleh menggunakan -mp3.

## Dalam kumpulan

Penanda berfungsi dengan cara yang sama dalam kumpulan:

- **-audio** — bot menghantar audio dan bukannya video.
- **-hd** — video dalam kualiti terbaik, walaupun 720p dipilih dalam /settings kumpulan.

Jika kumpulan menghidupkan pemadaman mesej yang mengandungi pautan, mesej “pautan + penanda” juga dipadamkan sebaik sahaja fail tiba.

Tanpa penanda, semuanya berfungsi seperti sebelum ini: dalam sembang peribadi bot menunjukkan butang kualiti, dan dalam kumpulan bot memuat turun mengikut tetapan kumpulan.
