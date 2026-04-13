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

    expect(screen.getByText('Loading summary...')).toBeInTheDocument();

    resolveSummary({
      totalSuggestions: 4,
      totalConfirmed: 1,
      totalEvents: 2,
      suggestedActions: { archive: 3, delete: 1 },
      confirmedActions: { accept: 1 },
      classifications: { bulk: 2 }
    });

    await waitFor(() => {
      expect(screen.getByText('Total suggestions')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('archive: 3')).toBeInTheDocument();
      expect(screen.getByText('accept: 1')).toBeInTheDocument();
      expect(screen.getByText('bulk: 2')).toBeInTheDocument();
    });

    expect(getSummary).toHaveBeenCalledWith('daily');
    expect(screen.getByText('Window: 24 hours')).toBeInTheDocument();
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
      expect(screen.getByText('archive: 2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'Weekly' })[0]);

    await waitFor(() => {
      expect(getSummary).toHaveBeenLastCalledWith('weekly');
      expect(screen.getByText('Window: 7 days')).toBeInTheDocument();
      expect(screen.getByText('delete: 7')).toBeInTheDocument();
      expect(screen.getByText('accept: 3')).toBeInTheDocument();
      expect(screen.getByText('stale_unread: 7')).toBeInTheDocument();
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
      expect(screen.getAllByText('No data').length).toBeGreaterThanOrEqual(3);
    });
  });
});
