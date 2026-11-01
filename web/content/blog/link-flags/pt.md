---
title: As flags -audio e -hd: baixe sem escolher a qualidade
summary: Adicione -audio depois do link e o bot envia o som em mp3 na hora; adicione -hd para receber o vídeo na melhor qualidade. Funciona em conversas privadas e em grupos.
date: 2026-10-31
---
O bot [@VideonerBot](https://t.me/VideonerBot) agora entende flags — palavras curtas depois do link. Com elas, você não precisa tocar em um botão de qualidade: o bot começa a baixar na hora.

## Flags disponíveis

- **-audio** — só o som, em mp3. Prático para músicas, podcasts e aulas.
- **-hd** — o vídeo na melhor qualidade que cabe no Telegram (até 2 GB).

## Como usar

Envie um link seguido de um espaço e uma flag, por exemplo:

`https://youtu.be/... -audio`

Se a mensagem tiver vários links, a flag vale para todos. Você pode usar um travessão no lugar do hífen — o celular muitas vezes troca um pelo outro automaticamente, e o bot entende. No lugar de -audio, também dá para usar -mp3.

## Nos grupos

As flags funcionam do mesmo jeito nos grupos:

- **-audio** — o bot envia o som em vez do vídeo.
- **-hd** — o vídeo na melhor qualidade, mesmo que 720p esteja selecionado no /settings do grupo.

Se o grupo tiver ativada a exclusão das mensagens com links, a mensagem “link + flag” também é apagada quando o arquivo chega.

Sem flag, tudo funciona como antes: em conversa privada o bot mostra os botões de qualidade, e no grupo ele baixa conforme as configurações do grupo.
