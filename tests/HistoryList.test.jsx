// tests/HistoryList.test.jsx
import React from 'react';
import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import HistoryList from '../src/components/HistoryList.jsx';

// Mock API module used by HistoryList
vi.mock('../src/services/api.js', () => ({
  getHistory: vi.fn(),
  confirmAction: vi.fn(),
}));

describe('HistoryList', () => {
  beforeEach(async () => {
    const { getHistory, confirmAction } = await import('../src/services/api.js');
    getHistory.mockReset();
    confirmAction.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    vi.clearAllMocks();
  });

  test('shows "Cargando..." on first render', async () => {
    const { getHistory } = await import('../src/services/api.js');

    let resolveHistory;
    const pendingPromise = new Promise((resolve) => {
      resolveHistory = resolve;
    });

    // Leave the promise pending to observe the loading state
    getHistory.mockReturnValueOnce(pendingPromise);

    render(<HistoryList />);

    // While the promise is pending, the real loading message must be visible
    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    // Now resolve the promise so the component can finish loading
    resolveHistory([]);

    await waitFor(() => {
      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    });
  });

  test('shows empty-state when there are no actions', async () => {
    const { getHistory } = await import('../src/services/api.js');

    // getHistory returns an empty array
    getHistory.mockResolvedValueOnce([]);

    render(<HistoryList />);

    await waitFor(() => {
      expect(
        screen.getByText('No hay acciones registradas todavía.')
      ).toBeInTheDocument();
    });
  });

  test('shows an error message when getHistory fails', async () => {
    const { getHistory } = await import('../src/services/api.js');

    getHistory.mockRejectedValueOnce(new Error('Fallo el backend'));

    render(<HistoryList />);

    await waitFor(() => {
      // HistoryList forwards err.message to StatusMessage,
      // so we look for the text "Fallo el backend"
      expect(screen.getByText('Fallo el backend')).toBeInTheDocument();
    });
  });

  test('pagination: allows going to the next page and repeating an action', async () => {
    const { getHistory, confirmAction } = await import('../src/services/api.js');

    // HistoryList uses perPage = 20
    const page1 = Array.from({ length: 20 }).map((_, index) => ({
      id: `h-${index + 1}`,
      emailId: `email-${index + 1}`,
      action: 'accept',
      timestamp: new Date('2025-01-01T00:00:00.000Z').toISOString(),
      ids: [`email-${index + 1}`],
    }));

    const page2 = [
      {
        id: 'h-21',
        emailId: 'email-21',
        action: 'reject',
        timestamp: new Date('2025-01-02T00:00:00.000Z').toISOString(),
        ids: ['email-21'],
      },
    ];

    // First call: page 1
    // Second call: page 2
    getHistory
      .mockResolvedValueOnce(page1)
      .mockResolvedValueOnce(page2);

    confirmAction.mockResolvedValueOnce({
      success: true,
      processed: 1,
      ids: ['email-21'],
      action: 'reject',
    });

    render(<HistoryList />);

    // Initial load
    await waitFor(() => {
      expect(getHistory).toHaveBeenCalledTimes(1);
    });

    // Page 1: "Página anterior" disabled, "Página siguiente" enabled
    expect(
      screen.getByRole('button', { name: 'Página anterior' }),
    ).toBeDisabled();

    expect(
      screen.getByRole('button', { name: 'Página siguiente' }),
    ).toBeEnabled();

    expect(screen.getByText('Página 1')).toBeInTheDocument();

    // Go to page 2
    fireEvent.click(
      screen.getByRole('button', { name: 'Página siguiente' }),
    );

    await waitFor(() => {
      expect(getHistory).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Página 2')).toBeInTheDocument();
    });

    // On page 2 there must be a "Repetir acción" button
    const repeatButton = screen.getByRole('button', { name: 'Repetir acción' });

    fireEvent.click(repeatButton);

    await waitFor(() => {
      expect(confirmAction).toHaveBeenCalledWith(['email-21'], 'reject');

      // The component builds the message like:
      // `✅ Acción "reject" repetida para email-21`
      expect(
        screen.getByText(/Acción "reject" repetida para email-21/)
      ).toBeInTheDocument();
    });
  });
});
