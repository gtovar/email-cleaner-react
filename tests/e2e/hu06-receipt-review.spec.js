/* eslint-env node */
import { expect, test } from '@playwright/test';

const sessionToken = process.env.E2E_SESSION_TOKEN;

test.describe('HU06 receipt review browser validation', () => {
  test.beforeEach(async ({ context }) => {
    if (!sessionToken) {
      throw new Error(
        'E2E_SESSION_TOKEN is required. Generate it from email-cleaner-fastify with `npm run session:e2e`.'
      );
    }

    await context.addCookies([
      {
        name: 'session_token',
        value: sessionToken,
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ]);
  });

  test('completes the happy path for receipt review and manual WhatsApp send', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Inbox' })).toBeVisible();
    await page.getByRole('button', { name: 'Inbox' }).click();

    const receiptRow = page.getByTestId('inbox-row-email-hu06-success');
    await expect(receiptRow).toBeVisible();

    await receiptRow.getByRole('button', { name: 'Revisar recibo' }).click();

    const dialog = page.getByTestId('receipt-review-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Revisar recibo' })).toBeVisible();
    await expect(dialog.getByText('Recibo de luz de marzo')).toBeVisible();
    await expect(dialog.getByText('$350.50')).toBeVisible();
    await expect(dialog.getByText('2026-03-25')).toBeVisible();

    await dialog.getByLabel('Telefono WhatsApp').fill('+52 81 1234 5678');
    await dialog.getByTestId('receipt-review-send-button').click();

    const feedback = dialog.getByTestId('receipt-review-feedback');
    await expect(feedback).toContainText('WhatsApp enviado');
    await expect(feedback).toContainText(
      'La notificacion se envio correctamente a +52 81 1234 5678. Puedes cerrar este dialogo.'
    );
    await expect(dialog.getByRole('button', { name: 'Cerrar' })).toBeVisible();
  });

  test('shows a visible send error and retry affordance when the provider flow fails', async ({ page }) => {
    await page.route('**/api/v1/notifications/receipt-whatsapp', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sent: false,
          reason: 'provider_error',
        }),
      });
    });

    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Inbox' })).toBeVisible();
    await page.getByRole('button', { name: 'Inbox' }).click();

    const receiptRow = page.getByTestId('inbox-row-email-hu06-provider-error');
    await expect(receiptRow).toBeVisible();

    await receiptRow.getByRole('button', { name: 'Revisar recibo' }).click();

    const dialog = page.getByTestId('receipt-review-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Recordatorio de pago de agua')).toBeVisible();
    await expect(dialog.getByText('$900.00')).toBeVisible();
    await expect(dialog.getByText('2026-03-28')).toBeVisible();

    await dialog.getByLabel('Telefono WhatsApp').fill('+52 55 0000 0000');
    await dialog.getByTestId('receipt-review-send-button').click();

    const feedback = dialog.getByTestId('receipt-review-feedback');
    await expect(feedback).toContainText('Error del backend');
    await expect(feedback).toContainText(
      'El backend no pudo completar el envio de WhatsApp con el proveedor. Intenta de nuevo.'
    );
    await expect(dialog.getByRole('button', { name: 'Reintentar envio' })).toBeVisible();
  });
});
