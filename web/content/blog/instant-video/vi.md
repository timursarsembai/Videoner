---
title: Video không cần chọn chất lượng: chế độ «Video ngay» và tự động tải
summary: Bot không còn bỏ qua liên kết nếu bạn chưa kịp chọn chất lượng: sau 2 phút bot tự gửi video 720p. Còn trong /settings bạn có thể bật chế độ «Video ngay» — video đến liền, kèm nút MP3 bên dưới.
date: 2026-11-12
time: 12:40:00
---
Bot [@VideonerBot](https://t.me/VideonerBot) đã tiện hơn cho những ai không muốn chọn chất lượng mỗi lần. Những thay đổi này có theo yêu cầu của người dùng — cảm ơn bạn đã góp ý!

## Chưa kịp chọn — bot tự gửi video

Trước đây thường xảy ra thế này: bạn gửi liên kết, chuyển sang việc khác, quay lại thì thấy «Không có chất lượng nào được chọn — bỏ qua link này».

Giờ nếu sau **2 phút** bạn không nhấn nút nào, bot tự tải **video 720p** (hoặc chất lượng gần nhất vừa với Telegram) và gửi cho bạn. Thay cho các nút sẽ có lời giải thích vì sao video đến mà không cần chọn.

Nếu bạn đã bắt đầu chọn — ví dụ mở phần phụ đề — bot không quyết định thay bạn và vẫn chờ lựa chọn của bạn như trước.

## Chế độ «Video ngay»

Nếu bạn gần như luôn chỉ cần video, hãy bật chế độ mà bot hoàn toàn không hỏi chất lượng:

1. Gửi cho bot lệnh **/settings** (lệnh này cũng có trong menu).
2. Nhấn **⚡ Video ngay** — bên cạnh sẽ hiện ✅.
3. Nhấn **✅ Xong**.

Từ giờ, với mỗi liên kết bot gửi ngay video 720p, bên dưới có nút **🎵 MP3**. Cần âm thanh — nhấn nút đó, bot sẽ gửi mp3.

Cần chất lượng khác, ví dụ 1080p? Tắt chế độ bằng chính nút đó trong /settings — việc chọn như thường lệ sẽ quay lại. Mặc định chế độ này tắt, nên với những ai quen tự chọn thì không có gì thay đổi.

## Và còn có cờ

Nếu chỉ cần dùng một lần, không cần cài đặt, hãy thêm cờ sau liên kết: **-audio** — nhận ngay âm thanh dạng mp3, **-hd** — video ở chất lượng tốt nhất. Xem thêm trong bài về [cờ -audio và -hd](https://videoner.download/vi/blog/link-flags).
