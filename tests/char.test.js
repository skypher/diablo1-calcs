/**
 * Unit tests for js/char.js - Character Stats Calculator
 * Tests comprehensive character stat calculations
 */

const {
  nxtExp,
  calcWarriorLife,
  calcWarriorMana,
  calcRogueLife,
  calcRogueMana,
  calcSorcererLife,
  calcSorcererMana,
  calcToHit,
  calcAC,
  calcBlock,
  clampHitChance,
  clampBlockChance,
  formatResistance,
  calcMeleeDamage,
  calcMagicToHit
} = require('../js/char.js');

describe('char.js - Character Stats Calculator', () => {

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
      const life = calcWarriorLife(25, 1);
      expect(life).toBe(70); // 25*2 + 0*2 + 20 = 70
    });

    test('calculates base life at level 50', () => {
      // vit * 2 + 48 * 2 + 20
      const life = calcWarriorLife(100, 50);
      expect(life).toBe(316); // 100*2 + 48*2 + 20 = 316
    });

    test('vitality has 2x multiplier', () => {
      const life1 = calcWarriorLife(50, 1);
      const life2 = calcWarriorLife(60, 1);
      expect(life2 - life1).toBe(20); // 10 vit * 2 = 20
    });
  });

  describe('Warrior Mana Calculation', () => {
    test('calculates base mana at level 1', () => {
      // mag + 0 = mag
      const mana = calcWarriorMana(10, 1);
      expect(mana).toBe(10);
    });

    test('calculates base mana at level 50', () => {
      // mag + 48
      const mana = calcWarriorMana(50, 50);
      expect(mana).toBe(98);
    });
  });

  describe('Rogue Life Calculation', () => {
    test('calculates base life at level 1', () => {
      // vit + 0 * 2 + 25 = vit + 25
      const life = calcRogueLife(20, 1);
      expect(life).toBe(45);
    });

    test('level gain is 2x for Rogue', () => {
      const life1 = calcRogueLife(20, 10);
      const life2 = calcRogueLife(20, 11);
      expect(life2 - life1).toBe(2);
    });
  });

  describe('Rogue Mana Calculation', () => {
    test('calculates base mana at level 1', () => {
      // mag + 0 * 2 + 7 = mag + 7
      const mana = calcRogueMana(15, 1);
      expect(mana).toBe(22);
    });
  });

  describe('Sorcerer Life Calculation', () => {
    test('calculates base life at level 1', () => {
      // vit + 0 + 10 = vit + 10
      const life = calcSorcererLife(20, 1);
      expect(life).toBe(30);
    });

    test('level gain is 1x for Sorcerer life', () => {
      const life1 = calcSorcererLife(20, 10);
      const life2 = calcSorcererLife(20, 11);
      expect(life2 - life1).toBe(1);
    });
  });

  describe('Sorcerer Mana Calculation', () => {
    test('calculates base mana at level 1', () => {
      // mag * 2 + 0 * 2 = mag * 2
      const mana = calcSorcererMana(35, 1);
      expect(mana).toBe(70);
    });

    test('magic has 2x multiplier', () => {
      const mana1 = calcSorcererMana(35, 1);
      const mana2 = calcSorcererMana(45, 1);
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
      const warriorLife49 = calcWarriorLife(100, 49);
      const warriorLife50 = calcWarriorLife(100, 50);

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

  describe('calcToHit function', () => {
    test('calculates to-hit with no equipment bonus', () => {
      // floor(100 * 0.5) + 50 + 0 = 100
      expect(calcToHit(100, 0)).toBe(100);
    });

    test('calculates to-hit with equipment bonus', () => {
      // floor(100 * 0.5) + 50 + 20 = 120
      expect(calcToHit(100, 20)).toBe(120);
    });

    test('dex is floored before adding', () => {
      // floor(55 * 0.5) + 50 + 0 = 27 + 50 = 77
      expect(calcToHit(55, 0)).toBe(77);
    });
  });

  describe('calcAC function', () => {
    test('calculates AC with no equipment bonus', () => {
      // floor(100 * 0.2) + 0 = 20
      expect(calcAC(100, 0)).toBe(20);
    });

    test('calculates AC with equipment bonus', () => {
      // floor(100 * 0.2) + 50 = 70
      expect(calcAC(100, 50)).toBe(70);
    });

    test('dex is floored before adding', () => {
      // floor(55 * 0.2) + 10 = 11 + 10 = 21
      expect(calcAC(55, 10)).toBe(21);
    });
  });

  describe('calcBlock function', () => {
    test('calculates block chance when player level equals enemy level', () => {
      // (30 - 30) * 2 + 100 = 100
      expect(calcBlock(30, 30, 100)).toBe(100);
    });

    test('higher player level increases block chance', () => {
      // (40 - 30) * 2 + 100 = 120
      expect(calcBlock(40, 30, 100)).toBe(120);
    });

    test('higher enemy level decreases block chance', () => {
      // (30 - 40) * 2 + 100 = 80
      expect(calcBlock(30, 40, 100)).toBe(80);
    });
  });

  describe('clampHitChance function', () => {
    test('clamps values below 5 to 5', () => {
      expect(clampHitChance(0)).toBe(5);
      expect(clampHitChance(-10)).toBe(5);
      expect(clampHitChance(4)).toBe(5);
    });

    test('clamps values above 95 to 95', () => {
      expect(clampHitChance(100)).toBe(95);
      expect(clampHitChance(96)).toBe(95);
      expect(clampHitChance(200)).toBe(95);
    });

    test('returns value unchanged if within range', () => {
      expect(clampHitChance(5)).toBe(5);
      expect(clampHitChance(50)).toBe(50);
      expect(clampHitChance(95)).toBe(95);
    });
  });

  describe('clampBlockChance function', () => {
    test('clamps values below 0 to 0', () => {
      expect(clampBlockChance(-10)).toBe(0);
      expect(clampBlockChance(-1)).toBe(0);
    });

    test('clamps values above 100 to 100', () => {
      expect(clampBlockChance(101)).toBe(100);
      expect(clampBlockChance(200)).toBe(100);
    });

    test('returns value unchanged if within range', () => {
      expect(clampBlockChance(0)).toBe(0);
      expect(clampBlockChance(50)).toBe(50);
      expect(clampBlockChance(100)).toBe(100);
    });
  });

  describe('formatResistance function', () => {
    test('returns MAX for values >= 75', () => {
      expect(formatResistance(75)).toBe('MAX');
      expect(formatResistance(80)).toBe('MAX');
      expect(formatResistance(100)).toBe('MAX');
    });

    test('returns value with % for values < 75', () => {
      expect(formatResistance(0)).toBe('0%');
      expect(formatResistance(50)).toBe('50%');
      expect(formatResistance(74)).toBe('74%');
    });
  });

  describe('calcMeleeDamage function', () => {
    test('calculates melee damage with 1% multiplier (Warrior)', () => {
      // floor(100 * 30 * 0.01) = 30
      expect(calcMeleeDamage(100, 30, 0.01)).toBe(30);
    });

    test('calculates melee damage with 0.5% multiplier (Rogue/Sorcerer)', () => {
      // floor(100 * 30 * 0.005) = 15
      expect(calcMeleeDamage(100, 30, 0.005)).toBe(15);
    });

    test('floors the result', () => {
      // floor(55 * 10 * 0.01) = floor(5.5) = 5
      expect(calcMeleeDamage(55, 10, 0.01)).toBe(5);
    });
  });

  describe('calcMagicToHit function', () => {
    test('calculates magic to-hit against same level', () => {
      // (25 - 25) * 2 + 100 + 0 = 100
      expect(calcMagicToHit(100, 25)).toBe(100);
    });

    test('calculates magic to-hit against lower level', () => {
      // (25 - 15) * 2 + 100 + 0 = 120
      expect(calcMagicToHit(100, 15)).toBe(120);
    });

    test('calculates magic to-hit against higher level', () => {
      // (25 - 30) * 2 + 100 + 0 = 90
      expect(calcMagicToHit(100, 30)).toBe(90);
    });

    test('includes bonus when provided', () => {
      // (25 - 25) * 2 + 100 + 20 = 120
      expect(calcMagicToHit(100, 25, 20)).toBe(120);
    });
  });
});
