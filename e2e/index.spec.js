// @ts-check
const { test, expect } = require('@playwright/test');

const complexCalcs = [
  { key: 'acmax', selector: 'select[name="Dif"]' },
  { key: 'block', selector: 'select[name="Diph"]' },
  { key: 'cth', selector: 'select[name="cClass"]' },
  { key: 'price', selector: 'select[name="Clas"]' },
  { key: 'orkin', selector: 'select[name="Item"]' },
  { key: 'rarity', selector: 'select[name="Class"]' },
  { key: 'premium', selector: 'select[name="prefixx"]' },
  { key: 'char', selector: 'select[name="myclass"]' },
  { key: 'actohit', selector: 'select[name="game"]' },
];

const embedChecks = [
  { key: 'lifemana', filename: 'life-mana-calculator.html', guide: '#213-life-and-mana' },
  { key: 'actohit', filename: 'ac-tohit-calculator.html', guide: '#214-armor-class-and-to-hit' },
  { key: 'acmax', filename: 'ac-calculator.html', guide: '#214-armor-class-and-to-hit' },
  { key: 'price', filename: 'item-price-calculator.html', guide: '#31-armor-weapons-and-jewelry' },
  { key: 'premium', filename: 'premium-item-checker.html', guide: '#31-armor-weapons-and-jewelry' },
];

test.describe('Index embeds complex calculators', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  for (const calc of complexCalcs) {
    test(`${calc.key} tab loads its calculator`, async ({ page }) => {
      await page.click(`button.tab[data-calc="${calc.key}"]`);

      const iframeLocator = page.locator(`#calc-${calc.key} iframe`);
      await expect(iframeLocator).toBeVisible();

      const frame = await iframeLocator.contentFrame();
      await expect(frame.locator(calc.selector)).toBeVisible();
    });
  }
});

test.describe('Embed codes and Jarulf links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  for (const embed of embedChecks) {
    test(`${embed.key} tab shows embed code and Jarulf link`, async ({ page }) => {
      await page.click(`button.tab[data-calc="${embed.key}"]`);

      const meta = page.locator(`#calc-${embed.key} .meta`);
      await expect(meta).toBeVisible();

      const input = meta.locator('input.embed-input');
      await expect(input).toBeVisible();
      await expect(input).toHaveValue(new RegExp(embed.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

      const guide = meta.locator('a.guide');
      await expect(guide).toBeVisible();
      await expect(guide).toHaveAttribute('href', new RegExp(embed.guide.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    });
  }
});
