/* eslint-env node */
import { expect, test } from '@playwright/test';

const sessionToken = process.env.E2E_SESSION_TOKEN;

test.describe('HU19 row-level Inbox actions', () => {
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

  test('archives the fixture row after confirmation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Inbox' })).toBeVisible();
    await page.getByRole('button', { name: 'Inbox' }).click();

    const archiveRow = page.getByTestId('inbox-row-email-hu19-archive');
    await expect(archiveRow).toBeVisible();
    await expect(page.getByText('Boletin semanal de Atlas Studio')).toBeVisible();

    await archiveRow.getByRole('button', { name: 'Mostrar acciones' }).click();
    await archiveRow.getByRole('button', { name: 'Archivar' }).click();

    await expect(page.getByText('Archive this email?')).toBeVisible();
    await page.getByRole('button', { name: 'Archive email' }).click();

    await expect(page.getByText('Correo archivado.')).toBeVisible();
    await expect(archiveRow).toHaveCount(0);
  });

  test('deletes the fixture row after confirmation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Inbox' })).toBeVisible();
    await page.getByRole('button', { name: 'Inbox' }).click();

    const deleteRow = page.getByTestId('inbox-row-email-hu19-delete');
    await expect(deleteRow).toBeVisible();
    await expect(page.getByText('Promocion de temporada de Tienda Nube')).toBeVisible();

    await deleteRow.getByRole('button', { name: 'Mostrar acciones' }).click();
    await deleteRow.getByRole('button', { name: 'Eliminar' }).click();

    await expect(page.getByText('Delete this email?')).toBeVisible();
    await page.getByRole('button', { name: 'Delete email' }).click();

    await expect(page.getByText('Correo eliminado.')).toBeVisible();
    await expect(deleteRow).toHaveCount(0);
  });

  test('marks the fixture row as unread without confirmation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Inbox' })).toBeVisible();
    await page.getByRole('button', { name: 'Inbox' }).click();

    const unreadRow = page.getByTestId('inbox-row-email-hu19-read');
    await expect(unreadRow).toBeVisible();
    await expect(page.getByText('Seguimiento pendiente de renovacion')).toBeVisible();

    await unreadRow.getByRole('button', { name: 'Mostrar acciones' }).click();
    await unreadRow.getByRole('button', { name: 'Marcar no leído' }).click();

    await expect(page.getByText('Correo marcado como no leído.')).toBeVisible();
    await expect(page.getByText('Confirm Inbox action')).toHaveCount(0);
    await expect(unreadRow.locator('svg.fill-primary')).toBeVisible();
  });

  test('archives multiple selected fixture rows and clears the bulk selection', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Inbox' })).toBeVisible();
    await page.getByRole('button', { name: 'Inbox' }).click();

    const archiveRow = page.getByTestId('inbox-row-email-hu19-archive');
    const deleteRow = page.getByTestId('inbox-row-email-hu19-delete');

    await archiveRow.getByRole('checkbox', { name: 'Seleccionar correo' }).click();
    await deleteRow.getByRole('checkbox', { name: 'Seleccionar correo' }).click();

    await expect(page.getByTestId('bulk-action-bar')).toContainText('2 seleccionados');
    await page.getByTestId('bulk-archive-button').first().click();

    await expect(page.getByText('Archive selected emails?')).toBeVisible();
    await page.getByRole('button', { name: 'Archive selected' }).click();

    await expect(page.getByText(/correos procesados/i)).toBeVisible();
    await expect(archiveRow).toHaveCount(0);
    await expect(deleteRow).toHaveCount(0);
    await expect(page.getByTestId('bulk-action-bar')).toHaveCount(0);
  });

  test('deletes multiple selected fixture rows and clears the bulk selection', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Inbox' })).toBeVisible();
    await page.getByRole('button', { name: 'Inbox' }).click();

    const archiveRow = page.getByTestId('inbox-row-email-hu19-archive');
    const deleteRow = page.getByTestId('inbox-row-email-hu19-delete');

    await archiveRow.getByRole('checkbox', { name: 'Seleccionar correo' }).click();
    await deleteRow.getByRole('checkbox', { name: 'Seleccionar correo' }).click();

    await expect(page.getByTestId('bulk-action-bar')).toContainText('2 seleccionados');
    await page.getByTestId('bulk-delete-button').first().click();

    await expect(page.getByText('Delete selected emails?')).toBeVisible();
    await page.getByRole('button', { name: 'Delete selected' }).click();

    await expect(page.getByText(/correos procesados/i)).toBeVisible();
    await expect(archiveRow).toHaveCount(0);
    await expect(deleteRow).toHaveCount(0);
    await expect(page.getByTestId('bulk-action-bar')).toHaveCount(0);
  });

  test('marks multiple selected fixture rows as unread without confirmation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Inbox' })).toBeVisible();
    await page.getByRole('button', { name: 'Inbox' }).click();

    const unreadRow = page.getByTestId('inbox-row-email-hu19-read');
    const archiveRow = page.getByTestId('inbox-row-email-hu19-archive');

    await unreadRow.getByRole('checkbox', { name: 'Seleccionar correo' }).click();
    await archiveRow.getByRole('checkbox', { name: 'Seleccionar correo' }).click();

    await expect(page.getByTestId('bulk-action-bar')).toContainText('2 seleccionados');
    await page.getByTestId('bulk-mark-unread-button').first().click();

    await expect(page.getByText(/correos procesados/i)).toBeVisible();
    await expect(page.getByText('Archive selected emails?')).toHaveCount(0);
    await expect(page.getByText('Delete selected emails?')).toHaveCount(0);
    await expect(page.getByTestId('bulk-action-bar')).toHaveCount(0);
    await expect(unreadRow.locator('svg.fill-primary')).toBeVisible();
    await expect(archiveRow.locator('svg.fill-primary')).toBeVisible();
  });
});
