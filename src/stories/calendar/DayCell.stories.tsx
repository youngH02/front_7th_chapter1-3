import { DndContext } from '@dnd-kit/core';
import { Table, TableRow } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { DayCell } from '../../components/calendar/DayCell';
import { Event } from '../../types';

// Mock 데이터
const mockEvents: Event[] = [
  {
    id: '1',
    title: '회의',
    date: '2025-11-15',
    startTime: '09:00',
    endTime: '10:00',
    description: '팀 회의',
    location: '회의실',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '반복 일정',
    date: '2025-11-15',
    startTime: '14:00',
    endTime: '15:00',
    description: '주간 미팅',
    location: '온라인',
    category: '업무',
    repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' },
    notificationTime: 30,
  },
];

// DnD Context로 감싸는 Wrapper 컴포넌트
const DayCardWrapper = ({ children }: { children: React.ReactNode }) => (
  <DndContext onDragEnd={() => {}}>
    <Table>
      <TableRow>{children}</TableRow>
    </Table>
  </DndContext>
);

const meta: Meta<typeof DayCell> = {
  title: 'Calendar/DayCell',
  component: DayCell,
  decorators: [
    (Story) => (
      <div
        style={{
          width: '200px',
          height: '150px',
          margin: '16px',
          border: '1px solid #ddd',
        }}
      >
        <DayCardWrapper>
          <Story />
        </DayCardWrapper>
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: {
      viewports: [768, 1024],
      delay: 300,
    },
  },
  args: {
    view: 'month',
    onDateSelect: () => {},
    droppableId: 'day-cell',
  },
};

export default meta;
type Story = StoryObj<typeof DayCell>;

// 2. 일정이 있는 날
export const WithEvents: Story = {
  name: '일정이 있는 날',
  args: {
    date: new Date('2025-11-15'),
    events: mockEvents,
    notifiedEvents: ['1'],
  },
};

// 3. 많은 일정이 있는 날
export const WithManyEvents: Story = {
  name: '많은 일정이 있는 날',
  args: {
    date: new Date('2025-11-15'),
    events: [
      ...mockEvents,
      {
        id: '3',
        title: '점심약속',
        date: '2025-11-15',
        startTime: '12:00',
        endTime: '13:00',
        description: '친구와 점심',
        location: '식당',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 15,
      },
      {
        id: '4',
        title: '운동',
        date: '2025-11-15',
        startTime: '19:00',
        endTime: '20:00',
        description: '헬스장',
        location: '헬스장',
        category: '개인',
        repeat: { type: 'daily', interval: 1, endDate: '2025-12-31' },
        notificationTime: 30,
      },
      {
        id: '5',
        title: '긴 제목을 가진 일정',
        date: '2025-11-15',
        startTime: '15:00',
        endTime: '16:00',
        description: '긴 제목 테스트',
        location: '어딘가',
        category: '기타',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
    ],
    notifiedEvents: ['1', '3', '4'],
  },
};

// 4. 공휴일
export const Holiday: Story = {
  name: '공휴일',
  args: {
    date: new Date('2025-12-25'),
    events: [],
    notifiedEvents: [],
    holiday: '크리스마스',
  },
};

// 5. 공휴일 + 일정
export const HolidayWithEvents: Story = {
  name: '공휴일 + 일정',
  args: {
    date: new Date('2025-12-25'),
    events: [
      {
        id: '6',
        title: '크리스마스 파티',
        date: '2025-12-25',
        startTime: '18:00',
        endTime: '22:00',
        description: '크리스마스 파티',
        location: '집',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 60,
      },
    ],
    notifiedEvents: ['6'],
    holiday: '크리스마스',
  },
};

// 6. 빈 날짜 (null)
export const EmptyDate: Story = {
  name: '빈 날짜 (이전/다음 달)',
  args: {
    date: null,
    events: [],
    notifiedEvents: [],
  },
};

// 8. 알림이 설정된 모든 일정
export const AllNotified: Story = {
  name: '모든 일정에 알림 설정',
  args: {
    date: new Date('2025-11-15'),
    events: mockEvents,
    notifiedEvents: ['1', '2'],
  },
};
