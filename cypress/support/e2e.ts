// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

const API_BASE_URL = Cypress.env('apiBaseUrl');

// 초기 데이터 
const INITIAL_EVENTS = [
  {
    id: '1',
    title: '기존 회의',
    date: '2025-11-07',
    startTime: '09:00',
    endTime: '10:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

// Cypress 테스트 데이터베이스를 초기 데이터로 리셋
const resetToInitialData = () => {
  // 현재 모든 이벤트 삭제
  cy.request('GET', `${API_BASE_URL}/api/events`).then((response) => {
    const events = response.body.events || [];

    // 각 이벤트를 개별적으로 삭제
    events.forEach((event: any) => {
      cy.request('DELETE', `${API_BASE_URL}/api/events/${event.id}`);
    });
  });

  // 초기 데이터 다시 생성
  INITIAL_EVENTS.forEach((event) => {
    cy.request('POST', `${API_BASE_URL}/api/events`, event);
  });
};

beforeEach(() => {
  resetToInitialData();
});

Cypress.Commands.add('addEvent' as any, (eventData: any) => {
  return cy.request('POST', `${API_BASE_URL}/api/events`, eventData);
});

Cypress.Commands.add('addEvents' as any, (events: any[]) => {
  return cy.request('POST', `${API_BASE_URL}/api/events-list`, { events });
});

Cypress.Commands.add('updateEvent' as any, (eventId: string, eventData: any) => {
  return cy.request('PUT', `${API_BASE_URL}/api/events/${eventId}`, eventData);
});

Cypress.Commands.add('deleteEvent' as any, (eventId: string) => {
  return cy.request('DELETE', `${API_BASE_URL}/api/events/${eventId}`);
});

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      addEvent(eventData: any): Chainable<any>;
      addEvents(events: any[]): Chainable<any>;
      updateEvent(eventId: string, eventData: any): Chainable<any>;
      deleteEvent(eventId: string): Chainable<any>;
    }
  }
}
