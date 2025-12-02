// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Life/Mana Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/life-mana-calculator.html');
  });

  test('page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Life\/Mana Calculator/);
    await expect(page.locator('select[name="CharClass"]')).toBeVisible();
  });

  test('class dropdown has all options', async ({ page }) => {
    const options = await page.locator('select[name="CharClass"] option').allTextContents();
    expect(options).toContain('Warrior');
    expect(options).toContain('Rogue');
    expect(options).toContain('Sorcerer');
    expect(options).toContain('Monk');
    expect(options).toContain('Bard');
    expect(options).toContain('Barbarian');
  });

  test('Set Min button resets to starting values for Warrior', async ({ page }) => {
    await page.selectOption('select[name="CharClass"]', 'Warrior');
    await page.click('input[value="Set Min"]');

    await expect(page.locator('input[name="CharLevel"]')).toHaveValue('1');
    await expect(page.locator('input[name="BaseMagic"]')).toHaveValue('10');
    await expect(page.locator('input[name="BaseVitality"]')).toHaveValue('25');
  });

  test('Set Min button resets to starting values for Sorcerer', async ({ page }) => {
    await page.selectOption('select[name="CharClass"]', 'Sorcerer');
    await page.click('input[value="Set Min"]');

    await expect(page.locator('input[name="BaseMagic"]')).toHaveValue('35');
    await expect(page.locator('input[name="BaseVitality"]')).toHaveValue('20');
  });

  test('Calculate button produces results', async ({ page }) => {
    await page.selectOption('select[name="CharClass"]', 'Warrior');
    await page.click('input[value="Set Min"]');
    await page.click('input[value="Calculate"]');

    const results = await page.locator('textarea[name="lifmantxt"]').inputValue();
    expect(results).toContain('Life');
    expect(results).toContain('Mana');
  });

  test('Warrior level 50 max stats calculation', async ({ page }) => {
    await page.selectOption('select[name="CharClass"]', 'Warrior');
    await page.click('input[value="Set Max"]');
    await page.click('input[value="Calculate"]');

    const results = await page.locator('textarea[name="lifmantxt"]').inputValue();
    expect(results).toMatch(/Life.*:\s*\d+/);
    expect(results).toMatch(/Mana.*:\s*\d+/);
  });
});

test.describe('Weapon Damage Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/weapon-damage-calculator.html');
  });

  test('page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Weapon Damage Calculator/);
    await expect(page.locator('select[name="base"]')).toBeVisible();
  });

  test('weapon dropdown has items', async ({ page }) => {
    const options = await page.locator('select[name="base"] option').count();
    expect(options).toBeGreaterThan(90);
  });

  test('selecting Dagger shows correct base damage', async ({ page }) => {
    await page.selectOption('select[name="base"]', { index: 1 }); // Dagger
    await expect(page.locator('input[name="basemin"]')).toHaveValue('1');
    await expect(page.locator('input[name="basemax"]')).toHaveValue('4');
  });

  test('calculate button produces damage distribution', async ({ page }) => {
    await page.selectOption('select[name="base"]', { index: 1 }); // Dagger
    await page.fill('input[name="damrate"]', '0');
    await page.fill('input[name="damadd"]', '0');
    await page.click('input[value="Calculate"]');

    const results = await page.locator('textarea[name="display"]').inputValue();
    expect(results).toContain('Damage Distribution');
    expect(results).toContain('Average Damage');
  });

  test('damage modifier increases output', async ({ page }) => {
    await page.selectOption('select[name="base"]', { index: 1 }); // Dagger (1-4)
    await page.fill('input[name="damrate"]', '100');
    await page.fill('input[name="damadd"]', '0');
    await page.click('input[value="Calculate"]');

    // With 100% rate, damage should be doubled (2-8)
    await expect(page.locator('input[name="min"]')).toHaveValue('2');
    await expect(page.locator('input[name="max"]')).toHaveValue('8');
  });

  test('damage add modifier increases output', async ({ page }) => {
    await page.selectOption('select[name="base"]', { index: 1 }); // Dagger (1-4)
    await page.fill('input[name="damrate"]', '0');
    await page.fill('input[name="damadd"]', '5');
    await page.click('input[value="Calculate"]');

    // With +5 damage, should be 6-9
    await expect(page.locator('input[name="min"]')).toHaveValue('6');
    await expect(page.locator('input[name="max"]')).toHaveValue('9');
  });

  test('reset clears form', async ({ page }) => {
    await page.selectOption('select[name="base"]', { index: 5 });
    await page.fill('input[name="damrate"]', '50');
    await page.click('input[value="Reset"]');

    await expect(page.locator('input[name="damrate"]')).toHaveValue('');
  });
});

test.describe('AC Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ac-calculator.html');
  });

  test('page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Armor Class Calculator/);
    await expect(page.locator('select[name="Dif"]')).toBeVisible();
  });

  test('difficulty dropdown has all options', async ({ page }) => {
    const options = await page.locator('select[name="Dif"] option').allTextContents();
    expect(options).toContain('Normal');
    expect(options).toContain('Nightmare');
    expect(options).toContain('Hell');
  });

  test('changing difficulty updates calculations', async ({ page }) => {
    // Get initial value
    const table = page.locator('#MaxAC');
    await page.selectOption('select[name="Dif"]', '0'); // Normal
    await page.waitForTimeout(100);

    const normalValue = await table.locator('tr:nth-child(2) td:nth-child(2)').textContent();

    await page.selectOption('select[name="Dif"]', '120'); // Hell
    await page.waitForTimeout(100);

    const hellValue = await table.locator('tr:nth-child(2) td:nth-child(2)').textContent();

    // Hell should have higher AC requirements
    expect(parseInt(hellValue || '0')).toBeGreaterThan(parseInt(normalValue || '0'));
  });

  test('clvl dropdown updates calculations', async ({ page }) => {
    await page.selectOption('select[name="Cclvl"]', '30');
    await page.waitForTimeout(100);

    const table = page.locator('#MaxAC');
    const value30 = await table.locator('tr:nth-child(2) td:nth-child(5)').textContent();

    await page.selectOption('select[name="Cclvl"]', '50');
    await page.waitForTimeout(100);

    const value50 = await table.locator('tr:nth-child(2) td:nth-child(5)').textContent();

    // Higher clvl should need less AC
    expect(parseInt(value50 || '0')).toBeLessThan(parseInt(value30 || '0'));
  });
});

test.describe('Block Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/block-calculator.html');
  });

  test('page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Block Calculator/);
  });

  test('difficulty affects block requirements', async ({ page }) => {
    const table = page.locator('#MaxDEX');

    await page.selectOption('select[name="Diph"]', '0'); // Normal
    await page.waitForTimeout(100);
    const normalValue = await table.locator('tr:nth-child(2) td:nth-child(2)').textContent();

    await page.selectOption('select[name="Diph"]', '120'); // Hell
    await page.waitForTimeout(100);
    const hellValue = await table.locator('tr:nth-child(2) td:nth-child(2)').textContent();

    // Hell should require more DEX
    expect(parseInt(hellValue || '0')).toBeGreaterThan(parseInt(normalValue || '0'));
  });
});

test.describe('Chance to Hit Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cth-calculator.html');
  });

  test('page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Chance to Hit Calculator/);
  });

  test('class dropdown has all options', async ({ page }) => {
    const options = await page.locator('select[name="cClass"] option').allTextContents();
    expect(options).toContain('Warrior');
    expect(options).toContain('Rogue');
    expect(options).toContain('Sorcerer');
  });

  test('attack type dropdown has options', async ({ page }) => {
    const options = await page.locator('select[name="Attack"] option').allTextContents();
    expect(options).toContain('melee');
    expect(options).toContain('arrow');
  });

  test('changing attack type updates calculations', async ({ page }) => {
    const table = page.locator('#MaxCS');

    await page.selectOption('select[name="Attack"]', 'melee');
    await page.waitForTimeout(100);
    const meleeValue = await table.locator('tr:nth-child(2) td:nth-child(2)').textContent();

    await page.selectOption('select[name="Attack"]', 'arrow');
    await page.waitForTimeout(100);
    const arrowValue = await table.locator('tr:nth-child(2) td:nth-child(2)').textContent();

    // Values should be different for melee vs arrow
    expect(meleeValue).not.toBe(arrowValue);
  });
});

test.describe('DPS Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dps-calculator.html');
  });

  test('page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/DPS Calculator/);
  });

  test('has input fields for damage calculation', async ({ page }) => {
    await expect(page.locator('input[name="avg"]')).toBeVisible();
    await expect(page.locator('select[name="basetype"]')).toBeVisible();
  });
});

test.describe('Item Price Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/item-price-calculator.html');
  });

  test('page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Item Price Calculator/);
  });

  test('class dropdown exists', async ({ page }) => {
    await expect(page.locator('select[name="Clas"]')).toBeVisible();
  });

  test('class selection enables other dropdowns', async ({ page }) => {
    await page.selectOption('select[name="Clas"]', { index: 1 }); // Helm
    await page.waitForTimeout(200);

    // After selecting class, prefix dropdown should be enabled
    const prefixSelect = page.locator('select[name="Prefx"]');
    await expect(prefixSelect).not.toBeDisabled();
  });
});

test.describe('Item Rarity Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/item-rarity-calculator.html');
  });

  test('page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Item Rarity Calculator/);
  });
});

test.describe('Shop QLvl Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop-qlvl-calculator.html');
  });

  test('page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Shop qlvl Calculator/);
  });

  test('clvl input exists', async ({ page }) => {
    await expect(page.locator('input[name="clvl"]')).toBeVisible();
  });
});

test.describe('Character Stats Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/character-stats-calculator.html');
  });

  test('page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Character Stats Calculator/);
  });

  test('class dropdown has options', async ({ page }) => {
    const options = await page.locator('select[name="myclass"] option').allTextContents();
    expect(options.length).toBeGreaterThan(0);
  });
});

test.describe('Armor Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/armor-calculator.html');
  });

  test('page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Armor Calculator/);
  });
});
