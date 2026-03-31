import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SummaryPanel from '../src/components/SummaryPanel.jsx';

vi.mock('../src/services/api.js', () => ({
  getSummary: vi.fn(),
}));

describe('SummaryPanel', () => {
  beforeEach(async () => {
    const { getSummary } = await import('../src/services/api.js');
    getSummary.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  test('shows loading state and renders daily summary data', async () => {
    const { getSummary } = await import('../src/services/api.js');

    let resolveSummary;
    const pending = new Promise((resolve) => {
      resolveSummary = resolve;
    });
    getSummary.mockReturnValueOnce(pending);

    render(<SummaryPanel />);

    render(<SummaryPanel />);

    resolveSummary({
      totalSuggestions: 4,
      totalConfirmed: 1,
      totalEvents: 2,
      suggestedActions: { archive: 3, delete: 1 },
      confirmedActions: { accept: 1 },
      classifications: { bulk: 2 }
    });

    await waitFor(() => {
      expect(screen.getByText('Sugerencias')).toBeInTheDocument();
      expect(screen.getAllByText('4').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('archive')).toBeInTheDocument();
      expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('accept')).toBeInTheDocument();
      expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('bulk')).toBeInTheDocument();
      expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
    });

    expect(getSummary).toHaveBeenCalledWith('daily');
    expect(screen.getAllByText(/Ventana: ultimas 24 horas/i).length).toBeGreaterThanOrEqual(1);
  });

  test('switches to weekly and reloads summary', async () => {
    const { getSummary } = await import('../src/services/api.js');

    getSummary
      .mockResolvedValueOnce({
        totalSuggestions: 2,
        totalConfirmed: 0,
        totalEvents: 1,
        suggestedActions: { archive: 2 },
        confirmedActions: {},
        classifications: { promotions_old: 2 }
      })
      .mockResolvedValueOnce({
        totalSuggestions: 7,
        totalConfirmed: 3,
        totalEvents: 5,
        suggestedActions: { delete: 7 },
        confirmedActions: { accept: 3 },
        classifications: { stale_unread: 7 }
      });

    render(<SummaryPanel />);

    await waitFor(() => {
      expect(screen.getByText('archive')).toBeInTheDocument();
      expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
    });

    fireEvent.click(screen.getByRole('button', { name: '7 dias' }));

    await waitFor(() => {
      expect(getSummary).toHaveBeenLastCalledWith('weekly');
      expect(screen.getByText('Ventana: ultimos 7 dias')).toBeInTheDocument();
      expect(screen.getByText('delete')).toBeInTheDocument();
      expect(screen.getAllByText('7').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('accept')).toBeInTheDocument();
      expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('stale unread')).toBeInTheDocument();
      expect(screen.getAllByText('7').length).toBeGreaterThanOrEqual(1);
    });
  });

  test('shows an error message when summary loading fails', async () => {
    const { getSummary } = await import('../src/services/api.js');
    getSummary.mockRejectedValueOnce(new Error('Summary failed'));

    render(<SummaryPanel />);

    await waitFor(() => {
      expect(screen.getByText('Summary failed')).toBeInTheDocument();
    });
  });

  test('shows No data sections when summary collections are empty', async () => {
    const { getSummary } = await import('../src/services/api.js');
    getSummary.mockResolvedValueOnce({
      totalSuggestions: 0,
      totalConfirmed: 0,
      totalEvents: 0,
      suggestedActions: {},
      confirmedActions: {},
      classifications: {}
    });

    render(<SummaryPanel />);

    await waitFor(() => {
      expect(screen.getByText('Sin actividad reciente')).toBeInTheDocument();
      expect(screen.getByText('Sin decisiones registradas')).toBeInTheDocument();
      expect(screen.getByText('No hay patrones detectados')).toBeInTheDocument();
    });
  });
});
