---
title: -audio ve -hd işaretleri: kalite seçmeden indirin
summary: Bağlantının arkasına -audio ekleyin, bot sesi hemen mp3 olarak göndersin; en iyi kalitede video için -hd ekleyin. Özel sohbetlerde ve gruplarda çalışır.
date: 2026-10-31
---
[@VideonerBot](https://t.me/VideonerBot) botu artık işaretleri anlıyor: bağlantıdan sonra yazılan kısa kelimeler. Bunlar sayesinde bir kalite düğmesine dokunmanıza gerek kalmaz: bot indirmeye hemen başlar.

## Mevcut işaretler

- **-audio**: yalnızca ses, mp3 olarak. Müzik, podcast ve dersler için pratiktir.
- **-hd**: Telegram'a sığan en iyi kalitede video (2 GB'a kadar).

## Nasıl kullanılır

Bir bağlantı, ardından bir boşluk ve bir işaret gönderin, örneğin:

`https://youtu.be/... -audio`

Bir mesajda birden fazla bağlantı varsa işaret hepsine uygulanır. Kısa çizgi yerine uzun tire de kullanabilirsiniz: telefonlar bunu genellikle otomatik olarak değiştirir, bot yine de anlar. -audio yerine -mp3 de kullanabilirsiniz.

## Gruplarda

İşaretler gruplarda da aynı şekilde çalışır:

- **-audio**: bot video yerine sesi gönderir.
- **-hd**: grubun /settings ayarlarında 720p seçili olsa bile en iyi kalitede video.

Grupta bağlantı içeren mesajların silinmesi açıksa “bağlantı + işaret” mesajı da dosya geldikten sonra silinir.

İşaret olmadan her şey eskisi gibi çalışır: özel sohbette bot kalite düğmelerini gösterir, grupta ise grubun ayarlarına göre indirir.
