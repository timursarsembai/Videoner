-- Размеры видео для sendVideo: без width/height Telegram на iOS сплющивает
-- вертикальное видео в квадрат. Заполняются ffprobe'ом при завершении загрузки.
ALTER TABLE "Download" ADD COLUMN "videoWidth" INTEGER;
ALTER TABLE "Download" ADD COLUMN "videoHeight" INTEGER;
