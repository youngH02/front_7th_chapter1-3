import { saveSchedule, waitForPageLoad } from '../../support/utils';

describe('일정 중복 처리', () => {
  beforeEach(() => {
    cy.visit('/');
    waitForPageLoad();
  });

  describe('중복 일정 경고', () => {
    it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', () => {
      // 첫 번째 일정 생성 (09:00-10:00)
      saveSchedule({
        title: '기존 회의',
        date: '2025-11-03',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      // 첫 번째 일정이 생성되었는지 확인
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('기존 회의').should('exist');
      });

      // 겹치는 시간에 두 번째 일정 생성 시도 (08:30-10:30 - 겹침)
      saveSchedule({
        title: '새 회의',
        date: '2025-11-03',
        startTime: '08:30',
        endTime: '10:30',
        description: '겹치는 시간의 새 회의',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      // 겹침 경고 팝업 확인
      cy.contains('일정 겹침 경고').should('be.visible');
      cy.contains('다음 일정과 겹칩니다').should('be.visible');
    });

    it('정확히 같은 시간에 일정을 추가할 때 경고가 표시된다', () => {
      // 첫 번째 일정 생성
      saveSchedule({
        title: '원본 일정',
        date: '2025-11-04',
        startTime: '14:00',
        endTime: '15:00',
        description: '원본 일정 설명',
        location: '회의실 C',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      // 정확히 같은 시간에 두 번째 일정 생성 시도
      saveSchedule({
        title: '중복 일정',
        date: '2025-11-04',
        startTime: '14:00',
        endTime: '15:00',
        description: '중복 시간의 일정',
        location: '회의실 D',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      // 겹침 경고 팝업 확인
      cy.contains('일정 겹침 경고').should('be.visible');
      cy.contains('다음 일정과 겹칩니다').should('be.visible');
    });

    it('시간이 겹치지 않는 일정은 경고 없이 추가된다', () => {
      saveSchedule({
        title: '오전 회의',
        date: '2025-11-05',
        startTime: '09:00',
        endTime: '10:00',
        description: '오전 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      saveSchedule({
        title: '오후 회의',
        date: '2025-11-05',
        startTime: '14:00',
        endTime: '15:00',
        description: '오후 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      // 두 일정이 모두 추가되었는지 확인
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('오전 회의').should('exist');
        cy.contains('오후 회의').should('exist');
      });

      // 경고가 없었는지 확인
      cy.get('body').then(($body) => {
        expect($body.text()).to.not.include('일정 겹침 경고');
      });
    });

    it('반복 일정 생성시 충돌을 감지하지 않는다', () => {
      cy.resetToEmptyData();
      // 기존 단일 일정 생성
      saveSchedule({
        title: '기존 단일 일정',
        date: '2025-11-21',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 일정',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      // 겹치는 시간대에 반복 일정 생성 시도 (09:30-10:30 for 3 days)
      saveSchedule({
        title: '새 반복 일정',
        date: '2025-11-21',
        startTime: '09:30',
        endTime: '10:30',
        description: '반복 일정',
        location: '회의실 B',
        category: '개인',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2025-11-04',
        },
        notificationTime: 0,
      });

      cy.contains('일정 겹침 경고').should('not.exist');
    });
  });
});
