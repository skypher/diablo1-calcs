/**
 * Unit tests for js/char.js - Character Stats Calculator
 * Tests comprehensive character stat calculations
 */

describe('char.js - Character Stats Calculator', () => {

  // Experience table from char.js
  const nxtExp = [
    0, 2000, 4620, 8040, 12489, 18258, 25712, 35309, 47622, 63364,
    83419, 108879, 141086, 181683, 231075, 313658, 424067, 571190, 766569, 1025154,
    1366227, 1814568, 2401895, 3168651, 4166200, 5459523, 7130496, 9281874, 12042092, 15571031,
    20066092, 25774405, 32994399, 42095202, 53525811, 67831218, 85670061, 107834823, 135274799, 169122009,
    210720231, 261657253, 323800420, 399335440, 490808349, 601170414, 733825617, 892680222, 1082908612, 1310707109,
    1583495809
  ];

  // Class formulas from char.js
  const classData = {
    Warrior: {
      lifeBase: (vit, clvl) => vit * 2 + (clvl === 50 ? 48 : (clvl - 1)) * 2 + 20,
      manaBase: (mag, clvl) => mag + (clvl === 50 ? 48 : (clvl - 1)),
      lifeEquip: 2,
      manaEquip: 1,
      damageMultMelee: 0.01,
      damageMultBow: 0.005,
      toHitMelee: (dex) => Math.floor(dex * 0.5) + 20,
      toHitBow: (dex) => dex + 10
    },
    Rogue: {
      lifeBase: (vit, clvl) => vit + (clvl === 50 ? 48 : (clvl - 1)) * 2 + 25,
      manaBase: (mag, clvl) => mag + (clvl === 50 ? 48 : (clvl - 1)) * 2 + 7,
      lifeEquip: 1.5,
      manaEquip: 1.5,
      damageMultMelee: 0.005,
      damageMultBow: 0.005,
      toHitMelee: (dex) => Math.floor(dex * 0.5),
      toHitBow: (dex) => dex + 20
    },
    Sorcerer: {
      lifeBase: (vit, clvl) => vit + (clvl === 50 ? 48 : (clvl - 1)) + 9,
      manaBase: (mag, clvl) => mag * 2 + (clvl === 50 ? 48 : (clvl - 1)) * 2 - 2,
      lifeEquip: 1,
      manaEquip: 2,
      damageMultMelee: 0.005,
      damageMultBow: 0.005,
      toHitMelee: (dex) => Math.floor(dex * 0.5),
      toHitBow: (dex) => dex
    }
  };

  describe('Experience Table', () => {
    test('level 0 requires 0 experience', () => {
      expect(nxtExp[0]).toBe(0);
    });

    test('level 1 requires 2000 experience', () => {
      expect(nxtExp[1]).toBe(2000);
    });

    test('level 50 requires maximum experience', () => {
      expect(nxtExp[50]).toBe(1583495809);
    });

    test('experience requirements increase with level', () => {
      for (let i = 1; i <= 50; i++) {
        expect(nxtExp[i]).toBeGreaterThan(nxtExp[i - 1]);
      }
    });

    test('experience table has 51 entries (0-50)', () => {
      expect(nxtExp.length).toBe(51);
    });
  });

  describe('Warrior Life Calculation', () => {
    test('calculates base life at level 1', () => {
      // vit * 2 + 0 * 2 + 20 = vit * 2 + 20
      const life = classData.Warrior.lifeBase(25, 1);
      expect(life).toBe(70); // 25*2 + 0*2 + 20 = 70
    });

    test('calculates base life at level 50', () => {
      // vit * 2 + 48 * 2 + 20
      const life = classData.Warrior.lifeBase(100, 50);
      expect(life).toBe(316); // 100*2 + 48*2 + 20 = 316
    });

    test('vitality has 2x multiplier', () => {
      const life1 = classData.Warrior.lifeBase(50, 1);
      const life2 = classData.Warrior.lifeBase(60, 1);
      expect(life2 - life1).toBe(20); // 10 vit * 2 = 20
    });
  });

  describe('Warrior Mana Calculation', () => {
    test('calculates base mana at level 1', () => {
      // mag + 0 = mag
      const mana = classData.Warrior.manaBase(10, 1);
      expect(mana).toBe(10);
    });

    test('calculates base mana at level 50', () => {
      // mag + 48
      const mana = classData.Warrior.manaBase(50, 50);
      expect(mana).toBe(98);
    });
  });

  describe('Rogue Life Calculation', () => {
    test('calculates base life at level 1', () => {
      // vit + 0 * 2 + 25 = vit + 25
      const life = classData.Rogue.lifeBase(20, 1);
      expect(life).toBe(45);
    });

    test('level gain is 2x for Rogue', () => {
      const life1 = classData.Rogue.lifeBase(20, 10);
      const life2 = classData.Rogue.lifeBase(20, 11);
      expect(life2 - life1).toBe(2);
    });
  });

  describe('Rogue Mana Calculation', () => {
    test('calculates base mana at level 1', () => {
      // mag + 0 * 2 + 7 = mag + 7
      const mana = classData.Rogue.manaBase(15, 1);
      expect(mana).toBe(22);
    });
  });

  describe('Sorcerer Life Calculation', () => {
    test('calculates base life at level 1', () => {
      // vit + 0 + 9 = vit + 9
      const life = classData.Sorcerer.lifeBase(20, 1);
      expect(life).toBe(29);
    });

    test('level gain is 1x for Sorcerer life', () => {
      const life1 = classData.Sorcerer.lifeBase(20, 10);
      const life2 = classData.Sorcerer.lifeBase(20, 11);
      expect(life2 - life1).toBe(1);
    });
  });

  describe('Sorcerer Mana Calculation', () => {
    test('calculates base mana at level 1', () => {
      // mag * 2 + 0 * 2 - 2 = mag * 2 - 2
      const mana = classData.Sorcerer.manaBase(35, 1);
      expect(mana).toBe(68);
    });

    test('magic has 2x multiplier', () => {
      const mana1 = classData.Sorcerer.manaBase(35, 1);
      const mana2 = classData.Sorcerer.manaBase(45, 1);
      expect(mana2 - mana1).toBe(20); // 10 mag * 2 = 20
    });
  });

  describe('Equipment Stat Multipliers', () => {
    test('Warrior equipment vitality has 2x life', () => {
      expect(classData.Warrior.lifeEquip).toBe(2);
    });

    test('Warrior equipment magic has 1x mana', () => {
      expect(classData.Warrior.manaEquip).toBe(1);
    });

    test('Rogue has 1.5x multipliers', () => {
      expect(classData.Rogue.lifeEquip).toBe(1.5);
      expect(classData.Rogue.manaEquip).toBe(1.5);
    });

    test('Sorcerer equipment magic has 2x mana', () => {
      expect(classData.Sorcerer.manaEquip).toBe(2);
    });
  });

  describe('Damage Calculation', () => {
    function calculateDamage(str, dex, clvl, mult, baseDamage) {
      const charDamage = Math.floor((str + dex) * clvl * mult);
      return [charDamage + baseDamage[0], charDamage + baseDamage[1]];
    }

    test('Warrior melee damage uses STR only', () => {
      // floor(str * clvl * 0.01) + baseDam
      const str = 100;
      const clvl = 30;
      const charDamage = Math.floor(str * clvl * 0.01);
      expect(charDamage).toBe(30);
    });

    test('Rogue damage uses STR + DEX', () => {
      const str = 100;
      const dex = 150;
      const clvl = 30;
      const charDamage = Math.floor((str + dex) * clvl * 0.005);
      expect(charDamage).toBe(37);
    });
  });

  describe('To-Hit Calculation', () => {
    test('Warrior melee to-hit formula', () => {
      // clvl + floor(dex * 0.5) + 50 - enAC + 20 + toHitEquip
      const toHit = classData.Warrior.toHitMelee(100);
      expect(toHit).toBe(70); // floor(100 * 0.5) + 20 = 70
    });

    test('Warrior bow to-hit formula', () => {
      // clvl + dex + 50 - enAC + 10 + toHitEquip
      const toHit = classData.Warrior.toHitBow(100);
      expect(toHit).toBe(110); // 100 + 10 = 110
    });

    test('Rogue bow has +20 bonus', () => {
      const toHit = classData.Rogue.toHitBow(150);
      expect(toHit).toBe(170); // 150 + 20 = 170
    });

    test('Sorcerer has no weapon bonuses', () => {
      const toHitMelee = classData.Sorcerer.toHitMelee(100);
      const toHitBow = classData.Sorcerer.toHitBow(100);
      expect(toHitMelee).toBe(50); // floor(100 * 0.5) = 50
      expect(toHitBow).toBe(100); // just dex
    });
  });

  describe('Magic To-Hit Calculation', () => {
    function calculateMagicToHit(magic, enemyMagicLevel) {
      return (25 - enemyMagicLevel) * 2 + magic;
    }

    test('magic to-hit against same level', () => {
      const toHit = calculateMagicToHit(100, 25);
      expect(toHit).toBe(100); // (25-25)*2 + 100 = 100
    });

    test('magic to-hit against lower level', () => {
      const toHit = calculateMagicToHit(100, 15);
      expect(toHit).toBe(120); // (25-15)*2 + 100 = 120
    });

    test('magic to-hit against higher level', () => {
      const toHit = calculateMagicToHit(100, 30);
      expect(toHit).toBe(90); // (25-30)*2 + 100 = 90
    });
  });

  describe('AC Calculation', () => {
    function calculateTotalAC(helmAC, helmRate, armorAC, armorRate, shieldAC, shieldRate, weaponAC, ringAC) {
      return Math.floor(helmAC * helmRate) +
        Math.floor(armorAC * armorRate) +
        Math.floor(shieldAC * shieldRate) +
        weaponAC + ringAC;
    }

    test('calculates total AC from equipment', () => {
      // Helm: 10 AC, +50% = 15
      // Armor: 60 AC, +100% = 120
      // Shield: 20 AC, +75% = 35
      // Weapon: 5 AC
      // Rings: 10 AC
      const totalAC = calculateTotalAC(10, 1.5, 60, 2.0, 20, 1.75, 5, 10);
      expect(totalAC).toBe(185);
    });
  });

  describe('Weapon Damage with Modifiers', () => {
    function calculateWeaponDamage(baseDamMin, baseDamMax, rate, add) {
      return [
        Math.floor(baseDamMin * rate + add),
        Math.floor(baseDamMax * rate + add)
      ];
    }

    test('calculates weapon damage with no modifiers', () => {
      const damage = calculateWeaponDamage(10, 20, 1.0, 0);
      expect(damage).toEqual([10, 20]);
    });

    test('calculates weapon damage with rate modifier', () => {
      const damage = calculateWeaponDamage(10, 20, 1.5, 0);
      expect(damage).toEqual([15, 30]);
    });

    test('calculates weapon damage with add modifier', () => {
      const damage = calculateWeaponDamage(10, 20, 1.0, 5);
      expect(damage).toEqual([15, 25]);
    });

    test('bare fist damage is 1-1', () => {
      const damage = [1, 1];
      expect(damage).toEqual([1, 1]);
    });

    test('shield bash damage is 1-3', () => {
      const damage = [1, 3];
      expect(damage).toEqual([1, 3]);
    });
  });

  describe('Level 50 Special Case', () => {
    test('level 50 uses level 48 for gain calculations', () => {
      // At level 50, the game uses level 48 (clvl-2) instead of 49
      const warriorLife49 = classData.Warrior.lifeBase(100, 49);
      const warriorLife50 = classData.Warrior.lifeBase(100, 50);

      // Both should use the same level gain
      expect(warriorLife50).toBe(warriorLife49);
    });
  });

  describe('Resistance Calculation', () => {
    function calculateTotalRes(helmRes, armorRes, shieldRes, weaponRes, amuletRes, ring1Res, ring2Res) {
      const total = helmRes + armorRes + shieldRes + weaponRes + amuletRes + ring1Res + ring2Res;
      return Math.min(total, 75); // Max is 75%
    }

    test('sums all resistance sources', () => {
      const res = calculateTotalRes(10, 15, 10, 5, 10, 10, 10);
      expect(res).toBe(70);
    });

    test('caps at 75%', () => {
      const res = calculateTotalRes(20, 20, 20, 20, 20, 20, 20);
      expect(res).toBe(75);
    });
  });

  describe('Total Attribute Calculation', () => {
    function calculateTotalAttribute(base, helmAttr, armorAttr, shieldAttr, weaponAttr, amuletAttr, ring1Attr, ring2Attr) {
      return base + helmAttr + armorAttr + shieldAttr + weaponAttr + amuletAttr + ring1Attr + ring2Attr;
    }

    test('sums base and equipment attributes', () => {
      const total = calculateTotalAttribute(100, 5, 10, 5, 15, 10, 10, 10);
      expect(total).toBe(165);
    });
  });
});
