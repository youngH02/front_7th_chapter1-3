import { type FC } from 'react';
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

interface IProps {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
}

const WeekView: FC<IProps> = ({ currentDate, filteredEvents, notifiedEvents }) => {
  const weekDates = getWeekDates(currentDate);
  return (
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
              {weekDates.map((date) => (
                <DayCell
                  key={date.toISOString()}
                  view="week"
                  date={date}
                  events={filteredEvents.filter(
                    (event) => new Date(event.date).toDateString() === date.toDateString()
                  )}
                  notifiedEvents={notifiedEvents}
                />
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default WeekView;
