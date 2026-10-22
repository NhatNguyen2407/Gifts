// Timeline dữ liệu cho 12 tháng đầu tiên, tính từ ngày 24/10/2025.
// Mỗi sự kiện có thể có nhiều ảnh (photos). Không điền dữ liệu phỏng đoán.
export const TIMELINE_START_DATE = '2025-10-24';
export const TIMELINE_TOTAL_MONTHS = 12;

// Khi có ảnh thật, import chúng vào file này và thêm vào trường photos.
// Ví dụ (chỉ là cấu trúc dữ liệu, KHÔNG phải kỷ niệm thực tế):
// import firstPhoto from '../../assets/images/timeline/first-photo.jpg';
// {
//   id: 'unique-id',
//   date: '2025-11-02',
//   title: 'Tên buổi đi chơi',
//   location: 'Địa điểm',
//   description: 'Vài dòng ghi lại kỷ niệm',
//   photos: [{ src: firstPhoto, caption: 'Chú thích ảnh', alt: 'Mô tả ảnh' }],
// }
// Chỉ sử dụng dữ liệu sự kiện khi có ngày thật được xác nhận.
// Album ảnh theo tháng không cần có sự kiện, địa điểm hoặc ngày chụp.
export const TIMELINE_EVENTS = [];

const SOURCE_MONTHS = [
  '10/2025', '11/2025', '12/2025', '01/2026',
  '02/2026', '03/2026', '04/2026', '05/2026',
  '06/2026', '07/2026', '08/2026', '09 và 10/2026',
];

// Vite tự lấy các ảnh đã chọn từ month-01 ... month-12.
// Những screenshot Zalo chỉ dùng phân loại, không có trong thư mục website.
const PHOTO_ASSETS = import.meta.glob(
  '../../assets/images/timeline/month-*/photo-*.jpg',
  { eager: true, query: '?url', import: 'default' },
);

const PHOTOS_BY_MONTH = Object.entries(PHOTO_ASSETS).reduce((result, [path, src]) => {
  const matches = path.match(/month-(\d+)\/photo-(\d+)\.jpg$/);
  if (!matches) return result;
  const month = Number(matches[1]);
  const order = Number(matches[2]);
  if (month < 1 || month > TIMELINE_TOTAL_MONTHS) return result;
  if (!result[month]) result[month] = [];
  result[month].push({ src, order, alt: `Ảnh kỷ niệm tháng thứ ${month}, số ${order}` });
  return result;
}, {});

Object.values(PHOTOS_BY_MONTH).forEach((items) => items.sort((a, b) => a.order - b.order));

const ORDINALS = [
  'nhất', 'hai', 'ba', 'tư', 'năm', 'sáu',
  'bảy', 'tám', 'chín', 'mười', 'mười một', 'mười hai',
];

const [startYear, startMonth, startDay] = TIMELINE_START_DATE.split('-').map(Number);
const anniversaryBoundary = (offset) => new Date(startYear, startMonth - 1 + offset, startDay);
const dateToISO = (date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('-');

export const formatTimelineDate = (iso) => {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
};

// Kỳ tháng thứ N là [ngày 24 tháng N, ngày 24 tháng N+1), không phụ thuộc tháng dương lịch.
// Ví dụ: 24/10/2025 – 23/11/2025 là tháng thứ nhất.
export const getTimelineChapters = () => Array.from(
  { length: TIMELINE_TOTAL_MONTHS },
  (_, index) => {
    const beginning = anniversaryBoundary(index);
    const nextBeginning = anniversaryBoundary(index + 1);
    const lastDay = new Date(
      nextBeginning.getFullYear(),
      nextBeginning.getMonth(),
      nextBeginning.getDate() - 1,
    );
    const startDate = dateToISO(beginning);
    const endDate = dateToISO(lastDay);
    const events = TIMELINE_EVENTS
      .filter((event) => event.date >= startDate && event.date < dateToISO(nextBeginning))
      .sort((a, b) => a.date.localeCompare(b.date));
    return {
      number: index + 1,
      title: `Tháng thứ ${ORDINALS[index]}`,
      startDate,
      endDate,
      events,
      albumPhotos: PHOTOS_BY_MONTH[index + 1] || [],
      note: `Ảnh đã chọn từ nhóm tháng ${SOURCE_MONTHS[index]}.`,
      photoCount: (PHOTOS_BY_MONTH[index + 1]?.length || 0)
        + events.reduce((total, event) => total + (event.photos?.length || 0), 0),
    };
  },
);
