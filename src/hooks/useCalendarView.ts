import { useEffect, useState } from 'react';

import { fetchHolidays } from '../apis/fetchHolidays';

export const useCalendarView = () => {
  const [view, setViewState] = useState<'week' | 'month'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

  const alignToMonthStart = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1);

  const setView = (nextView: 'week' | 'month') => {
    setCurrentDate((prevDate) => {
      const alignedDate = alignToMonthStart(prevDate);
      return prevDate.getTime() === alignedDate.getTime() ? prevDate : alignedDate;
    });

    setViewState(nextView);
  };

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === 'week') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      } else if (view === 'month') {
        newDate.setDate(1); // 항상 1일로 설정
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      }
      return newDate;
    });
  };

  useEffect(() => {
    setHolidays(fetchHolidays(currentDate));
  }, [currentDate]);

  return { view, setView, currentDate, setCurrentDate, holidays, navigate };
};
