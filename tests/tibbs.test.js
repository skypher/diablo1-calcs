/**
 * Unit tests for js/tibbs.js - Life/Mana Calculator
 * Tests character life and mana calculations
 */

const {
  truncate,
  AddStringAsNum,
  calcLife,
  calcMana,
  parseModifiers,
  characterData,
  Rexp,
  Rexp3
} = require('../js/tibbs.js');

describe('tibbs.js - Life/Mana Calculator', () => {

  describe('truncate', () => {
    test('truncates positive decimals', () => {
      expect(truncate(5.7)).toBe(5);
      expect(truncate(10.99)).toBe(10);
      expect(truncate(100.1)).toBe(100);
    });

    test('truncates negative decimals', () => {
      expect(truncate(-5.7)).toBe(-5);
      expect(truncate(-10.99)).toBe(-10);
    });

    test('returns whole numbers unchanged', () => {
      expect(truncate(5)).toBe(5);
      expect(truncate(100)).toBe(100);
      expect(truncate(0)).toBe(0);
    });
  });

  describe('AddStringAsNum', () => {
    test('adds positive string to number', () => {
      expect(AddStringAsNum(10, '+5')).toBe(15);
      expect(AddStringAsNum(100, '+25')).toBe(125);
    });

    test('adds negative string to number', () => {
      expect(AddStringAsNum(10, '-5')).toBe(5);
      expect(AddStringAsNum(100, '-25')).toBe(75);
    });

    test('handles zero', () => {
      expect(AddStringAsNum(10, '+0')).toBe(10);
      expect(AddStringAsNum(10, '-0')).toBe(10);
    });
  });

  describe('Character Starting Values', () => {
    test('Warrior starting attributes', () => {
      expect(characterData.Warrior.startMagic).toBe(10);
      expect(characterData.Warrior.startVitality).toBe(25);
    });

    test('Rogue starting attributes', () => {
      expect(characterData.Rogue.startMagic).toBe(15);
      expect(characterData.Rogue.startVitality).toBe(20);
    });

    test('Sorcerer starting attributes', () => {
      expect(characterData.Sorcerer.startMagic).toBe(35);
      expect(characterData.Sorcerer.startVitality).toBe(20);
    });

    test('Monk starting attributes', () => {
      expect(characterData.Monk.startMagic).toBe(15);
      expect(characterData.Monk.startVitality).toBe(20);
    });

    test('Bard starting attributes', () => {
      expect(characterData.Bard.startMagic).toBe(20);
      expect(characterData.Bard.startVitality).toBe(20);
    });

    test('Barbarian starting attributes', () => {
      expect(characterData.Barbarian.startMagic).toBe(0);
      expect(characterData.Barbarian.startVitality).toBe(25);
    });
  });

  describe('Character Maximum Values', () => {
    test('Warrior max attributes', () => {
      expect(characterData.Warrior.maxMagic).toBe(50);
      expect(characterData.Warrior.maxVitality).toBe(100);
    });

    test('Rogue max attributes', () => {
      expect(characterData.Rogue.maxMagic).toBe(70);
      expect(characterData.Rogue.maxVitality).toBe(80);
    });

    test('Sorcerer max attributes', () => {
      expect(characterData.Sorcerer.maxMagic).toBe(250);
      expect(characterData.Sorcerer.maxVitality).toBe(80);
    });

    test('Barbarian max attributes', () => {
      expect(characterData.Barbarian.maxMagic).toBe(0);
      expect(characterData.Barbarian.maxVitality).toBe(150);
    });
  });

  describe('Life/Mana Calculation Logic', () => {
    // Formula: Life = LifeBonus + (Clvl * LifeGain) + (BaseV * LifeChar) + (ItemV * LifeItem)
    // Note: At clvl 50, use clvl 49 for calculations

    function calculateLife(charClass, clvl, baseV, itemV) {
      const c = characterData[charClass];
      const effectiveClvl = clvl === 50 ? 49 : clvl;
      let life = c.lifeBonus + (effectiveClvl * c.lifeGain) + (baseV * c.lifeChar) + (itemV * c.lifeItem);
      // Rogue, Monk, Bard, Barbarian truncate
      if (['Rogue', 'Monk', 'Bard', 'Barbarian'].includes(charClass)) {
        life = Math.floor(life);
      }
      return life;
    }

    function calculateMana(charClass, clvl, baseM, itemM) {
      const c = characterData[charClass];
      const effectiveClvl = clvl === 50 ? 49 : clvl;
      let mana = c.manaBonus + (effectiveClvl * c.manaGain) + (baseM * c.manaChar) + (itemM * c.manaItem);
      // Rogue, Monk, Bard truncate mana
      if (['Rogue', 'Monk', 'Bard'].includes(charClass)) {
        mana = Math.floor(mana);
      }
      return mana;
    }

    test('Warrior level 1 base life', () => {
      // LifeBonus(18) + Clvl(1)*LifeGain(2) + BaseV(25)*LifeChar(2) + ItemV(0)*LifeItem(2)
      // = 18 + 2 + 50 + 0 = 70
      expect(calculateLife('Warrior', 1, 25, 0)).toBe(70);
    });

    test('Warrior level 1 base mana', () => {
      // ManaBonus(-1) + Clvl(1)*ManaGain(1) + BaseM(10)*ManaChar(1) + ItemM(0)*ManaItem(1)
      // = -1 + 1 + 10 + 0 = 10
      expect(calculateMana('Warrior', 1, 10, 0)).toBe(10);
    });

    test('Warrior level 50 max life', () => {
      // At clvl 50, use 49 for gain calculation
      // LifeBonus(18) + 49*LifeGain(2) + 100*LifeChar(2) + 0*LifeItem(2)
      // = 18 + 98 + 200 + 0 = 316
      expect(calculateLife('Warrior', 50, 100, 0)).toBe(316);
    });

    test('Sorcerer level 1 base life', () => {
      // LifeBonus(9) + Clvl(1)*LifeGain(1) + BaseV(20)*LifeChar(1) + ItemV(0)*LifeItem(1)
      // = 9 + 1 + 20 + 0 = 30
      expect(calculateLife('Sorcerer', 1, 20, 0)).toBe(30);
    });

    test('Sorcerer level 1 base mana', () => {
      // ManaBonus(-2) + Clvl(1)*ManaGain(2) + BaseM(35)*ManaChar(2) + ItemM(0)*ManaItem(2)
      // = -2 + 2 + 70 + 0 = 70
      expect(calculateMana('Sorcerer', 1, 35, 0)).toBe(70);
    });

    test('Rogue life with item vitality', () => {
      // LifeBonus(23) + Clvl(10)*LifeGain(2) + BaseV(20)*LifeChar(1) + ItemV(10)*LifeItem(1.5)
      // = 23 + 20 + 20 + 15 = 78
      expect(calculateLife('Rogue', 10, 20, 10)).toBe(78);
    });

    test('Bard mana with item magic (truncated)', () => {
      // ManaBonus(3) + Clvl(10)*ManaGain(2) + BaseM(20)*ManaChar(1.5) + ItemM(10)*ManaItem(1.75)
      // = 3 + 20 + 30 + 17.5 = 70.5 -> truncated to 70
      expect(calculateMana('Bard', 10, 20, 10)).toBe(70);
    });

    test('Barbarian has 0 mana gain per level', () => {
      // ManaBonus(0) + Clvl(20)*ManaGain(0) + BaseM(0)*ManaChar(1) + ItemM(0)*ManaItem(1)
      // = 0 + 0 + 0 + 0 = 0
      expect(calculateMana('Barbarian', 20, 0, 0)).toBe(0);
    });
  });

  describe('Input Validation Regex', () => {
    test('Rexp validates whole numbers', () => {
      expect(Rexp.test('123')).toBe(true);
      expect(Rexp.test('+123')).toBe(true);
      expect(Rexp.test('-123')).toBe(true);
      expect(Rexp.test('0')).toBe(true);
      expect(Rexp.test('12.5')).toBe(false);
      expect(Rexp.test('abc')).toBe(false);
    });

    test('Rexp3 validates modifier strings', () => {
      expect(Rexp3.test('')).toBe(true);
      expect(Rexp3.test('+5')).toBe(true);
      expect(Rexp3.test('-5')).toBe(true);
      expect(Rexp3.test('+5-3')).toBe(true);
      expect(Rexp3.test('+5-3+10')).toBe(true);
      expect(Rexp3.test('5')).toBe(false);
      expect(Rexp3.test('++5')).toBe(false);
    });
  });

  describe('calcLife function', () => {
    test('Warrior level 1 base life', () => {
      // LifeBonus(18) + Clvl(1)*LifeGain(2) + BaseV(25)*LifeChar(2) + ItemV(0)*LifeItem(2)
      expect(calcLife('Warrior', 1, 25, 0)).toBe(70);
    });

    test('Warrior level 50 max life', () => {
      // At clvl 50, use 49 for gain calculation
      expect(calcLife('Warrior', 50, 100, 0)).toBe(316);
    });

    test('Sorcerer level 1 base life', () => {
      expect(calcLife('Sorcerer', 1, 20, 0)).toBe(30);
    });

    test('Rogue life with item vitality (truncated)', () => {
      expect(calcLife('Rogue', 10, 20, 10)).toBe(78);
    });

    test('Monk life with item vitality (truncated)', () => {
      // LifeBonus(23) + Clvl(10)*LifeGain(2) + BaseV(20)*LifeChar(1) + ItemV(10)*LifeItem(1.5)
      // = 23 + 20 + 20 + 15 = 78
      expect(calcLife('Monk', 10, 20, 10)).toBe(78);
    });

    test('Bard life with item vitality (truncated)', () => {
      expect(calcLife('Bard', 10, 20, 10)).toBe(78);
    });

    test('Barbarian life with item vitality (truncated)', () => {
      // LifeBonus(18) + Clvl(10)*LifeGain(2) + BaseV(25)*LifeChar(2) + ItemV(10)*LifeItem(2.5)
      // = 18 + 20 + 50 + 25 = 113
      expect(calcLife('Barbarian', 10, 25, 10)).toBe(113);
    });

    test('includes life modifiers', () => {
      const baseLife = calcLife('Warrior', 1, 25, 0);
      const lifeWithMods = calcLife('Warrior', 1, 25, 0, 25);
      expect(lifeWithMods).toBe(baseLife + 25);
    });

    test('returns 0 for unknown class', () => {
      expect(calcLife('Unknown', 1, 25, 0)).toBe(0);
    });
  });

  describe('calcMana function', () => {
    test('Warrior level 1 base mana', () => {
      // ManaBonus(-1) + Clvl(1)*ManaGain(1) + BaseM(10)*ManaChar(1) + ItemM(0)*ManaItem(1)
      expect(calcMana('Warrior', 1, 10, 0)).toBe(10);
    });

    test('Sorcerer level 1 base mana', () => {
      // ManaBonus(-2) + Clvl(1)*ManaGain(2) + BaseM(35)*ManaChar(2) + ItemM(0)*ManaItem(2)
      expect(calcMana('Sorcerer', 1, 35, 0)).toBe(70);
    });

    test('Rogue mana with item magic (truncated)', () => {
      // ManaBonus(5) + Clvl(10)*ManaGain(2) + BaseM(15)*ManaChar(1) + ItemM(10)*ManaItem(1.5)
      // = 5 + 20 + 15 + 15 = 55
      expect(calcMana('Rogue', 10, 15, 10)).toBe(55);
    });

    test('Monk mana with item magic (truncated)', () => {
      // ManaBonus(5) + Clvl(10)*ManaGain(2) + BaseM(15)*ManaChar(1) + ItemM(10)*ManaItem(1.5)
      expect(calcMana('Monk', 10, 15, 10)).toBe(55);
    });

    test('Bard mana with item magic (truncated)', () => {
      // ManaBonus(3) + Clvl(10)*ManaGain(2) + BaseM(20)*ManaChar(1.5) + ItemM(10)*ManaItem(1.75)
      // = 3 + 20 + 30 + 17.5 = 70.5 -> 70
      expect(calcMana('Bard', 10, 20, 10)).toBe(70);
    });

    test('Barbarian has 0 mana gain per level', () => {
      expect(calcMana('Barbarian', 20, 0, 0)).toBe(0);
    });

    test('includes mana modifiers', () => {
      const baseMana = calcMana('Sorcerer', 1, 35, 0);
      const manaWithMods = calcMana('Sorcerer', 1, 35, 0, 30);
      expect(manaWithMods).toBe(baseMana + 30);
    });

    test('returns 0 for unknown class', () => {
      expect(calcMana('Unknown', 1, 35, 0)).toBe(0);
    });
  });

  describe('parseModifiers function', () => {
    test('returns 0 for empty string', () => {
      expect(parseModifiers('')).toBe(0);
    });

    test('returns 0 for null/undefined', () => {
      expect(parseModifiers(null)).toBe(0);
      expect(parseModifiers(undefined)).toBe(0);
    });

    test('parses single positive modifier', () => {
      expect(parseModifiers('+5')).toBe(5);
      expect(parseModifiers('+25')).toBe(25);
    });

    test('parses single negative modifier', () => {
      expect(parseModifiers('-5')).toBe(-5);
      expect(parseModifiers('-25')).toBe(-25);
    });

    test('parses multiple modifiers', () => {
      expect(parseModifiers('+5-3')).toBe(2);
      expect(parseModifiers('+10+20-5')).toBe(25);
      expect(parseModifiers('+1+2+3+4+5')).toBe(15);
    });

    test('returns NaN for invalid format', () => {
      expect(parseModifiers('5')).toBeNaN();
      expect(parseModifiers('abc')).toBeNaN();
      expect(parseModifiers('++5')).toBeNaN();
    });
  });
});
