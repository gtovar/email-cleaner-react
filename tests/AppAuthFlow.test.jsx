import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import App from '../src/App.jsx';

let authExpiredHandler = null;

vi.mock('../src/services/api.js', () => ({
  API_ORIGIN: 'http://localhost:3000',
  getAuthMe: vi.fn(),
  logout: vi.fn(),
  onAuthExpired: vi.fn((handler) => {
    authExpiredHandler = handler;
  }),
  getSuggestions: vi.fn(),
  confirmAction: vi.fn(),
  getHistory: vi.fn(),
  getSummary: vi.fn(),
  getEmails: vi.fn(),
  runInboxAction: vi.fn(),
}));

describe('App auth callback and session expiry flow', () => {
  let replaceStateSpy;

  beforeEach(async () => {
    authExpiredHandler = null;
    replaceStateSpy = vi.spyOn(window.history, 'replaceState');

    const {
      getAuthMe,
      getSuggestions,
      getHistory,
      getSummary,
      getEmails,
      logout,
      runInboxAction,
    } = await import('../src/services/api.js');

    getAuthMe.mockReset();
    getSuggestions.mockReset();
    getHistory.mockReset();
    getSummary.mockReset();
    getEmails.mockReset();
    logout.mockReset();
    runInboxAction.mockReset();

    getSuggestions.mockResolvedValue([]);
    getHistory.mockResolvedValue([]);
    getSummary.mockResolvedValue({
      totalSuggestions: 0,
      totalConfirmed: 0,
      totalEvents: 0,
      suggestedActions: {},
      confirmedActions: {},
      classifications: {}
    });
    getEmails.mockResolvedValue({
      emails: [],
      total: 0,
      nextPageToken: null,
    });
    runInboxAction.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    replaceStateSpy.mockRestore();
    vi.clearAllMocks();
    window.history.pushState(null, '', '/');
    document.body.innerHTML = '';
  });

  test('handles successful /auth/callback by syncing auth state and clearing the callback URL', async () => {
    const { getAuthMe } = await import('../src/services/api.js');
    getAuthMe.mockResolvedValue({ authenticated: true, email: 'user@example.com' });

    window.history.pushState(null, '', '/auth/callback');

    render(<App />);

    await waitFor(() => {
      expect(getAuthMe).toHaveBeenCalled();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Historial' })).toBeInTheDocument();
    });

    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/');
  });

  test('handles /auth/callback error by returning to login with a visible message', async () => {
    const { getAuthMe } = await import('../src/services/api.js');
    getAuthMe.mockResolvedValue({ authenticated: false });

    window.history.pushState(null, '', '/auth/callback?error=access_denied');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Google sign-in failed. Please try again.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument();
    });

    expect(getAuthMe).not.toHaveBeenCalled();
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/login');
  });

  test('moves the user back to login when the auth expiry handler fires', async () => {
    const { getAuthMe, onAuthExpired } = await import('../src/services/api.js');
    getAuthMe.mockResolvedValue({ authenticated: true, email: 'user@example.com' });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    expect(onAuthExpired).toHaveBeenCalledTimes(1);
    expect(typeof authExpiredHandler).toBe('function');

    await act(async () => {
      authExpiredHandler();
    });

    await waitFor(() => {
      expect(
        screen.getByText('Your previous session ended. Continue with Google to reopen your workspace.')
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument();
    });
  });
});
