---
title: Las opciones -audio y -hd: descarga sin elegir calidad
summary: Añade -audio después del enlace y el bot te enviará el audio en mp3 al instante; con -hd, el vídeo en la mejor calidad. Funciona en chats privados y grupos.
date: 2026-10-31
---
El bot [@VideonerBot](https://t.me/VideonerBot) ahora entiende opciones: palabras cortas después del enlace. Con ellas no tienes que pulsar el botón de calidad: el bot empieza a descargar al instante.

## Qué opciones hay

- **-audio** — solo el audio en mp3. Ideal para música, pódcasts y clases.
- **-hd** — el vídeo en la mejor calidad que cabe en Telegram (hasta 2 GB).

## Cómo usarlas

Envía el enlace y, separada por un espacio, la opción, por ejemplo:

`https://youtu.be/... -audio`

Si un mensaje tiene varios enlaces, la opción se aplica a todos. En lugar del guion puedes poner una raya: el teléfono suele cambiarlo solo y el bot lo entenderá. En lugar de -audio también sirve -mp3.

## En grupos

En un grupo las opciones funcionan igual:

- **-audio** — el bot enviará el audio en lugar del vídeo.
- **-hd** — el vídeo en la mejor calidad, aunque en los /settings del grupo esté seleccionado 720p.

Si el grupo tiene activada la eliminación de mensajes con enlaces, el mensaje «enlace + opción» también se borrará cuando llegue el archivo.

Sin opción, todo sigue como antes: en el chat privado el bot muestra los botones de calidad y en un grupo descarga según la configuración del grupo.
