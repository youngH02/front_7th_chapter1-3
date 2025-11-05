import { Notifications, Repeat } from '@mui/icons-material';
import { Box, Stack, TableCell, Tooltip, Typography } from '@mui/material';
import { type FC } from 'react';

import type { Event } from '../../types';

interface DayCellProps {
  date: Date | null;
  view: 'month' | 'week';
  events: Event[];
  notifiedEvents: string[];
  holiday?: string;
}

const repeatTypeLabelMap: Record<string, string> = {
  daily: '일',
  weekly: '주',
  monthly: '월',
  yearly: '년',
};

const getRepeatTypeLabel = (type: string): string => repeatTypeLabelMap[type] ?? '';

const baseCellSx = {
  height: '120px',
  verticalAlign: 'top',
  width: '14.28%',
  padding: 1,
  border: '1px solid #e0e0e0',
  overflow: 'hidden',
} as const;

export const DayCell: FC<DayCellProps> = ({ date, view, events, notifiedEvents, holiday }) => {
  if (!date) {
    return <TableCell sx={baseCellSx} />;
  }

  const isMonthView = view === 'month';
  const dayNumber = date.getDate();

  return (
    <TableCell sx={{ ...baseCellSx, ...(isMonthView ? { position: 'relative' } : {}) }}>
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
          <Box
            key={event.id}
            sx={{
              p: 0.5,
              my: 0.5,
              borderRadius: 1,
              minHeight: '18px',
              width: '100%',
              overflow: 'hidden',
              backgroundColor: isNotified ? '#ffebee' : '#f5f5f5',
              fontWeight: isNotified ? 'bold' : 'normal',
              color: isNotified ? '#d32f2f' : 'inherit',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              {isNotified && <Notifications fontSize="small" />}
              {isRepeating && (
                <Tooltip
                  title={`${event.repeat.interval}${getRepeatTypeLabel(event.repeat.type)}마다 반복${
                    event.repeat.endDate ? ` (종료: ${event.repeat.endDate})` : ''
                  }`}
                >
                  <Repeat fontSize="small" />
                </Tooltip>
              )}
              <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                {event.title}
              </Typography>
            </Stack>
          </Box>
        );
      })}
    </TableCell>
  );
};

export default DayCell;
