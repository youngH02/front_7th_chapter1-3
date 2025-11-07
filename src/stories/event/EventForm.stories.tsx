import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import EventForm from '../../components/eventForm/EventForm';
import { Event, RepeatType } from '../../types';

// Mock 함수들
const mockHandleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log('Start time changed:', e.target.value);
};

const mockHandleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log('End time changed:', e.target.value);
};

const mockOnSubmit = () => {
  console.log('Form submitted');
};

// Mock 이벤트 데이터
const mockEditingEvent: Event = {
  id: '1',
  title: '기존 회의',
  date: '2025-11-20',
  startTime: '14:00',
  endTime: '15:00',
  description: '프로젝트 진행 상황 논의',
  location: '회의실 A',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 60,
};

// EventForm을 래핑하는 컴포넌트 (상태 관리용)
const EventFormWrapper = ({
  editingEvent = null,
  startTimeError = null,
  endTimeError = null,
}: {
  editingEvent?: Event | null;
  startTimeError?: string | null;
  endTimeError?: string | null;
}) => {
  const [title, setTitle] = useState(editingEvent?.title || '');
  const [date, setDate] = useState(editingEvent?.date || '2025-11-20');
  const [startTime] = useState(editingEvent?.startTime || '09:00');
  const [endTime] = useState(editingEvent?.endTime || '10:00');
  const [description, setDescription] = useState(editingEvent?.description || '');
  const [location, setLocation] = useState(editingEvent?.location || '');
  const [category, setCategory] = useState(editingEvent?.category || '업무');
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatType, setRepeatType] = useState<RepeatType>('none');
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatEndDate, setRepeatEndDate] = useState('2025-12-31');
  const [notificationTime, setNotificationTime] = useState(editingEvent?.notificationTime || 10);

  return (
    <EventForm
      title={title}
      setTitle={setTitle}
      date={date}
      setDate={setDate}
      startTime={startTime}
      endTime={endTime}
      description={description}
      setDescription={setDescription}
      location={location}
      setLocation={setLocation}
      category={category}
      setCategory={setCategory}
      isRepeating={isRepeating}
      setIsRepeating={setIsRepeating}
      repeatType={repeatType}
      setRepeatType={setRepeatType}
      repeatInterval={repeatInterval}
      setRepeatInterval={setRepeatInterval}
      repeatEndDate={repeatEndDate}
      setRepeatEndDate={setRepeatEndDate}
      notificationTime={notificationTime}
      setNotificationTime={setNotificationTime}
      startTimeError={startTimeError}
      endTimeError={endTimeError}
      handleStartTimeChange={mockHandleStartTimeChange}
      handleEndTimeChange={mockHandleEndTimeChange}
      onSubmit={mockOnSubmit}
      editingEvent={editingEvent}
    />
  );
};

const meta: Meta<typeof EventFormWrapper> = {
  title: 'Event/EventForm',
  component: EventFormWrapper,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: {
      viewports: [1200, 1440, 1920],
      delay: 500,
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '20vw',
          height: '100vh',
          padding: '20px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EventFormWrapper>;

// 1. 새 일정 추가 - 기본 상태
export const NewEventDefault: Story = {
  name: '새 일정 추가 - 기본 상태',
  args: {},
};

// 2. 새 일정 추가 - 반복 일정 설정
export const NewEventWithRepeat: Story = {
  name: '새 일정 추가 - 반복 일정',
  render: () => {
    const EventFormWithRepeat = () => {
      const [title, setTitle] = useState('매일 운동');
      const [date, setDate] = useState('2025-11-20');
      const [startTime] = useState('07:00');
      const [endTime] = useState('08:00');
      const [description, setDescription] = useState('아침 운동 루틴');
      const [location, setLocation] = useState('헬스장');
      const [category, setCategory] = useState('개인');
      const [isRepeating, setIsRepeating] = useState(true);
      const [repeatType, setRepeatType] = useState<RepeatType>('daily');
      const [repeatInterval, setRepeatInterval] = useState(1);
      const [repeatEndDate, setRepeatEndDate] = useState('2025-12-31');
      const [notificationTime, setNotificationTime] = useState(60);

      return (
        <EventForm
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          startTime={startTime}
          endTime={endTime}
          description={description}
          setDescription={setDescription}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          isRepeating={isRepeating}
          setIsRepeating={setIsRepeating}
          repeatType={repeatType}
          setRepeatType={setRepeatType}
          repeatInterval={repeatInterval}
          setRepeatInterval={setRepeatInterval}
          repeatEndDate={repeatEndDate}
          setRepeatEndDate={setRepeatEndDate}
          notificationTime={notificationTime}
          setNotificationTime={setNotificationTime}
          startTimeError={null}
          endTimeError={null}
          handleStartTimeChange={mockHandleStartTimeChange}
          handleEndTimeChange={mockHandleEndTimeChange}
          onSubmit={mockOnSubmit}
          editingEvent={null}
        />
      );
    };

    return <EventFormWithRepeat />;
  },
};

// 3. 일정 수정 모드
export const EditEvent: Story = {
  name: '일정 수정 모드',
  args: {
    editingEvent: mockEditingEvent,
  },
};

// 4. 시간 유효성 검사 오류 상태
export const WithTimeValidationErrors: Story = {
  name: '시간 유효성 검사 오류',
  args: {
    startTimeError: '시작 시간이 올바르지 않습니다',
    endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다',
  },
};

// 5. 모든 필드 채워진 상태
export const FilledForm: Story = {
  name: '모든 필드 채워진 상태',
  render: () => {
    const FilledEventForm = () => {
      const [title, setTitle] = useState('중요한 프레젠테이션');
      const [date, setDate] = useState('2025-11-25');
      const [startTime] = useState('14:00');
      const [endTime] = useState('16:00');
      const [description, setDescription] = useState('새 제품 런칭 프레젠테이션 및 Q&A 세션');
      const [location, setLocation] = useState('대회의실 (3층)');
      const [category, setCategory] = useState('업무');
      const [isRepeating, setIsRepeating] = useState(false);
      const [repeatType, setRepeatType] = useState<RepeatType>('none');
      const [repeatInterval, setRepeatInterval] = useState(1);
      const [repeatEndDate, setRepeatEndDate] = useState('2025-12-31');
      const [notificationTime, setNotificationTime] = useState(120);

      return (
        <EventForm
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          startTime={startTime}
          endTime={endTime}
          description={description}
          setDescription={setDescription}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          isRepeating={isRepeating}
          setIsRepeating={setIsRepeating}
          repeatType={repeatType}
          setRepeatType={setRepeatType}
          repeatInterval={repeatInterval}
          setRepeatInterval={setRepeatInterval}
          repeatEndDate={repeatEndDate}
          setRepeatEndDate={setRepeatEndDate}
          notificationTime={notificationTime}
          setNotificationTime={setNotificationTime}
          startTimeError={null}
          endTimeError={null}
          handleStartTimeChange={mockHandleStartTimeChange}
          handleEndTimeChange={mockHandleEndTimeChange}
          onSubmit={mockOnSubmit}
          editingEvent={null}
        />
      );
    };

    return <FilledEventForm />;
  },
};

// 6. 주간 반복 일정
export const WeeklyRepeatEvent: Story = {
  name: '주간 반복 일정',
  render: () => {
    const WeeklyEventForm = () => {
      const [title, setTitle] = useState('팀 회의');
      const [date, setDate] = useState('2025-11-20');
      const [startTime] = useState('10:00');
      const [endTime] = useState('11:00');
      const [description, setDescription] = useState('주간 진행 상황 점검');
      const [location, setLocation] = useState('회의실 B');
      const [category, setCategory] = useState('업무');
      const [isRepeating, setIsRepeating] = useState(true);
      const [repeatType, setRepeatType] = useState<RepeatType>('weekly');
      const [repeatInterval, setRepeatInterval] = useState(1);
      const [repeatEndDate, setRepeatEndDate] = useState('2025-06-30');
      const [notificationTime, setNotificationTime] = useState(60);

      return (
        <EventForm
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          startTime={startTime}
          endTime={endTime}
          description={description}
          setDescription={setDescription}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          isRepeating={isRepeating}
          setIsRepeating={setIsRepeating}
          repeatType={repeatType}
          setRepeatType={setRepeatType}
          repeatInterval={repeatInterval}
          setRepeatInterval={setRepeatInterval}
          repeatEndDate={repeatEndDate}
          setRepeatEndDate={setRepeatEndDate}
          notificationTime={notificationTime}
          setNotificationTime={setNotificationTime}
          startTimeError={null}
          endTimeError={null}
          handleStartTimeChange={mockHandleStartTimeChange}
          handleEndTimeChange={mockHandleEndTimeChange}
          onSubmit={mockOnSubmit}
          editingEvent={null}
        />
      );
    };

    return <WeeklyEventForm />;
  },
};

// 7. 개인 카테고리 일정
export const PersonalCategoryEvent: Story = {
  name: '개인 카테고리 일정',
  render: () => {
    const PersonalEventForm = () => {
      const [title, setTitle] = useState('치과 예약');
      const [date, setDate] = useState('2025-11-22');
      const [startTime] = useState('15:30');
      const [endTime] = useState('16:30');
      const [description, setDescription] = useState('정기 검진 및 스케일링');
      const [location, setLocation] = useState('서울치과의원');
      const [category, setCategory] = useState('개인');
      const [isRepeating, setIsRepeating] = useState(false);
      const [repeatType, setRepeatType] = useState<RepeatType>('none');
      const [repeatInterval, setRepeatInterval] = useState(1);
      const [repeatEndDate, setRepeatEndDate] = useState('2025-12-31');
      const [notificationTime, setNotificationTime] = useState(1440); // 1일 전

      return (
        <EventForm
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          startTime={startTime}
          endTime={endTime}
          description={description}
          setDescription={setDescription}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          isRepeating={isRepeating}
          setIsRepeating={setIsRepeating}
          repeatType={repeatType}
          setRepeatType={setRepeatType}
          repeatInterval={repeatInterval}
          setRepeatInterval={setRepeatInterval}
          repeatEndDate={repeatEndDate}
          setRepeatEndDate={setRepeatEndDate}
          notificationTime={notificationTime}
          setNotificationTime={setNotificationTime}
          startTimeError={null}
          endTimeError={null}
          handleStartTimeChange={mockHandleStartTimeChange}
          handleEndTimeChange={mockHandleEndTimeChange}
          onSubmit={mockOnSubmit}
          editingEvent={null}
        />
      );
    };

    return <PersonalEventForm />;
  },
};
