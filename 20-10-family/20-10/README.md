# Tiny - 20/10

Trang chúc 20/10 của tôi, được phát triển từ một website tham khảo và cá nhân hóa lại nội dung, âm nhạc, hình ảnh và phần kết.

## Chạy trên máy

- Giải nén toàn bộ thư mục `20-10`.
- Mở `index.html` bằng Chrome hoặc Edge. Không cần cài thêm thư viện hay chạy build.
- Click hoặc chạm vào khoảng trống để chuyển cảnh.
- Trình duyệt có thể chặn nhạc tự phát. Nếu không nghe tiếng ngay, hãy chạm vào trang một lần.
- GIF Rem được nhúng từ Tenor và cần có Internet.

## Cấu trúc

- `index.html` - Nội dung lời chúc, hình ảnh và thứ tự các cảnh.
- `style.css` - Bố cục, màu sắc và animation trên desktop/mobile.
- `js/02-story.js` - Chuyển cảnh, điều khiển nhạc và hiển thị lời đồng bộ.
- `js/02-lyrics.js` - Bảng LRC dùng để chạy lời bài hát; timestamp tính từ đầu MP3.
- `js/` - Các hiệu ứng hoạt hình và cấu hình hiệu suất khác.
- `assets/shiori.mp3` - Bài nhạc nền tôi đang sử dụng.
- `assets/cat-side-eye.png` - Ảnh mèo liếc.
- `assets/cat-like.png` - Ảnh mèo like.

## Chỉnh nhạc và lyrics

Trong `js/02-story.js`:

```js
const MUSIC_START_TIME = 32.0;
const MUSIC_HOLD_TIME = MUSIC_START_TIME + 11.6;
const MUSIC_FADE_START = MUSIC_HOLD_TIME - 1.4;
const MUSIC_VOLUME = 0.67;
```

- Nhạc bắt đầu tại 00:32.00 và giảm âm lượng từ 00:42.20.
- Nhạc tạm dừng tại 00:43.60, rồi tiếp tục sau khi chuyển qua cảnh lời chúc.
- Lời bắt đầu xuất hiện từ cảnh mèo liếc (`text-5`), tiếp tục qua các cảnh sau (bao gồm Rem và cảnh kết), và được đồng bộ bằng `currentTime` của chính file MP3.
- Tôi có thể sửa thời gian hoặc câu hát trực tiếp trong `js/02-lyrics.js`.
- Lời sẽ tự mờ đi trong khoảng nhạc không có câu hát mới.

## Các thay đổi cá nhân

- Giữ những lời chúc dành cho Nhinhi và câu kết `Ớ iu ậu`.
- Dùng hai ảnh mèo thay cho hình người; không thêm hiệu ứng che hoặc làm mờ mép ảnh.
- Bỏ lớp cỏ, hoa và lá rơi phía trước ở cảnh mèo liếc.
- Thay Waguri bằng GIF Rem từ Tenor, cho Rem và mèo like lớn hơn trên cả desktop và điện thoại.
- Bỏ cảnh yêu cầu chia sẻ, máy bay, xe mặt trăng và gian hàng quảng bá.

## Lưu ý

- GIF Tenor sẽ không tải khi thiết bị ngoại tuyến hoặc khi Tenor bị chặn.
- Nhạc và các nội dung tham khảo có thể chịu bản quyền. Cần kiểm tra quyền sử dụng trước khi công khai website.
