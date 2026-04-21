// Jest setup provided by Grafana scaffolding
import './.config/jest-setup';
import '@testing-library/jest-dom';

// jest-environment-jsdom@29 removed setImmediate; polyfill for tests that rely on it
if (typeof globalThis.setImmediate === 'undefined') {
  globalThis.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
  globalThis.clearImmediate = (id) => clearTimeout(id);
}
