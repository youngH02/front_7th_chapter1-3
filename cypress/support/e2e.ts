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

// Cypress 테스트 데이터베이스 초기화 함수
const resetDatabase = () => {
  cy.request('GET', `${API_BASE_URL}/api/events`).then((response) => {
    const events = response.body.events || [];

    // 각 이벤트를 개별적으로 삭제
    events.forEach((event: any) => {
      cy.request('DELETE', `${API_BASE_URL}/api/events/${event.id}`);
    });
  });
};

beforeEach(() => {
  resetDatabase();
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
