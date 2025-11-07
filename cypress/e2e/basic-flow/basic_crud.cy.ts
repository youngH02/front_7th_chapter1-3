import { navigateCalendar, saveSchedule, waitForPageLoad } from '../../support/utils';

// 검색
const searchEvents = (searchTerm: string) => {
  cy.get('#search').scrollIntoView();
  cy.get('#search').clear();
  cy.get('#search').type(searchTerm);
};

// 뷰 선택
const selectView = (viewType: 'week' | 'month') => {
  cy.get('[aria-label="뷰 타입 선택"]').scrollIntoView();
  cy.get('[aria-label="뷰 타입 선택"]').click();
  cy.get(`[aria-label="${viewType}-option"]`).click();
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

      selectView('week');

      // 이벤트 리스트에서 검색 결과 확인
      cy.get('[data-testid="event-list"]').scrollIntoView();
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('검색 결과가 없습니다.').should('exist');
      });
    });

    it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', () => {
      selectView('week');
      navigateCalendar('next', 1); // 11월에서 12월로 이동

      // 초기 데이터인 "기존 회의" 확인
      cy.get('[data-testid="event-list"]').scrollIntoView();
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('기존 회의').should('exist');
      });
    });

    it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', () => {
      // 검색어로 결과를 비움
      searchEvents('존재하지않는일정');

      // 이벤트 리스트에서 검색 결과 확인
      cy.get('[data-testid="event-list"]').scrollIntoView();
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('검색 결과가 없습니다.').should('exist');
      });
    });

    it('월별 뷰에 일정이 정확히 표시되는지 확인한다', () => {
      // 초기 데이터인 "기존 회의" 확인
      cy.get('[data-testid="month-view"]').scrollIntoView();
      cy.get('[data-testid="month-view"]').within(() => {
        cy.contains('기존 회의').should('exist');
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
      // 초기 데이터인 "기존 회의" 수정
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('기존 회의').should('exist');
      });

      cy.get('[aria-label="Edit event"]').first().scrollIntoView();
      cy.get('[aria-label="Edit event"]').first().click();

      cy.get('#title').clear();
      cy.get('#title').type('수정된 회의');

      cy.get('#description').clear();
      cy.get('#description').type('회의 내용 변경');

      cy.get('[data-testid="event-submit-button"]').click();

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
      // 초기 데이터인 "기존 회의" 삭제
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('기존 회의').should('exist');
      });

      cy.get('[aria-label="Delete event"]').first().scrollIntoView();
      cy.get('[aria-label="Delete event"]').first().click();

      // 삭제 결과 확인
      cy.get('[data-testid="event-list"]').scrollIntoView();
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('기존 회의').should('not.exist');
      });
    });
  });
});
