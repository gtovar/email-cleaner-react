// tests/ConfirmButton.test.jsx
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
  cleanup,
} from '@testing-library/react';
import ConfirmButton from '../src/components/ConfirmButton.jsx';
import { confirmAction } from '../src/services/api.js';

// Mock the whole API module used by ConfirmButton
vi.mock('../src/services/api.js', () => ({
  confirmAction: vi.fn(),
}));

let consoleErrorSpy;

beforeEach(() => {
  // Reset API mock and silence console noise before each test
  confirmAction.mockReset();
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // Ensure clean DOM and mocks between tests
  cleanup();
  vi.clearAllMocks();

  if (consoleErrorSpy) {
    consoleErrorSpy.mockRestore();
  }
});

describe('ConfirmButton', () => {
  test('disables the button while loading and shows "..."', async () => {
    confirmAction.mockResolvedValueOnce({});

    render(
      <ConfirmButton
        emailId="mail-1"
        action="accept"
        onSuccess={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: 'Aceptar' });
    expect(button).toBeEnabled();

    fireEvent.click(button);

    // After click it should be disabled and show "..."
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('...');

    await waitFor(() => {
      expect(confirmAction).toHaveBeenCalledTimes(1);
      expect(button).toBeEnabled();
    });
  });

  test('calls onSuccess when confirmAction resolves OK', async () => {
    confirmAction.mockResolvedValueOnce({});

    const onSuccess = vi.fn();

    render(
      <ConfirmButton
        emailId="mail-2"
        action="reject"
        onSuccess={onSuccess}
      />
    );

    const button = screen.getByRole('button', { name: 'Rechazar' });

    fireEvent.click(button);

    await waitFor(() => {
      expect(confirmAction).toHaveBeenCalledWith(['mail-2'], 'reject');
      expect(onSuccess).toHaveBeenCalledWith('mail-2', 'reject');
    });
  });

  test('shows an error message when confirmAction throws', async () => {
    const fakeError = new Error('Backend caído');
    confirmAction.mockRejectedValueOnce(fakeError);

    render(
      <ConfirmButton
        emailId="mail-3"
        action="accept"
        onSuccess={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: 'Aceptar' });
    fireEvent.click(button);

    await waitFor(() => {
      // Accept either the real error message or the component fallback
      const errorNode =
        screen.queryByText('Backend caído') ||
        screen.queryByText('Error al confirmar la acción');

      expect(errorNode).not.toBeNull();
    });
  });
});

