import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReceiptReviewDialog from '../src/components/ReceiptReviewDialog.jsx';

vi.mock('../src/services/api.js', () => ({
  getEmailContent: vi.fn(),
  extractReceipt: vi.fn(),
  getReceiptResponse: vi.fn(),
  saveReceiptResponse: vi.fn(),
  sendReceiptWhatsApp: vi.fn(),
}));

function createDeferred() {
  let resolve;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

describe('ReceiptReviewDialog', () => {
  beforeEach(async () => {
    const api = await import('../src/services/api.js');
    api.getEmailContent.mockReset();
    api.extractReceipt.mockReset();
    api.getReceiptResponse.mockReset();
    api.saveReceiptResponse.mockReset();
    api.sendReceiptWhatsApp.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  function renderDialog(props = {}) {
    const onOpenChange = vi.fn();

    render(
      <ReceiptReviewDialog
        open
        emailId="email-1"
        onOpenChange={onOpenChange}
        {...props}
      />
    );

    return { onOpenChange };
  }

  test('loads email content and extraction results on open', async () => {
    const { getEmailContent, extractReceipt } = await import('../src/services/api.js');
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

    renderDialog();

    expect(screen.getByText('Cargando el contenido completo del correo...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Factura CFE marzo')).toBeInTheDocument();
    });

    expect(getEmailContent).toHaveBeenCalledWith('email-1');
    expect(extractReceipt).toHaveBeenCalledWith({
      subject: 'Factura CFE marzo',
      body: 'Total a pagar: $350.50. Fecha limite de pago: 2026-03-25.',
      html: null,
    });
    expect(screen.getByText('2026-03-25')).toBeInTheDocument();
  });

  test('keeps send disabled while the phone input is empty', async () => {
    const { getEmailContent, extractReceipt } = await import('../src/services/api.js');
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

    renderDialog();

    const sendButton = await screen.findByRole('button', { name: 'Enviar por WhatsApp' });
    expect(sendButton).toBeDisabled();
  });

  test('keeps send disabled when extraction returns partial data', async () => {
    const { getEmailContent, extractReceipt } = await import('../src/services/api.js');
    getEmailContent.mockResolvedValue({
      id: 'email-1',
      subject: 'Factura CFE marzo',
      from: 'CFE <facturas@cfe.mx>',
      body: 'Total a pagar: $350.50.',
      html: null,
    });
    extractReceipt.mockResolvedValue({
      amount: 350.5,
      due_date: null,
    });

    renderDialog();

    await waitFor(() => {
      expect(screen.getByText('El recibo no esta listo para envio porque falta monto o fecha limite.')).toBeInTheDocument();
    });

    const phoneInput = screen.getByLabelText('Telefono WhatsApp');
    fireEvent.change(phoneInput, { target: { value: '+52 81 1234 5678' } });

    expect(screen.getByRole('button', { name: 'Enviar por WhatsApp' })).toBeDisabled();
  });

  test('keeps send disabled when extraction returns blank strings', async () => {
    const { getEmailContent, extractReceipt, getReceiptResponse } = await import('../src/services/api.js');
    getEmailContent.mockResolvedValue({
      id: 'email-1',
      subject: 'Factura CFE marzo',
      from: 'CFE <facturas@cfe.mx>',
      body: 'Total a pagar: pendiente.',
      html: null,
    });
    extractReceipt.mockResolvedValue({
      amount: '',
      due_date: '   ',
    });
    getReceiptResponse.mockResolvedValue({
      targetId: 'email-1',
      response: null,
      updatedAt: null,
    });

    renderDialog();

    await waitFor(() => {
      expect(screen.getByText('El recibo no esta listo para envio porque falta monto o fecha limite.')).toBeInTheDocument();
    });

    const phoneInput = screen.getByLabelText('Telefono WhatsApp');
    fireEvent.change(phoneInput, { target: { value: '+52 81 1234 5678' } });

    expect(screen.getByText('No disponible')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar por WhatsApp' })).toBeDisabled();
  });

  test('sends WhatsApp manually when extraction data and phone are ready', async () => {
    const { getEmailContent, extractReceipt, getReceiptResponse, sendReceiptWhatsApp } = await import('../src/services/api.js');
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
    sendReceiptWhatsApp.mockResolvedValue({
      sent: true,
      provider: 'twilio',
      status: 'sent',
    });
    getReceiptResponse.mockResolvedValue({
      targetId: 'email-1',
      response: null,
      updatedAt: null,
    });

    renderDialog();

    const phoneInput = await screen.findByLabelText('Telefono WhatsApp');
    fireEvent.change(phoneInput, { target: { value: '+52 81 1234 5678' } });

    const sendButton = screen.getByRole('button', { name: 'Enviar por WhatsApp' });
    expect(sendButton).not.toBeDisabled();

    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(sendReceiptWhatsApp).toHaveBeenCalledWith({
        emailId: 'email-1',
        sender: 'CFE <facturas@cfe.mx>',
        subject: 'Factura CFE marzo',
        amount: 350.5,
        due_date: '2026-03-25',
        phone: '+52 81 1234 5678',
      });
    });

    expect(await screen.findByText('WhatsApp enviado')).toBeInTheDocument();
    expect(
      screen.getByText('La notificacion se envio correctamente a +52 81 1234 5678. Puedes cerrar este dialogo.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
  });

  test('sends WhatsApp with the dialog email id even when content payload omits id', async () => {
    const { getEmailContent, extractReceipt, getReceiptResponse, sendReceiptWhatsApp } = await import('../src/services/api.js');
    getEmailContent.mockResolvedValue({
      subject: 'Factura CFE marzo',
      from: 'CFE <facturas@cfe.mx>',
      body: 'Total a pagar: $350.50. Fecha limite de pago: 2026-03-25.',
      html: null,
    });
    extractReceipt.mockResolvedValue({
      amount: 350.5,
      due_date: '2026-03-25',
    });
    getReceiptResponse.mockResolvedValue({
      targetId: 'email-1',
      response: null,
      updatedAt: null,
    });
    sendReceiptWhatsApp.mockResolvedValue({
      sent: true,
      provider: 'twilio',
      status: 'sent',
    });

    renderDialog();

    const phoneInput = await screen.findByLabelText('Telefono WhatsApp');
    fireEvent.change(phoneInput, { target: { value: '+52 81 1234 5678' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar por WhatsApp' }));

    await waitFor(() => {
      expect(sendReceiptWhatsApp).toHaveBeenCalledWith({
        emailId: 'email-1',
        sender: 'CFE <facturas@cfe.mx>',
        subject: 'Factura CFE marzo',
        amount: 350.5,
        due_date: '2026-03-25',
        phone: '+52 81 1234 5678',
      });
    });
  });

  test('stays open on backend send error and allows retry or cancel', async () => {
    const { getEmailContent, extractReceipt, sendReceiptWhatsApp } = await import('../src/services/api.js');
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
    sendReceiptWhatsApp.mockResolvedValue({
      sent: false,
      reason: 'provider_error',
    });

    const { onOpenChange } = renderDialog();

    const phoneInput = await screen.findByLabelText('Telefono WhatsApp');
    fireEvent.change(phoneInput, { target: { value: '+52 81 1234 5678' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar por WhatsApp' }));

    await waitFor(() => {
      expect(screen.getByText('Error del backend')).toBeInTheDocument();
    });

    expect(
      screen.getByText('El backend no pudo completar el envio de WhatsApp con el proveedor. Intenta de nuevo.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reintentar envio' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test('shows a validation error when the backend rejects the send request', async () => {
    const { getEmailContent, extractReceipt, sendReceiptWhatsApp } = await import('../src/services/api.js');
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
    sendReceiptWhatsApp.mockRejectedValue(new Error('Request failed 400'));

    renderDialog();

    const phoneInput = await screen.findByLabelText('Telefono WhatsApp');
    fireEvent.change(phoneInput, { target: { value: '+52 81 1234 5678' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar por WhatsApp' }));

    await waitFor(() => {
      expect(screen.getByText('Error de validacion')).toBeInTheDocument();
    });

    expect(
      screen.getByText('El backend rechazo la solicitud. Revisa el telefono y los datos del recibo antes de reintentar.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reintentar envio' })).toBeInTheDocument();
  });

  test('shows a network error when the send request times out or loses connectivity', async () => {
    const { getEmailContent, extractReceipt, sendReceiptWhatsApp } = await import('../src/services/api.js');
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
    sendReceiptWhatsApp.mockRejectedValue(new Error('Network error'));

    renderDialog();

    const phoneInput = await screen.findByLabelText('Telefono WhatsApp');
    fireEvent.change(phoneInput, { target: { value: '+52 81 1234 5678' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar por WhatsApp' }));

    await waitFor(() => {
      expect(screen.getByText('Error de red')).toBeInTheDocument();
    });

    expect(
      screen.getByText('No hubo respuesta de la red durante el envio. Verifica la conexion e intenta de nuevo.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reintentar envio' })).toBeInTheDocument();
  });

  test('shows a retry action when content loading fails', async () => {
    const { getEmailContent } = await import('../src/services/api.js');
    getEmailContent.mockRejectedValue(new Error('No se pudo cargar el contenido del correo.'));

    renderDialog();

    await waitFor(() => {
      expect(screen.getByText('No se pudo cargar el contenido del correo.')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Reintentar carga' })).toBeInTheDocument();
  });

  test('ignores stale retry results after switching to another email', async () => {
    const { getEmailContent, extractReceipt } = await import('../src/services/api.js');
    const retryDeferred = createDeferred();
    let email1Calls = 0;

    getEmailContent.mockImplementation((requestedEmailId) => {
      if (requestedEmailId === 'email-1') {
        email1Calls += 1;
        if (email1Calls === 1) {
          return Promise.reject(new Error('No se pudo cargar el contenido del correo.'));
        }

        return retryDeferred.promise;
      }

      return Promise.resolve({
        id: 'email-2',
        subject: 'Factura CFE abril',
        from: 'CFE <facturas@cfe.mx>',
        body: 'Total a pagar: $410.00. Fecha limite de pago: 2026-04-10.',
        html: null,
      });
    });

    extractReceipt.mockImplementation(({ subject }) =>
      Promise.resolve({
        amount: subject === 'Factura CFE abril' ? 410 : 350.5,
        due_date: subject === 'Factura CFE abril' ? '2026-04-10' : '2026-03-25',
      })
    );

    const onOpenChange = vi.fn();
    const view = render(
      <ReceiptReviewDialog
        open
        emailId="email-1"
        onOpenChange={onOpenChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('No se pudo cargar el contenido del correo.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar carga' }));

    view.rerender(
      <ReceiptReviewDialog
        open
        emailId="email-2"
        onOpenChange={onOpenChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Factura CFE abril')).toBeInTheDocument();
    });

    retryDeferred.resolve({
      id: 'email-1',
      subject: 'Factura CFE marzo',
      from: 'CFE <facturas@cfe.mx>',
      body: 'Total a pagar: $350.50. Fecha limite de pago: 2026-03-25.',
      html: null,
    });

    await waitFor(() => {
      expect(screen.getByText('Factura CFE abril')).toBeInTheDocument();
    });

    expect(screen.queryByText('Factura CFE marzo')).not.toBeInTheDocument();
    expect(extractReceipt).toHaveBeenCalledTimes(1);
    expect(extractReceipt).toHaveBeenCalledWith({
      subject: 'Factura CFE abril',
      body: 'Total a pagar: $410.00. Fecha limite de pago: 2026-04-10.',
      html: null,
    });
  });

  test('ignores stale send results after switching to another email', async () => {
    const { getEmailContent, extractReceipt, sendReceiptWhatsApp } = await import('../src/services/api.js');
    const sendDeferred = createDeferred();

    getEmailContent.mockImplementation((requestedEmailId) =>
      Promise.resolve(
        requestedEmailId === 'email-1'
          ? {
              id: 'email-1',
              subject: 'Factura CFE marzo',
              from: 'CFE <facturas@cfe.mx>',
              body: 'Total a pagar: $350.50. Fecha limite de pago: 2026-03-25.',
              html: null,
            }
          : {
              id: 'email-2',
              subject: 'Factura CFE abril',
              from: 'CFE <facturas@cfe.mx>',
              body: 'Total a pagar: $410.00. Fecha limite de pago: 2026-04-10.',
              html: null,
            }
      )
    );

    extractReceipt.mockImplementation(({ subject }) =>
      Promise.resolve({
        amount: subject === 'Factura CFE abril' ? 410 : 350.5,
        due_date: subject === 'Factura CFE abril' ? '2026-04-10' : '2026-03-25',
      })
    );

    sendReceiptWhatsApp.mockReturnValue(sendDeferred.promise);

    const onOpenChange = vi.fn();
    const view = render(
      <ReceiptReviewDialog
        open
        emailId="email-1"
        onOpenChange={onOpenChange}
      />
    );

    const phoneInput = await screen.findByLabelText('Telefono WhatsApp');
    fireEvent.change(phoneInput, { target: { value: '+52 81 1234 5678' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar por WhatsApp' }));

    await waitFor(() => {
      expect(sendReceiptWhatsApp).toHaveBeenCalledWith({
        emailId: 'email-1',
        sender: 'CFE <facturas@cfe.mx>',
        subject: 'Factura CFE marzo',
        amount: 350.5,
        due_date: '2026-03-25',
        phone: '+52 81 1234 5678',
      });
    });

    view.rerender(
      <ReceiptReviewDialog
        open
        emailId="email-2"
        onOpenChange={onOpenChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Factura CFE abril')).toBeInTheDocument();
    });

    sendDeferred.resolve({
      sent: true,
      provider: 'twilio',
      status: 'sent',
    });

    await waitFor(() => {
      expect(screen.getByText('Factura CFE abril')).toBeInTheDocument();
    });

    expect(screen.queryByText('Notificacion enviada por WhatsApp.')).not.toBeInTheDocument();
  });

  test('shows an existing paid receipt response when the dialog opens', async () => {
    const { getEmailContent, extractReceipt, getReceiptResponse } = await import('../src/services/api.js');
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
    getReceiptResponse.mockResolvedValue({
      targetId: 'email-1',
      response: 'paid',
      updatedAt: '2026-03-24T18:00:00.000Z',
    });

    renderDialog();

    await waitFor(() => {
      expect(screen.getByTestId('receipt-response-status')).toHaveTextContent('Pagado');
    });

    expect(screen.getByText(/Actualizado:/)).toBeInTheDocument();
  });

  test('saves a paid receipt response and refreshes the visible state', async () => {
    const { getEmailContent, extractReceipt, getReceiptResponse, saveReceiptResponse } = await import('../src/services/api.js');
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
    getReceiptResponse.mockResolvedValue({
      targetId: 'email-1',
      response: null,
      updatedAt: null,
    });
    saveReceiptResponse.mockResolvedValue({
      targetId: 'email-1',
      response: 'paid',
      updatedAt: '2026-03-24T18:30:00.000Z',
    });

    renderDialog();

    const paidButton = await screen.findByRole('button', { name: 'Marcar como pagado' });
    fireEvent.click(paidButton);

    await waitFor(() => {
      expect(saveReceiptResponse).toHaveBeenCalledWith({
        targetId: 'email-1',
        response: 'paid',
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('receipt-response-status')).toHaveTextContent('Pagado');
    });

    expect(screen.getByText('Recibo marcado como pagado.')).toBeInTheDocument();
  });

  test('saves an ignored receipt response and refreshes the visible state', async () => {
    const { getEmailContent, extractReceipt, getReceiptResponse, saveReceiptResponse } = await import('../src/services/api.js');
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
    getReceiptResponse.mockResolvedValue({
      targetId: 'email-1',
      response: null,
      updatedAt: null,
    });
    saveReceiptResponse.mockResolvedValue({
      targetId: 'email-1',
      response: 'ignore',
      updatedAt: '2026-03-24T18:31:00.000Z',
    });

    renderDialog();

    const ignoreButton = await screen.findByRole('button', { name: 'Marcar como ignorado' });
    fireEvent.click(ignoreButton);

    await waitFor(() => {
      expect(saveReceiptResponse).toHaveBeenCalledWith({
        targetId: 'email-1',
        response: 'ignore',
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('receipt-response-status')).toHaveTextContent('Ignorado');
    });

    expect(screen.getByText('Recibo marcado como ignorado.')).toBeInTheDocument();
  });

  test('shows a load error and blocks response actions when the receipt status cannot be read', async () => {
    const { getEmailContent, extractReceipt, getReceiptResponse } = await import('../src/services/api.js');
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
    getReceiptResponse.mockRejectedValue(new Error('No se pudo cargar el estado del recibo.'));

    renderDialog();

    await waitFor(() => {
      expect(screen.getByText('No se pudo cargar el estado del recibo.')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Marcar como pagado' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Marcar como ignorado' })).toBeDisabled();
  });

  test('shows a save error when persisting the receipt response fails', async () => {
    const { getEmailContent, extractReceipt, getReceiptResponse, saveReceiptResponse } = await import('../src/services/api.js');
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
    getReceiptResponse.mockResolvedValue({
      targetId: 'email-1',
      response: null,
      updatedAt: null,
    });
    saveReceiptResponse.mockRejectedValue(new Error('No se pudo guardar la respuesta del recibo.'));

    renderDialog();

    const ignoreButton = await screen.findByRole('button', { name: 'Marcar como ignorado' });
    await waitFor(() => {
      expect(ignoreButton).toBeEnabled();
    });
    fireEvent.click(ignoreButton);

    await waitFor(() => {
      expect(saveReceiptResponse).toHaveBeenCalledWith({
        targetId: 'email-1',
        response: 'ignore',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('No se pudo guardar la respuesta del recibo.')).toBeInTheDocument();
    });

    expect(screen.getByTestId('receipt-response-status')).toHaveTextContent('Sin respuesta registrada');
  });
});
