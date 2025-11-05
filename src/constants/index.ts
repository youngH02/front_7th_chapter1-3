export const CATEGORIES = ['업무', '개인', '가족', '기타'] as const;

/**
 * 주중 요일 표시 배열 (일~토)
 * 일요일부터 토요일까지 순서대로 표시
 */
export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

/**
 * 알림 시간 옵션 (분 단위)
 * 일정 시작 전 알림을 받을 시간을 분 단위로 정의
 */
export const NOTIFICATION_OPTIONS = [
  { value: 1, label: '1분 전' },
  { value: 10, label: '10분 전' },
  { value: 60, label: '1시간 전' },
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type NotificationOption = (typeof NOTIFICATION_OPTIONS)[number];

export const HOLIDAY_RECORD = {
  '2025-01-01': '신정',
  '2025-01-29': '설날',
  '2025-01-30': '설날',
  '2025-01-31': '설날',
  '2025-03-01': '삼일절',
  '2025-05-05': '어린이날',
  '2025-06-06': '현충일',
  '2025-08-15': '광복절',
  '2025-10-05': '추석',
  '2025-10-06': '추석',
  '2025-10-07': '추석',
  '2025-10-03': '개천절',
  '2025-10-09': '한글날',
  '2025-12-25': '크리스마스',
};

export type HolidayRecord = typeof HOLIDAY_RECORD;
export type HolidayKeys = keyof HolidayRecord;
