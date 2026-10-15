# TIMELINE.EXE — cách bổ sung kỷ niệm

**Phạm vi:** chỉ dự án `1-year_anni_gift/virtual-os`, không chỉnh website 6 tháng.

## Quy tắc phân chia tháng
- Tháng thứ nhất: 24/10/2025 đến hết 23/11/2025.
- Tháng thứ hai: 24/11/2025 đến hết 23/12/2025.
- ...
- Tháng thứ mười hai: 24/09/2026 đến hết 23/10/2026.
- Ngày **24/10/2026** là kỷ niệm một năm, nằm ngoài mười hai chương này. Nếu muốn có chương riêng cho ngày tròn năm, ta sẽ bổ sung riêng.

## Thêm ảnh và nội dung
1. Đặt ảnh vào `src/assets/images/timeline/` (tạo thư mục nếu chưa có).
2. Mở `src/apps/Timeline/timelineData.js`.
3. Import ảnh từ thư mục trên, ví dụ:
   ```js
   import photoA from '../../assets/images/timeline/photo-a.jpg';
   import photoB from '../../assets/images/timeline/photo-b.jpg';
   ```
4. Thêm một phần tử vào `TIMELINE_EVENTS`:
   ```js
   {
     id: 'event-unique-id',
     date: '2025-11-02', // ngày chụp/đi chơi, dạng YYYY-MM-DD
     title: 'Tên sự kiện',
     location: 'Địa điểm nếu có',
     description: 'Ghi chú hoặc câu chuyện ngắn',
     photos: [
       { src: photoA, caption: 'Chú thích ảnh A', alt: 'Mô tả ảnh A' },
       { src: photoB, caption: 'Chú thích ảnh B', alt: 'Mô tả ảnh B' },
     ],
   },
   ```
5. Mỗi ngày có thể thêm nhiều sự kiện, mỗi sự kiện có thể chứa nhiều ảnh. Giao diện sẽ tự đưa sự kiện vào đúng tháng theo ngày.
6. Sự kiện ngoài khoảng 24/10/2025–23/10/2026 sẽ không hiển thị trong 12 chương.

**Lưu ý:** Đây là ví dụ về cấu trúc, không phải kỷ niệm thật. Ở thời điểm tạo giao diện, chỉ có mốc 24/10/2025 được giữ lại từ code cũ.

## Cách kiểm tra
Từ thư mục `1-year_anni_gift/virtual-os`:

```bash
npm install
npm run lint
npm run build
```

Mở TIMELINE.EXE; thử mở/đóng các tháng, cuộn trên màn hình nhỏ, nhấn vào ảnh để phóng to, chuyển ảnh bằng mũi tên và phím ← →, đóng bằng Escape. Các thao tác ảnh chỉ kiểm thử đầy đủ được khi đã thêm ảnh thật.
