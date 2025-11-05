import { saveSchedule, waitForPageLoad } from '../../support/utils';

describe('알림 기능', () => {
  beforeEach(() => {
    cy.visit('/');
    waitForPageLoad();
  });

  describe('일정 알림', () => {
    it('알림 시간 설정이 올바르게 저장된다', () => {
      saveSchedule({
        title: '알림 테스트 회의',
        date: '2025-11-06',
        startTime: '14:00',
        endTime: '15:00',
        description: '알림 테스트',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      });

      // 일정이 생성되었는지 확인
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('알림 테스트 회의').should('exist');
      });

      // 알림 설정이 저장되었는지 확인 (이벤트 목록에서 알림 정보 표시)
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('알림 테스트 회의')
          .closest('.MuiBox-root')
          .within(() => {
            cy.contains('10분 전').should('exist');
          });
      });
    });

    it('알림 시간 수정이 가능하다', () => {
      saveSchedule({
        title: '수정 테스트 일정',
        date: '2025-11-06',
        startTime: '15:00',
        endTime: '16:00',
        description: '알림 시간 수정 테스트',
        location: '회의실 C',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      });

      // 일정 편집
      cy.get('[data-testid="event-list"]')
        .find('.MuiBox-root')
        .filter((index, box) => {
          return Cypress.$(box).text().includes('수정 테스트 일정');
        })
        .first()
        .find('[aria-label="Edit event"]')
        .click();

      cy.get('#notification').should('exist');

      // 알림 시간 변경
      cy.get('#notification').click({ force: true });
      cy.get('[role="listbox"]').within(() => {
        cy.get('[data-value="60"]').should('be.visible').click();
      });

      cy.get('[data-testid="event-submit-button"]').click();

      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('수정 테스트 일정').should('exist');
        cy.contains('1시간 전').should('exist');
      });
    });

    it('반복 일정에도 알림 설정이 적용된다', () => {
      saveSchedule({
        title: '반복 알림 회의',
        date: '2025-11-04',
        startTime: '09:00',
        endTime: '10:00',
        description: '매일 진행되는 회의',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2025-11-05',
        },
        notificationTime: 10,
      });

      // 반복 일정이 생성되었는지 확인
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('반복 알림 회의');
        });
        expect(eventBoxes).to.have.length(2);
      });

      cy.get('[data-testid="RepeatIcon"]').should('exist');

      // 알림 설정 확인
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('반복 알림 회의').should('exist');
        cy.contains('10분 전').should('exist');
      });
    });
  });

  describe('알림 노출', () => {
    it('알림 시간이 도래하면 알림 메시지가 표시된다', () => {
      const title = '임박 알림 회의';

      // 현재 시간 가져오기
      const now = new Date();
      const futureTime = new Date(now.getTime() + 11 * 60 * 1000); // 현재 시간 + 11분

      const date =
        futureTime.getFullYear() +
        '-' +
        String(futureTime.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(futureTime.getDate()).padStart(2, '0'); // YYYY-MM-DD
      const startTime =
        String(futureTime.getHours()).padStart(2, '0') +
        ':' +
        String(futureTime.getMinutes()).padStart(2, '0'); // HH:MM
      const endHour = futureTime.getHours() + 1;
      const endTime = `${endHour.toString().padStart(2, '0')}:${futureTime.getMinutes().toString().padStart(2, '0')}`;

      saveSchedule({
        title,
        date,
        startTime,
        endTime,
        description: '알림 도착 확인',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      });

      // 알림이 나타날 때까지 기다리기 (최대 1분)
      cy.get('[role="alert"]', { timeout: 60000 })
        .should('have.length', 1)
        .and('contain', `10분 후 ${title} 일정이 시작됩니다.`);
    });

    it('알림을 닫으면 목록에서 제거된다다', () => {
      const title = '알림 닫기 회의';

      // 현재 시간 가져오기
      const now = new Date();
      const futureTime = new Date(now.getTime() + 11 * 60 * 1000); // 현재 시간 + 11분

      const date =
        futureTime.getFullYear() +
        '-' +
        String(futureTime.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(futureTime.getDate()).padStart(2, '0'); // YYYY-MM-DD
      const startTime =
        String(futureTime.getHours()).padStart(2, '0') +
        ':' +
        String(futureTime.getMinutes()).padStart(2, '0'); // HH:MM
      const endHour = futureTime.getHours() + 1;
      const endTime = `${endHour.toString().padStart(2, '0')}:${futureTime.getMinutes().toString().padStart(2, '0')}`;

      saveSchedule({
        title,
        date,
        startTime,
        endTime,
        description: '알림 닫기 확인',
        location: '회의실 D',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      });

      // 알림이 나타나는지 확인
      cy.get('[role="alert"]', { timeout: 60000 }).should(
        'contain',
        `10분 후 ${title} 일정이 시작됩니다.`
      );

      // 알림 팝업 내의 X버튼(닫기 버튼) 클릭
      cy.get('[role="alert"]')
        .first()
        .within(() => {
          cy.get('button').click();
        });

      // 알림이 사라졌는지 확인
      cy.get('[role="alert"]').should('not.exist');
    });
  });
});
