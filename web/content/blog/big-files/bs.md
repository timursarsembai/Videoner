---
title: Videozapisi veći od 2 GB — bot pokazuje gdje ih preuzeti
summary: Telegram ne dozvoljava botovima da šalju fajlove veće od 2 GB. Sada bot to objašnjava i odmah nudi dugmad za preuzimanje istog videa na web-stranici ili pomoću proširenja.
date: 2026-10-31
time: 02:49:39
---
Telegram ima ograničenje: bot ne može poslati fajl veći od **2 GB**. Dugačak video u visokom kvalitetu lako ga premaši — na primjer, predavanje od nekoliko sati u 1080p.

## Šta bot sada radi

- **Preteški kvaliteti.** Ako se zna da neki kvaliteti premašuju 2 GB, bot ih skriva i objašnjava zašto. Ispod izbora kvaliteta pojavljuju se dva dugmeta: **„🌐 Preuzmi na web-stranici“** i **„🧩 Preuzmi pomoću proširenja“**.
- **Čak i najniži kvalitet premašuje 2 GB.** U botu možete preuzeti samo audio, a video — pomoću istih dugmadi.
- **Fajl se nakon preuzimanja pokazao većim od 2 GB.** To se dešava kada veličina nije unaprijed poznata. Bot objašnjava šta se desilo i nudi ista dva dugmeta — ili možete odabrati niži kvalitet.

## Zašto web-stranica i proširenje to mogu

Web-stranica [videoner.download](https://videoner.download/bs) i [proširenje preglednika](https://videoner.download/bs/extension) nemaju Telegramovo ograničenje: fajl se čuva direktno na vaš uređaj. Dugmad u botu otvaraju ih s već učitanim ovim videom — link ne morate ponovo lijepiti.
