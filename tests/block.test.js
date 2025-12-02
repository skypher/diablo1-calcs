/**
 * Unit tests for js/block.js - Block Calculator
 * Tests block chance calculations for players and enemies
 */

const {
  getDifficultyBonus,
  calculatePlayerDEX,
  calculateEnemyDEX,
  blockMonsterData,
  calculateAllMonstersDEX,
  calculateAverageDEX
} = require('../js/block.js');

describe('block.js - Block Calculator', () => {

  // Block formula from block.js:
  // DEX = percent + 2*((baseLevel + bonus) - clvl)

  function calculateBlockDEX(percent, bonus, clvl, baseLevel) {
    return percent + 2 * ((baseLevel + bonus) - clvl);
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

  describe('Player Block Calculation (calcM)', () => {
    const playerBaseLevel = 30; // Max player level stat

    test('calculates DEX needed for max block at clvl 30 on Normal', () => {
      // percent=0 (0% block), bonus=0, clvl=30, baseLevel=30
      // DEX = 0 + 2*(30-30) = 0
      const dex = calculateBlockDEX(0, 0, 30, playerBaseLevel);
      expect(dex).toBe(0);
    });

    test('calculates DEX needed at clvl 40 on Normal', () => {
      // percent=0, bonus=0, clvl=40, baseLevel=30
      // DEX = 0 + 2*(30-40) = -20
      const dex = calculateBlockDEX(0, 0, 40, playerBaseLevel);
      expect(dex).toBe(-20);
    });

    test('calculates DEX needed at clvl 50 on Normal', () => {
      // percent=0, bonus=0, clvl=50, baseLevel=30
      // DEX = 0 + 2*(30-50) = -40
      const dex = calculateBlockDEX(0, 0, 50, playerBaseLevel);
      expect(dex).toBe(-40);
    });

    test('calculates DEX needed on Nightmare difficulty', () => {
      // percent=0, bonus=15 (NM), clvl=30, baseLevel=30
      // DEX = 0 + 2*(45-30) = 30
      const dex = calculateBlockDEX(0, 15, 30, playerBaseLevel);
      expect(dex).toBe(30);
    });

    test('calculates DEX needed on Hell difficulty', () => {
      // percent=0, bonus=30 (Hell), clvl=30, baseLevel=30
      // DEX = 0 + 2*(60-30) = 60
      const dex = calculateBlockDEX(0, 30, 30, playerBaseLevel);
      expect(dex).toBe(60);
    });

    test('includes block percent modifier', () => {
      // percent=50 (50% block), bonus=0, clvl=30, baseLevel=30
      // DEX = 50 + 2*(30-30) = 50
      const dex = calculateBlockDEX(50, 0, 30, playerBaseLevel);
      expect(dex).toBe(50);
    });
  });

  describe('Enemy Block Calculation (calcEne)', () => {
    // Monster base levels from block.js
    const monsters = [
      { name: 'Lava Maw', baseLevel: 25 },
      { name: 'Storm Lord', baseLevel: 22 },
      { name: 'Maelstorm', baseLevel: 24 },
      { name: 'Guardian', baseLevel: 22 },
      { name: 'Vortex Lord', baseLevel: 24 },
      { name: 'Balrog', baseLevel: 26 },
      { name: 'Cave Viper', baseLevel: 21 },
      { name: 'Fire Drake', baseLevel: 23 },
      { name: 'Gold Viper', baseLevel: 25 },
      { name: 'Azure Drake', baseLevel: 27 },
      { name: 'Black Knight', baseLevel: 24 },
      { name: 'Doom Guard', baseLevel: 26 },
      { name: 'Steel Lord', baseLevel: 28 },
      { name: 'Blood Knight', baseLevel: 30 }
    ];

    test('calculates Lava Maw block DEX on Normal at clvl 30', () => {
      // percent=0, bonus=0, clvl=30, baseLevel=25
      // DEX = 0 + 2*(25-30) = -10
      const dex = calculateBlockDEX(0, 0, 30, 25);
      expect(dex).toBe(-10);
    });

    test('calculates Blood Knight block DEX on Normal at clvl 30', () => {
      // percent=0, bonus=0, clvl=30, baseLevel=30
      // DEX = 0 + 2*(30-30) = 0
      const dex = calculateBlockDEX(0, 0, 30, 30);
      expect(dex).toBe(0);
    });

    test('calculates Steel Lord block DEX on Hell at clvl 50', () => {
      // percent=0, bonus=30 (Hell), clvl=50, baseLevel=28
      // DEX = 0 + 2*(58-50) = 16
      const dex = calculateBlockDEX(0, 30, 50, 28);
      expect(dex).toBe(16);
    });

    test('all monsters have valid base levels', () => {
      monsters.forEach(m => {
        expect(m.baseLevel).toBeGreaterThanOrEqual(21);
        expect(m.baseLevel).toBeLessThanOrEqual(30);
      });
    });

    test('Blood Knight has highest base level', () => {
      const maxLevel = Math.max(...monsters.map(m => m.baseLevel));
      expect(maxLevel).toBe(30);
    });

    test('Cave Viper has lowest base level', () => {
      const minLevel = Math.min(...monsters.map(m => m.baseLevel));
      expect(minLevel).toBe(21);
    });
  });

  describe('Block Chance with Percent Modifier', () => {
    test('higher percent means easier to block', () => {
      // With 50% block bonus vs 0%
      const dex0 = calculateBlockDEX(0, 0, 30, 25);
      const dex50 = calculateBlockDEX(50, 0, 30, 25);

      // Higher DEX value = easier to achieve max block
      expect(dex50).toBeGreaterThan(dex0);
      expect(dex50 - dex0).toBe(50);
    });

    test('percent directly adds to result', () => {
      for (let percent = 0; percent <= 100; percent += 10) {
        const dex = calculateBlockDEX(percent, 0, 30, 30);
        expect(dex).toBe(percent);
      }
    });
  });

  describe('Level Difference Effects', () => {
    test('each clvl above monster reduces DEX needed by 2', () => {
      const dex30 = calculateBlockDEX(0, 0, 30, 25);
      const dex31 = calculateBlockDEX(0, 0, 31, 25);
      const dex32 = calculateBlockDEX(0, 0, 32, 25);

      expect(dex30 - dex31).toBe(2);
      expect(dex31 - dex32).toBe(2);
    });

    test('each clvl below monster increases DEX needed by 2', () => {
      const dex30 = calculateBlockDEX(0, 0, 30, 25);
      const dex29 = calculateBlockDEX(0, 0, 29, 25);
      const dex28 = calculateBlockDEX(0, 0, 28, 25);

      expect(dex29 - dex30).toBe(2);
      expect(dex28 - dex29).toBe(2);
    });
  });

  describe('Difficulty Scaling', () => {
    test('Nightmare adds 15 to monster effective level', () => {
      const dexNormal = calculateBlockDEX(0, 0, 30, 25);
      const dexNightmare = calculateBlockDEX(0, 15, 30, 25);

      // Difference should be 2 * 15 = 30
      expect(dexNightmare - dexNormal).toBe(30);
    });

    test('Hell adds 30 to monster effective level', () => {
      const dexNormal = calculateBlockDEX(0, 0, 30, 25);
      const dexHell = calculateBlockDEX(0, 30, 30, 25);

      // Difference should be 2 * 30 = 60
      expect(dexHell - dexNormal).toBe(60);
    });
  });

  describe('Average Calculation', () => {
    function calculateAverage(values) {
      return Math.floor(values.reduce((a, b) => a + b, 0) / values.length);
    }

    test('averages are floored', () => {
      const values = [10, 11, 12]; // Sum=33, avg=11
      expect(calculateAverage(values)).toBe(11);

      const values2 = [10, 11, 11]; // Sum=32, avg=10.67
      expect(calculateAverage(values2)).toBe(10);
    });

    test('can calculate average across all monsters', () => {
      const monsterLevels = [25, 22, 24, 22, 24, 26, 21, 23, 25, 27, 24, 26, 28, 30];
      const dexValues = monsterLevels.map(level =>
        calculateBlockDEX(50, 0, 30, level)
      );

      const avg = calculateAverage(dexValues);
      expect(typeof avg).toBe('number');
      expect(avg).not.toBeNaN();
    });
  });

  describe('Edge Cases', () => {
    test('handles clvl 1', () => {
      // Very low level player
      const dex = calculateBlockDEX(0, 0, 1, 25);
      // DEX = 0 + 2*(25-1) = 48
      expect(dex).toBe(48);
    });

    test('handles maximum percent', () => {
      const dex = calculateBlockDEX(100, 0, 30, 25);
      // DEX = 100 + 2*(25-30) = 90
      expect(dex).toBe(90);
    });

    test('handles combined high difficulty and low clvl', () => {
      // Hell difficulty, clvl 1, fighting Blood Knight
      const dex = calculateBlockDEX(0, 30, 1, 30);
      // DEX = 0 + 2*(60-1) = 118
      expect(dex).toBe(118);
    });
  });

  describe('calculatePlayerDEX function', () => {
    test('calculates DEX at clvl 30 on Normal', () => {
      // percent=0, bonus=0, clvl=30
      // DEX = 0 + 2*(30-30) = 0
      expect(calculatePlayerDEX(0, 0, 30)).toBe(0);
    });

    test('calculates DEX at clvl 40 on Normal', () => {
      // percent=0, bonus=0, clvl=40
      // DEX = 0 + 2*(30-40) = -20
      expect(calculatePlayerDEX(0, 0, 40)).toBe(-20);
    });

    test('calculates DEX at clvl 50 on Normal', () => {
      // percent=0, bonus=0, clvl=50
      // DEX = 0 + 2*(30-50) = -40
      expect(calculatePlayerDEX(0, 0, 50)).toBe(-40);
    });

    test('calculates DEX on Nightmare', () => {
      // percent=0, bonus=15, clvl=30
      // DEX = 0 + 2*(45-30) = 30
      expect(calculatePlayerDEX(0, 15, 30)).toBe(30);
    });

    test('calculates DEX on Hell', () => {
      // percent=0, bonus=30, clvl=30
      // DEX = 0 + 2*(60-30) = 60
      expect(calculatePlayerDEX(0, 30, 30)).toBe(60);
    });

    test('includes percent modifier', () => {
      // percent=50, bonus=0, clvl=30
      // DEX = 50 + 2*(30-30) = 50
      expect(calculatePlayerDEX(50, 0, 30)).toBe(50);
    });
  });

  describe('calculateEnemyDEX function', () => {
    test('calculates Lava Maw DEX (baseLevel=25) on Normal', () => {
      // percent=0, bonus=0, clvl=30, baseLevel=25
      // DEX = 0 + 2*(25-30) = -10
      expect(calculateEnemyDEX(0, 0, 30, 25)).toBe(-10);
    });

    test('calculates Blood Knight DEX (baseLevel=30) on Normal', () => {
      // percent=0, bonus=0, clvl=30, baseLevel=30
      // DEX = 0 + 2*(30-30) = 0
      expect(calculateEnemyDEX(0, 0, 30, 30)).toBe(0);
    });

    test('calculates Steel Lord DEX (baseLevel=28) on Hell', () => {
      // percent=0, bonus=30, clvl=50, baseLevel=28
      // DEX = 0 + 2*(58-50) = 16
      expect(calculateEnemyDEX(0, 30, 50, 28)).toBe(16);
    });

    test('includes percent modifier', () => {
      // percent=50, bonus=0, clvl=30, baseLevel=25
      // DEX = 50 + 2*(25-30) = 40
      expect(calculateEnemyDEX(50, 0, 30, 25)).toBe(40);
    });

    test('calculates for all difficulty levels', () => {
      const normalDEX = calculateEnemyDEX(0, 0, 30, 25);
      const nightmareDEX = calculateEnemyDEX(0, 15, 30, 25);
      const hellDEX = calculateEnemyDEX(0, 30, 30, 25);

      expect(nightmareDEX - normalDEX).toBe(30);
      expect(hellDEX - nightmareDEX).toBe(30);
    });
  });

  describe('blockMonsterData Array', () => {
    test('contains 14 monsters', () => {
      expect(blockMonsterData.length).toBe(14);
    });

    test('contains Lava Maw with correct baseLevel', () => {
      const lavaMaw = blockMonsterData.find(m => m.name === 'Lava Maw');
      expect(lavaMaw).toBeDefined();
      expect(lavaMaw.baseLevel).toBe(25);
    });

    test('contains Blood Knight with correct baseLevel', () => {
      const bloodKnight = blockMonsterData.find(m => m.name === 'Blood Knight');
      expect(bloodKnight).toBeDefined();
      expect(bloodKnight.baseLevel).toBe(30);
    });

    test('all monsters have required properties', () => {
      blockMonsterData.forEach(m => {
        expect(m.name).toBeDefined();
        expect(m.baseLevel).toBeGreaterThan(0);
      });
    });
  });

  describe('calculateAllMonstersDEX Function', () => {
    test('returns array of all monster DEXs', () => {
      const results = calculateAllMonstersDEX(50, 0, 30);
      expect(results.length).toBe(14);
      expect(results[0]).toHaveProperty('name');
      expect(results[0]).toHaveProperty('dex');
    });

    test('Lava Maw DEX on Normal at clvl 30', () => {
      const results = calculateAllMonstersDEX(50, 0, 30);
      const lavaMaw = results.find(r => r.name === 'Lava Maw');
      // 50 + 2*(25-30) = 40
      expect(lavaMaw.dex).toBe(40);
    });

    test('Blood Knight DEX on Hell at clvl 50', () => {
      const results = calculateAllMonstersDEX(50, 30, 50);
      const bloodKnight = results.find(r => r.name === 'Blood Knight');
      // 50 + 2*(60-50) = 70
      expect(bloodKnight.dex).toBe(70);
    });

    test('higher difficulty increases all DEXs', () => {
      const normalResults = calculateAllMonstersDEX(50, 0, 30);
      const hellResults = calculateAllMonstersDEX(50, 30, 30);

      normalResults.forEach((normal, i) => {
        expect(hellResults[i].dex).toBeGreaterThan(normal.dex);
      });
    });
  });

  describe('calculateAverageDEX Function', () => {
    test('returns average DEX across all monsters', () => {
      const avg = calculateAverageDEX(50, 0, 30);
      expect(typeof avg).toBe('number');
    });

    test('average is floored', () => {
      const avg = calculateAverageDEX(50, 0, 30);
      expect(avg).toBe(Math.floor(avg));
    });

    test('average increases with difficulty', () => {
      const normalAvg = calculateAverageDEX(50, 0, 30);
      const nightmareAvg = calculateAverageDEX(50, 15, 30);
      const hellAvg = calculateAverageDEX(50, 30, 30);

      expect(nightmareAvg).toBeGreaterThan(normalAvg);
      expect(hellAvg).toBeGreaterThan(nightmareAvg);
    });

    test('average decreases with higher clvl', () => {
      const avgAt30 = calculateAverageDEX(50, 0, 30);
      const avgAt40 = calculateAverageDEX(50, 0, 40);
      const avgAt50 = calculateAverageDEX(50, 0, 50);

      expect(avgAt40).toBeLessThan(avgAt30);
      expect(avgAt50).toBeLessThan(avgAt40);
    });
  });
});
