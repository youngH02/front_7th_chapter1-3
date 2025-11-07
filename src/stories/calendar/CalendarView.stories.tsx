import type { Meta, StoryObj } from '@storybook/react';

import CalendarView from '../../components/calendar/CalendarView';
import { Event } from '../../types';

// Mock 데이터
const mockEvents: Event[] = [
  {
    id: '1',
    title: '일반 회의',
    date: '2025-11-15',
    startTime: '09:00',
    endTime: '10:00',
    description: '일반 회의 설명',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '반복 회의',
    date: '2025-11-16',
    startTime: '14:00',
    endTime: '15:00',
    description: '매주 반복되는 회의',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' },
    notificationTime: 60,
  },
  {
    id: '3',
    title: '개인 일정',
    date: '2025-11-17',
    startTime: '13:00',
    endTime: '14:00',
    description: '개인 약속',
    location: '카페',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  },
];

const meta: Meta<typeof CalendarView> = {
  title: 'Calendar/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: {
      // Chromatic 설정: 시각적 회귀 테스트를 위한 옵션들
      viewports: [1200, 1440, 1920],
      delay: 1000, // 애니메이션 대기
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100vw', // CalendarView가 충분한 크기로 보이도록
          minWidth: '800px', // 캘린더가 적절한 크기로 보이도록
          height: '100vh',
          padding: '20px',
          boxSizing: 'border-box',
          border: '1px solid #e0e0e0', // 영역 확인용 경계선
          overflow: 'auto',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    currentDate: new Date('2025-11-15'),
    filteredEvents: mockEvents,
    notifiedEvents: ['1', '2'], // 알림이 설정된 이벤트들
    onViewChange: () => {},
    onNavigate: () => {},
    onEventMove: () => {},
    onDateSelect: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof CalendarView>;

// 1. 월별 뷰 기본 상태
export const MonthViewDefault: Story = {
  name: '월별 뷰 - 기본 상태',
  args: {
    view: 'month',
  },
};

// 2. 월별 뷰 - 일정이 많은 경우
export const MonthViewWithManyEvents: Story = {
  name: '월별 뷰 - 많은 일정',
  args: {
    view: 'month',
    filteredEvents: [
      ...mockEvents,
      {
        id: '4',
        title: '긴 제목을 가진 일정 테스트용 아주 긴 제목',
        date: '2025-11-15',
        startTime: '10:00',
        endTime: '11:00',
        description: '긴 제목 테스트',
        location: '온라인',
        category: '기타',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
      {
        id: '5',
        title: '겹치는 시간대 일정',
        date: '2025-11-15',
        startTime: '09:30',
        endTime: '10:30',
        description: '시간 겹침 테스트',
        location: '회의실 C',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 5,
      },
    ],
  },
};

// 3. 주별 뷰 기본 상태
export const WeekViewDefault: Story = {
  name: '주별 뷰 - 기본 상태',
  args: {
    view: 'week',
  },
};

// 4. 주별 뷰 - 일정이 많은 경우
export const WeekViewWithManyEvents: Story = {
  name: '주별 뷰 - 많은 일정',
  args: {
    view: 'week',
    filteredEvents: [
      ...mockEvents,
      {
        id: '6',
        title: '아침 운동',
        date: '2025-11-15',
        startTime: '06:00',
        endTime: '07:00',
        description: '헬스장',
        location: '헬스장',
        category: '개인',
        repeat: { type: 'daily', interval: 1, endDate: '2025-12-31' },
        notificationTime: 15,
      },
      {
        id: '7',
        title: '점심 약속',
        date: '2025-11-15',
        startTime: '12:00',
        endTime: '13:00',
        description: '동료와 점심',
        location: '식당',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 30,
      },
    ],
  },
};

// 5. 빈 상태 (일정 없음)
export const EmptyState: Story = {
  name: '빈 상태 - 일정 없음',
  args: {
    view: 'month',
    filteredEvents: [],
    notifiedEvents: [],
  },
};
