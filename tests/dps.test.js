/**
 * Unit tests for js/dps.js - DPS Calculator
 * Tests damage per second calculations for different weapon types and classes
 */

const { swingSpeeds, calculateDPS, avgdps } = require('../js/dps.js');

describe('dps.js - DPS Calculator', () => {

  describe('DPS Calculation', () => {
    test('basic DPS formula works', () => {
      // 100 damage / 0.5 seconds = 200 DPS
      expect(calculateDPS(100, 0.5)).toBe(200);
    });

    test('higher damage increases DPS', () => {
      const dps50 = calculateDPS(50, 0.5);
      const dps100 = calculateDPS(100, 0.5);
      const dps150 = calculateDPS(150, 0.5);

      expect(dps100).toBe(dps50 * 2);
      expect(dps150).toBe(dps50 * 3);
    });

    test('faster swing increases DPS', () => {
      const dpsSlow = calculateDPS(100, 0.5);
      const dpsFast = calculateDPS(100, 0.25);

      expect(dpsFast).toBe(dpsSlow * 2);
    });

    test('rounds to 2 decimal places', () => {
      const dps = calculateDPS(100, 0.33);
      expect(dps.toString()).toMatch(/^\d+\.\d{1,2}$/);
    });
  });

  describe('Swing Speeds Data', () => {
    test('swingSpeeds contains all weapon types', () => {
      expect(swingSpeeds).toHaveProperty('sword');
      expect(swingSpeeds).toHaveProperty('axe');
      expect(swingSpeeds).toHaveProperty('staff');
      expect(swingSpeeds).toHaveProperty('bow');
    });

    test('each weapon type has all classes', () => {
      const classes = ['Warrior', 'Rogue', 'Sorcerer', 'Monk', 'Bard', 'Barbarian'];
      const weapons = ['sword', 'axe', 'staff', 'bow'];

      weapons.forEach(weapon => {
        classes.forEach(cls => {
          expect(swingSpeeds[weapon]).toHaveProperty(cls);
        });
      });
    });
  });

  describe('Sword DPS by Class', () => {
    const avgDamage = 100;

    test('Warrior has fastest sword speed', () => {
      const warriorDPS = calculateDPS(avgDamage, swingSpeeds.sword.Warrior.normal);
      const rogueDPS = calculateDPS(avgDamage, swingSpeeds.sword.Rogue.normal);
      const sorcererDPS = calculateDPS(avgDamage, swingSpeeds.sword.Sorcerer.normal);

      expect(warriorDPS).toBeGreaterThan(rogueDPS);
      expect(rogueDPS).toBeGreaterThan(sorcererDPS);
    });

    test('speed suffix increases DPS for all classes', () => {
      const classes = ['Warrior', 'Rogue', 'Sorcerer', 'Monk', 'Bard'];

      classes.forEach(cls => {
        const normalDPS = calculateDPS(avgDamage, swingSpeeds.sword[cls].normal);
        const swiftDPS = calculateDPS(avgDamage, swingSpeeds.sword[cls].swiftness);
        const speedDPS = calculateDPS(avgDamage, swingSpeeds.sword[cls].speed);

        expect(swiftDPS).toBeGreaterThan(normalDPS);
        expect(speedDPS).toBeGreaterThan(swiftDPS);
      });
    });
  });

  describe('Axe DPS by Class', () => {
    const avgDamage = 100;

    test('Barbarian is fastest with axes', () => {
      const barbarianDPS = calculateDPS(avgDamage, swingSpeeds.axe.Barbarian.normal);
      const warriorDPS = calculateDPS(avgDamage, swingSpeeds.axe.Warrior.normal);

      expect(barbarianDPS).toBeGreaterThan(warriorDPS);
    });

    test('Sorcerer is slowest with axes', () => {
      const sorcererDPS = calculateDPS(avgDamage, swingSpeeds.axe.Sorcerer.normal);
      const rogueDPS = calculateDPS(avgDamage, swingSpeeds.axe.Rogue.normal);

      expect(rogueDPS).toBeGreaterThan(sorcererDPS);
    });
  });

  describe('Staff DPS by Class', () => {
    const avgDamage = 100;

    test('Monk is fastest with staves', () => {
      const monkDPS = calculateDPS(avgDamage, swingSpeeds.staff.Monk.normal);
      const warriorDPS = calculateDPS(avgDamage, swingSpeeds.staff.Warrior.normal);
      const sorcererDPS = calculateDPS(avgDamage, swingSpeeds.staff.Sorcerer.normal);

      expect(monkDPS).toBeGreaterThan(warriorDPS);
      expect(monkDPS).toBeGreaterThan(sorcererDPS);
    });

    test('Warrior and Rogue have same staff speed', () => {
      expect(swingSpeeds.staff.Warrior.normal).toBe(swingSpeeds.staff.Rogue.normal);
    });
  });

  describe('Bow DPS by Class', () => {
    const avgDamage = 100;

    test('Rogue is fastest with bows', () => {
      const rogueDPS = calculateDPS(avgDamage, swingSpeeds.bow.Rogue.normal);
      const warriorDPS = calculateDPS(avgDamage, swingSpeeds.bow.Warrior.normal);
      const sorcererDPS = calculateDPS(avgDamage, swingSpeeds.bow.Sorcerer.normal);

      expect(rogueDPS).toBeGreaterThan(warriorDPS);
      expect(rogueDPS).toBeGreaterThan(sorcererDPS);
    });

    test('Sorcerer is slowest with bows', () => {
      const sorcererDPS = calculateDPS(avgDamage, swingSpeeds.bow.Sorcerer.normal);

      Object.keys(swingSpeeds.bow).forEach(cls => {
        if (cls !== 'Sorcerer') {
          const otherDPS = calculateDPS(avgDamage, swingSpeeds.bow[cls].normal);
          expect(otherDPS).toBeGreaterThan(sorcererDPS);
        }
      });
    });

    test('bow has fewer speed tiers', () => {
      // Bows only have normal and swiftness, no speed tier
      expect(swingSpeeds.bow.Warrior.speed).toBeUndefined();
    });
  });

  describe('Speed Suffix Effects', () => {
    test('Swiftness suffix reduces swing time', () => {
      const weapons = ['sword', 'axe', 'staff'];
      const classes = ['Warrior', 'Rogue', 'Sorcerer'];

      weapons.forEach(weapon => {
        classes.forEach(cls => {
          expect(swingSpeeds[weapon][cls].swiftness)
            .toBeLessThan(swingSpeeds[weapon][cls].normal);
        });
      });
    });

    test('Speed suffix reduces swing time more than Swiftness', () => {
      const weapons = ['sword', 'axe', 'staff'];
      const classes = ['Warrior', 'Rogue', 'Sorcerer'];

      weapons.forEach(weapon => {
        classes.forEach(cls => {
          expect(swingSpeeds[weapon][cls].speed)
            .toBeLessThan(swingSpeeds[weapon][cls].swiftness);
        });
      });
    });
  });

  describe('Barbarian Special Cases', () => {
    test('Barbarian shows one-hand/two-hand sword speeds', () => {
      const barbarianSword = swingSpeeds.sword.Barbarian;

      expect(Array.isArray(barbarianSword.normal)).toBe(true);
      expect(barbarianSword.normal.length).toBe(2);

      // Two-hand is faster
      expect(barbarianSword.normal[1]).toBeLessThan(barbarianSword.normal[0]);
    });

    test('Barbarian axe speed is fastest overall', () => {
      const barbarianAxeSpeed = swingSpeeds.axe.Barbarian.speed;

      // 0.30 is the fastest axe speed
      expect(barbarianAxeSpeed).toBe(0.30);
    });
  });

  describe('Practical DPS Calculations', () => {
    test('Great Sword with Warrior', () => {
      // Great Sword: 10-20 damage, avg 15
      const avgDamage = 15;
      const dpsNormal = calculateDPS(avgDamage, 0.45);
      const dpsSpeed = calculateDPS(avgDamage, 0.35);

      expect(dpsNormal).toBeCloseTo(33.33, 1);
      expect(dpsSpeed).toBeCloseTo(42.86, 1);
    });

    test('Long War Bow with Rogue', () => {
      // Long War Bow: 1-14 damage, avg 7.5
      const avgDamage = 7.5;
      const dpsNormal = calculateDPS(avgDamage, 0.35);

      expect(dpsNormal).toBeCloseTo(21.43, 1);
    });

    test('War Staff with Monk', () => {
      // War Staff: 8-16 damage, avg 12
      const avgDamage = 12;
      const dpsNormal = calculateDPS(avgDamage, 0.40);
      const dpsSpeed = calculateDPS(avgDamage, 0.30);

      expect(dpsNormal).toBe(30);
      expect(dpsSpeed).toBe(40);
    });
  });

  describe('Edge Cases', () => {
    test('handles zero damage', () => {
      expect(calculateDPS(0, 0.5)).toBe(0);
    });

    test('handles very high damage', () => {
      const dps = calculateDPS(1000, 0.35);
      expect(dps).toBeCloseTo(2857.14, 1);
    });

    test('handles very small swing times', () => {
      const dps = calculateDPS(100, 0.1);
      expect(dps).toBe(1000);
    });
  });

  describe('Class Specializations', () => {
    const avgDamage = 100;

    test('each class has an optimal weapon type', () => {
      // Warrior: Sword
      const warriorSword = calculateDPS(avgDamage, swingSpeeds.sword.Warrior.normal);
      const warriorAxe = calculateDPS(avgDamage, swingSpeeds.axe.Warrior.normal);
      expect(warriorSword).toBeGreaterThan(warriorAxe);

      // Rogue: Bow
      const rogueBow = calculateDPS(avgDamage, swingSpeeds.bow.Rogue.normal);
      const rogueSword = calculateDPS(avgDamage, swingSpeeds.sword.Rogue.normal);
      expect(rogueBow).toBeGreaterThan(rogueSword);

      // Monk: Staff
      const monkStaff = calculateDPS(avgDamage, swingSpeeds.staff.Monk.normal);
      const monkSword = calculateDPS(avgDamage, swingSpeeds.sword.Monk.normal);
      expect(monkStaff).toBeGreaterThan(monkSword);
    });
  });

  describe('avgdps DOM handler', () => {
    function createMockForm(basetype, avg) {
      return {
        basetype: { value: basetype },
        avg: { value: avg },
        display: { value: '' },
        display1: { value: '' },
        display2: { value: '' },
        display3: { value: '' },
        display4: { value: '' },
        display5: { value: '' },
        display6: { value: '' }
      };
    }

    test('calculates sword DPS for all classes', () => {
      const form = createMockForm('sword', 100);
      avgdps(form);

      expect(form.display.value).toContain('Suffix:');
      expect(form.display1.value).toContain('Warrior:');
      expect(form.display2.value).toContain('Rogue:');
      expect(form.display3.value).toContain('Sorcerer:');
      expect(form.display4.value).toContain('Monk:');
      expect(form.display5.value).toContain('Bard:');
      expect(form.display6.value).toContain('Barbarian:');
    });

    test('calculates axe DPS for all classes', () => {
      const form = createMockForm('axe', 100);
      avgdps(form);

      expect(form.display1.value).toContain('Warrior:');
      expect(form.display6.value).toContain('Barbarian:');
    });

    test('calculates staff DPS for all classes', () => {
      const form = createMockForm('staff', 100);
      avgdps(form);

      expect(form.display1.value).toContain('Warrior:');
      expect(form.display4.value).toContain('Monk:');
    });

    test('calculates bow DPS for all classes', () => {
      const form = createMockForm('bow', 100);
      avgdps(form);

      expect(form.display1.value).toContain('Warrior:');
      expect(form.display2.value).toContain('Rogue:');
    });

    test('sword DPS values are correct', () => {
      const form = createMockForm('sword', 100);
      avgdps(form);

      // Warrior: 100/0.45 = 222.22, 100/0.4 = 250, 100/0.35 = 285.71
      expect(form.display1.value).toContain('222.22');
      expect(form.display1.value).toContain('250');
      expect(form.display1.value).toContain('285.71');
    });

    test('axe DPS values are correct for Barbarian', () => {
      const form = createMockForm('axe', 100);
      avgdps(form);

      // Barbarian: 100/0.4 = 250, 100/0.35 = 285.71, 100/0.3 = 333.33
      expect(form.display6.value).toContain('250');
      expect(form.display6.value).toContain('285.71');
      expect(form.display6.value).toContain('333.33');
    });

    test('staff DPS values are correct for Monk', () => {
      const form = createMockForm('staff', 100);
      avgdps(form);

      // Monk: 100/0.4 = 250, 100/0.35 = 285.71, 100/0.3 = 333.33
      expect(form.display4.value).toContain('250');
      expect(form.display4.value).toContain('285.71');
      expect(form.display4.value).toContain('333.33');
    });

    test('bow DPS values are correct for Rogue', () => {
      const form = createMockForm('bow', 100);
      avgdps(form);

      // Rogue: 100/0.35 = 285.71, 100/0.3 = 333.33
      expect(form.display2.value).toContain('285.71');
      expect(form.display2.value).toContain('333.33');
    });
  });
});
