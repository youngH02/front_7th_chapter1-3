import { navigateCalendar, saveSchedule, waitForPageLoad } from '../../support/utils';

// 검색 관련 유틸리티 함수
const searchEvents = (searchTerm: string) => {
  cy.get('#search').scrollIntoView();
  cy.get('#search').clear();
  cy.get('#search').type(searchTerm);
  cy.wait(500); // 검색 처리 대기
};

// 뷰 선택 유틸리티 함수
const selectView = (viewType: 'week' | 'month') => {
  cy.get('[aria-label="뷰 타입 선택"]').scrollIntoView();
  cy.get('[aria-label="뷰 타입 선택"]').click();
  cy.get(`[aria-label="${viewType}-option"]`).click();
  cy.wait(1000); // 뷰 변경 대기
};

describe('기본 일정 관리 워크플로우', () => {
  beforeEach(() => {
    cy.visit('/');
    waitForPageLoad();
  });

  describe('일정 뷰', () => {
    it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', () => {
      // 먼저 검색어로 결과를 비움
      searchEvents('존재하지않는일정');

      // 뷰 선택
      selectView('week');

      // 이벤트 리스트에서 검색 결과 확인
      cy.get('[data-testid="event-list"]').scrollIntoView();
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('검색 결과가 없습니다.').should('exist');
      });
    });

    it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', () => {
      saveSchedule({
        title: '이번주 팀 회의',
        date: '2025-11-04',
        startTime: '09:00',
        endTime: '10:00',
        description: '이번주 팀 회의입니다.',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      // 뷰 선택
      selectView('week');

      cy.get('[data-testid="week-view"]').scrollIntoView();
      cy.get('[data-testid="week-view"]').within(() => {
        cy.contains('이번주 팀 회의').should('exist');
      });
    });

    it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', () => {
      // 검색어로 결과를 비움
      searchEvents('존재하지않는일정');

      cy.wait(1000); // 검색 적용 대기

      // 이벤트 리스트에서 검색 결과 확인
      cy.get('[data-testid="event-list"]').scrollIntoView();
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('검색 결과가 없습니다.').should('exist');
      });
    });

    it('월별 뷰에 일정이 정확히 표시되는지 확인한다', () => {
      saveSchedule({
        title: '이번달 팀 회의',
        date: '2025-11-05',
        startTime: '09:00',
        endTime: '10:00',
        description: '이번달 팀 회의입니다.',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      cy.get('[data-testid="month-view"]').scrollIntoView();
      cy.get('[data-testid="month-view"]').within(() => {
        cy.contains('이번달 팀 회의').should('exist');
      });
    });

    it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', () => {
      // 1월로 네비게이션 (11월에서 1월까지 10번 이전으로 이동)
      navigateCalendar('prev', 10);

      cy.get('[data-testid="month-view"]').scrollIntoView();
      cy.get('[data-testid="month-view"]').within(() => {
        cy.contains('1')
          .parent()
          .within(() => {
            cy.contains('신정').should('exist');
          });
      });
    });
  });

  describe('일정 생성', () => {
    it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', () => {
      saveSchedule({
        title: '새 회의',
        date: '2025-11-03',
        startTime: '14:00',
        endTime: '15:00',
        description: '프로젝트 진행 상황 논의',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      cy.get('[data-testid="event-list"]').scrollIntoView();
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('새 회의').should('exist');
        cy.contains('2025-11-03').should('exist');
        cy.contains('14:00 - 15:00').should('exist');
        cy.contains('프로젝트 진행 상황 논의').should('exist');
        cy.contains('회의실 A').should('exist');
        cy.contains('카테고리: 업무').should('exist');
      });
    });
  });
  describe('일정 수정', () => {
    it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', () => {
      // 수정할 일정을 먼저 생성
      saveSchedule({
        title: '수정 테스트 회의',
        date: '2025-11-03',
        startTime: '10:00',
        endTime: '11:00',
        description: '수정 전 설명',
        location: '수정 전 위치',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      cy.wait(1000); // 일정 생성 대기

      // 특정 이벤트의 편집 버튼 찾기
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('수정 테스트 회의').should('exist');
      });

      cy.get('[aria-label="Edit event"]').last().scrollIntoView();
      cy.get('[aria-label="Edit event"]').last().click();

      cy.get('#title').clear();
      cy.get('#title').type('수정된 회의');

      cy.get('#description').clear();
      cy.get('#description').type('회의 내용 변경');

      cy.get('[data-testid="event-submit-button"]').click();
      cy.wait(500); // 수정 처리 대기

      // 수정 결과 확인
      cy.get('[data-testid="event-list"]').scrollIntoView();
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('수정된 회의').should('exist');
        cy.contains('회의 내용 변경').should('exist');
        cy.contains('수정 테스트 회의').should('not.exist');
      });
    });
  });

  describe('일정 삭제', () => {
    it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', () => {
      // 삭제할 일정을 먼저 생성
      saveSchedule({
        title: '삭제 테스트 이벤트',
        date: '2025-11-03',
        startTime: '16:00',
        endTime: '17:00',
        description: '삭제될 일정',
        location: '삭제될 위치',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      cy.wait(1000); // 일정 생성 대기

      // 특정 이벤트 확인 후 삭제
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('삭제 테스트 이벤트').should('exist');
      });

      cy.get('[aria-label="Delete event"]').last().scrollIntoView();
      cy.get('[aria-label="Delete event"]').last().click();
      cy.wait(500); // 삭제 처리 대기

      // 삭제 결과 확인
      cy.get('[data-testid="event-list"]').scrollIntoView();
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('삭제 테스트 이벤트').should('not.exist');
      });
    });
  });
});
