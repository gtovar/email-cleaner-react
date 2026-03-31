import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SettingsPage from '../src/pages/SettingsPage.jsx';

describe('SettingsPage', () => {
  test('renders only settings aligned with the current product scope', () => {
    render(<SettingsPage />);

    expect(screen.getByRole('heading', { name: /Ajustes/i })).toBeInTheDocument();
    expect(screen.getByText('Revisión guiada')).toBeInTheDocument();
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    expect(screen.getByText('Gestión de Cuenta')).toBeInTheDocument();

    expect(screen.queryByText('Cuenta')).not.toBeInTheDocument();
    expect(screen.queryByText('Seguridad')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Correo principal')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Password actual')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Password nueva')).not.toBeInTheDocument();
  });

  test('renders only the local workflow toggles with the expected defaults', () => {
    const { container } = render(<SettingsPage />);

    const switches = Array.from(container.querySelectorAll('button[role="switch"]'));
    expect(switches).toHaveLength(6);

    expect(switches[0]).toHaveAttribute('aria-checked', 'false');
    expect(switches[1]).toHaveAttribute('aria-checked', 'true');
    expect(switches[2]).toHaveAttribute('aria-checked', 'true');
    expect(switches[3]).toHaveAttribute('aria-checked', 'true');
    expect(switches[4]).toHaveAttribute('aria-checked', 'true');
    expect(switches[5]).toHaveAttribute('aria-checked', 'true');
  });
});
