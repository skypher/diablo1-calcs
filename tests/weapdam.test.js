/**
 * Unit tests for js/weapdam.js - Weapon Damage Calculator
 * Tests weapon damage distribution and AC calculations
 */

// Pure implementations from weapdam.js

function MakeArray(n) {
  this.length = n;
}

function MakeBase(name, min, max, rate, add) {
  this.name = name;
  this.min = min;
  this.max = max;
  this.rate = rate;
  this.add = add;
}

function AcCalc(theForm) {
  var myAc = theForm.base.value * 1;
  var myAcRate = 1 + theForm.acrate.value * 0.01;
  theForm.ac.value = Math.floor(myAc * myAcRate);
}

// Create base array with weapon data
var basmax = 98;
var base = new MakeArray(basmax + 1);

base[0] = new MakeBase("------- Custom -------", 0, 0, 0, 0);
base[1] = new MakeBase("Dagger", 1, 4, 0, 0);
base[12] = new MakeBase("Great Sword", 10, 20, 0, 0);
base[29] = new MakeBase("Short Bow", 1, 4, 0, 0);
base[36] = new MakeBase("Long War Bow", 1, 14, 0, 0);
base[38] = new MakeBase("Short Staff", 2, 4, 0, 0);
base[42] = new MakeBase("War Staff", 8, 16, 0, 0);
base[44] = new MakeBase("The Rift Bow", 1, 4, 0, 2);
base[48] = new MakeBase("The Blackoak Bow", 1, 6, 50, 0);
base[52] = new MakeBase("Windforce", 1, 14, 200, 0);
base[69] = new MakeBase("The Falcon's Talon", 3, 7, -33, 0);
base[78] = new MakeBase("Messerschmidt's Reaver", 12, 30, 200, 15);
base[87] = new MakeBase("Schaefer's Hammer", 5, 9, -100, 0);

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
      expect(base[69].name).toBe("The Falcon's Talon");
      expect(base[69].rate).toBe(-33);

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
  });
});
