---
title: Grupni način — bot šalje videozapise za linkove podijeljene u chatu
summary: Dodajte @VideonerBot u grupu i on će na linkove objavljene u njoj odgovarati videom. Administratori podešavaju njegovo ponašanje komandom /settings.
date: 2026-10-30
---
Sada možete dodati [@VideonerBot](https://t.me/VideonerBot) u grupni chat. Kada neko pošalje link na video, bot odgovara samim videom. Niko ne mora otvarati link niti prelaziti u bota.

## Kako ga podesiti

1. Otvorite [@VideonerBot](https://t.me/VideonerBot) i dodirnite /start.
2. Dodirnite dugme **„👥 Dodaj u grupu“** i odaberite chat.
3. To je to — bot će se pozdraviti i početi s radom.

## Kako se bot ponaša u grupi

- Sam preuzima videozapise **do 15 minuta**, bez ikakvih komandi, i automatski bira kvalitet.
- Ne odgovara na obične poruke i ne miješa se u razgovor.
- Ako se video ne može preuzeti, bot tiho uklanja svoju poruku umjesto da zatrpava chat greškama.
- Linkovi rade i bez https:// — bot ih također prepoznaje.

## Postavke za administratore

Administratori grupe mogu podesiti bota komandom **/settings**:

- **Brisanje linkova** — kada video stigne, poruka s linkom nestaje, a u chatu ostaje samo video.
- **Tekst** — puni, samo naslov i izvor ili bez teksta.
- **Kvalitet** — najviši ili 720p, ako grupa želi štedjeti podatke.
- **Dugi videozapisi** — dozvoliti ih ili zadržati ograničenje od 15 minuta.

Postavke se čuvaju zasebno za svaku grupu i ostaju čak i ako grupa postane supergrupa. Mijenjati ih mogu samo administratori.

Isprobajte u chatu s prijateljima ili u radnoj grupi — i javite nam šta nedostaje na [@VideonerBot](https://t.me/VideonerBot).
