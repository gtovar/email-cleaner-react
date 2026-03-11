import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SettingsPage from '../src/pages/SettingsPage.jsx';

describe('SettingsPage', () => {
  test('renders the main account, notification, and security sections', () => {
    render(<SettingsPage />);

    expect(screen.getByRole('heading', { name: 'Ajustes' })).toBeInTheDocument();
    expect(screen.getByText('Cuenta')).toBeInTheDocument();
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    expect(screen.getByText('Seguridad')).toBeInTheDocument();

    expect(screen.getByLabelText('Correo principal')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre visible')).toBeInTheDocument();
    expect(screen.getByLabelText('Password actual')).toBeInTheDocument();
    expect(screen.getByLabelText('Password nueva')).toBeInTheDocument();
  });

  test('renders the notification and security toggles with the expected defaults', () => {
    const { container } = render(<SettingsPage />);

    const switches = Array.from(container.querySelectorAll('button[role="switch"]'));
    expect(switches).toHaveLength(4);

    expect(switches[0]).toHaveAttribute('aria-checked', 'false');
    expect(switches[1]).toHaveAttribute('aria-checked', 'false');
    expect(switches[2]).toHaveAttribute('aria-checked', 'true');
    expect(switches[3]).toHaveAttribute('aria-checked', 'false');
  });
});
