declare global {
  namespace Cypress {
    interface Chainable {
      resetToEmptyData(): Chainable<any>;
      resetToInitialData(): Chainable<any>;
    }
  }
}

export {};
