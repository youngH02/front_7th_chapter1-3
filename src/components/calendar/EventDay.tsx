import { useDraggable } from '@dnd-kit/core';
import { Notifications, Repeat } from '@mui/icons-material';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { type FC } from 'react';

import type { Event } from '../../types';
interface IProps {
  event: Event;
  isNotified: boolean;
  isRepeating: boolean;
}

const repeatTypeLabelMap: Record<string, string> = {
  daily: '일',
  weekly: '주',
  monthly: '월',
  yearly: '년',
};

const getRepeatTypeLabel = (type: string): string => repeatTypeLabelMap[type] ?? '';

const EventDayInCell: FC<IProps> = ({ event, isNotified, isRepeating }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
    data: { event },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      data-testid={`event-${event.id}`}
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
};

export default EventDayInCell;
