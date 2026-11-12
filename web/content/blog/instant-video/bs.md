---
title: Video bez biranja kvaliteta — način rada „Odmah video” i automatsko preuzimanje
summary: Bot više ne preskače link ako niste stigli odabrati kvalitet: nakon 2 minute sam šalje video u 720p. A u /settings možete uključiti način „Odmah video” — video stiže odmah, a ispod njega je dugme MP3.
date: 2026-11-12
time: 12:40:00
---
Bot [@VideonerBot](https://t.me/VideonerBot) postao je praktičniji za one koji ne žele svaki put birati kvalitet. Ove promjene su nastale na zahtjev naših korisnika — hvala što nam pišete!

## Niste stigli odabrati — bot sam šalje video

Ranije se dešavalo ovako: pošaljete link, pređete na druge stvari, a kad se vratite, vidite „kvalitet nije odabran — preskačem link”.

Sada, ako u roku od **2 minute** niste pritisnuli nijedno dugme, bot sam preuzima **video u 720p** (ili najbliži kvalitet koji stane u Telegram) i šalje ga. Umjesto dugmadi pojavljuje se objašnjenje zašto je video stigao bez izbora.

Ako ste počeli birati — na primjer, otvorili ste titlove — bot ništa ne odlučuje umjesto vas i čeka vaš izbor, kao i ranije.

## Način rada „Odmah video”

Ako vam gotovo uvijek treba samo video, uključite način u kojem bot uopće ne pita za kvalitet:

1. Pošaljite botu komandu **/settings** (nalazi se i u meniju).
2. Pritisnite **⚡ Odmah video** — pored će se pojaviti ✅.
3. Pritisnite **✅ Gotovo**.

Sada za svaki link bot odmah šalje video u 720p, a ispod njega — dugme **🎵 MP3**. Treba vam zvuk — pritisnite ga i bot će poslati mp3.

Treba vam drugi kvalitet, na primjer 1080p? Isključite način istim dugmetom u /settings — vraća se uobičajeni izbor. Po zadanim postavkama način je isključen, pa se za one koji su navikli birati sami ništa nije promijenilo.

## A tu su i oznake

Ako vam treba jednokratno, bez postavki, dopišite iza linka oznaku: **-audio** — odmah zvuk kao mp3, **-hd** — video u najboljem kvalitetu. Više o tome — u članku o [oznakama -audio i -hd](https://videoner.download/bs/blog/link-flags).
