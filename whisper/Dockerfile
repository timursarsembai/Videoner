# Распознавание речи для «Текст из видео» (владелец 26.11.2026): whisper.cpp
# на процессоре, без сторонних сервисов. Отдельный контейнер со своим пределом
# памяти и ядер — чтобы распознавание не мешало скачиваниям. Принимает WAV
# 16 кГц моно (перекодирует server), отвечает текстом с отрезками по времени.
FROM debian:bookworm-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends git cmake build-essential ca-certificates curl \
 && rm -rf /var/lib/apt/lists/*
ARG WHISPER_VERSION=v1.7.4
RUN git clone --depth 1 --branch ${WHISPER_VERSION} https://github.com/ggml-org/whisper.cpp /src
WORKDIR /src
RUN cmake -B build -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF -DGGML_NATIVE=OFF -DWHISPER_BUILD_TESTS=OFF \
 && cmake --build build -j4 --target whisper-server
# small: на 4 ядрах этого сервера минута речи — за 1–1,5 минуты, ~600 МБ
# памяти. large-v3-turbo точнее, но 3 минуты речи не распознала и за 15 минут
# (замер 26.11.2026).
ARG WHISPER_MODEL=small-q5_1
RUN curl -fsSL -o /model.bin "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-${WHISPER_MODEL}.bin"

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends libgomp1 curl && rm -rf /var/lib/apt/lists/* \
 && useradd -u 1000 -m whisper
COPY --from=build /src/build/bin/whisper-server /usr/local/bin/whisper-server
COPY --from=build /model.bin /models/model.bin
USER whisper
EXPOSE 8178
# 4 потока: на 8 было не быстрее — ядра делятся с остальными сервисами.
ENTRYPOINT ["whisper-server", "--host", "0.0.0.0", "--port", "8178", "-m", "/models/model.bin", "-l", "auto", "-t", "4"]
