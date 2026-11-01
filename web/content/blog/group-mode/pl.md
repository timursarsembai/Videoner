---
title: Tryb grupowy: bot wrzuca filmy z linków wysłanych na czacie
summary: Dodaj @VideonerBot do grupy, a na wrzucone tam linki odpowie filmem. Admini ustawiają jego zachowanie komendą /settings.
date: 2026-10-30
---
Możesz teraz dodać [@VideonerBot](https://t.me/VideonerBot) do czatu grupowego. Gdy ktoś wrzuci link do filmu, bot odpowie samym filmem. Nikt nie musi otwierać linku ani przełączać się do bota.

## Jak to ustawić

1. Otwórz [@VideonerBot](https://t.me/VideonerBot) i stuknij /start.
2. Stuknij przycisk **„Dodaj do grupy”** i wybierz czat.
3. Gotowe — bot się przywita i weźmie się do roboty.

## Jak bot zachowuje się w grupie

- Sam, bez żadnych komend, pobiera filmy **do 15 minut**, automatycznie dobierając jakość.
- Nie odpowiada na zwykłe wiadomości i nie wtrąca się do rozmowy.
- Jeśli filmu nie da się pobrać, bot po cichu usuwa swoją wiadomość, zamiast zaśmiecać czat błędami.
- Linki działają nawet bez https:// — bot je też rozpozna.

## Ustawienia dla adminów

Admini grupy mogą skonfigurować bota komendą **/settings**:

- **Usuwanie linków** — gdy przyjdzie film, wiadomość z linkiem znika i na czacie zostaje tylko film.
- **Podpis** — pełny, tylko tytuł i źródło albo bez podpisu.
- **Jakość** — najwyższa albo 720p, jeśli grupa chce oszczędzać transfer.
- **Długie filmy** — zezwól na nie albo zostaw limit 15 minut.

Ustawienia są zapisywane osobno dla każdej grupy i zostają nawet wtedy, gdy grupa stanie się supergrupą. Zmieniać je mogą tylko admini.

Wypróbuj go na czacie ze znajomymi albo w grupie z pracy — i napisz nam, czego brakuje, na [@VideonerBot](https://t.me/VideonerBot).
