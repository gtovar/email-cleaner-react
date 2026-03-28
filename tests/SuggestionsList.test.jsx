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
      snippet: 'Resumen corto del correo de prueba para tomar una decision con contexto.',
      suggestions: [
        {
          action: 'archive',
          classification: 'repeated_low_value',
          confidence_score: 0.93,
          reason: 'Remitente recurrente con baja interaccion',
        },
      ],
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

    expect(screen.getByText('Sugerencia')).toBeInTheDocument();
    expect(screen.getByText('Archivar')).toBeInTheDocument();
    expect(screen.getByText('Remitente recurrente con baja interaccion')).toBeInTheDocument();
    expect(screen.getByText('Alta confianza')).toBeInTheDocument();
    expect(screen.getByText('93%')).toBeInTheDocument();
    expect(screen.getAllByText('Baja sensibilidad').length).toBeGreaterThan(0);
    expect(screen.getByText('Resumen corto del correo de prueba para tomar una decision con contexto.')).toBeInTheDocument();
    expect(
      screen.getByText('Si apruebas, este correo se archivara y quedara registrado.')
    ).toBeInTheDocument();

    const acceptButton = screen.getByRole('button', { name: 'Aprobar archivar' });
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

  test('shows a generic guided decision when suggestion data is minimal', async () => {
    const { getSuggestions } = await import('../src/services/api.js');
    getSuggestions.mockResolvedValueOnce([
      {
        id: 'email-2',
        subject: 'Otro correo',
        from: 'sender@example.com',
        date: new Date('2025-02-01').toISOString(),
      },
    ]);

    render(<SuggestionsList />);

    await waitFor(() => {
      expect(screen.getByText('Otro correo')).toBeInTheDocument();
    });

    expect(screen.getByText('Revisar y decidir')).toBeInTheDocument();
    expect(
      screen.getByText('La sugerencia se genero a partir del patron detectado para este correo.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Si apruebas, se aplicara la accion sugerida y quedara registrada.')
    ).toBeInTheDocument();
  });

  test('orders emails by review priority and exposes richer context when expanded', async () => {
    const { getSuggestions } = await import('../src/services/api.js');
    getSuggestions.mockResolvedValueOnce([
      {
        id: 'email-low',
        subject: 'Boletin semanal',
        from: 'boletin@example.com',
        date: new Date('2025-02-01').toISOString(),
        snippet: 'Resumen semanal sin tareas pendientes.',
        suggestions: [
          {
            action: 'archive',
            classification: 'repeated_low_value',
            confidence_score: 0.92,
            reason: 'Boletin repetitivo.',
          },
        ],
      },
      {
        id: 'email-high',
        subject: 'Recibo de agua',
        from: 'billing@example.com',
        date: new Date('2025-02-02').toISOString(),
        snippet: 'Recibo con fecha limite y monto detectados.',
        suggestions: [
          {
            action: 'review',
            classification: 'receipt_manual_review',
            confidence_score: 0.96,
            reason: 'Caso especializado que requiere validacion humana.',
          },
        ],
      },
    ]);

    render(<SuggestionsList />);

    await waitFor(() => {
      expect(screen.getByText('Recibo de agua')).toBeInTheDocument();
      expect(screen.getByText('Boletin semanal')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Decision guiada').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Alta prioridad')).toBeInTheDocument();

    const subjects = screen
      .getAllByText(/Recibo de agua|Boletin semanal/)
      .map((node) => node.textContent);
    expect(subjects[0]).toBe('Recibo de agua');

    fireEvent.click(screen.getAllByRole('button', { name: 'Ver contexto' })[0]);

    await waitFor(() => {
      expect(screen.getByText('Tipo detectado')).toBeInTheDocument();
      expect(screen.getByText('Caso especializado de recibo')).toBeInTheDocument();
      expect(screen.getByText('Prioridad de revision')).toBeInTheDocument();
      expect(screen.getByText('Evidencia del sistema')).toBeInTheDocument();
    });
  });
});
