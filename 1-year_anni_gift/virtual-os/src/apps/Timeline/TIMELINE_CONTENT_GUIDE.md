# Timeline - 12 tháng album ảnh (Style B)

- Timeline hiển thị đường thời gian dọc, 12 checkpoint. Mỗi tháng có tiêu đề, note ngắn và cụm ảnh collage. Cuộn xuống để ảnh và checkpoint xuất hiện lần lượt.
- Không bắt buộc thêm sự kiện, địa điểm hay ngày cụ thể.
- Tự động import ảnh `month-01/photo-01.jpg` ... `month-12/photo-YY.jpg` từ `src/assets/images/timeline`.
- 53 ảnh Bro chọn được sắp trong gói `Gifts_1year_Timeline_StyleB.zip`.
- Quy tắc Zalo: các ảnh **phía trên** tin nhắn "tháng X" được gán vào nhóm tháng X, kể cả 5 ảnh đầu trước dòng "tháng 10".
- Album tháng 12 gom ảnh được chọn trong nhóm Zalo tháng 9 và 10/2026 để giữ 12 chương.
- Do screenshot chỉ cung cấp nhóm tháng dương lịch mà không phải ngày chụp của từng ảnh, không nên hiểu nhóm ảnh là bằng chứng ảnh được chụp trong chính khoảng 24–23 của tháng yêu nhau.
- Không đưa screenshot chat Zalo vào repo, chỉ thêm ảnh đã chọn.

## Đưa ảnh vào repo

1. Tải và giải nén `Gifts_1year_Timeline_StyleB.zip` vào **thư mục gốc repo Gifts** đang clone trên máy.
2. Trong GitHub Desktop, kiểm tra chỉ có ảnh mới dưới `1-year_anni_gift/virtual-os/src/assets/images/timeline/month-XX/`.
3. Commit và Push lên `main`.
4. Đợi Vercel deploy; mở `TIMELINE.EXE` để xem album.

## Kiểm tra

- `npm run lint` và `npm run build` trong thư mục `1-year_anni_gift/virtual-os`.
- Kiểm tra đủ 12 tháng, cuộn xuống đủ 12 mark, hiệu ứng hiện ảnh, xem ảnh phóng to, chuyển ảnh, phím Escape và màn hình nhỏ. Thử cả chế độ giảm chuyển động trong hệ điều hành.
- Lưu ý repo GitHub hiện công khai: cân nhắc quyền riêng tư trước khi đẩy ảnh cá nhân lên.
