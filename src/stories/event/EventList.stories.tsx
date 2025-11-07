import type { Meta, StoryObj } from '@storybook/react';

import EventList from '../../components/eventList/EventList';
import { Event } from '../../types';

// Mock 데이터
const mockEvents: Event[] = [
  {
    id: '1',
    title: '일반 회의',
    date: '2025-11-15',
    startTime: '09:00',
    endTime: '10:00',
    description: '프로젝트 진행상황 논의',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '주간 팀 미팅',
    date: '2025-11-16',
    startTime: '14:00',
    endTime: '15:00',
    description: '매주 반복되는 팀 회의',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' },
    notificationTime: 60,
  },
  {
    id: '3',
    title: '점심 약속',
    date: '2025-11-17',
    startTime: '12:00',
    endTime: '13:00',
    description: '친구와 점심식사',
    location: '이탈리안 레스토랑',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 30,
  },
  {
    id: '4',
    title: '월간 보고서 작성',
    date: '2025-11-18',
    startTime: '16:00',
    endTime: '18:00',
    description: '월말 정산 및 보고서 작성',
    location: '사무실',
    category: '업무',
    repeat: { type: 'monthly', interval: 1, endDate: '2025-12-31' },
    notificationTime: 120,
  },
  {
    id: '5',
    title: '운동',
    date: '2025-11-19',
    startTime: '07:00',
    endTime: '08:00',
    description: '아침 운동 루틴',
    location: '헬스장',
    category: '개인',
    repeat: { type: 'daily', interval: 1, endDate: '2025-12-31' },
    notificationTime: 15,
  },
];

const meta: Meta<typeof EventList> = {
  title: 'Event/EventList',
  component: EventList,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: {
      // 시각적 회귀 테스트 설정
      viewports: [1024, 1440, 1920], // 적절한 뷰포트 크기로 조정
      delay: 500,
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '20vw', // 고정 너비
          height: '100vh',
          padding: '20px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    searchTerm: '',
    setSearchTerm: () => {},
    onEditEvent: () => {},
    onDeleteEvent: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof EventList>;

// 1. 기본 상태 (모든 일정 표시)
export const Default: Story = {
  name: '기본 상태 - 모든 일정',
  args: {
    filteredEvents: mockEvents,
    notifiedEvents: ['1', '2', '5'], // 알림이 활성화된 이벤트들
  },
};

// 2. 검색 결과 상태
export const SearchResults: Story = {
  name: '검색 결과 - "회의" 검색',
  args: {
    searchTerm: '회의',
    filteredEvents: mockEvents.filter(
      (event) => event.title.includes('회의') || event.description.includes('회의')
    ),
    notifiedEvents: ['2'],
  },
};

// 3. 빈 상태 (일정 없음)
export const EmptyState: Story = {
  name: '빈 상태 - 일정 없음',
  args: {
    filteredEvents: [],
    notifiedEvents: [],
  },
};

// 4. 검색 결과 없음
export const NoSearchResults: Story = {
  name: '검색 결과 없음',
  args: {
    searchTerm: '존재하지않는검색어',
    filteredEvents: [],
    notifiedEvents: [],
  },
};

// 5. 반복 일정만 표시
export const RepeatEventsOnly: Story = {
  name: '반복 일정만 표시',
  args: {
    filteredEvents: mockEvents.filter((event) => event.repeat.type !== 'none'),
    notifiedEvents: ['2', '4', '5'],
  },
};

// 6. 알림 설정된 일정만 표시
export const NotificationEventsOnly: Story = {
  name: '알림 설정된 일정만 표시',
  args: {
    filteredEvents: mockEvents.filter((event) => event.notificationTime > 0),
    notifiedEvents: ['1', '2', '3', '4', '5'],
  },
};

// 7. 카테고리별 일정 (업무만)
export const WorkEventsOnly: Story = {
  name: '업무 일정만 표시',
  args: {
    filteredEvents: mockEvents.filter((event) => event.category === '업무'),
    notifiedEvents: ['1', '2', '4'],
  },
};

// 8. 긴 제목과 설명이 있는 일정들
export const LongTextEvents: Story = {
  name: '긴 텍스트 일정들',
  args: {
    filteredEvents: [
      {
        id: '6',
        title:
          '매우 긴 제목을 가진 일정입니다 - 이것은 UI가 어떻게 처리하는지 테스트하기 위한 긴 제목입니다',
        date: '2025-11-20',
        startTime: '10:00',
        endTime: '12:00',
        description:
          '이것은 매우 긴 설명입니다. 일정의 세부 내용이 길어질 때 UI가 어떻게 반응하는지 확인하기 위한 테스트용 긴 설명입니다. 여러 줄에 걸쳐 표시될 수 있는 내용이며, 레이아웃이 깨지지 않는지 확인해야 합니다.',
        location:
          '매우 긴 위치 정보 - 서울특별시 강남구 테헤란로 123길 45-67 ABC빌딩 12층 대회의실',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 60,
      },
      ...mockEvents.slice(0, 2), // 기본 이벤트 몇 개도 함께 표시
    ],
    notifiedEvents: ['6'],
  },
};

// 9. 다양한 알림 시간 설정
export const VariousNotificationTimes: Story = {
  name: '다양한 알림 시간',
  args: {
    filteredEvents: [
      { ...mockEvents[0], notificationTime: 1 }, // 1분 전
      { ...mockEvents[1], notificationTime: 10 }, // 10분 전
      { ...mockEvents[2], notificationTime: 60 }, // 1시간 전
      { ...mockEvents[3], notificationTime: 120 }, // 2시간 전
      { ...mockEvents[4], notificationTime: 1440 }, // 1일 전
    ],
    notifiedEvents: ['1', '2', '3', '4', '5'],
  },
};
