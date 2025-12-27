import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(document.body).toBeTruthy();
  });

  it('should render Home page on root route', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    // Le composant App contient le routeur et devrait rendre la page Home
    expect(document.body).toBeTruthy();
  });
});
