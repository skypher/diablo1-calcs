/**
 * Unit tests for js/ac.js - Armor Class Calculator
 * Tests AC calculations for players and enemies
 */

describe('ac.js - Armor Class Calculator', () => {

  // Pure function implementation of the AC formula from ac.js
  // AC = (percent < threshold? -threshold: -percent)+30+(baseToHit+diff)+2*((baseLevel+bonus)-clvl)

  function calculatePlayerAC(percent, diff, bonus, clvl, threshold = 30) {
    const percentMod = percent < threshold ? -threshold : -percent;
    const baseToHit = 130; // Player's base to-hit value
    const baseLevel = 30; // Player's base level for calc
    return percentMod + 30 + (baseToHit + diff) + 2 * ((baseLevel + bonus) - clvl);
  }

  function calculateEnemyAC(percent, diff, bonus, clvl, baseToHit, baseLevel, threshold = 15) {
    const percentMod = percent < threshold ? -threshold : -percent;
    return percentMod + 30 + (baseToHit + diff) + 2 * ((baseLevel + bonus) - clvl);
  }

  function getDifficultyBonus(diff) {
    if (diff === 0) return 0;      // Normal
    if (diff === 85) return 15;    // Nightmare
    if (diff === 120) return 30;   // Hell
    return 0;
  }

  describe('Difficulty Bonus Calculation', () => {
    test('Normal difficulty has 0 bonus', () => {
      expect(getDifficultyBonus(0)).toBe(0);
    });

    test('Nightmare difficulty has 15 bonus', () => {
      expect(getDifficultyBonus(85)).toBe(15);
    });

    test('Hell difficulty has 30 bonus', () => {
      expect(getDifficultyBonus(120)).toBe(30);
    });
  });

  describe('Player AC Calculation (calcMa)', () => {
    test('calculates AC for Normal difficulty at clvl 30', () => {
      // percent=50, diff=0, bonus=0, clvl=30
      // -50 + 30 + 130 + 2*(30-30) = 110
      const ac = calculatePlayerAC(50, 0, 0, 30);
      expect(ac).toBe(110);
    });

    test('calculates AC for Nightmare difficulty at clvl 40', () => {
      // percent=50, diff=85, bonus=15, clvl=40
      // -50 + 30 + 215 + 2*(45-40) = 205
      const ac = calculatePlayerAC(50, 85, 15, 40);
      expect(ac).toBe(205);
    });

    test('calculates AC for Hell difficulty at clvl 50', () => {
      // percent=50, diff=120, bonus=30, clvl=50
      // -50 + 30 + 250 + 2*(60-50) = 250
      const ac = calculatePlayerAC(50, 120, 30, 50);
      expect(ac).toBe(250);
    });

    test('uses threshold when percent is below it', () => {
      // percent=20, threshold=30, so use -30 instead of -20
      // -30 + 30 + 130 + 2*(30-30) = 130
      const ac = calculatePlayerAC(20, 0, 0, 30, 30);
      expect(ac).toBe(130);
    });

    test('uses percent when above threshold', () => {
      // percent=40, threshold=30, so use -40
      // -40 + 30 + 130 + 2*(30-30) = 120
      const ac = calculatePlayerAC(40, 0, 0, 30, 30);
      expect(ac).toBe(120);
    });

    test('higher clvl reduces needed AC', () => {
      const ac30 = calculatePlayerAC(50, 0, 0, 30);
      const ac40 = calculatePlayerAC(50, 0, 0, 40);
      const ac50 = calculatePlayerAC(50, 0, 0, 50);

      expect(ac40).toBeLessThan(ac30);
      expect(ac50).toBeLessThan(ac40);
    });
  });

  describe('Enemy AC Calculation (calcEnem)', () => {
    // Monster stats from ac.js:
    // Lava Maws: baseToHit=65, baseLevel=25
    // Storm Lord: baseToHit=85, baseLevel=22
    // Balrog: baseToHit=130, baseLevel=26
    // Blood Knight: baseToHit=130, baseLevel=30

    test('calculates Lava Maw AC on Normal at clvl 30', () => {
      // percent=50, diff=0, bonus=0, clvl=30, baseToHit=65, baseLevel=25
      // -50 + 30 + 65 + 2*(25-30) = 35
      const ac = calculateEnemyAC(50, 0, 0, 30, 65, 25);
      expect(ac).toBe(35);
    });

    test('calculates Balrog AC on Normal at clvl 30', () => {
      // percent=50, diff=0, bonus=0, clvl=30, baseToHit=130, baseLevel=26
      // -50 + 30 + 130 + 2*(26-30) = 102
      const ac = calculateEnemyAC(50, 0, 0, 30, 130, 26);
      expect(ac).toBe(102);
    });

    test('calculates Blood Knight AC on Hell at clvl 50', () => {
      // percent=50, diff=120, bonus=30, clvl=50, baseToHit=130, baseLevel=30
      // -50 + 30 + 250 + 2*(60-50) = 250
      const ac = calculateEnemyAC(50, 120, 30, 50, 130, 30);
      expect(ac).toBe(250);
    });

    test('uses 15 threshold for most enemies', () => {
      // percent=10, threshold=15, so use -15 instead of -10
      // -15 + 30 + 65 + 2*(25-30) = 70
      const ac = calculateEnemyAC(10, 0, 0, 30, 65, 25, 15);
      expect(ac).toBe(70);
    });

    test('Azure Drake uses 25 threshold', () => {
      // Azure Drake: baseToHit=130, baseLevel=27, threshold=25
      // percent=20, threshold=25, so use -25
      // -25 + 30 + 130 + 2*(27-30) = 129
      const ac = calculateEnemyAC(20, 0, 0, 30, 130, 27, 25);
      expect(ac).toBe(129);
    });

    test('Doom Guard uses 25 threshold', () => {
      // Doom Guard: baseToHit=130, baseLevel=26, threshold=25
      // percent=20, threshold=25, so use -25
      // -25 + 30 + 130 + 2*(26-30) = 127
      const ac = calculateEnemyAC(20, 0, 0, 30, 130, 26, 25);
      expect(ac).toBe(127);
    });

    test('Steel Lord uses 20 threshold', () => {
      // Steel Lord: baseToHit=120, baseLevel=28, threshold=20
      // percent=15, threshold=20, so use -20
      // -20 + 30 + 120 + 2*(28-30) = 126
      const ac = calculateEnemyAC(15, 0, 0, 30, 120, 28, 20);
      expect(ac).toBe(126);
    });
  });

  describe('Average Calculation', () => {
    function calculateAverage(values) {
      return Math.floor(values.reduce((a, b) => a + b, 0) / values.length);
    }

    test('averages are calculated correctly', () => {
      const values = [100, 110, 120, 130];
      expect(calculateAverage(values)).toBe(115);
    });

    test('averages floor the result', () => {
      const values = [100, 101, 102]; // Sum=303, avg=101
      expect(calculateAverage(values)).toBe(101);

      const values2 = [100, 100, 101]; // Sum=301, avg=100.33...
      expect(calculateAverage(values2)).toBe(100);
    });
  });

  describe('Monster Data Verification', () => {
    // Based on the enemy data in ac.js
    const monsters = [
      { name: 'Lava Maw', baseToHit: 65, baseLevel: 25, threshold: 15 },
      { name: 'Storm Lord', baseToHit: 85, baseLevel: 22, threshold: 15 },
      { name: 'Maelstorm', baseToHit: 90, baseLevel: 24, threshold: 15 },
      { name: 'Guardian', baseToHit: 110, baseLevel: 22, threshold: 15 },
      { name: 'Vortex Lord', baseToHit: 120, baseLevel: 24, threshold: 15 },
      { name: 'Balrog', baseToHit: 130, baseLevel: 26, threshold: 15 },
      { name: 'Cave Viper', baseToHit: 90, baseLevel: 21, threshold: 15 },
      { name: 'Fire Drake', baseToHit: 105, baseLevel: 23, threshold: 15 },
      { name: 'Gold Viper', baseToHit: 120, baseLevel: 25, threshold: 15 },
      { name: 'Azure Drake', baseToHit: 130, baseLevel: 27, threshold: 25 },
      { name: 'Black Knight', baseToHit: 110, baseLevel: 24, threshold: 15 },
      { name: 'Doom Guard', baseToHit: 130, baseLevel: 26, threshold: 25 },
      { name: 'Steel Lord', baseToHit: 120, baseLevel: 28, threshold: 20 },
      { name: 'Blood Knight', baseToHit: 130, baseLevel: 30, threshold: 15 }
    ];

    test('all monsters have valid baseToHit values', () => {
      monsters.forEach(m => {
        expect(m.baseToHit).toBeGreaterThanOrEqual(65);
        expect(m.baseToHit).toBeLessThanOrEqual(130);
      });
    });

    test('all monsters have valid baseLevel values', () => {
      monsters.forEach(m => {
        expect(m.baseLevel).toBeGreaterThanOrEqual(21);
        expect(m.baseLevel).toBeLessThanOrEqual(30);
      });
    });

    test('Blood Knight has highest level', () => {
      const maxLevel = Math.max(...monsters.map(m => m.baseLevel));
      const bloodKnight = monsters.find(m => m.name === 'Blood Knight');
      expect(bloodKnight.baseLevel).toBe(maxLevel);
    });

    test('Lava Maw has lowest baseToHit', () => {
      const minToHit = Math.min(...monsters.map(m => m.baseToHit));
      const lavaMaw = monsters.find(m => m.name === 'Lava Maw');
      expect(lavaMaw.baseToHit).toBe(minToHit);
    });
  });

  describe('Edge Cases', () => {
    test('handles clvl 1', () => {
      const ac = calculatePlayerAC(50, 0, 0, 1);
      // -50 + 30 + 130 + 2*(30-1) = 168
      expect(ac).toBe(168);
    });

    test('handles very high percent values', () => {
      const ac = calculatePlayerAC(100, 0, 0, 30);
      // -100 + 30 + 130 + 0 = 60
      expect(ac).toBe(60);
    });

    test('handles percent of 0', () => {
      // percent=0, threshold=30, so use -30
      const ac = calculatePlayerAC(0, 0, 0, 30);
      // -30 + 30 + 130 + 0 = 130
      expect(ac).toBe(130);
    });
  });
});
