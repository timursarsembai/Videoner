---
title: Modo para grupos: el bot envía los videos de los enlaces del chat
summary: Añade @VideonerBot a un grupo y responderá con el video a los enlaces que se publiquen allí. Los administradores ajustan su comportamiento con el comando /settings.
date: 2026-10-30
---
Ahora puedes añadir [@VideonerBot](https://t.me/VideonerBot) a un chat de grupo. Alguien comparte el enlace de un video y el bot responde enviando el video. Nadie tiene que abrir el enlace ni ir al bot.

## Cómo añadirlo

1. Abre [@VideonerBot](https://t.me/VideonerBot) y pulsa /start.
2. Pulsa el botón **«Add to a group»** (añadir a un grupo) y elige el chat.
3. Listo: el bot saludará y empezará a funcionar.

## Cómo se comporta el bot en un grupo

- Descarga por su cuenta los videos de **hasta 15 minutos**, sin comandos, y elige la calidad automáticamente.
- No responde a los mensajes normales ni se mete en la conversación.
- Si no consigue descargar un video, borra su mensaje en silencio en lugar de llenar el chat de errores.
- Los enlaces se pueden enviar también sin https://: el bot los reconoce igual.

## Ajustes para administradores

Los administradores del grupo pueden configurar el bot con el comando **/settings**:

- **Delete links** (borrar enlaces): cuando llega el video, el mensaje con el enlace desaparece y en el chat queda solo el video.
- **Caption** (pie del video): completo, solo título y fuente, o sin pie.
- **Quality** (calidad): la máxima o 720p, si en el grupo quieren ahorrar datos.
- **Long videos** (videos largos): permitirlos o mantener el límite de 15 minutos.

Los ajustes se guardan por separado para cada grupo y se conservan aunque el grupo se convierta en supergrupo. Solo los administradores pueden cambiarlos.

Pruébalo en un chat con amigos o en un grupo de trabajo, y cuéntanos qué echas en falta en [@VideonerBot](https://t.me/VideonerBot).
