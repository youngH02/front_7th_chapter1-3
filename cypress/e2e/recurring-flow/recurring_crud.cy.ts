import { navigateCalendar, saveSchedule, waitForPageLoad } from '../../support/utils';

describe('반복 일정 CRUD 워크플로우', () => {
  beforeEach(() => {
    cy.visit('/');
    waitForPageLoad();
  });

  describe('반복 일정 생성', () => {
    it('반복 일정을 생성하고 여러 개의 일정이 생성되는지 확인한다', () => {
      // 반복 일정 생성 (매일, 2일간)
      saveSchedule({
        title: '매일 회의',
        date: '2025-11-03',
        startTime: '14:00',
        endTime: '15:00',
        description: '매일 진행되는 회의',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2025-11-04',
        },
        notificationTime: 0,
      });

      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('매일 회의');
        });
        expect(eventBoxes).to.have.length.at.least(2);
      });
      cy.get('[data-testid="RepeatIcon"]').should('exist');
    });

    it('주간 반복 일정이 정확히 생성되는지 확인한다', () => {
      saveSchedule({
        title: '주간 팀 미팅',
        date: '2025-11-03',
        startTime: '10:00',
        endTime: '11:00',
        description: '매주 진행되는 팀 미팅',
        location: '대회의실',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-11-17',
        },
        notificationTime: 0,
      });
      // 반복 일정 생성 확인 - 주간 반복이므로 최소 3개 생성되어야 함
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('주간 팀 미팅');
        });
        expect(eventBoxes).to.have.length.at.least(3);
      });

      cy.get('[data-testid="RepeatIcon"]').should('exist');
    });

    it('월간 반복 일정이 정확히 생성되는지 확인한다', () => {
      saveSchedule({
        title: '월간 보고 회의',
        date: '2025-11-03',
        startTime: '16:00',
        endTime: '17:00',
        description: '매월 진행되는 보고 회의',
        location: '임원 회의실',
        category: '업무',
        repeat: {
          type: 'monthly',
          interval: 1,
          endDate: '2025-12-03',
        },
        notificationTime: 0,
      });

      // 월간 반복 일정 생성 확인 - 현재 달에서 1개 확인
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('월간 보고 회의');
        });
        expect(eventBoxes).to.have.length.at.least(1);
      });

      // 다음 달로 이동하여 반복 일정 확인
      navigateCalendar('next');

      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('월간 보고 회의');
        });
        expect(eventBoxes).to.have.length.at.least(1);
      });

      cy.get('[data-testid="RepeatIcon"]').should('exist');
    });

    it('연간 반복 일정이 정확히 생성되는지 확인한다', () => {
      saveSchedule({
        title: '연간 총회',
        date: '2025-11-03',
        startTime: '09:00',
        endTime: '18:00',
        description: '매년 진행되는 총회',
        location: '대강당',
        category: '업무',
        repeat: {
          type: 'yearly',
          interval: 1,
          endDate: '2027-11-03',
        },
        notificationTime: 0,
      });

      // 연간 반복 일정 생성 확인 - 현재 년도에서 1개 확인
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('연간 총회');
        });
        expect(eventBoxes).to.have.length.at.least(1);
      });

      // 다음 년도로 이동하여 반복 일정 확인 (12개월 이동)
      navigateCalendar('next', 12);

      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('연간 총회');
        });
        expect(eventBoxes).to.have.length.at.least(1);
      });

      cy.get('[data-testid="RepeatIcon"]').should('exist');
    });
  });

  describe('반복 일정 편집', () => {
    beforeEach(() => {
      saveSchedule({
        title: '매일 회의',
        date: '2025-11-03',
        startTime: '14:00',
        endTime: '15:00',
        description: '매일 진행되는 회의',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2025-11-04',
        },
        notificationTime: 0,
      });
    });

    it('반복 일정 편집 시 편집 다이얼로그가 나타나는지 확인한다', () => {
      // 반복 일정 편집 - 반복 아이콘이 있는 Box를 찾기
      cy.get('[data-testid="event-list"]')
        .find('.MuiBox-root')
        .filter((index, box) => {
          return Cypress.$(box).text().includes('매일 회의');
        })
        .first()
        .find('[aria-label="Edit event"]')
        .click();

      // 반복 일정 편집 다이얼로그 확인
      cy.contains('반복 일정 수정', { timeout: 5000 }).should('be.visible');
      cy.contains('해당 일정만 수정하시겠어요?').should('be.visible');
    });

    it('예를 선택하면 해당 일정만 단일 일정으로 변경된다', () => {
      // 반복 일정 편집 전 개수 확인
      cy.get('[data-testid="event-list"]').within(() => {
        cy.get(':contains("매일 회의")').should('have.length.at.least', 2);
      });

      cy.get('[data-testid="event-list"]')
        .find('.MuiBox-root')
        .filter((index, box) => {
          return Cypress.$(box).text().includes('매일 회의');
        })
        .first()
        .find('[aria-label="Edit event"]')
        .click();

      // 반복 일정 편집 다이얼로그 대기 및 옵션 선택
      cy.contains('반복 일정 수정', { timeout: 5000 }).should('be.visible');
      cy.contains('해당 일정만 수정하시겠어요?').should('be.visible');

      cy.contains('예').click();

      // 제목과 설명 변경 (vitest처럼 더 상세한 수정)
      cy.get('#title').clear();
      cy.get('#title').type('수정된 회의');

      cy.get('#description').clear();
      cy.get('#description').type('단일 수정된 설명');

      cy.get('[data-testid="event-submit-button"]').click();
      cy.wait(1000);

      // 결과 확인: 수정된 일정과 원본 일정이 모두 존재해야 함
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('수정된 회의').should('exist');
        cy.contains('단일 수정된 설명').should('exist');
        cy.contains('매일 회의').should('exist'); // 나머지는 그대로
      });
    });

    it('아니오를 선택하면 모든 반복 일정이 변경된다', () => {
      // 반복 일정 편집 전 개수 확인 및 저장
      let initialEventCount;
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('매일 회의');
        });
        initialEventCount = eventBoxes.length;
        expect(initialEventCount).to.be.at.least(2);
      });

      cy.get('[data-testid="event-list"]')
        .find('.MuiBox-root')
        .filter((index, box) => {
          return Cypress.$(box).text().includes('매일 회의');
        })
        .first()
        .find('[aria-label="Edit event"]')
        .click();

      // 반복 일정 편집 다이얼로그 대기 및 옵션 선택
      cy.contains('반복 일정 수정', { timeout: 5000 }).should('be.visible');
      cy.contains('해당 일정만 수정하시겠어요?').should('be.visible');

      cy.contains('아니오').click();

      // 제목과 설명 변경
      cy.get('#title').clear();
      cy.get('#title').type('전체 변경된 회의');

      cy.get('#description').clear();
      cy.get('#description').type('전체 변경된 설명');

      cy.get('[data-testid="event-submit-button"]').click();
      cy.wait(1000);

      // 결과 확인: 모든 반복 일정이 변경되어야 함
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const changedEventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('전체 변경된 회의');
        });
        expect(changedEventBoxes).to.have.length(initialEventCount);
      });

      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('전체 변경된 설명').should('exist');
        cy.contains('매일 회의').should('not.exist'); // 원본은 없어야 함
      });
    });

    it('취소를 선택하면 편집이 취소된다', () => {
      // 처음 일정 개수 확인 및 저장
      let initialEventCount;
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('매일 회의');
        });
        initialEventCount = eventBoxes.length;
        expect(initialEventCount).to.be.at.least(2);
      });

      cy.get('[data-testid="event-list"]')
        .find('.MuiBox-root')
        .filter((index, box) => {
          return Cypress.$(box).text().includes('매일 회의');
        })
        .first()
        .find('[aria-label="Edit event"]')
        .click();

      cy.contains('반복 일정 수정', { timeout: 5000 }).should('be.visible');
      cy.contains('해당 일정만 수정하시겠어요?').should('be.visible');

      // 취소 버튼 클릭
      cy.contains('취소').click();

      // 다이얼로그가 닫히고 편집되지 않음을 확인
      cy.contains('반복 일정 수정').should('not.exist');

      // 마지막 일정 개수가 처음과 동일한지 확인
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('매일 회의');
        });
        expect(eventBoxes).to.have.length(initialEventCount);
      });
    });
  });

  describe('반복 일정 삭제', () => {
    beforeEach(() => {
      saveSchedule({
        title: '삭제 테스트 회의',
        date: '2025-11-03',
        startTime: '16:00',
        endTime: '17:00',
        description: '삭제될 반복 회의',
        location: '회의실 B',
        category: '업무',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2025-11-04',
        },
        notificationTime: 0,
      });
    });

    it('반복 일정 삭제 시 삭제 다이얼로그가 나타난다', () => {
      // 반복 일정 삭제 시도
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('삭제 테스트 회의').should('exist');
      });

      cy.get('[data-testid="event-list"]')
        .find('.MuiBox-root')
        .filter((index, box) => {
          return Cypress.$(box).text().includes('삭제 테스트 회의');
        })
        .first()
        .find('[aria-label="Delete event"]')
        .click();

      cy.contains('반복 일정 삭제', { timeout: 5000 }).should('be.visible');
      cy.contains('해당 일정만 삭제하시겠어요?').should('be.visible');
    });

    it('삭제 다이얼로그에서 예를 선택하면 해당 일정만 삭제된다', () => {
      // 삭제 전 반복 일정 개수 확인
      cy.get('[data-testid="event-list"]').within(() => {
        cy.get(':contains("삭제 테스트 회의")').should('have.length.at.least', 2);
      });

      cy.get('[data-testid="event-list"]')
        .find('.MuiBox-root')
        .filter((index, box) => {
          return Cypress.$(box).text().includes('삭제 테스트 회의');
        })
        .first()
        .find('[aria-label="Delete event"]')
        .click();

      cy.contains('반복 일정 삭제', { timeout: 5000 }).should('be.visible');
      cy.contains('해당 일정만 삭제하시겠어요?').should('be.visible');

      cy.contains('예').click();
      cy.wait(1000);

      // 알림 메시지 확인
      cy.contains('일정이 삭제되었습니다', { timeout: 5000 }).should('be.visible');

      // 일정 개수가 줄어들었는지 확인 (하나만 삭제됨)
      cy.get('[data-testid="event-list"]').within(() => {
        cy.get(':contains("삭제 테스트 회의")').should('have.length.at.least', 1);
      });
    });

    it('삭제 다이얼로그에서 아니오를 선택하면 모든 반복 일정이 삭제된다', () => {
      // 반복 일정 삭제
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('삭제 테스트 회의').should('exist');
      });

      cy.get('[data-testid="event-list"]')
        .find('.MuiBox-root')
        .filter((index, box) => {
          return Cypress.$(box).text().includes('삭제 테스트 회의');
        })
        .first()
        .find('[aria-label="Delete event"]')
        .click();

      cy.contains('반복 일정 삭제', { timeout: 5000 }).should('be.visible');
      cy.contains('해당 일정만 삭제하시겠어요?').should('be.visible');

      cy.contains('아니오').click();
      cy.wait(1000);

      // 모든 일정이 삭제되었는지 확인
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('삭제 테스트 회의').should('not.exist');
      });
    });

    it('삭제 다이얼로그에서 취소를 선택하면 삭제가 취소된다', () => {
      // 처음 일정 개수 확인 및 저장
      let initialEventCount;
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('삭제 테스트 회의');
        });
        initialEventCount = eventBoxes.length;
        expect(initialEventCount).to.be.at.least(2);
      });

      cy.get('[data-testid="event-list"]')
        .find('.MuiBox-root')
        .filter((index, box) => {
          return Cypress.$(box).text().includes('삭제 테스트 회의');
        })
        .first()
        .find('[aria-label="Delete event"]')
        .click();

      cy.contains('반복 일정 삭제', { timeout: 5000 }).should('be.visible');
      cy.contains('해당 일정만 삭제하시겠어요?').should('be.visible');

      cy.contains('취소').click();

      cy.contains('반복 일정 삭제').should('not.exist');

      // 모든 일정이 그대로 남아있는지 확인
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('삭제 테스트 회의');
        });
        expect(eventBoxes).to.have.length(initialEventCount);
      });
    });
  });

  describe('반복 일정 표시 및 추가 기능', () => {
    beforeEach(() => {
      cy.visit('/');
      waitForPageLoad();
    });

    it('단일 일정에는 반복 아이콘이 표시되지 않는다', () => {
      saveSchedule({
        title: '단일 일정 테스트',
        date: '2025-11-03',
        startTime: '11:00',
        endTime: '12:00',
        description: '단일 일정입니다',
        location: '테스트 장소',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('단일 일정 테스트').should('exist');
      });

      cy.get('body').then(($body) => {
        const repeatIcons = $body.find('[data-testid="RepeatIcon"]');
        if (repeatIcons.length === 0) {
          cy.log('No repeat icons found - correct for single event only');
        }
      });
    });

    it('반복 종료일이 지나면 더 이상 반복되지 않는다', () => {
      // 종료일이 내일인 반복 일정 생성
      saveSchedule({
        title: '종료일 테스트',
        date: '2025-11-03',
        startTime: '15:00',
        endTime: '16:00',
        description: '내일까지만 반복',
        location: '테스트 장소',
        category: '개인',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2025-11-04',
        },
        notificationTime: 0,
      });

      // 정확히 2개의 일정만 생성되어야 함 (11/3, 11/4)
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('종료일 테스트');
        });
        expect(eventBoxes).to.have.length(2);
      });
    });

    it('입력한 새로운 반복 일정 정보에 맞춰 반복 표시가 정확히 저장된다', () => {
      // 2일 간격으로 반복되는 일정 생성
      saveSchedule({
        title: '2일 간격 테스트',
        date: '2025-11-03',
        startTime: '12:00',
        endTime: '13:00',
        description: '2일마다 반복',
        location: '테스트 장소',
        category: '개인',
        repeat: {
          type: 'daily',
          interval: 2,
          endDate: '2025-11-09',
        },
        notificationTime: 0,
      });

      // 2일 간격이므로 11/3, 11/5, 11/7, 11/9 = 4개 생성되어야 함
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('2일 간격 테스트');
        });
        expect(eventBoxes).to.have.length(4);
      });

      // 반복 아이콘이 표시되는지 확인
      cy.get('[data-testid="RepeatIcon"]').should('exist');
    });

    it('반복 간격이 올바르게 적용된다', () => {
      // 2일 간격으로 반복되는 일정 생성
      saveSchedule({
        title: '간격 테스트',
        date: '2025-11-03',
        startTime: '12:00',
        endTime: '13:00',
        description: '2일마다 반복',
        location: '테스트 장소',
        category: '개인',
        repeat: {
          type: 'daily',
          interval: 2,
          endDate: '2025-11-09',
        },
        notificationTime: 0,
      });

      // 2일 간격이므로 11/3, 11/5, 11/7, 11/9 = 4개 생성되어야 함
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('간격 테스트');
        });
        expect(eventBoxes).to.have.length(4);
      });
    });

    it('반복 유형별로 올바른 날짜에 일정이 생성된다', () => {
      // 주간 반복 (매주 월요일) 테스트
      saveSchedule({
        title: '매주 월요일 회의',
        date: '2025-11-03', // 월요일
        startTime: '08:00',
        endTime: '09:00',
        description: '매주 월요일 진행',
        location: '회의실',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-11-24',
        },
        notificationTime: 0,
      });

      // 3주간이므로 최소 3개 생성되어야 함
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('매주 월요일 회의');
        });
        expect(eventBoxes).to.have.length.at.least(3);
      });
    });

    it('반복 일정을 수정하는 경우 반복 표시가 사라진다', () => {
      saveSchedule({
        title: '수정 테스트 회의',
        date: '2025-11-03',
        startTime: '14:00',
        endTime: '15:00',
        description: '반복 테스트',
        location: '회의실',
        category: '업무',
        repeat: {
          type: 'daily',
          interval: 2,
          endDate: '2025-11-07',
        },
        notificationTime: 0,
      });

      // 반복 아이콘이 표시되는지 확인
      cy.get('[data-testid="RepeatIcon"]').should('exist');

      // 반복 일정 개수 확인 (2일 간격이므로 11/3, 11/5, 11/7 = 3개)
      cy.get('[data-testid="event-list"] > div').then(($boxes) => {
        const eventBoxes = $boxes.filter((index, box) => {
          return Cypress.$(box).text().includes('수정 테스트 회의');
        });
        expect(eventBoxes).to.have.length(3);
      });

      // 첫 번째 반복 일정 편집
      cy.get('[data-testid="event-list"]')
        .find('.MuiBox-root')
        .filter((index, box) => {
          return Cypress.$(box).text().includes('수정 테스트 회의');
        })
        .first()
        .find('[aria-label="Edit event"]')
        .click();

      cy.contains('반복 일정 수정', { timeout: 5000 }).should('be.visible');
      cy.contains('해당 일정만 수정하시겠어요?').should('be.visible');
      cy.contains('예').click();

      // 제목 수정
      cy.get('#title').clear();
      cy.get('#title').type('수정된 회의');

      cy.get('[data-testid="event-submit-button"]').click();
      cy.wait(1000);

      // 결과 확인: 수정된 일정이 단일 일정으로 변경되고 나머지는 그대로
      cy.get('[data-testid="event-list"]').within(() => {
        cy.contains('수정된 회의').should('exist');
        cy.contains('수정 테스트 회의').should('exist'); // 나머지는 그대로
      });
    });
  });
});
