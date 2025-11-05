import { type FC, useCallback } from 'react';
import { formatWeek, getWeekDates } from '../../utils/dateUtils';
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
import { WEEK_DAYS } from '../../constants';
import DayCell from './DayCell';
import type { Event } from '../../types';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';

interface IProps {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
  onEventMove: (event: Event, date: Date) => void;
}

const WeekView: FC<IProps> = ({ currentDate, filteredEvents, notifiedEvents, onEventMove }) => {
  const weekDates = getWeekDates(currentDate);
  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
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
    },
    [onEventMove]
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
        <Typography variant="h5">{formatWeek(currentDate)}</Typography>
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
              <TableRow>
                {weekDates.map((date) => {
                  const droppableId = `week-${date.toISOString().split('T')[0]}`;

                  return (
                    <DayCell
                      key={date.toISOString()}
                      view="week"
                      date={date}
                      events={filteredEvents.filter(
                        (event) => new Date(event.date).toDateString() === date.toDateString()
                      )}
                      notifiedEvents={notifiedEvents}
                      droppableId={droppableId}
                    />
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </DndContext>
  );
};

export default WeekView;
