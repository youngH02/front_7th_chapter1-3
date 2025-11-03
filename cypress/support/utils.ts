export interface SaveScheduleForm {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat?: {
    type: string;
    interval: number;
    endDate?: string;
  };
}

export const saveSchedule = (form: SaveScheduleForm) => {
  const { title, date, startTime, endTime, location, description, category, repeat } = form;

  cy.get('#title').clear();
  cy.get('#title').type(title);

  cy.get('#date').clear();
  cy.get('#date').type(date);

  cy.get('#start-time').clear();
  cy.get('#start-time').type(startTime);

  cy.get('#end-time').clear();
  cy.get('#end-time').type(endTime);

  cy.get('#description').clear();
  cy.get('#description').type(description);

  cy.get('#location').clear();
  cy.get('#location').type(location);

  // 카테고리 선택
  cy.get('body').then(($body) => {
    cy.get('#category').click();
    cy.get(`[aria-label="${category}-option"]`).click();
  });

  if (repeat) {
    // 반복 일정 체크박스
    cy.get('input[type="checkbox"]').first().check();
    cy.wait(500);

    cy.get('body').then(($body) => {
      cy.contains('반복 유형').parent().find('select, [role="combobox"]').click();
      cy.contains(`${repeat.type}`).click();
    });

    cy.get('body').then(($body) => {
      cy.get('#repeat-interval').clear();
      cy.get('#repeat-interval').type(String(repeat.interval));
    });

    cy.get('body').then(($body) => {
      cy.get('#repeat-end-date').type(repeat.endDate);
    });
  }

  cy.get('button').contains('일정 추가').first().scrollIntoView();
  cy.get('button').contains('일정 추가').first().click();
  cy.wait(1000); // 일정 생성 대기
};

export const navigateCalendar = (direction: 'prev' | 'next', times: number = 1) => {
  const buttonLabel = direction === 'prev' ? 'Previous' : 'Next';
  for (let i = 0; i < times; i++) {
    cy.get(`[aria-label="${buttonLabel}"]`).scrollIntoView();
    cy.get(`[aria-label="${buttonLabel}"]`).click();
    cy.wait(200);
  }
};

// 페이지 로딩 완료 대기 함수
export const waitForPageLoad = () => {
  // "일정 로딩 완료!" 메시지가 있으면 대기하고, 없으면 다른 요소들로 확인
  cy.get('body').then(($body) => {
    if ($body.text().includes('일정 로딩 완료!')) {
      cy.contains('일정 로딩 완료!', { timeout: 10000 }).should('be.visible');
    } else {
      // 대신 주요 컴포넌트들이 로딩되었는지 확인
      cy.get('[data-testid="month-view"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid="event-list"]', { timeout: 10000 }).should('be.visible');
      cy.get('button').contains('일정 추가', { timeout: 10000 }).should('be.visible');
    }
  });
  cy.wait(1000);
};
