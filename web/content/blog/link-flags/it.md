---
title: I flag -audio e -hd: scarica senza scegliere la qualità
summary: Aggiungi -audio dopo un link e il bot ti manda subito l’audio in mp3; aggiungi -hd per il video nella qualità migliore. Funziona in chat privata e nei gruppi.
date: 2026-10-31
time: 01:12:42
---
Il bot [@VideonerBot](https://t.me/VideonerBot) ora capisce i flag: brevi parole dopo un link. Con questi non devi toccare un pulsante di qualità: il bot inizia subito a scaricare.

## Flag disponibili

- **-audio**: solo l’audio, in mp3. Comodo per musica, podcast e lezioni.
- **-hd**: il video nella qualità migliore che entra in Telegram (fino a 2 GB).

## Come usarli

Invia un link seguito da uno spazio e da un flag, per esempio:

`https://youtu.be/... -audio`

Se un messaggio contiene più link, il flag vale per tutti. Al posto del trattino puoi usare una lineetta: i telefoni spesso lo sostituiscono in automatico, e il bot capisce lo stesso. Invece di -audio puoi usare anche -mp3.

## Nei gruppi

I flag funzionano allo stesso modo nei gruppi:

- **-audio**: il bot invia l’audio invece del video.
- **-hd**: il video nella qualità migliore, anche se nelle /settings del gruppo è selezionato 720p.

Se nel gruppo è attiva l’eliminazione dei messaggi con i link, anche il messaggio «link + flag» viene eliminato quando arriva il file.

Senza flag tutto funziona come prima: in chat privata il bot mostra i pulsanti di qualità, e in un gruppo scarica secondo le impostazioni del gruppo.
