-- Глобальный номер удачного скачивания (см. schema.prisma, Download.downloadNumber).
ALTER TABLE "Download" ADD COLUMN "downloadNumber" INTEGER;

-- Прежним удачным скачиваниям — номера по порядку создания.
WITH numbered AS (
  SELECT id, row_number() OVER (ORDER BY "createdAt", id) AS n
  FROM "Download"
  -- EXPIRED без размера — упавшие: очистка (cleanup.service) переводит в
  -- EXPIRED и FAILED, если от них остался недокачанный файл.
  WHERE status = 'COMPLETED' OR (status = 'EXPIRED' AND "fileSize" IS NOT NULL)
)
UPDATE "Download" d SET "downloadNumber" = numbered.n
FROM numbered WHERE d.id = numbered.id;

CREATE UNIQUE INDEX "Download_downloadNumber_key" ON "Download"("downloadNumber");

CREATE SEQUENCE "download_number_seq";
SELECT setval('download_number_seq', COALESCE((SELECT max("downloadNumber") FROM "Download"), 0) + 1, false);

-- Номер ставится, когда скачивание становится удачным: при создании записи
-- сразу удачной (выдача из кеша — бывает и EXPIRED, отчёт расширения) или при
-- смене статуса на COMPLETED. Смена на EXPIRED номера не даёт: так очистка
-- (cleanup.service) помечает и упавшие скачивания, а удачные к этому времени
-- номер уже получили.
CREATE FUNCTION assign_download_number() RETURNS trigger AS $$
BEGIN
  IF NEW."downloadNumber" IS NULL AND (
    NEW.status = 'COMPLETED' OR (TG_OP = 'INSERT' AND NEW.status = 'EXPIRED')
  ) THEN
    NEW."downloadNumber" := nextval('download_number_seq');
  END IF;
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER download_number
BEFORE INSERT OR UPDATE OF status ON "Download"
FOR EACH ROW EXECUTE FUNCTION assign_download_number();
