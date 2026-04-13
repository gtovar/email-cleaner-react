// tests/SuggestionsList.test.jsx
import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SuggestionsList from '../src/components/SuggestionsList.jsx';

// Mock the API module
vi.mock('../src/services/api.js', () => ({
  getSuggestions: vi.fn(),
  confirmAction: vi.fn(),
}));

describe('SuggestionsList', () => {
  const mockEmails = [
    {
      id: 'email-1',
      subject: 'Correo de prueba',
      from: 'test@example.com',
      date: new Date('2025-01-01').toISOString(),
    },
  ];

  beforeEach(async () => {
    const { getSuggestions, confirmAction } = await import('../src/services/api.js');
    getSuggestions.mockReset();
    confirmAction.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    vi.clearAllMocks();
  });

  test('shows skeletons while data is loading', async () => {
    const { getSuggestions } = await import('../src/services/api.js');
    // Promise we resolve later to observe the loading state
    let resolvePromise;
    const pending = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    getSuggestions.mockReturnValueOnce(pending);

    render(<SuggestionsList />);

    // At the beginning skeletons should be visible
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);

    // Resolve as empty list
    resolvePromise([]);

    await waitFor(() => {
      expect(document.querySelectorAll('.animate-pulse').length).toBe(0);
    });
  });

  test('shows empty-state when there are no suggestions', async () => {
    const { getSuggestions } = await import('../src/services/api.js');
    getSuggestions.mockResolvedValueOnce([]);

    render(<SuggestionsList />);

    await waitFor(() => {
      expect(screen.getByText('All caught up!')).toBeInTheDocument();
    });
  });

  test('shows an error message when getSuggestions fails', async () => {
    const { getSuggestions } = await import('../src/services/api.js');
    getSuggestions.mockRejectedValueOnce(new Error('Fallo el backend'));

    render(<SuggestionsList />);

    await waitFor(() => {
      expect(
        screen.getByText('Fallo el backend')
      ).toBeInTheDocument();
    });
  });

  test('renders a suggestion and allows accepting the action', async () => {
    const { getSuggestions, confirmAction } = await import('../src/services/api.js');
    getSuggestions.mockResolvedValueOnce(mockEmails);
    confirmAction.mockResolvedValueOnce({});

    render(<SuggestionsList />);

    // Wait until the suggestion is rendered
    await waitFor(() => {
      expect(
        screen.getByText('Correo de prueba')
      ).toBeInTheDocument();
    });

    // There must be an "Aceptar" button
    const acceptButton = screen.getByRole('button', { name: 'Aceptar' });
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(confirmAction).toHaveBeenCalledWith(['email-1'], 'accept');
    });

    await waitFor(
      () => {
        expect(screen.queryByText('Correo de prueba')).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
