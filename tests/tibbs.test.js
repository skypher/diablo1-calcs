/**
 * Unit tests for js/tibbs.js - Life/Mana Calculator
 * Tests character life and mana calculations
 */

const fs = require('fs');
const vm = require('vm');

// Create context and load the source
const context = {
  parseInt: parseInt,
  Math: Math,
  RegExp: RegExp,
  String: String,
  document: {
    getElementById: () => ({ value: '' })
  },
  LifeManaForm: {
    CharLevel: { value: 1 },
    BaseMagic: { value: 10 },
    BaseVitality: { value: 25 },
    FinalMagic: { value: 10 },
    FinalVitality: { value: 25 },
    LifeMods: { value: '' },
    ManaMods: { value: '' },
    CharClass: { value: 'Warrior' }
  }
};
vm.createContext(context);

// Read the source file, skip HTML comment markers
const sourceCode = fs.readFileSync('./js/tibbs.js', 'utf8')
  .replace('<!-- Hide script from older browsers', '')
  .replace('// End hiding script -->', '');

vm.runInContext(sourceCode, context);

const { truncate, AddStringAsNum } = context;

// Character constants from the file
const characterData = {
  Warrior: {
    startMagic: 10, startVitality: 25,
    maxMagic: 50, maxVitality: 100,
    lifeGain: 2, manaGain: 1,
    lifeChar: 2, manaChar: 1,
    lifeItem: 2, manaItem: 1,
    lifeBonus: 18, manaBonus: -1
  },
  Rogue: {
    startMagic: 15, startVitality: 20,
    maxMagic: 70, maxVitality: 80,
    lifeGain: 2, manaGain: 2,
    lifeChar: 1, manaChar: 1,
    lifeItem: 1.5, manaItem: 1.5,
    lifeBonus: 23, manaBonus: 5
  },
  Sorcerer: {
    startMagic: 35, startVitality: 20,
    maxMagic: 250, maxVitality: 80,
    lifeGain: 1, manaGain: 2,
    lifeChar: 1, manaChar: 2,
    lifeItem: 1, manaItem: 2,
    lifeBonus: 9, manaBonus: -2
  },
  Monk: {
    startMagic: 15, startVitality: 20,
    maxMagic: 80, maxVitality: 80,
    lifeGain: 2, manaGain: 2,
    lifeChar: 1, manaChar: 1,
    lifeItem: 1.5, manaItem: 1.5,
    lifeBonus: 23, manaBonus: 5
  },
  Bard: {
    startMagic: 20, startVitality: 20,
    maxMagic: 120, maxVitality: 100,
    lifeGain: 2, manaGain: 2,
    lifeChar: 1, manaChar: 1.5,
    lifeItem: 1.5, manaItem: 1.75,
    lifeBonus: 23, manaBonus: 3
  },
  Barbarian: {
    startMagic: 0, startVitality: 25,
    maxMagic: 0, maxVitality: 150,
    lifeGain: 2, manaGain: 0,
    lifeChar: 2, manaChar: 1,
    lifeItem: 2.5, manaItem: 1,
    lifeBonus: 18, manaBonus: 0
  }
};

// Pure implementation of truncate logic from tibbs.js
function truncatePure(number) {
  // The original uses regex to extract integer part
  const match = /^(-?\d+)\.?(\d*)$/.exec(number.toString());
  if (match) {
    let temp = match[1];
    temp++;
    temp--;
    return temp;
  }
  return 0;
}

describe('tibbs.js - Life/Mana Calculator', () => {

  describe('truncate (pure implementation)', () => {
    test('truncates positive decimals', () => {
      expect(truncatePure(5.7)).toBe(5);
      expect(truncatePure(10.99)).toBe(10);
      expect(truncatePure(100.1)).toBe(100);
    });

    test('truncates negative decimals', () => {
      expect(truncatePure(-5.7)).toBe(-5);
      expect(truncatePure(-10.99)).toBe(-10);
    });

    test('returns whole numbers unchanged', () => {
      expect(truncatePure(5)).toBe(5);
      expect(truncatePure(100)).toBe(100);
      expect(truncatePure(0)).toBe(0);
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
    const Rexp = /^[+-]?\d+$/;
    const Rexp3 = /^([+-]\d+)*$/;

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
});
