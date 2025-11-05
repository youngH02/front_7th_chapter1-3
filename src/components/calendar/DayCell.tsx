import { useDroppable } from '@dnd-kit/core';
import { TableCell, Typography } from '@mui/material';
import { type FC } from 'react';

import type { Event } from '../../types';
import EventDayInCell from './EventDay';

interface DayCellProps {
  date: Date | null;
  view: 'month' | 'week';
  events: Event[];
  notifiedEvents: string[];
  holiday?: string;
  droppableId: string;
}

const baseCellSx = {
  height: '120px',
  verticalAlign: 'top',
  width: '14.28%',
  padding: 1,
  border: '1px solid #e0e0e0',
  overflow: 'hidden',
} as const;

export const DayCell: FC<DayCellProps> = ({
  date,
  view,
  events,
  notifiedEvents,
  holiday,
  droppableId,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
    data: { date },
    disabled: !date,
  });

  if (!date) {
    return <TableCell ref={setNodeRef} sx={baseCellSx} />;
  }

  const isMonthView = view === 'month';
  const dayNumber = date.getDate();

  return (
    <TableCell
      ref={setNodeRef}
      data-testid={`calendar-cell-${date.toISOString().split('T')[0]}`}
      sx={{
        ...baseCellSx,
        ...(isMonthView ? { position: 'relative' } : {}),
        ...(isOver
          ? {
              outline: '2px solid #1976d2',
              outlineOffset: -1,
            }
          : {}),
      }}
    >
      <Typography variant="body2" fontWeight="bold">
        {dayNumber}
      </Typography>

      {holiday && (
        <Typography variant="body2" color="error">
          {holiday}
        </Typography>
      )}

      {events.map((event) => {
        const isNotified = notifiedEvents.includes(event.id);
        const isRepeating = event.repeat.type !== 'none';

        return (
          <EventDayInCell
            key={event.id}
            event={event}
            isNotified={isNotified}
            isRepeating={isRepeating}
          />
        );
      })}
    </TableCell>
  );
};

export default DayCell;
