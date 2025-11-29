// tests/integration/confirmActionFlow.test.jsx
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
  within,
} from '@testing-library/react';

import App from '../../src/App.jsx';

// Mock de toda la capa de API usada por el flujo completo
vi.mock('../../src/services/api.js', () => ({
  getSuggestions: vi.fn(),
  confirmAction: vi.fn(),
  getHistory: vi.fn(),
}));

describe('Flujo integración: sugerencias → confirmación → historial', () => {
  beforeEach(async () => {
    const {
      getSuggestions,
      confirmAction,
      getHistory,
    } = await import('../../src/services/api.js');

    getSuggestions.mockReset();
    confirmAction.mockReset();
    getHistory.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('usuario acepta una sugerencia y luego ve el historial con posibilidad de repetir acción', async () => {
    const {
      getSuggestions,
      confirmAction,
      getHistory,
    } = await import('../../src/services/api.js');

    // 1) Mock de sugerencias iniciales
    getSuggestions.mockResolvedValueOnce([
      {
        id: 'email-1',
        subject: 'Prueba HU14',
        snippet: 'Demo de flujo integrado',
        suggestedAction: 'accept',
      },
    ]);

    // 2) Mock de confirmación de acción (desde SuggestionsList / ConfirmButton)
    confirmAction.mockResolvedValueOnce({
      success: true,
      processed: 1,
      ids: ['email-1'],
      action: 'accept',
    });

    // 3) Mock del historial cuando el usuario abre la pestaña de Historial
    getHistory.mockResolvedValueOnce([
      {
        id: 'h-1',
        emailId: 'email-1',
        action: 'accept',
        timestamp: new Date('2025-01-03T00:00:00.000Z').toISOString(),
        ids: ['email-1'],
      },
    ]);

    render(<App />);

    // Paso A: se cargan las sugerencias
    await waitFor(() => {
      expect(getSuggestions).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Prueba HU14')).toBeInTheDocument();
    });

    // Paso B: el usuario hace clic en "Aceptar"
    const acceptButton = screen.getByRole('button', { name: 'Aceptar' });
    fireEvent.click(acceptButton);

    // Confirmamos que se llamó confirmAction y que aparece el StatusMessage correcto
    await waitFor(() => {
      expect(confirmAction).toHaveBeenCalledWith(['email-1'], 'accept');

      // En el código: `✅ Acción "accept" confirmada para el correo email-1`
      // Usamos regex para ignorar el emoji y no exigir punto final
      expect(
        screen.getByText(/Acción "accept" confirmada para el correo email-1/)
      ).toBeInTheDocument();
    });

    // Paso C: el usuario se mueve a la vista de historial
    // Modelamos explícitamente que usa el botón del HEADER (role="banner")
    const header = screen.getByRole('banner');
    const historyTab = within(header).getByRole('button', { name: 'Historial' });
    fireEvent.click(historyTab);

    await waitFor(() => {
      expect(getHistory).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Historial de acciones')).toBeInTheDocument();
      expect(screen.getByText('email-1')).toBeInTheDocument();
    });

    // Paso D: el usuario hace clic en "Repetir acción" desde el historial
    confirmAction.mockResolvedValueOnce({
      success: true,
      processed: 1,
      ids: ['email-1'],
      action: 'accept',
    });

    const repeatButton = screen.getByRole('button', { name: 'Repetir acción' });
    fireEvent.click(repeatButton);

    await waitFor(() => {
      expect(confirmAction).toHaveBeenCalledTimes(2);

      // HistoryList usa: `✅ Acción "accept" repetida para email-1`
      expect(
        screen.getByText(/Acción "accept" repetida para email-1/)
      ).toBeInTheDocument();
    });
  });
});

