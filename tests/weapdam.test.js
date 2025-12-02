/**
 * Unit tests for js/weapdam.js - Weapon Damage Calculator
 * Tests weapon damage distribution and AC calculations
 */

const {
  MakeArray,
  MakeBase,
  AcCalc,
  basmax,
  base,
  calcDamageValue,
  calcMinDamage,
  calcMaxDamage,
  calcDamageDistribution,
  calcAverageDamage,
  calcACWithRate,
  validateDamageRange,
  ratePercentToMultiplier,
  getWeaponStats
} = require('../js/weapdam.js');

describe('weapdam.js - Weapon Damage Calculator', () => {

  describe('MakeArray Constructor', () => {
    test('creates array with correct length property', () => {
      const arr = new MakeArray(10);
      expect(arr.length).toBe(10);
    });
  });

  describe('MakeBase Constructor', () => {
    test('creates base item with all properties', () => {
      const item = new MakeBase('Test Weapon', 5, 15, 50, 3);

      expect(item.name).toBe('Test Weapon');
      expect(item.min).toBe(5);
      expect(item.max).toBe(15);
      expect(item.rate).toBe(50);
      expect(item.add).toBe(3);
    });

    test('creates base item with zero values', () => {
      const item = new MakeBase('Custom', 0, 0, 0, 0);

      expect(item.name).toBe('Custom');
      expect(item.min).toBe(0);
      expect(item.max).toBe(0);
      expect(item.rate).toBe(0);
      expect(item.add).toBe(0);
    });
  });

  describe('AcCalc Function', () => {
    test('calculates AC with no rate modifier', () => {
      const form = { base: { value: 100 }, acrate: { value: 0 }, ac: { value: 0 } };
      AcCalc(form);
      expect(form.ac.value).toBe(100);
    });

    test('calculates AC with positive rate modifier', () => {
      const form = { base: { value: 100 }, acrate: { value: 50 }, ac: { value: 0 } };
      // AC = floor(100 * 1.5) = 150
      AcCalc(form);
      expect(form.ac.value).toBe(150);
    });

    test('calculates AC with 100% rate modifier', () => {
      const form = { base: { value: 50 }, acrate: { value: 100 }, ac: { value: 0 } };
      // AC = floor(50 * 2.0) = 100
      AcCalc(form);
      expect(form.ac.value).toBe(100);
    });

    test('calculates AC with negative rate modifier', () => {
      const form = { base: { value: 100 }, acrate: { value: -50 }, ac: { value: 0 } };
      // AC = floor(100 * 0.5) = 50
      AcCalc(form);
      expect(form.ac.value).toBe(50);
    });

    test('floors the result', () => {
      const form = { base: { value: 10 }, acrate: { value: 33 }, ac: { value: 0 } };
      // AC = floor(10 * 1.33) = floor(13.3) = 13
      AcCalc(form);
      expect(form.ac.value).toBe(13);
    });
  });

  describe('Damage Distribution Calculation', () => {
    // Reimplementing ChkDam logic for pure math testing
    function calculateDamageDistribution(dammin, dammax, rate, add) {
      const distribution = [];
      let total = 0;

      for (let i = dammin; i <= dammax; i++) {
        const damage = Math.floor(i * (1 + rate * 0.01)) + add;
        distribution.push(damage);
        total += damage;
      }

      const average = total / (dammax - dammin + 1);
      const minDam = distribution[0];
      const maxDam = distribution[distribution.length - 1];

      return { distribution, average, minDam, maxDam };
    }

    test('calculates damage distribution with no modifiers', () => {
      const result = calculateDamageDistribution(1, 5, 0, 0);
      expect(result.distribution).toEqual([1, 2, 3, 4, 5]);
      expect(result.minDam).toBe(1);
      expect(result.maxDam).toBe(5);
      expect(result.average).toBe(3);
    });

    test('calculates damage distribution with rate modifier', () => {
      const result = calculateDamageDistribution(10, 10, 100, 0);
      // 10 * 2.0 = 20
      expect(result.distribution).toEqual([20]);
      expect(result.minDam).toBe(20);
      expect(result.maxDam).toBe(20);
    });

    test('calculates damage distribution with add modifier', () => {
      const result = calculateDamageDistribution(5, 5, 0, 10);
      // 5 * 1.0 + 10 = 15
      expect(result.distribution).toEqual([15]);
      expect(result.minDam).toBe(15);
      expect(result.maxDam).toBe(15);
    });

    test('calculates damage distribution with both modifiers', () => {
      const result = calculateDamageDistribution(10, 20, 50, 5);
      // Each damage: floor(i * 1.5) + 5
      // 10: floor(15) + 5 = 20
      // 20: floor(30) + 5 = 35
      expect(result.minDam).toBe(20);
      expect(result.maxDam).toBe(35);
    });

    test('average calculation is correct', () => {
      const result = calculateDamageDistribution(1, 4, 0, 0);
      // [1, 2, 3, 4], average = 10/4 = 2.5
      expect(result.average).toBe(2.5);
    });
  });

  describe('Base Weapon Data', () => {
    test('basmax is 98', () => {
      expect(basmax).toBe(98);
    });

    test('base array has correct length', () => {
      expect(base.length).toBe(99);
    });

    test('Dagger has correct stats', () => {
      expect(base[1].name).toBe('Dagger');
      expect(base[1].min).toBe(1);
      expect(base[1].max).toBe(4);
      expect(base[1].rate).toBe(0);
      expect(base[1].add).toBe(0);
    });

    test('Great Sword has correct stats', () => {
      expect(base[12].name).toBe('Great Sword');
      expect(base[12].min).toBe(10);
      expect(base[12].max).toBe(20);
    });

    test('Short Bow has correct stats', () => {
      expect(base[29].name).toBe('Short Bow');
      expect(base[29].min).toBe(1);
      expect(base[29].max).toBe(4);
    });

    test('War Staff has correct stats', () => {
      expect(base[42].name).toBe('War Staff');
      expect(base[42].min).toBe(8);
      expect(base[42].max).toBe(16);
    });

    test('unique weapons have special modifiers', () => {
      // The Rift Bow
      expect(base[44].name).toBe('The Rift Bow');
      expect(base[44].add).toBe(2);

      // The Blackoak Bow has 50% rate
      expect(base[48].name).toBe('The Blackoak Bow');
      expect(base[48].rate).toBe(50);

      // Windforce has 200% rate
      expect(base[52].name).toBe('Windforce');
      expect(base[52].rate).toBe(200);

      // Messerschmidt's Reaver has both rate and add
      expect(base[78].name).toBe("Messerschmidt's Reaver");
      expect(base[78].rate).toBe(200);
      expect(base[78].add).toBe(15);
    });

    test('negative rate modifier exists', () => {
      // The Falcon's Talon has -33% rate
      expect(base[65].name).toBe("The Falcon's Talon");
      expect(base[65].rate).toBe(-33);

      // Schaefer's Hammer has -100% rate
      expect(base[87].name).toBe("Schaefer's Hammer");
      expect(base[87].rate).toBe(-100);
    });
  });

  describe('Weapon Categories', () => {
    test('Dagger is a sword type', () => {
      expect(base[1].name).toBe('Dagger');
    });

    test('Great Sword exists', () => {
      expect(base[12].name).toBe('Great Sword');
    });

    test('bows exist in array', () => {
      expect(base[29].name).toBe('Short Bow');
      expect(base[36].name).toBe('Long War Bow');
    });

    test('staffs exist in array', () => {
      expect(base[38].name).toBe('Short Staff');
      expect(base[42].name).toBe('War Staff');
    });
  });

  describe('Edge Cases', () => {
    function calculateDamageDistribution(dammin, dammax, rate, add) {
      const distribution = [];
      let total = 0;

      for (let i = dammin; i <= dammax; i++) {
        const damage = Math.floor(i * (1 + rate * 0.01)) + add;
        distribution.push(damage);
        total += damage;
      }

      const average = total / (dammax - dammin + 1);
      const minDam = distribution[0];
      const maxDam = distribution[distribution.length - 1];

      return { distribution, average, minDam, maxDam };
    }

    test('handles zero base damage', () => {
      const result = calculateDamageDistribution(0, 0, 0, 0);
      expect(result.distribution).toEqual([0]);
      expect(result.average).toBe(0);
    });

    test('handles single value range', () => {
      const result = calculateDamageDistribution(5, 5, 0, 0);
      expect(result.distribution).toEqual([5]);
      expect(result.average).toBe(5);
    });
  });

  describe('calcDamageValue Function', () => {
    test('calculates damage with no modifiers', () => {
      expect(calcDamageValue(10, 1, 0)).toBe(10);
    });

    test('calculates damage with rate modifier', () => {
      // 10 * 1.5 = 15
      expect(calcDamageValue(10, 1.5, 0)).toBe(15);
    });

    test('calculates damage with add modifier', () => {
      expect(calcDamageValue(10, 1, 5)).toBe(15);
    });

    test('calculates damage with both modifiers', () => {
      // floor(10 * 1.5) + 5 = 20
      expect(calcDamageValue(10, 1.5, 5)).toBe(20);
    });

    test('floors the result', () => {
      // floor(10 * 1.33) + 0 = floor(13.3) = 13
      expect(calcDamageValue(10, 1.33, 0)).toBe(13);
    });
  });

  describe('calcMinDamage and calcMaxDamage Functions', () => {
    test('calcMinDamage with no modifiers', () => {
      expect(calcMinDamage(5, 1, 0)).toBe(5);
    });

    test('calcMaxDamage with no modifiers', () => {
      expect(calcMaxDamage(15, 1, 0)).toBe(15);
    });

    test('calcMinDamage with rate modifier', () => {
      expect(calcMinDamage(10, 2, 0)).toBe(20);
    });

    test('calcMaxDamage with rate and add', () => {
      expect(calcMaxDamage(20, 1.5, 5)).toBe(35);
    });
  });

  describe('calcDamageDistribution Function', () => {
    test('returns array of damage values', () => {
      const dist = calcDamageDistribution(1, 5, 1, 0);
      expect(dist).toEqual([1, 2, 3, 4, 5]);
    });

    test('applies rate modifier to all values', () => {
      const dist = calcDamageDistribution(10, 12, 2, 0);
      expect(dist).toEqual([20, 22, 24]);
    });

    test('applies add modifier to all values', () => {
      const dist = calcDamageDistribution(1, 3, 1, 10);
      expect(dist).toEqual([11, 12, 13]);
    });

    test('handles single value range', () => {
      const dist = calcDamageDistribution(5, 5, 1, 0);
      expect(dist).toEqual([5]);
    });

    test('handles empty range', () => {
      const dist = calcDamageDistribution(5, 4, 1, 0);
      expect(dist).toEqual([]);
    });
  });

  describe('calcAverageDamage Function', () => {
    test('calculates average for simple range', () => {
      const avg = calcAverageDamage(1, 5, 1, 0);
      expect(avg).toBe(3);
    });

    test('calculates average with modifiers', () => {
      const avg = calcAverageDamage(10, 10, 2, 0);
      expect(avg).toBe(20);
    });

    test('returns 0 for empty range', () => {
      const avg = calcAverageDamage(5, 4, 1, 0);
      expect(avg).toBe(0);
    });

    test('handles non-integer average', () => {
      const avg = calcAverageDamage(1, 4, 1, 0);
      // [1, 2, 3, 4] -> 10/4 = 2.5
      expect(avg).toBe(2.5);
    });
  });

  describe('calcACWithRate Function', () => {
    test('calculates AC with no rate', () => {
      expect(calcACWithRate(100, 0)).toBe(100);
    });

    test('calculates AC with positive rate', () => {
      expect(calcACWithRate(100, 50)).toBe(150);
    });

    test('calculates AC with 100% rate', () => {
      expect(calcACWithRate(50, 100)).toBe(100);
    });

    test('calculates AC with negative rate', () => {
      expect(calcACWithRate(100, -50)).toBe(50);
    });

    test('floors the result', () => {
      expect(calcACWithRate(10, 33)).toBe(13);
    });
  });

  describe('validateDamageRange Function', () => {
    test('valid range returns valid: true', () => {
      const result = validateDamageRange(1, 10);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('min greater than max returns error', () => {
      const result = validateDamageRange(10, 5);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Damage Min > Damage Max');
    });

    test('negative min returns error', () => {
      const result = validateDamageRange(-1, 10);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Damage Min < 0');
    });

    test('equal min and max is valid', () => {
      const result = validateDamageRange(5, 5);
      expect(result.valid).toBe(true);
    });

    test('zero min is valid', () => {
      const result = validateDamageRange(0, 5);
      expect(result.valid).toBe(true);
    });
  });

  describe('ratePercentToMultiplier Function', () => {
    test('0% rate is 1.0 multiplier', () => {
      expect(ratePercentToMultiplier(0)).toBe(1);
    });

    test('100% rate is 2.0 multiplier', () => {
      expect(ratePercentToMultiplier(100)).toBe(2);
    });

    test('50% rate is 1.5 multiplier', () => {
      expect(ratePercentToMultiplier(50)).toBe(1.5);
    });

    test('-50% rate is 0.5 multiplier', () => {
      expect(ratePercentToMultiplier(-50)).toBe(0.5);
    });

    test('200% rate is 3.0 multiplier', () => {
      expect(ratePercentToMultiplier(200)).toBe(3);
    });
  });

  describe('getWeaponStats Function', () => {
    test('returns Dagger stats', () => {
      const stats = getWeaponStats(1);
      expect(stats.name).toBe('Dagger');
      expect(stats.min).toBe(1);
      expect(stats.max).toBe(4);
      expect(stats.rate).toBe(0);
      expect(stats.add).toBe(0);
    });

    test('returns Great Sword stats', () => {
      const stats = getWeaponStats(12);
      expect(stats.name).toBe('Great Sword');
      expect(stats.min).toBe(10);
      expect(stats.max).toBe(20);
    });

    test('returns unique weapon stats', () => {
      const stats = getWeaponStats(52);
      expect(stats.name).toBe('Windforce');
      expect(stats.rate).toBe(200);
    });

    test('returns null for invalid index', () => {
      expect(getWeaponStats(-1)).toBeNull();
      expect(getWeaponStats(100)).toBeNull();
    });

    test('returns stats with all properties', () => {
      const stats = getWeaponStats(78);
      expect(stats).toHaveProperty('name');
      expect(stats).toHaveProperty('min');
      expect(stats).toHaveProperty('max');
      expect(stats).toHaveProperty('rate');
      expect(stats).toHaveProperty('add');
    });
  });
});
