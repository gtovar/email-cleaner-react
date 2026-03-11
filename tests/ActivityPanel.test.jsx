import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ActivityPanel from '../src/components/activity/ActivityPanel.jsx';

vi.mock('../src/services/api.js', () => ({
  getSummary: vi.fn(),
}));

describe('ActivityPanel', () => {
  beforeEach(async () => {
    const { getSummary } = await import('../src/services/api.js');
    getSummary.mockReset();
    getSummary.mockResolvedValue({
      totalSuggestions: 1,
      totalConfirmed: 0,
      totalEvents: 1,
      suggestedActions: { archive: 1 },
      confirmedActions: {},
      classifications: { bulk: 1 }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders SummaryPanel inside the drawer and forwards panel actions', async () => {
    const onNavigate = vi.fn();
    const onLogout = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <ActivityPanel
        open
        onOpenChange={onOpenChange}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Resumen')).toBeInTheDocument();
      expect(screen.getByText('Total suggestions')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Ajustes' }));
    expect(onNavigate).toHaveBeenCalledWith('settings');

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
