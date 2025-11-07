declare global {
  namespace Cypress {
    interface Chainable {
      resetToEmptyData(): Chainable<void>;
      resetToInitialData(): Chainable<void>;
    }
  }
}

export {};
