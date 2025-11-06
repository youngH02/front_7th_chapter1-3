import type { DragEndEvent } from '@dnd-kit/core';

import type { Event } from '../types';

type OnEventMove = (event: Event, date: Date) => void;

export const handleCalendarDragEnd = (dragEvent: DragEndEvent, onEventMove: OnEventMove): void => {
  const { active, over } = dragEvent;

  if (!active || !over) {
    return;
  }

  const event = active.data.current?.event as Event | undefined;
  const dropDate = over.data.current?.date as Date | undefined;

  if (!event || !dropDate) {
    return;
  }

  const originalDate = new Date(event.date);

  if (originalDate.toDateString() === dropDate.toDateString()) {
    return;
  }

  onEventMove(event, dropDate);
};
