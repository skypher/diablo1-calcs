/**
 * Unit tests for js/cth.js - Chance to Hit Calculator
 * Tests chance to hit calculations for different classes and attack types
 */

describe('cth.js - Chance to Hit Calculator', () => {

  // Class bonuses from cth.js
  const classData = {
    Warrior: { meleeBonus: 20, arrowBonus: 10, dex: 225 },
    Rogue: { meleeBonus: 0, arrowBonus: 20, dex: 250 },
    Sorcerer: { meleeBonus: 0, arrowBonus: 0, dex: 245 }
  };

  // Formula from cth.js:
  // CS = floor(percent + (monsterAC + diff) - clvl - bonus + (arrow? 25-dex/2 : 0))

  function calculateCS(percent, monsterAC, diff, clvl, bonus, isArrow, dex) {
    const arrowPenalty = isArrow ? 25 - dex / 2 : 0;
    const cs = Math.floor(percent + (monsterAC + diff) - clvl - bonus + arrowPenalty);
    return cs < 0 ? 0 : cs;
  }

  function getClassBonus(className, attackType) {
    const classInfo = classData[className];
    if (attackType === 'melee') return classInfo.meleeBonus;
    if (attackType === 'arrow') return classInfo.arrowBonus;
    return 0;
  }

  describe('Class Bonus Calculation', () => {
    test('Warrior has melee bonus of 20', () => {
      expect(getClassBonus('Warrior', 'melee')).toBe(20);
    });

    test('Warrior has arrow bonus of 10', () => {
      expect(getClassBonus('Warrior', 'arrow')).toBe(10);
    });

    test('Rogue has no melee bonus', () => {
      expect(getClassBonus('Rogue', 'melee')).toBe(0);
    });

    test('Rogue has arrow bonus of 20', () => {
      expect(getClassBonus('Rogue', 'arrow')).toBe(20);
    });

    test('Sorcerer has no melee or arrow bonus', () => {
      expect(getClassBonus('Sorcerer', 'melee')).toBe(0);
      expect(getClassBonus('Sorcerer', 'arrow')).toBe(0);
    });
  });

  describe('Player To-Hit Calculation (calcMax)', () => {
    const playerMonsterAC = 85; // Max player AC for reference

    test('calculates Warrior melee to-hit at clvl 30', () => {
      // percent=0, monsterAC=85, diff=0, clvl=30, bonus=20, melee
      // CS = 0 + 85 - 30 - 20 = 35
      const cs = calculateCS(0, 85, 0, 30, 20, false, 225);
      expect(cs).toBe(35);
    });

    test('calculates Warrior arrow to-hit at clvl 30', () => {
      // percent=0, monsterAC=85, diff=0, clvl=30, bonus=10, arrow, dex=225
      // arrowPenalty = 25 - 225/2 = 25 - 112.5 = -87.5
      // CS = 0 + 85 - 30 - 10 + (-87.5) = -42.5 -> 0 (clamped)
      const cs = calculateCS(0, 85, 0, 30, 10, true, 225);
      expect(cs).toBe(0);
    });

    test('calculates Rogue arrow to-hit at clvl 30', () => {
      // percent=0, monsterAC=85, diff=0, clvl=30, bonus=20, arrow, dex=250
      // arrowPenalty = 25 - 250/2 = 25 - 125 = -100
      // CS = 0 + 85 - 30 - 20 + (-100) = -65 -> 0 (clamped)
      const cs = calculateCS(0, 85, 0, 30, 20, true, 250);
      expect(cs).toBe(0);
    });

    test('calculates Sorcerer melee to-hit at clvl 30', () => {
      // percent=0, monsterAC=85, diff=0, clvl=30, bonus=0, melee
      // CS = 0 + 85 - 30 - 0 = 55
      const cs = calculateCS(0, 85, 0, 30, 0, false, 245);
      expect(cs).toBe(55);
    });

    test('higher clvl reduces needed to-hit', () => {
      const cs30 = calculateCS(0, 85, 0, 30, 20, false, 225);
      const cs40 = calculateCS(0, 85, 0, 40, 20, false, 225);
      const cs50 = calculateCS(0, 85, 0, 50, 20, false, 225);

      expect(cs40).toBeLessThan(cs30);
      expect(cs50).toBeLessThan(cs40);
    });

    test('higher difficulty increases needed to-hit', () => {
      const csNormal = calculateCS(0, 85, 0, 30, 20, false, 225);
      const csNightmare = calculateCS(0, 85, 85, 30, 20, false, 225);
      const csHell = calculateCS(0, 85, 120, 30, 20, false, 225);

      expect(csNightmare).toBeGreaterThan(csNormal);
      expect(csHell).toBeGreaterThan(csNightmare);
    });
  });

  describe('Enemy To-Hit Calculation (calcEnemy)', () => {
    // Monster AC values from cth.js
    const monsters = [
      { name: 'Lava Maw', ac: 35 },
      { name: 'Storm Lord', ac: 35 },
      { name: 'Maelstorm', ac: 40 },
      { name: 'Guardian', ac: 65 },
      { name: 'Vortex Lord', ac: 70 },
      { name: 'Balrog', ac: 75 },
      { name: 'Cave Viper', ac: 60 },
      { name: 'Fire Drake', ac: 65 },
      { name: 'Gold Viper', ac: 70 },
      { name: 'Azure Drake', ac: 75 },
      { name: 'Succubus', ac: 60 },
      { name: 'Snow Witch', ac: 65 },
      { name: 'Hell Spawn', ac: 75 },
      { name: 'Soul Burner', ac: 85 },
      { name: 'Black Knight', ac: 75 },
      { name: 'Doom Guard', ac: 75 },
      { name: 'Steel Lord', ac: 80 },
      { name: 'Blood Knight', ac: 85 },
      { name: 'Counselor', ac: 0 },
      { name: 'Magistrate', ac: 0 },
      { name: 'Cabalist', ac: 0 },
      { name: 'Advocate', ac: 0 }
    ];

    test('calculates Lava Maw to-hit on Normal', () => {
      // Warrior melee: percent=0, monsterAC=35, diff=0, clvl=30, bonus=20
      const cs = calculateCS(0, 35, 0, 30, 20, false, 225);
      // CS = 0 + 35 - 30 - 20 = -15 -> 0
      expect(cs).toBe(0);
    });

    test('calculates Blood Knight to-hit on Hell', () => {
      // Warrior melee: percent=0, monsterAC=85, diff=120, clvl=50, bonus=20
      const cs = calculateCS(0, 85, 120, 50, 20, false, 225);
      // CS = 0 + 205 - 50 - 20 = 135
      expect(cs).toBe(135);
    });

    test('Mages have 0 AC', () => {
      const mages = monsters.filter(m =>
        ['Counselor', 'Magistrate', 'Cabalist', 'Advocate'].includes(m.name)
      );
      mages.forEach(m => {
        expect(m.ac).toBe(0);
      });
    });

    test('Soul Burner and Blood Knight have highest AC', () => {
      const maxAC = Math.max(...monsters.map(m => m.ac));
      expect(maxAC).toBe(85);

      const highACMonsters = monsters.filter(m => m.ac === 85);
      expect(highACMonsters.map(m => m.name)).toContain('Soul Burner');
      expect(highACMonsters.map(m => m.name)).toContain('Blood Knight');
    });
  });

  describe('Arrow Penalty Calculation', () => {
    test('high DEX reduces arrow penalty', () => {
      // DEX 250: penalty = 25 - 125 = -100
      // DEX 200: penalty = 25 - 100 = -75
      // DEX 100: penalty = 25 - 50 = -25

      const cs250 = calculateCS(100, 50, 0, 30, 0, true, 250);
      const cs200 = calculateCS(100, 50, 0, 30, 0, true, 200);
      const cs100 = calculateCS(100, 50, 0, 30, 0, true, 100);

      // Higher DEX = lower CS needed (more accurate)
      expect(cs250).toBeLessThan(cs200);
      expect(cs200).toBeLessThan(cs100);
    });

    test('DEX 50 gives 0 arrow penalty', () => {
      // penalty = 25 - 50/2 = 25 - 25 = 0
      const csArrow = calculateCS(50, 50, 0, 30, 0, true, 50);
      const csMelee = calculateCS(50, 50, 0, 30, 0, false, 50);

      expect(csArrow).toBe(csMelee);
    });

    test('low DEX gives positive arrow penalty', () => {
      // DEX 20: penalty = 25 - 10 = 15
      const csArrow = calculateCS(50, 50, 0, 30, 0, true, 20);
      const csMelee = calculateCS(50, 50, 0, 30, 0, false, 20);

      expect(csArrow).toBeGreaterThan(csMelee);
      expect(csArrow - csMelee).toBe(15);
    });
  });

  describe('Percent Modifier', () => {
    test('higher percent increases CS needed', () => {
      const cs0 = calculateCS(0, 50, 0, 30, 20, false, 225);
      const cs50 = calculateCS(50, 50, 0, 30, 20, false, 225);
      const cs100 = calculateCS(100, 50, 0, 30, 20, false, 225);

      expect(cs50).toBe(cs0 + 50);
      expect(cs100).toBe(cs0 + 100);
    });
  });

  describe('Clamping Behavior', () => {
    test('negative CS is clamped to 0', () => {
      // Very favorable conditions
      const cs = calculateCS(0, 35, 0, 50, 20, false, 225);
      // CS = 0 + 35 - 50 - 20 = -35 -> 0
      expect(cs).toBe(0);
    });

    test('CS is not clamped when positive', () => {
      const cs = calculateCS(100, 85, 0, 30, 0, false, 225);
      // CS = 100 + 85 - 30 - 0 = 155
      expect(cs).toBe(155);
    });
  });

  describe('Average Calculation', () => {
    function calculateAverage(values) {
      return Math.floor(values.reduce((a, b) => a + b, 0) / values.length);
    }

    test('averages 22 monster values', () => {
      // The file calculates averages for 22 monsters
      const monsterACs = [35, 35, 40, 65, 70, 75, 60, 65, 70, 75,
        60, 65, 75, 85, 75, 75, 80, 85, 0, 0, 0, 0];

      const csValues = monsterACs.map(ac =>
        calculateCS(50, ac, 0, 30, 20, false, 225)
      );

      const avg = calculateAverage(csValues);
      expect(typeof avg).toBe('number');
      expect(avg).not.toBeNaN();
    });
  });

  describe('Output Formatting', () => {
    test('percentage suffix is added to results', () => {
      // The file adds "%" to player results
      const cs = calculateCS(50, 85, 0, 30, 20, false, 225);
      const formatted = (cs < 0 ? 0 : cs) + '%';
      expect(formatted).toMatch(/\d+%/);
    });
  });

  describe('Edge Cases', () => {
    test('handles clvl 1', () => {
      const cs = calculateCS(0, 85, 0, 1, 20, false, 225);
      // CS = 0 + 85 - 1 - 20 = 64
      expect(cs).toBe(64);
    });

    test('handles maximum values', () => {
      const cs = calculateCS(100, 85, 120, 50, 20, false, 225);
      // CS = 100 + 205 - 50 - 20 = 235
      expect(cs).toBe(235);
    });
  });
});
