---
title: Vídeo sem escolher a qualidade: o modo «Vídeo direto» e o download automático
summary: O bot não descarta mais o seu link se você não escolheu a qualidade a tempo: depois de 2 minutos, ele mesmo envia o vídeo em 720p. E em /settings você pode ativar o modo «Vídeo direto»: o vídeo chega na hora, com um botão MP3 embaixo.
date: 2026-11-12
time: 12:40:00
---
O bot [@VideonerBot](https://t.me/VideonerBot) ficou mais prático para quem não quer escolher a qualidade toda vez. Essas mudanças vieram de pedidos dos nossos usuários — obrigado por escreverem!

## Não deu tempo de escolher? O bot envia o vídeo sozinho

Antes era assim: você manda um link, vai fazer outra coisa e, quando volta, vê «Nenhuma qualidade escolhida — pulando este link».

Agora, se em **2 minutos** você não tocar em nenhum botão, o bot baixa sozinho o **vídeo em 720p** (ou a qualidade mais próxima que cabe no Telegram) e o envia. No lugar dos botões aparece uma nota explicando por que o vídeo chegou sem escolha.

Se você já começou a escolher — por exemplo, abriu as legendas —, o bot não decide nada por você e espera a sua escolha, como antes.

## O modo «Vídeo direto»

Se quase sempre você quer só o vídeo, ative o modo em que o bot nem pergunta a qualidade:

1. Envie ao bot o comando **/settings** (ele também está no menu).
2. Toque em **⚡ Vídeo direto** — um ✅ aparece ao lado.
3. Toque em **✅ Pronto**.

Agora, para cada link, o bot envia na hora um vídeo em 720p, com o botão **🎵 MP3** embaixo. Precisa só do som? Toque nele e o bot envia um mp3.

Precisa de outra qualidade, como 1080p? Desative o modo com o mesmo botão em /settings e a escolha de sempre volta. O modo vem desativado por padrão, então quem está acostumado a escolher por conta própria não percebe nenhuma mudança.

## E tem as flags

Se for algo pontual, sem mexer nas configurações, escreva uma flag depois do link: **-audio** — o som em mp3 na hora, **-hd** — o vídeo na melhor qualidade. Mais detalhes no artigo sobre [as flags -audio e -hd: baixe sem escolher a qualidade](https://videoner.download/pt/blog/link-flags).
