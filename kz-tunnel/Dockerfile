# SOCKS-туннель на личный сервер владельца в Казахстане (24.11.2026): TikTok
# отдаёт ролики, закрытые «только для страны автора», казахстанскому адресу
# (server/src/lib/region-proxy.ts). Учётка на том сервере — без прав, только
# проброс. Адрес и учётка — в ~/.config/videoner-kz/ssh_config на хосте (не в
# git), ключ и known_hosts монтируются только для чтения.
# Отдельный контейнер, а не туннель zakup: проекты не зависят друг от друга.
FROM alpine:3.20
RUN apk add --no-cache openssh-client && adduser -D -u 1000 tunnel
USER tunnel
ENTRYPOINT ["ssh", "-F", "/run/kz/config", "-N", "-D", "0.0.0.0:1080", "-o", "BatchMode=yes", "-o", "IdentitiesOnly=yes", \
            "-o", "ExitOnForwardFailure=yes", "-o", "ServerAliveInterval=30", "-o", "ServerAliveCountMax=3", \
            "-o", "StrictHostKeyChecking=yes", "-o", "UserKnownHostsFile=/run/kz/known_hosts", \
            "-i", "/run/kz/key", "kz"]
