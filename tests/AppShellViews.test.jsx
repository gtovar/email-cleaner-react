import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../src/App.jsx';

vi.mock('../src/services/api.js', () => ({
  API_ORIGIN: 'http://localhost:3000',
  getAuthMe: vi.fn(),
  logout: vi.fn(),
  onAuthExpired: vi.fn(),
  getSuggestions: vi.fn(),
  confirmAction: vi.fn(),
  getHistory: vi.fn(),
  getSummary: vi.fn(),
  getEmails: vi.fn(),
  runInboxAction: vi.fn(),
}));

describe('App shell view mounting', () => {
  beforeEach(async () => {
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

    getAuthMe.mockResolvedValue({ authenticated: true, email: 'user@example.com' });
    getSuggestions.mockResolvedValue([]);
    getHistory.mockResolvedValue([]);
    getSummary.mockResolvedValue({
      totalSuggestions: 0,
      totalConfirmed: 0,
      totalEvents: 0,
      suggestedActions: {},
      confirmedActions: {},
      classifications: {},
    });
    getEmails.mockResolvedValue({
      emails: [],
      total: 0,
      nextPageToken: null,
    });
    runInboxAction.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
    window.history.pushState(null, '', '/');
    document.body.innerHTML = '';
  });

  test('mounts InboxPage from the authenticated app shell', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    expect(
      screen.getByRole('heading', { name: 'Cola guiada de decisiones' })
    ).toBeInTheDocument();
    expect(screen.getByText('Empieza aqui')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Inbox/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Inbox' })).toBeInTheDocument();
      expect(screen.getByText('Revision manual y contexto completo')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Usa esta vista cuando necesites leer el correo completo, revisar contexto adicional o ejecutar una accion manual fuera de la cola guiada.'
        )
      ).toBeInTheDocument();
    });
  });

  test('mounts SettingsPage from the activity drawer', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ajustes' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Ajustes' })).toBeInTheDocument();
      expect(
        screen.getByText(
          'Esta pantalla solo muestra preferencias coherentes con el flujo actual de revision. No administra password, perfil ni seguridad avanzada.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Lo que esta fuera de alcance aqui')).toBeInTheDocument();
    });
  });
});
