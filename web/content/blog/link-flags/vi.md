---
title: Cờ -audio và -hd: tải mà không cần chọn chất lượng
summary: Thêm -audio sau liên kết, bot sẽ gửi ngay âm thanh dạng mp3; thêm -hd để nhận video ở chất lượng tốt nhất. Dùng được trong cuộc trò chuyện riêng và trong nhóm.
date: 2026-10-31
time: 01:12:42
---
Bot [@VideonerBot](https://t.me/VideonerBot) giờ hiểu được cờ — những từ ngắn đặt sau liên kết. Với cờ, bạn không cần nhấn nút chất lượng: bot bắt đầu tải ngay.

## Các cờ hiện có

- **-audio** — chỉ âm thanh, dạng mp3. Tiện cho nhạc, podcast và bài giảng.
- **-hd** — video ở chất lượng tốt nhất vừa với Telegram (đến 2 GB).

## Cách dùng

Gửi liên kết, theo sau là một dấu cách và cờ, ví dụ:

`https://youtu.be/... -audio`

Nếu tin nhắn có nhiều liên kết, cờ sẽ áp dụng cho tất cả. Bạn có thể dùng dấu gạch ngang dài thay cho dấu gạch nối — điện thoại thường tự động thay thế, và bot vẫn hiểu. Thay cho -audio, bạn cũng có thể dùng -mp3.

## Trong nhóm

Cờ hoạt động y như vậy trong nhóm:

- **-audio** — bot gửi âm thanh thay vì video.
- **-hd** — video ở chất lượng tốt nhất, kể cả khi trong /settings của nhóm đang chọn 720p.

Nếu nhóm đã bật xóa tin nhắn chứa liên kết, tin nhắn “liên kết + cờ” cũng sẽ bị xóa khi tệp đến.

Không có cờ, mọi thứ vẫn như trước: trong cuộc trò chuyện riêng, bot hiển thị các nút chất lượng, còn trong nhóm, bot tải theo cài đặt của nhóm.
