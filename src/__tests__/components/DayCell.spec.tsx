import { DndContext } from '@dnd-kit/core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import DayCell from '../../components/calendar/DayCell.tsx';
import type { Event } from '../../types.ts';

const createEvent = (overrides: Partial<Event> = {}): Event => ({
  id: 'evt-1',
  title: '테스트 일정',
  date: '2025-11-02',
  startTime: '09:00',
  endTime: '10:00',
  description: '',
  location: '',
  category: '',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 0,
  ...overrides,
});

const renderDayCell = (props: Parameters<typeof DayCell>[0]) =>
  render(
    <DndContext>
      <DayCell {...props} />
    </DndContext>
  );

describe('DayCell', () => {
  it('빈 날짜 셀을 클릭하면 onDateSelect가 호출된다', async () => {
    const handleSelect = vi.fn();
    const targetDate = new Date('2025-11-02');

    renderDayCell({
      date: targetDate,
      view: 'month',
      events: [],
      notifiedEvents: [],
      droppableId: 'test-cell',
      onDateSelect: handleSelect,
    });

    await userEvent.click(screen.getByTestId('calendar-cell-2025-11-02'));

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(targetDate);
  });

  it('이벤트가 있는 셀을 클릭하면 onDateSelect가 호출되지 않는다', async () => {
    const handleSelect = vi.fn();
    const targetDate = new Date('2025-11-07');
    const events = [createEvent({ id: 'evt-2', date: '2025-11-07' })];

    renderDayCell({
      date: targetDate,
      view: 'month',
      events,
      notifiedEvents: [],
      droppableId: 'test-cell-filled',
      onDateSelect: handleSelect,
    });

    await userEvent.click(screen.getByTestId('calendar-cell-2025-11-07'));

    expect(handleSelect).not.toHaveBeenCalled();
  });
});
