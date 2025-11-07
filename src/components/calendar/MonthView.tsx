import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { type FC, useCallback } from 'react';

import DayCell from './DayCell';
import { HOLIDAY_RECORD, WEEK_DAYS } from '../../constants';
import type { Event } from '../../types';
import { formatDate, formatMonth, getEventsForDay, getWeeksAtMonth } from '../../utils/dateUtils';
import { handleCalendarDragEnd } from '../../utils/dndHandlers';

interface IProps {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
  onEventMove: (event: Event, date: Date) => void;
  onDateSelect?: (date: Date) => void;
}

const MonthView: FC<IProps> = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
  onEventMove,
  onDateSelect,
}) => {
  const weeks = getWeeksAtMonth(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      handleCalendarDragEnd(event, onEventMove);
    },
    [onEventMove]
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Stack data-testid="month-view" spacing={4} sx={{ width: '100%' }}>
        <Typography variant="h5">{formatMonth(currentDate)}</Typography>
        <TableContainer>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                {WEEK_DAYS.map((day) => (
                  <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {weeks.map((week, weekIndex) => (
                <TableRow key={weekIndex}>
                  {week.map((day, dayIndex) => {
                    const cellDate = day ? new Date(year, month, day) : null;
                    const dateString = day ? formatDate(currentDate, day) : '';
                    const holiday =
                      day && HOLIDAY_RECORD[dateString as keyof typeof HOLIDAY_RECORD]
                        ? HOLIDAY_RECORD[dateString as keyof typeof HOLIDAY_RECORD]
                        : undefined;
                    const eventsForDay = day ? getEventsForDay(filteredEvents, day) : [];

                    const droppableId = day
                      ? `month-${dateString}`
                      : `month-empty-${weekIndex}-${dayIndex}`;

                    return (
                      <DayCell
                        key={dayIndex}
                        view="month"
                        date={cellDate}
                        holiday={holiday}
                        events={eventsForDay}
                        notifiedEvents={notifiedEvents}
                        droppableId={droppableId}
                        onDateSelect={onDateSelect}
                      />
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </DndContext>
  );
};

export default MonthView;
