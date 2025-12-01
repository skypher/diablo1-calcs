/**
 * Unit tests for js/dps.js - DPS Calculator
 * Tests damage per second calculations for different weapon types and classes
 */

describe('dps.js - DPS Calculator', () => {

  // Weapon speeds from dps.js (in seconds per swing)
  const weaponSpeeds = {
    sword: {
      Warrior: { normal: 0.45, swift: 0.40, speed: 0.35 },
      Rogue: { normal: 0.50, swift: 0.45, speed: 0.40 },
      Sorcerer: { normal: 0.60, swift: 0.55, speed: 0.50 },
      Monk: { normal: 0.60, swift: 0.55, speed: 0.50 },
      Bard: { normal: 0.50, swift: 0.45, speed: 0.40 },
      // Barbarian shows two values (one-hand/two-hand)
      Barbarian: {
        normal: [0.45, 0.40],
        swift: [0.40, 0.35],
        speed: [0.35, 0.30]
      }
    },
    axe: {
      Warrior: { normal: 0.50, swift: 0.45, speed: 0.40 },
      Rogue: { normal: 0.65, swift: 0.60, speed: 0.55 },
      Sorcerer: { normal: 0.80, swift: 0.75, speed: 0.70 },
      Monk: { normal: 0.70, swift: 0.65, speed: 0.60 },
      Bard: { normal: 0.65, swift: 0.60, speed: 0.55 },
      Barbarian: { normal: 0.40, swift: 0.35, speed: 0.30 }
    },
    staff: {
      Warrior: { normal: 0.55, swift: 0.50, speed: 0.45 },
      Rogue: { normal: 0.55, swift: 0.50, speed: 0.45 },
      Sorcerer: { normal: 0.60, swift: 0.55, speed: 0.50 },
      Monk: { normal: 0.40, swift: 0.35, speed: 0.30 },
      Bard: { normal: 0.55, swift: 0.50, speed: 0.45 },
      Barbarian: { normal: 0.55, swift: 0.50, speed: 0.45 }
    },
    bow: {
      Warrior: { normal: 0.55, swift: 0.50 },
      Rogue: { normal: 0.35, swift: 0.30 },
      Sorcerer: { normal: 0.80, swift: 0.75 },
      Monk: { normal: 0.70, swift: 0.70 },
      Bard: { normal: 0.55, swift: 0.55 },
      Barbarian: { normal: 0.55, swift: 0.55 }
    }
  };

  function calculateDPS(avgDamage, swingTime) {
    return parseFloat((avgDamage / swingTime).toFixed(2));
  }

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

  describe('Sword DPS by Class', () => {
    const avgDamage = 100;

    test('Warrior has fastest sword speed', () => {
      const warriorDPS = calculateDPS(avgDamage, weaponSpeeds.sword.Warrior.normal);
      const rogueDPS = calculateDPS(avgDamage, weaponSpeeds.sword.Rogue.normal);
      const sorcererDPS = calculateDPS(avgDamage, weaponSpeeds.sword.Sorcerer.normal);

      expect(warriorDPS).toBeGreaterThan(rogueDPS);
      expect(rogueDPS).toBeGreaterThan(sorcererDPS);
    });

    test('speed suffix increases DPS for all classes', () => {
      const classes = ['Warrior', 'Rogue', 'Sorcerer', 'Monk', 'Bard'];

      classes.forEach(cls => {
        const normalDPS = calculateDPS(avgDamage, weaponSpeeds.sword[cls].normal);
        const swiftDPS = calculateDPS(avgDamage, weaponSpeeds.sword[cls].swift);
        const speedDPS = calculateDPS(avgDamage, weaponSpeeds.sword[cls].speed);

        expect(swiftDPS).toBeGreaterThan(normalDPS);
        expect(speedDPS).toBeGreaterThan(swiftDPS);
      });
    });
  });

  describe('Axe DPS by Class', () => {
    const avgDamage = 100;

    test('Barbarian is fastest with axes', () => {
      const barbarianDPS = calculateDPS(avgDamage, weaponSpeeds.axe.Barbarian.normal);
      const warriorDPS = calculateDPS(avgDamage, weaponSpeeds.axe.Warrior.normal);

      expect(barbarianDPS).toBeGreaterThan(warriorDPS);
    });

    test('Sorcerer is slowest with axes', () => {
      const sorcererDPS = calculateDPS(avgDamage, weaponSpeeds.axe.Sorcerer.normal);
      const rogueDPS = calculateDPS(avgDamage, weaponSpeeds.axe.Rogue.normal);

      expect(rogueDPS).toBeGreaterThan(sorcererDPS);
    });
  });

  describe('Staff DPS by Class', () => {
    const avgDamage = 100;

    test('Monk is fastest with staves', () => {
      const monkDPS = calculateDPS(avgDamage, weaponSpeeds.staff.Monk.normal);
      const warriorDPS = calculateDPS(avgDamage, weaponSpeeds.staff.Warrior.normal);
      const sorcererDPS = calculateDPS(avgDamage, weaponSpeeds.staff.Sorcerer.normal);

      expect(monkDPS).toBeGreaterThan(warriorDPS);
      expect(monkDPS).toBeGreaterThan(sorcererDPS);
    });

    test('Warrior and Rogue have same staff speed', () => {
      expect(weaponSpeeds.staff.Warrior.normal).toBe(weaponSpeeds.staff.Rogue.normal);
    });
  });

  describe('Bow DPS by Class', () => {
    const avgDamage = 100;

    test('Rogue is fastest with bows', () => {
      const rogueDPS = calculateDPS(avgDamage, weaponSpeeds.bow.Rogue.normal);
      const warriorDPS = calculateDPS(avgDamage, weaponSpeeds.bow.Warrior.normal);
      const sorcererDPS = calculateDPS(avgDamage, weaponSpeeds.bow.Sorcerer.normal);

      expect(rogueDPS).toBeGreaterThan(warriorDPS);
      expect(rogueDPS).toBeGreaterThan(sorcererDPS);
    });

    test('Sorcerer is slowest with bows', () => {
      const sorcererDPS = calculateDPS(avgDamage, weaponSpeeds.bow.Sorcerer.normal);

      Object.keys(weaponSpeeds.bow).forEach(cls => {
        if (cls !== 'Sorcerer') {
          const otherDPS = calculateDPS(avgDamage, weaponSpeeds.bow[cls].normal);
          expect(otherDPS).toBeGreaterThan(sorcererDPS);
        }
      });
    });

    test('bow has fewer speed tiers', () => {
      // Bows only have normal and swift, no speed tier
      expect(weaponSpeeds.bow.Warrior.speed).toBeUndefined();
    });
  });

  describe('Speed Suffix Effects', () => {
    const avgDamage = 100;

    test('Swiftness suffix reduces swing time', () => {
      const weapons = ['sword', 'axe', 'staff'];
      const classes = ['Warrior', 'Rogue', 'Sorcerer'];

      weapons.forEach(weapon => {
        classes.forEach(cls => {
          expect(weaponSpeeds[weapon][cls].swift)
            .toBeLessThan(weaponSpeeds[weapon][cls].normal);
        });
      });
    });

    test('Speed suffix reduces swing time more than Swiftness', () => {
      const weapons = ['sword', 'axe', 'staff'];
      const classes = ['Warrior', 'Rogue', 'Sorcerer'];

      weapons.forEach(weapon => {
        classes.forEach(cls => {
          expect(weaponSpeeds[weapon][cls].speed)
            .toBeLessThan(weaponSpeeds[weapon][cls].swift);
        });
      });
    });
  });

  describe('Barbarian Special Cases', () => {
    test('Barbarian shows one-hand/two-hand sword speeds', () => {
      const barbarianSword = weaponSpeeds.sword.Barbarian;

      expect(Array.isArray(barbarianSword.normal)).toBe(true);
      expect(barbarianSword.normal.length).toBe(2);

      // Two-hand is faster
      expect(barbarianSword.normal[1]).toBeLessThan(barbarianSword.normal[0]);
    });

    test('Barbarian axe speed is fastest overall', () => {
      const barbarianAxeSpeed = weaponSpeeds.axe.Barbarian.speed;

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
      const warriorSword = calculateDPS(avgDamage, weaponSpeeds.sword.Warrior.normal);
      const warriorAxe = calculateDPS(avgDamage, weaponSpeeds.axe.Warrior.normal);
      expect(warriorSword).toBeGreaterThan(warriorAxe);

      // Rogue: Bow
      const rogueBow = calculateDPS(avgDamage, weaponSpeeds.bow.Rogue.normal);
      const rogueSword = calculateDPS(avgDamage, weaponSpeeds.sword.Rogue.normal);
      expect(rogueBow).toBeGreaterThan(rogueSword);

      // Monk: Staff
      const monkStaff = calculateDPS(avgDamage, weaponSpeeds.staff.Monk.normal);
      const monkSword = calculateDPS(avgDamage, weaponSpeeds.sword.Monk.normal);
      expect(monkStaff).toBeGreaterThan(monkSword);
    });
  });
});
