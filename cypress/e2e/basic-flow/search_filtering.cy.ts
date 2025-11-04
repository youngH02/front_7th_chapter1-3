import { saveSchedule, waitForPageLoad } from '../../support/utils';

// 검색 관련 유틸리티 함수들
const searchEvents = (searchTerm: string) => {
  cy.get('#search').scrollIntoView();
  cy.get('#search').clear();
  cy.get('#search').type(searchTerm);
  cy.wait(500); 
};

const clearSearch = () => {
  cy.get('#search').scrollIntoView();
  cy.get('#search').clear();
  cy.wait(500); 
};

describe('검색 및 필터링 기능', () => {
  beforeEach(() => {
    cy.visit('/');
    waitForPageLoad();
  });

  describe('검색 기능', () => {
    it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', () => {
      searchEvents('존재하지않는일정검색');

      cy.get('[data-testid="event-list"]').scrollIntoView();
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('검색 결과가 없습니다.', { timeout: 5000 }).should('exist');
      });
    });

    it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', () => {
      // 초기 데이터 "기존 회의"가 존재하는지 확인
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('기존 회의', { timeout: 5000 }).should('exist');
      });

      // 검색어 입력으로 결과를 비움
      searchEvents('존재하지않는검색어');

      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('검색 결과가 없습니다.', { timeout: 5000 }).should('exist');
      });

      // 검색어 삭제
      clearSearch();

      // 일정이 다시 표시되는지 확인
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('기존 회의', { timeout: 5000 }).should('exist');
        cy.contains('검색 결과가 없습니다.').should('not.exist');
      });
    });

    it('제목으로 일정을 검색할 수 있다', () => {
      // 여러 일정 생성
      saveSchedule({
        title: '팀 회의',
        date: '2025-11-04',
        startTime: '09:00',
        endTime: '10:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      saveSchedule({
        title: '프로젝트 계획',
        date: '2025-11-04',
        startTime: '14:00',
        endTime: '15:00',
        description: '새 프로젝트 계획 수립',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      // '팀' 검색
      searchEvents('팀');

      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('팀 회의').should('exist');
        cy.contains('프로젝트 계획').should('not.exist');
      });
    });

    it('설명으로 일정을 검색할 수 있다', () => {
      // 특정 설명이 있는 일정 생성
      saveSchedule({
        title: '회의',
        date: '2025-11-04',
        startTime: '10:00',
        endTime: '11:00',
        description: '프로젝트 진행 상황 논의',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      saveSchedule({
        title: '미팅',
        date: '2025-11-04',
        startTime: '15:00',
        endTime: '16:00',
        description: '새로운 아이디어 브레인스토밍',
        location: '회의실 B',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      // '프로젝트' 검색 (설명에서 검색)
      searchEvents('프로젝트');

      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('회의').should('exist');
        cy.contains('미팅').should('not.exist');
      });
    });

    it('위치로 일정을 검색할 수 있다', () => {
      // 여러 위치의 일정 생성
      saveSchedule({
        title: '회의 A',
        date: '2025-11-04',
        startTime: '09:00',
        endTime: '10:00',
        description: '설명 A',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      saveSchedule({
        title: '회의 B',
        date: '2025-11-04',
        startTime: '14:00',
        endTime: '15:00',
        description: '설명 B',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      // '회의실 A' 검색
      searchEvents('회의실 A');

      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('회의 A').should('exist');
        cy.contains('회의 B').should('not.exist');
      });
    });

    it('반복 일정도 검색 결과에 올바르게 포함된다', () => {
      // 반복 일정 생성
      saveSchedule({
        title: '반복 회의',
        date: '2025-11-04',
        startTime: '10:00',
        endTime: '11:00',
        description: '반복되는 회의',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2025-11-06',
        },
        notificationTime: 0,
      });

      // 단일 일정 생성
      saveSchedule({
        title: '단일 일정',
        date: '2025-11-04',
        startTime: '14:00',
        endTime: '15:00',
        description: '단일 일정',
        location: '회의실 B',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      // '반복' 검색
      searchEvents('반복');

      cy.get('[data-testid="event-list"]').within(() => {
        cy.get(':contains("반복 회의")').should('have.length.at.least', 2); // 반복 일정들
        cy.contains('단일 일정').should('not.exist');
      });
    });

    it('대소문자를 구분하지 않고 검색할 수 있다', () => {
      // 일정 생성
      saveSchedule({
        title: 'Project Meeting',
        date: '2025-11-04',
        startTime: '10:00',
        endTime: '11:00',
        description: 'Important project discussion',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      // 소문자로 검색
      searchEvents('project');

      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('Project Meeting').should('exist');
      });
    });
  });
});
