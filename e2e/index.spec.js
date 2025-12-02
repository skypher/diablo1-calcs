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
  { key: 'lifemana', filename: 'life-mana-calculator.html', guides: ['#213-life-and-mana', '#21-characters'] },
  { key: 'actohit', filename: 'ac-tohit-calculator.html', guides: ['#214-armor-class-and-to-hit', '#221-getting-hit'] },
  { key: 'acmax', filename: 'ac-calculator.html', guides: ['#214-armor-class-and-to-hit', '#221-getting-hit'] },
  { key: 'price', filename: 'item-price-calculator.html', guides: ['#31-armor-weapons-and-jewelry', '#36-prefixes-and-suffixes'] },
  { key: 'premium', filename: 'premium-item-checker.html', guides: ['#31-armor-weapons-and-jewelry', '#36-prefixes-and-suffixes'] },
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

      const guides = meta.locator('a.guide');
      const hrefs = await guides.evaluateAll((nodes) => nodes.map(n => n.getAttribute('href') || ''));
      expect(hrefs.length).toBeGreaterThan(0);
      for (const part of embed.guides) {
        expect(hrefs.some(h => h.includes(part))).toBe(true);
      }
    });
  }
});
