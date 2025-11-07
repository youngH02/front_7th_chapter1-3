import type { DragEndEvent } from '@dnd-kit/core';
import { describe, expect, it, vi } from 'vitest';

import type { Event } from '../../types.ts';
import { handleCalendarDragEnd } from '../../utils/dndHandlers.ts';

const baseEvent: Event = {
  id: 'evt-1',
  title: '테스트 일정',
  date: '2025-11-07',
  startTime: '09:00',
  endTime: '10:00',
  description: '',
  location: '',
  category: '',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 0,
};

const createDragEvent = (overrides: Partial<DragEndEvent> = {}): DragEndEvent =>
  ({
    active: {
      id: 'evt-1',
      data: { current: { event: baseEvent } },
      rect: { current: null },
    },
    delta: { x: 0, y: 0 },
    over: {
      id: 'target',
      data: { current: { date: new Date('2025-11-09') } },
      rect: { current: null },
    },
    ...overrides,
  }) as DragEndEvent;

describe('handleCalendarDragEnd', () => {
  it('이벤트가 없으면 onEventMove를 호출하지 않는다', () => {
    const moveSpy = vi.fn();
    const dragEvent = createDragEvent({
      active: {
        id: 'evt-1',
        data: { current: {} },
        rect: { current: null },
      },
    });

    handleCalendarDragEnd(dragEvent, moveSpy);

    expect(moveSpy).not.toHaveBeenCalled();
  });

  it('드롭 대상이 없으면 onEventMove를 호출하지 않는다', () => {
    const moveSpy = vi.fn();
    const dragEvent = createDragEvent({ over: null as unknown as DragEndEvent['over'] });

    handleCalendarDragEnd(dragEvent, moveSpy);

    expect(moveSpy).not.toHaveBeenCalled();
  });

  it('동일한 날짜로 드롭하면 onEventMove를 호출하지 않는다', () => {
    const moveSpy = vi.fn();
    const dragEvent = createDragEvent({
      over: {
        id: 'target',
        data: { current: { date: new Date('2025-11-07') } },
        rect: { current: null },
      },
    });

    handleCalendarDragEnd(dragEvent, moveSpy);

    expect(moveSpy).not.toHaveBeenCalled();
  });

  it('다른 날짜로 드롭하면 onEventMove를 호출한다', () => {
    const moveSpy = vi.fn();
    const targetDate = new Date('2025-11-09');
    const dragEvent = createDragEvent({
      over: {
        id: 'target',
        data: { current: { date: targetDate } },
        rect: { current: null },
      },
    });

    handleCalendarDragEnd(dragEvent, moveSpy);

    expect(moveSpy).toHaveBeenCalledTimes(1);
    expect(moveSpy).toHaveBeenCalledWith(baseEvent, targetDate);
  });
});
