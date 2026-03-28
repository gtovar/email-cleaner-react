import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import InboxList from '../src/components/InboxList.jsx';

vi.mock('../src/services/api.js', () => ({
  getEmails: vi.fn(),
  runInboxAction: vi.fn(),
  getEmailContent: vi.fn(),
  extractReceipt: vi.fn(),
  sendReceiptWhatsApp: vi.fn(),
}));

const { toastMock } = vi.hoisted(() => {
  const toastFn = vi.fn();
  toastFn.loading = vi.fn();
  toastFn.dismiss = vi.fn();
  toastFn.success = vi.fn();
  toastFn.error = vi.fn();
  toastFn.warning = vi.fn();
  return {
    toastMock: toastFn,
  };
});

vi.mock('sonner', () => ({
  toast: toastMock,
}));

function buildEmail({
  id,
  subject,
  isRead = false,
}) {
  return {
    id,
    from: 'Acme Corp <team@acme.test>',
    subject,
    snippet: 'Revenue summary attached.',
    date: '2026-03-09T18:30:00.000Z',
    isRead,
    hasSuggestion: false,
    reviewStatus: null,
    labels: ['INBOX'],
  };
}

function installMatchMedia(matches = false) {
  const listeners = new Set();

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches,
      media: '(max-width: 1023px)',
      onchange: null,
      addEventListener: (_event, handler) => listeners.add(handler),
      removeEventListener: (_event, handler) => listeners.delete(handler),
      addListener: (handler) => listeners.add(handler),
      removeListener: (handler) => listeners.delete(handler),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('InboxList', () => {
  beforeEach(async () => {
    installMatchMedia(false);

    const { getEmails } = await import('../src/services/api.js');
    getEmails.mockReset();
    const { runInboxAction } = await import('../src/services/api.js');
    runInboxAction.mockReset();
    const { getEmailContent, extractReceipt, sendReceiptWhatsApp } = await import('../src/services/api.js');
    getEmailContent.mockReset();
    extractReceipt.mockReset();
    sendReceiptWhatsApp.mockReset();
    toastMock.mockReset();
    toastMock.loading.mockReset();
    toastMock.dismiss.mockReset();
    toastMock.success.mockReset();
    toastMock.error.mockReset();
    toastMock.warning.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  test('renders the inbox empty state when there are no emails', async () => {
    const { getEmails } = await import('../src/services/api.js');
    getEmails.mockResolvedValue({
      emails: [],
      total: 0,
      nextPageToken: null,
    });

    render(<InboxList />);

    await waitFor(() => {
      expect(screen.getByText('Inbox en cero')).toBeInTheDocument();
      expect(
        screen.getByText('No encontramos correos para mostrar en este momento.')
      ).toBeInTheDocument();
    });
  });

  test('renders an error card when the email request fails', async () => {
    const { getEmails } = await import('../src/services/api.js');
    getEmails.mockRejectedValue(new Error('No se pudo cargar inbox'));

    render(<InboxList />);

    await waitFor(() => {
      expect(screen.getByText('No se pudo cargar inbox')).toBeInTheDocument();
    });
  });

  test('opens the mobile preview sheet when an email is selected on mobile', async () => {
    installMatchMedia(true);

    const { getEmails } = await import('../src/services/api.js');
    getEmails.mockResolvedValue({
      emails: [
        {
          id: 'email-1',
          from: 'Acme Corp <team@acme.test>',
          subject: 'Quarterly report',
          snippet: 'Revenue summary attached.',
          date: '2026-03-09T18:30:00.000Z',
          isRead: false,
          hasSuggestion: true,
          reviewStatus: null,
          labels: ['INBOX'],
        },
      ],
      total: 1,
      nextPageToken: null,
    });

    render(<InboxList />);

    await waitFor(() => {
      expect(screen.getByText('Quarterly report')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Quarterly report'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    });
  });

  test('applies the inbox-specific scroll area class so row actions stay visible', async () => {
    const { getEmails } = await import('../src/services/api.js');
    getEmails.mockResolvedValue({
      emails: [buildEmail({ id: 'email-1', subject: 'Quarterly report' })],
      total: 1,
      nextPageToken: null,
    });

    const { container } = render(<InboxList />);

    await waitFor(() => {
      expect(screen.getByText('Quarterly report')).toBeInTheDocument();
    });

    expect(container.querySelector('.inbox-list-scroll')).not.toBeNull();
  });

  test('archives a row email after confirmation and removes it from the list', async () => {
    const { getEmails, runInboxAction } = await import('../src/services/api.js');
    getEmails.mockResolvedValue({
      emails: [
        {
          id: 'email-1',
          from: 'Acme Corp <team@acme.test>',
          subject: 'Quarterly report',
          snippet: 'Revenue summary attached.',
          date: '2026-03-09T18:30:00.000Z',
          isRead: false,
          hasSuggestion: false,
          reviewStatus: null,
          labels: ['INBOX'],
        },
      ],
      total: 1,
      nextPageToken: null,
    });
    runInboxAction.mockResolvedValue({ ok: true });

    render(<InboxList />);

    await waitFor(() => {
      expect(screen.getByText('Quarterly report')).toBeInTheDocument();
    });

    const row = screen.getByTestId('inbox-row-email-1');
    fireEvent.click(within(row).getAllByRole('button', { name: 'Mostrar acciones' })[0]);
    fireEvent.click(within(row).getAllByRole('button', { name: 'Archivar' })[0]);

    await waitFor(() => {
      expect(screen.getByText('¿Archivar este correo?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Archivar correo' }));

    await waitFor(() => {
      expect(runInboxAction).toHaveBeenCalledWith(['email-1'], 'archive');
      expect(screen.queryByText('Quarterly report')).not.toBeInTheDocument();
    });
  });

  test('opens the receipt review dialog from the row action', async () => {
    const { getEmails, getEmailContent, extractReceipt } = await import('../src/services/api.js');
    getEmails.mockResolvedValue({
      emails: [buildEmail({ id: 'email-1', subject: 'Factura CFE marzo' })],
      total: 1,
      nextPageToken: null,
    });
    getEmailContent.mockResolvedValue({
      id: 'email-1',
      subject: 'Factura CFE marzo',
      from: 'CFE <facturas@cfe.mx>',
      body: 'Total a pagar: $350.50. Fecha limite de pago: 2026-03-25.',
      html: null,
    });
    extractReceipt.mockResolvedValue({
      amount: 350.5,
      due_date: '2026-03-25',
    });

    render(<InboxList />);

    await waitFor(() => {
      expect(screen.getByText('Factura CFE marzo')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Revisar recibo' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Revisar recibo' })).toBeInTheDocument();
    });

    expect(getEmailContent).toHaveBeenCalledWith('email-1');
    await waitFor(() => {
      expect(extractReceipt).toHaveBeenCalledWith({
        subject: 'Factura CFE marzo',
        body: 'Total a pagar: $350.50. Fecha limite de pago: 2026-03-25.',
        html: null,
      });
    });
  });

  test('marks an email as unread without confirmation and keeps it visible', async () => {
    const { getEmails, runInboxAction } = await import('../src/services/api.js');
    getEmails.mockResolvedValue({
      emails: [
        {
          id: 'email-1',
          from: 'Acme Corp <team@acme.test>',
          subject: 'Quarterly report',
          snippet: 'Revenue summary attached.',
          date: '2026-03-09T18:30:00.000Z',
          isRead: true,
          hasSuggestion: false,
          reviewStatus: null,
          labels: ['INBOX'],
        },
      ],
      total: 1,
      nextPageToken: null,
    });
    runInboxAction.mockResolvedValue({ ok: true });

    render(<InboxList />);

    await waitFor(() => {
      expect(screen.getByText('Quarterly report')).toBeInTheDocument();
    });

    const row = screen.getByTestId('inbox-row-email-1');
    fireEvent.click(within(row).getAllByRole('button', { name: 'Mostrar acciones' })[0]);
    fireEvent.click(within(row).getAllByRole('button', { name: 'Marcar no leído' })[0]);

    await waitFor(() => {
      expect(runInboxAction).toHaveBeenCalledWith(['email-1'], 'mark_unread');
    });

    expect(screen.queryByText('¿Archivar este correo?')).not.toBeInTheDocument();
    expect(screen.getByText('Quarterly report')).toBeInTheDocument();
  });

  test('does not reconcile row state when the backend returns execution none', async () => {
    const { getEmails, runInboxAction } = await import('../src/services/api.js');
    getEmails.mockResolvedValue({
      emails: [
        buildEmail({ id: 'email-1', subject: 'Quarterly report' }),
      ],
      total: 1,
      nextPageToken: null,
    });
    runInboxAction.mockResolvedValue({
      success: true,
      execution: 'none',
      action: 'archive',
      source: 'inbox',
      summary: {
        total: 1,
        processed: 0,
        failed: 1,
      },
      results: [{ emailId: 'email-1', status: 'error', reason: 'not_found' }],
    });

    render(<InboxList />);

    await waitFor(() => {
      expect(screen.getByText('Quarterly report')).toBeInTheDocument();
    });

    const row = screen.getByTestId('inbox-row-email-1');
    fireEvent.click(within(row).getAllByRole('button', { name: 'Mostrar acciones' })[0]);
    fireEvent.click(within(row).getAllByRole('button', { name: 'Archivar' })[0]);

    await waitFor(() => {
      expect(screen.getByText('¿Archivar este correo?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Archivar correo' }));

    await waitFor(() => {
      expect(runInboxAction).toHaveBeenCalledWith(['email-1'], 'archive');
      expect(screen.getByText('Quarterly report')).toBeInTheDocument();
    });

    expect(toastMock).toHaveBeenCalledWith(
      'La acción no se pudo aplicar porque el correo ya no está disponible.',
      { duration: 3500 }
    );
  });

  test('mobile overflow actions do not open the preview sheet', async () => {
    installMatchMedia(true);

    const { getEmails } = await import('../src/services/api.js');
    getEmails.mockResolvedValue({
      emails: [buildEmail({ id: 'email-1', subject: 'Quarterly report' })],
      total: 1,
      nextPageToken: null,
    });

    render(<InboxList />);

    await waitFor(() => {
      expect(screen.getByText('Quarterly report')).toBeInTheDocument();
    });

    const row = screen.getByTestId('inbox-row-email-1');
    fireEvent.click(within(row).getAllByRole('button', { name: 'Mostrar acciones' })[0]);
    fireEvent.click(within(row).getAllByRole('button', { name: 'Archivar' })[0]);

    await waitFor(() => {
      expect(screen.getByText('¿Archivar este correo?')).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
  });

  test('runs bulk archive with partial success and keeps failed items selected', async () => {
    const { getEmails, runInboxAction } = await import('../src/services/api.js');
    getEmails.mockResolvedValue({
      emails: [
        buildEmail({ id: 'email-1', subject: 'Archive target' }),
        buildEmail({ id: 'email-2', subject: 'Delete target' }),
      ],
      total: 2,
      nextPageToken: null,
    });
    runInboxAction.mockResolvedValue({
      success: true,
      execution: 'partial',
      action: 'archive',
      source: 'inbox',
      summary: {
        total: 2,
        processed: 1,
        failed: 1,
      },
      results: [
        { emailId: 'email-1', status: 'ok' },
        { emailId: 'email-2', status: 'error', reason: 'not_found' },
      ],
    });
    render(<InboxList />);

    await waitFor(() => {
      expect(screen.getByText('Archive target')).toBeInTheDocument();
      expect(screen.getByText('Delete target')).toBeInTheDocument();
    });

    const archiveRow = screen.getByTestId('inbox-row-email-1');
    const deleteRow = screen.getByTestId('inbox-row-email-2');

    fireEvent.click(within(archiveRow).getByRole('checkbox', { name: 'Seleccionar correo' }));
    fireEvent.click(within(deleteRow).getByRole('checkbox', { name: 'Seleccionar correo' }));

    expect(screen.getByText('2 seleccionados')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Archivar' })[0]);

    await waitFor(() => {
      expect(screen.getByText('¿Archivar correos seleccionados?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Archivar seleccionados' }));

    await waitFor(() => {
      expect(runInboxAction).toHaveBeenCalledWith(['email-1', 'email-2'], 'archive');
      expect(screen.queryByText('Archive target')).not.toBeInTheDocument();
      expect(screen.getByText('Delete target')).toBeInTheDocument();
      expect(within(screen.getByTestId('inbox-row-email-2')).getByRole('checkbox', { name: 'Seleccionar correo' })).toBeChecked();
    });

    expect(toastMock).toHaveBeenCalledWith('⚠️ Parcial: 1 exitosos, 1 fallaron.', {
      duration: 3500,
    });
  });

  test('clears selection and shows error when bulk execution returns none', async () => {
    const { getEmails, runInboxAction } = await import('../src/services/api.js');
    getEmails.mockResolvedValue({
      emails: [
        buildEmail({ id: 'email-1', subject: 'Archive target' }),
      ],
      total: 1,
      nextPageToken: null,
    });
    runInboxAction.mockResolvedValue({
      success: true,
      execution: 'none',
      action: 'archive',
      source: 'inbox',
      summary: {
        total: 1,
        processed: 0,
        failed: 1,
      },
      results: [
        { emailId: 'email-1', status: 'error', reason: 'not_found' },
      ],
    });
    render(<InboxList />);

    await waitFor(() => {
      expect(screen.getByText('Archive target')).toBeInTheDocument();
    });

    const archiveRow = screen.getByTestId('inbox-row-email-1');
    fireEvent.click(within(archiveRow).getByRole('checkbox', { name: 'Seleccionar correo' }));

    fireEvent.click(screen.getAllByRole('button', { name: 'Archivar' })[0]);

    await waitFor(() => {
      expect(screen.getByText('¿Archivar correos seleccionados?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Archivar seleccionados' }));

    await waitFor(() => {
      expect(runInboxAction).toHaveBeenCalledWith(['email-1'], 'archive');
      expect(screen.getByText('Archive target')).toBeInTheDocument();
    });

    expect(within(screen.getByTestId('inbox-row-email-1')).getByRole('checkbox', { name: 'Seleccionar correo' })).not.toBeChecked();
    expect(toastMock).toHaveBeenCalledWith('❌ Fallo total en la operación.', {
      duration: 3500,
    });
  });
});
