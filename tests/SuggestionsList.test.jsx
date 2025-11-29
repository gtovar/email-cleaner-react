// tests/SuggestionsList.test.jsx
import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SuggestionsList from '../src/components/SuggestionsList.jsx';
import * as api from '../src/services/api.js';

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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('shows "Cargando..." while data is loading', async () => {
    const { getSuggestions } = await import('../src/services/api.js');
    // Promise we resolve later to observe the loading state
    let resolvePromise;
    const pending = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    getSuggestions.mockReturnValueOnce(pending);

    render(<SuggestionsList />);

    // At the beginning "Cargando..." should be visible
    expect(
      screen.getByText('Cargando...', { exact: false })
    ).toBeInTheDocument();

    // Resolve as empty list
    resolvePromise([]);

    await waitFor(() => {
      // "Cargando..." should no longer be visible
      expect(
        screen.queryByText('Cargando...', { exact: false })
      ).not.toBeInTheDocument();
    });
  });

  test('shows empty-state when there are no suggestions', async () => {
    const { getSuggestions } = await import('../src/services/api.js');
    getSuggestions.mockResolvedValueOnce([]);

    render(<SuggestionsList />);

    await waitFor(() => {
      expect(
        screen.getByText('No hay sugerencias disponibles por el momento.')
      ).toBeInTheDocument();
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

    // ConfirmButton calls confirmAction and then handleActionSuccess
    await waitFor(() => {
      // API called with the correct id and action
      expect(confirmAction).toHaveBeenCalledWith(['email-1'], 'accept');
      // The email should be removed from the list
      expect(
        screen.queryByText('Correo de prueba')
      ).not.toBeInTheDocument();
      // And the success message built by handleActionSuccess should appear
      expect(
        screen.getByText(/Acción "accept" confirmada para el correo email-1/)
      ).toBeInTheDocument();
    });
  });
});

