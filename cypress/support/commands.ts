/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom commands for event management
const API_BASE_URL = Cypress.env('apiBaseUrl');
// 초기 데이터

const INITIAL_EVENT_DATE = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
const INITIAL_EVENTS = [
  {
    id: '1',
    title: '기존 회의',
    date: INITIAL_EVENT_DATE,
    startTime: '09:00',
    endTime: '10:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

Cypress.Commands.add('resetToEmptyData' as any, () => {
  cy.request('GET', `${API_BASE_URL}/api/events`).then((response) => {
    const events = response.body.events || [];

    events.forEach((event: any) => {
      cy.request('DELETE', `${API_BASE_URL}/api/events/${event.id}`);
    });
  });
});

Cypress.Commands.add('resetToInitialData' as any, () => {
  // 모든 이벤트 삭제
  cy.request('GET', `${API_BASE_URL}/api/events`).then((response) => {
    const events = response.body.events || [];

    events.forEach((event: any) => {
      cy.request('DELETE', `${API_BASE_URL}/api/events/${event.id}`);
    });
  });

  INITIAL_EVENTS.forEach((event) => {
    cy.request('POST', `${API_BASE_URL}/api/events`, event);
  });
});
