/**
 * Unit tests for js/arm.js - Armor Calculator
 * Tests the simple AC calculation with rate modifier
 */

const { calculateAC } = require('../js/arm.js');

describe('arm.js - Armor Calculator', () => {

  describe('AcCalc Function', () => {
    test('returns base AC with 0% rate modifier', () => {
      expect(calculateAC(100, 0)).toBe(100);
      expect(calculateAC(50, 0)).toBe(50);
      expect(calculateAC(1, 0)).toBe(1);
    });

    test('increases AC with positive rate modifier', () => {
      // 100 * 1.50 = 150
      expect(calculateAC(100, 50)).toBe(150);

      // 100 * 2.00 = 200
      expect(calculateAC(100, 100)).toBe(200);

      // 100 * 1.25 = 125
      expect(calculateAC(100, 25)).toBe(125);
    });

    test('decreases AC with negative rate modifier', () => {
      // 100 * 0.50 = 50
      expect(calculateAC(100, -50)).toBe(50);

      // 100 * 0.75 = 75
      expect(calculateAC(100, -25)).toBe(75);

      // 100 * 0.10 = 9.999... due to floating point, floors to 9
      expect(calculateAC(100, -90)).toBe(9);
    });

    test('floors the result', () => {
      // 10 * 1.33 = 13.3 -> 13
      expect(calculateAC(10, 33)).toBe(13);

      // 15 * 1.10 = 16.5 -> 16
      expect(calculateAC(15, 10)).toBe(16);

      // 7 * 1.50 = 10.5 -> 10
      expect(calculateAC(7, 50)).toBe(10);
    });

    test('handles zero base AC', () => {
      expect(calculateAC(0, 100)).toBe(0);
      expect(calculateAC(0, -50)).toBe(0);
    });

    test('handles very high rate modifiers', () => {
      // 100 * 3.00 = 300
      expect(calculateAC(100, 200)).toBe(300);

      // 50 * 4.00 = 200
      expect(calculateAC(50, 300)).toBe(200);
    });

    test('handles -100% rate modifier (zero result)', () => {
      // 100 * 0.00 = 0
      expect(calculateAC(100, -100)).toBe(0);
    });

    test('handles small AC values', () => {
      expect(calculateAC(1, 100)).toBe(2);  // 1 * 2.00 = 2
      expect(calculateAC(2, 50)).toBe(3);   // 2 * 1.50 = 3
      expect(calculateAC(3, 33)).toBe(3);   // 3 * 1.33 = 3.99 -> 3
    });

    test('typical armor calculations', () => {
      // Quilted Armor base AC ~5, no modifier
      expect(calculateAC(5, 0)).toBe(5);

      // Leather Armor with +30% AC
      expect(calculateAC(10, 30)).toBe(13);

      // Full Plate with +75% AC
      expect(calculateAC(60, 75)).toBe(105);

      // Godly Plate (+225% AC, effectively)
      expect(calculateAC(75, 200)).toBe(225);
    });
  });

  describe('Rate Modifier Ranges', () => {
    test('standard prefix modifiers', () => {
      const baseAC = 50;

      // Vulnerable (-100%)
      expect(calculateAC(baseAC, -100)).toBe(0);

      // No modifier (0%)
      expect(calculateAC(baseAC, 0)).toBe(50);

      // Fine (+20-30%)
      expect(calculateAC(baseAC, 20)).toBe(60);
      expect(calculateAC(baseAC, 30)).toBe(65);

      // Saintly (+110-145%)
      expect(calculateAC(baseAC, 110)).toBe(105);
      expect(calculateAC(baseAC, 145)).toBe(122);

      // Godly (+150-225%)
      expect(calculateAC(baseAC, 150)).toBe(125);
      expect(calculateAC(baseAC, 225)).toBe(162);
    });
  });

  describe('Edge Cases', () => {
    test('handles string inputs (form values)', () => {
      // The original function uses *1 to convert strings
      // Our test function does the same
      expect(calculateAC('100', '50')).toBe(150);
      expect(calculateAC('50', '-25')).toBe(37);
    });

    test('handles negative base AC', () => {
      // Shouldn't happen in game, but test the math
      expect(calculateAC(-10, 50)).toBe(-15); // -10 * 1.5 = -15
    });

    test('very large values', () => {
      expect(calculateAC(1000, 200)).toBe(3000);
    });
  });

  describe('Real Item Examples', () => {
    // Based on actual Diablo items
    const items = [
      { name: 'Buckler', baseAC: 5, expectedMin: 5, expectedMax: 16 }, // With Godly
      { name: 'Large Shield', baseAC: 15, expectedMin: 15, expectedMax: 48 },
      { name: 'Gothic Shield', baseAC: 25, expectedMin: 25, expectedMax: 81 },
      { name: 'Tower Shield', baseAC: 30, expectedMin: 30, expectedMax: 97 },
      { name: 'Quilted Armor', baseAC: 7, expectedMin: 7, expectedMax: 22 },
      { name: 'Leather Armor', baseAC: 13, expectedMin: 13, expectedMax: 42 },
      { name: 'Full Plate Mail', baseAC: 75, expectedMin: 75, expectedMax: 243 }
    ];

    items.forEach(item => {
      test(`${item.name} AC range is correct`, () => {
        // No modifier
        expect(calculateAC(item.baseAC, 0)).toBe(item.expectedMin);

        // With Godly (+225%)
        expect(calculateAC(item.baseAC, 225)).toBe(item.expectedMax);
      });
    });
  });

  describe('Computation Accuracy', () => {
    test('maintains precision before flooring', () => {
      // Test that fractional rates work correctly
      // 100 * 1.01 = 101
      expect(calculateAC(100, 1)).toBe(101);

      // 100 * 1.99 = 199
      expect(calculateAC(100, 99)).toBe(199);

      // 99 * 1.01 = 99.99 -> 99
      expect(calculateAC(99, 1)).toBe(99);
    });

    test('consistent with integer math', () => {
      // Verify the floor operation is consistent
      for (let base = 1; base <= 100; base += 10) {
        for (let rate = -50; rate <= 200; rate += 25) {
          const result = calculateAC(base, rate);
          const expected = Math.floor(base * (1 + rate * 0.01));
          expect(result).toBe(expected);
        }
      }
    });
  });
});
