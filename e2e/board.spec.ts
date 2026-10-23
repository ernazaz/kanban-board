import { expect, test, type Page } from '@playwright/test';

const column = (page: Page, name: string) => page.getByRole('region', { name });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('a created card moved to Done is still in Done after reload', async ({ page }) => {
  await page.getByRole('button', { name: 'New card' }).click();
  const dialog = page.getByRole('dialog', { name: 'New card' });
  await dialog.getByLabel('Title', { exact: true }).fill('Playwright card');
  await dialog.getByText('High', { exact: true }).click();
  await dialog.getByRole('button', { name: 'Create card' }).click();

  const card = column(page, 'To Do').getByRole('article', { name: 'Playwright card' });
  await expect(card).toBeVisible();

  await card.getByRole('button', { name: 'Move right' }).click();
  await column(page, 'In Progress')
    .getByRole('article', { name: 'Playwright card' })
    .getByRole('button', { name: 'Move right' })
    .click();
  await expect(column(page, 'Done').getByRole('article', { name: 'Playwright card' })).toBeVisible();

  await page.reload();
  await expect(column(page, 'Done').getByRole('article', { name: 'Playwright card' })).toBeVisible();
  await expect(column(page, 'To Do').getByRole('article', { name: 'Playwright card' })).toHaveCount(0);
});

test('search and priority filters apply to every column; filters do not persist', async ({ page }) => {
  await page.getByLabel('Search cards by title').fill('store');
  await expect(page.getByTestId('card')).toHaveCount(2);

  await page.getByRole('group', { name: 'Filter by priority' }).getByRole('button', { name: 'High' }).click();
  await expect(page.getByTestId('card')).toHaveCount(1);
  await expect(page.getByTestId('count-todo')).toHaveText('1/2');

  await page.reload();
  await expect(page.getByLabel('Search cards by title')).toHaveValue('');
  await expect(page.getByTestId('card')).toHaveCount(4);
});

test('deleting asks for confirmation and can be undone', async ({ page }) => {
  const card = page.getByRole('article', { name: 'Build filter bar' });
  await card.getByRole('button', { name: 'Delete card' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete' }).click();
  await expect(card).toHaveCount(0);

  await page.getByRole('status').getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByRole('article', { name: 'Build filter bar' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveCount(0);
});

test('undo toast disappears after 5 seconds', async ({ page }) => {
  await page.clock.install();
  await page.reload();
  await page.getByRole('article', { name: 'Build filter bar' }).getByRole('button', { name: 'Delete card' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await page.clock.runFor(5_100);
  await expect(page.getByRole('status')).toHaveCount(0);
});

test('typing in search does not re-render the New card button or unaffected cards', async ({ page }) => {
  await page.goto('/?renders');
  const newCard = page.getByTestId('renders-new-card');
  const doneCard = page.getByTestId('renders-card-seed-1');
  const newCardBefore = await newCard.textContent();
  const doneCardBefore = await doneCard.textContent();

  await page.getByLabel('Search cards by title').pressSequentially('scaffold', { delay: 20 });

  await expect(page.getByTestId('card')).toHaveCount(1);
  await expect(newCard).toHaveText(newCardBefore!);
  await expect(doneCard).toHaveText(doneCardBefore!);
});

test('keyboard shortcuts: n opens the dialog, / focuses search', async ({ page }) => {
  await page.keyboard.press('n');
  await expect(page.getByRole('dialog', { name: 'New card' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('/');
  await expect(page.getByLabel('Search cards by title')).toBeFocused();
});
