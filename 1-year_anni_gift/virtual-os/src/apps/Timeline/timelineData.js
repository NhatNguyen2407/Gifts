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
export const TIMELINE_EVENTS = [
  {
    id: 'official-start',
    date: '2025-10-24',
    title: 'Ngày chính thức yêu nhau',
    location: '',
    description: '',
    photos: [],
  },
];

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
      photoCount: events.reduce((total, event) => total + (event.photos?.length || 0), 0),
    };
  },
);
