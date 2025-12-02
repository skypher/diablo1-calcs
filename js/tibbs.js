// Life/Mana Calculator
// written by Joshua Colson, do not modify without permission
// v1.01 - Modernized for ES6+ compatibility

// Starting Attributes
const WarriorStartMagic = 10;
const WarriorStartVitality = 25;
const RogueStartMagic = 15;
const RogueStartVitality = 20;
const SorcererStartMagic = 35;
const SorcererStartVitality = 20;
const MonkStartMagic = 15;
const MonkStartVitality = 20;
const BardStartMagic = 20;
const BardStartVitality = 20;
const BarbarianStartMagic = 0;
const BarbarianStartVitality = 25;

// Gains Per Level
const WarriorLifeGain = 2;
const WarriorManaGain = 1;
const RogueLifeGain = 2;
const RogueManaGain = 2;
const SorcererLifeGain = 1;
const SorcererManaGain = 2;
const MonkLifeGain = 2;
const MonkManaGain = 2;
const BardLifeGain = 2;
const BardManaGain = 2;
const BarbarianLifeGain = 2;
const BarbarianManaGain = 0;

// Gains Per Character Attribute
const WarriorLifeChar = 2;
const WarriorManaChar = 1;
const RogueLifeChar = 1;
const RogueManaChar = 1;
const SorcererLifeChar = 1;
const SorcererManaChar = 2;
const MonkLifeChar = 1;
const MonkManaChar = 1;
const BardLifeChar = 1;
const BardManaChar = 1.5;
const BarbarianLifeChar = 2;
const BarbarianManaChar = 1;

// Gains Per Item Attribute
const WarriorLifeItem = 2;
const WarriorManaItem = 1;
const RogueLifeItem = 1.5;
const RogueManaItem = 1.5;
const SorcererLifeItem = 1;
const SorcererManaItem = 2;
const MonkLifeItem = 1.5;
const MonkManaItem = 1.5;
const BardLifeItem = 1.5;
const BardManaItem = 1.75;
const BarbarianLifeItem = 2.5;
const BarbarianManaItem = 1;

// Starting Bonus
const WarriorLifeBonus = 18;
const WarriorManaBonus = -1;
const RogueLifeBonus = 23;
const RogueManaBonus = 5;
const SorcererLifeBonus = 9;
const SorcererManaBonus = -2;
const MonkLifeBonus = 23;
const MonkManaBonus = 5;
const BardLifeBonus = 23;
const BardManaBonus = 3;
const BarbarianLifeBonus = 18;
const BarbarianManaBonus = 0;

// Attribute Maximums
const WarriorMaxMagic = 50;
const WarriorMaxVitality = 100;
const RogueMaxMagic = 70;
const RogueMaxVitality = 80;
const SorcererMaxMagic = 250;
const SorcererMaxVitality = 80;
const MonkMaxMagic = 80;
const MonkMaxVitality = 80;
const BardMaxMagic = 120;
const BardMaxVitality = 100;
const BarbarianMaxMagic = 0;
const BarbarianMaxVitality = 150;

// Regular Expression for validating whole numbers.
const Rexp = /^[+-]?\d+$/;

// Regular Expression for seperating out fractions.
const Rexp2 = /^(-?\d+)\.?(\d*)$/;

// Regular Expression for the input of life and mana modifiers.
const Rexp3 = /^([+-]\d+)*$/;

// Regular Expression for the life and mana modifiers calculations.
const Rexp47 = /^([+-]\d+)([+-]\d+)([+-]\d+)([+-]\d+)([+-]\d+)([+-]\d+)([+-]\d+)$/;
const Rexp46 = /^([+-]\d+)([+-]\d+)([+-]\d+)([+-]\d+)([+-]\d+)([+-]\d+)$/;
const Rexp45 = /^([+-]\d+)([+-]\d+)([+-]\d+)([+-]\d+)([+-]\d+)$/;
const Rexp44 = /^([+-]\d+)([+-]\d+)([+-]\d+)([+-]\d+)$/;
const Rexp43 = /^([+-]\d+)([+-]\d+)([+-]\d+)$/;
const Rexp42 = /^([+-]\d+)([+-]\d+)$/;
const Rexp41 = /^([+-]\d+)$/;

// truncates fractions (and keeps number from becoming a string using ++,-- routine)
function truncate(number) {
  Rexp2.exec(number);
  let temp = RegExp.$1;
  temp++;
  temp--;
  return temp;
}

// takes a string and convinces Javascript it is a number so it can be added
function AddStringAsNum(number, string) {
  let temp = string;
  temp++;
  temp--;
  number += temp;
  return number;
}

// Resets the form as a beginning character of the currently selected type.
function ResetForm(ResetClass) {
  if (typeof LifeManaForm === 'undefined') return;

  LifeManaForm.CharLevel.value = 1;
  LifeManaForm.LifeMods.value = "";
  LifeManaForm.ManaMods.value = "";

  if (ResetClass.value == "Warrior") {
    LifeManaForm.BaseMagic.value = WarriorStartMagic;
    LifeManaForm.BaseVitality.value = WarriorStartVitality;
    LifeManaForm.FinalMagic.value = WarriorStartMagic;
    LifeManaForm.FinalVitality.value = WarriorStartVitality;
  }

  if (ResetClass.value == "Rogue") {
    LifeManaForm.BaseMagic.value = RogueStartMagic;
    LifeManaForm.BaseVitality.value = RogueStartVitality;
    LifeManaForm.FinalMagic.value = RogueStartMagic;
    LifeManaForm.FinalVitality.value = RogueStartVitality;
  }

  if (ResetClass.value == "Sorcerer") {
    LifeManaForm.BaseMagic.value = SorcererStartMagic;
    LifeManaForm.BaseVitality.value = SorcererStartVitality;
    LifeManaForm.FinalMagic.value = SorcererStartMagic;
    LifeManaForm.FinalVitality.value = SorcererStartVitality;
  }

  if (ResetClass.value == "Monk") {
    LifeManaForm.BaseMagic.value = MonkStartMagic;
    LifeManaForm.BaseVitality.value = MonkStartVitality;
    LifeManaForm.FinalMagic.value = MonkStartMagic;
    LifeManaForm.FinalVitality.value = MonkStartVitality;
  }

  if (ResetClass.value == "Bard") {
    LifeManaForm.BaseMagic.value = BardStartMagic;
    LifeManaForm.BaseVitality.value = BardStartVitality;
    LifeManaForm.FinalMagic.value = BardStartMagic;
    LifeManaForm.FinalVitality.value = BardStartVitality;
  }

  if (ResetClass.value == "Barbarian") {
    LifeManaForm.BaseMagic.value = BarbarianStartMagic;
    LifeManaForm.BaseVitality.value = BarbarianStartVitality;
    LifeManaForm.FinalMagic.value = BarbarianStartMagic;
    LifeManaForm.FinalVitality.value = BarbarianStartVitality;
  }
}

// Resets the form as a maxed out character of the currently selected type.
function MaxForm(ResetClass) {
  if (typeof LifeManaForm === 'undefined') return;

  LifeManaForm.CharLevel.value = 50;
  LifeManaForm.LifeMods.value = "";
  LifeManaForm.ManaMods.value = "";

  if (ResetClass.value == "Warrior") {
    LifeManaForm.BaseMagic.value = WarriorMaxMagic;
    LifeManaForm.BaseVitality.value = WarriorMaxVitality;
    LifeManaForm.FinalMagic.value = WarriorMaxMagic;
    LifeManaForm.FinalVitality.value = WarriorMaxVitality;
  }

  if (ResetClass.value == "Rogue") {
    LifeManaForm.BaseMagic.value = RogueMaxMagic;
    LifeManaForm.BaseVitality.value = RogueMaxVitality;
    LifeManaForm.FinalMagic.value = RogueMaxMagic;
    LifeManaForm.FinalVitality.value = RogueMaxVitality;
  }

  if (ResetClass.value == "Sorcerer") {
    LifeManaForm.BaseMagic.value = SorcererMaxMagic;
    LifeManaForm.BaseVitality.value = SorcererMaxVitality;
    LifeManaForm.FinalMagic.value = SorcererMaxMagic;
    LifeManaForm.FinalVitality.value = SorcererMaxVitality;
  }

  if (ResetClass.value == "Monk") {
    LifeManaForm.BaseMagic.value = MonkMaxMagic;
    LifeManaForm.BaseVitality.value = MonkMaxVitality;
    LifeManaForm.FinalMagic.value = MonkMaxMagic;
    LifeManaForm.FinalVitality.value = MonkMaxVitality;
  }

  if (ResetClass.value == "Bard") {
    LifeManaForm.BaseMagic.value = BardMaxMagic;
    LifeManaForm.BaseVitality.value = BardMaxVitality;
    LifeManaForm.FinalMagic.value = BardMaxMagic;
    LifeManaForm.FinalVitality.value = BardMaxVitality;
  }

  if (ResetClass.value == "Barbarian") {
    LifeManaForm.BaseMagic.value = BarbarianMaxMagic;
    LifeManaForm.BaseVitality.value = BarbarianMaxVitality;
    LifeManaForm.FinalMagic.value = BarbarianMaxMagic;
    LifeManaForm.FinalVitality.value = BarbarianMaxVitality;
  }
}

// Validates the form, then performs calculations and displays results
function GoButton() {
  if (typeof LifeManaForm === 'undefined') return;

  // Validating
  if (!Rexp.test(LifeManaForm.CharLevel.value)) {
    const charl = document.getElementById('lifmantxt');
    charl.value = "Character Level must be a whole number.";
    return;
  }

  if (!Rexp.test(LifeManaForm.BaseMagic.value)) {
    const bmag = document.getElementById('lifmantxt');
    bmag.value = "Base Magic must be a whole number.";
    return;
  }

  if (!Rexp.test(LifeManaForm.FinalMagic.value)) {
    const fmag = document.getElementById('lifmantxt');
    fmag.value = "Final Magic must be a whole number.";
    return;
  }

  if (!Rexp.test(LifeManaForm.BaseVitality.value)) {
    const bvit = document.getElementById('lifmantxt');
    bvit.value = "Base Vitality must be a whole number.";
    return;
  }

  if (!Rexp.test(LifeManaForm.FinalVitality.value)) {
    const fvit = document.getElementById('lifmantxt');
    fvit.value = "Final Vitality must be a whole number.";
    return;
  }

  if (!Rexp3.test(LifeManaForm.LifeMods.value)) {
    const lifem = document.getElementById('lifmantxt');
    lifem.value = "Incorrect formatting of Life Modifiers.\nModifiers are added as such: +1-2+3-4";
    return;
  }

  if (!Rexp3.test(LifeManaForm.ManaMods.value)) {
    const manam = document.getElementById('lifmantxt');
    manam.value = "Incorrect formatting of Mana Modifiers.\nModifiers are added as such: +1-2+3-4";
    return;
  }

  // Variables
  let Life = 0;
  let Mana = 0;
  let Clvl = LifeManaForm.CharLevel.value;
  const BaseM = LifeManaForm.BaseMagic.value;
  const ItemM = LifeManaForm.FinalMagic.value - BaseM;
  const BaseV = LifeManaForm.BaseVitality.value;
  const ItemV = LifeManaForm.FinalVitality.value - BaseV;

  // Characters do not gain Life or Mana on reaching clvl 50
  if (Clvl == 50) Clvl = 49;

  // Calculations for Life and Mana
  if (LifeManaForm.CharClass.value == "Warrior") {
    Life = (WarriorLifeBonus) + (Clvl * WarriorLifeGain) + (BaseV * WarriorLifeChar) + (ItemV * WarriorLifeItem);
    Mana = (WarriorManaBonus) + (Clvl * WarriorManaGain) + (BaseM * WarriorManaChar) + (ItemM * WarriorManaItem);
  }

  if (LifeManaForm.CharClass.value == "Rogue") {
    Life = (RogueLifeBonus) + (Clvl * RogueLifeGain) + (BaseV * RogueLifeChar) + (ItemV * RogueLifeItem);
    Mana = (RogueManaBonus) + (Clvl * RogueManaGain) + (BaseM * RogueManaChar) + (ItemM * RogueManaItem);
    Life = truncate(Life);
    Mana = truncate(Mana);
  }

  if (LifeManaForm.CharClass.value == "Sorcerer") {
    Life = (SorcererLifeBonus) + (Clvl * SorcererLifeGain) + (BaseV * SorcererLifeChar) + (ItemV * SorcererLifeItem);
    Mana = (SorcererManaBonus) + (Clvl * SorcererManaGain) + (BaseM * SorcererManaChar) + (ItemM * SorcererManaItem);
  }

  if (LifeManaForm.CharClass.value == "Monk") {
    Life = (MonkLifeBonus) + (Clvl * MonkLifeGain) + (BaseV * MonkLifeChar) + (ItemV * MonkLifeItem);
    Mana = (MonkManaBonus) + (Clvl * MonkManaGain) + (BaseM * MonkManaChar) + (ItemM * MonkManaItem);
    Life = truncate(Life);
    Mana = truncate(Mana);
  }

  if (LifeManaForm.CharClass.value == "Bard") {
    Life = (BardLifeBonus) + (Clvl * BardLifeGain) + (BaseV * BardLifeChar) + (ItemV * BardLifeItem);
    Mana = (BardManaBonus) + (Clvl * BardManaGain) + (BaseM * BardManaChar) + (ItemM * BardManaItem);
    Life = truncate(Life);
    Mana = truncate(Mana);
  }

  if (LifeManaForm.CharClass.value == "Barbarian") {
    Life = (BarbarianLifeBonus) + (Clvl * BarbarianLifeGain) + (BaseV * BarbarianLifeChar) + (ItemV * BarbarianLifeItem);
    Mana = (BarbarianManaBonus) + (Clvl * BarbarianManaGain) + (BaseM * BarbarianManaChar) + (ItemM * BarbarianManaItem);
    Life = truncate(Life);
  }

  // Account for Life modifiers on equipment
  if (Rexp41.exec(LifeManaForm.LifeMods.value)) {
    Life = AddStringAsNum(Life, RegExp.$1);
  } else if (Rexp42.exec(LifeManaForm.LifeMods.value)) {
    Life = AddStringAsNum(Life, RegExp.$1);
    Life = AddStringAsNum(Life, RegExp.$2);
  } else if (Rexp43.exec(LifeManaForm.LifeMods.value)) {
    Life = AddStringAsNum(Life, RegExp.$1);
    Life = AddStringAsNum(Life, RegExp.$2);
    Life = AddStringAsNum(Life, RegExp.$3);
  } else if (Rexp44.exec(LifeManaForm.LifeMods.value)) {
    Life = AddStringAsNum(Life, RegExp.$1);
    Life = AddStringAsNum(Life, RegExp.$2);
    Life = AddStringAsNum(Life, RegExp.$3);
    Life = AddStringAsNum(Life, RegExp.$4);
  } else if (Rexp45.exec(LifeManaForm.LifeMods.value)) {
    Life = AddStringAsNum(Life, RegExp.$1);
    Life = AddStringAsNum(Life, RegExp.$2);
    Life = AddStringAsNum(Life, RegExp.$3);
    Life = AddStringAsNum(Life, RegExp.$4);
    Life = AddStringAsNum(Life, RegExp.$5);
  } else if (Rexp46.exec(LifeManaForm.LifeMods.value)) {
    Life = AddStringAsNum(Life, RegExp.$1);
    Life = AddStringAsNum(Life, RegExp.$2);
    Life = AddStringAsNum(Life, RegExp.$3);
    Life = AddStringAsNum(Life, RegExp.$4);
    Life = AddStringAsNum(Life, RegExp.$5);
    Life = AddStringAsNum(Life, RegExp.$6);
  } else if (Rexp47.exec(LifeManaForm.LifeMods.value)) {
    Life = AddStringAsNum(Life, RegExp.$1);
    Life = AddStringAsNum(Life, RegExp.$2);
    Life = AddStringAsNum(Life, RegExp.$3);
    Life = AddStringAsNum(Life, RegExp.$4);
    Life = AddStringAsNum(Life, RegExp.$5);
    Life = AddStringAsNum(Life, RegExp.$6);
    Life = AddStringAsNum(Life, RegExp.$7);
  } else if (LifeManaForm.LifeMods.value == "") {
    // Do nothing
  } else {
    const lifex = document.getElementById('lifmantxt');
    lifex.value = "You may only have up to 7 life modifiers.";
    return;
  }

  // Account for Mana modifiers on equipment
  if (Rexp41.exec(LifeManaForm.ManaMods.value)) {
    Mana = AddStringAsNum(Mana, RegExp.$1);
  } else if (Rexp42.exec(LifeManaForm.ManaMods.value)) {
    Mana = AddStringAsNum(Mana, RegExp.$1);
    Mana = AddStringAsNum(Mana, RegExp.$2);
  } else if (Rexp43.exec(LifeManaForm.ManaMods.value)) {
    Mana = AddStringAsNum(Mana, RegExp.$1);
    Mana = AddStringAsNum(Mana, RegExp.$2);
    Mana = AddStringAsNum(Mana, RegExp.$3);
  } else if (Rexp44.exec(LifeManaForm.ManaMods.value)) {
    Mana = AddStringAsNum(Mana, RegExp.$1);
    Mana = AddStringAsNum(Mana, RegExp.$2);
    Mana = AddStringAsNum(Mana, RegExp.$3);
    Mana = AddStringAsNum(Mana, RegExp.$4);
  } else if (Rexp45.exec(LifeManaForm.ManaMods.value)) {
    Mana = AddStringAsNum(Mana, RegExp.$1);
    Mana = AddStringAsNum(Mana, RegExp.$2);
    Mana = AddStringAsNum(Mana, RegExp.$3);
    Mana = AddStringAsNum(Mana, RegExp.$4);
    Mana = AddStringAsNum(Mana, RegExp.$5);
  } else if (Rexp46.exec(LifeManaForm.ManaMods.value)) {
    Mana = AddStringAsNum(Mana, RegExp.$1);
    Mana = AddStringAsNum(Mana, RegExp.$2);
    Mana = AddStringAsNum(Mana, RegExp.$3);
    Mana = AddStringAsNum(Mana, RegExp.$4);
    Mana = AddStringAsNum(Mana, RegExp.$5);
    Mana = AddStringAsNum(Mana, RegExp.$6);
  } else if (Rexp47.exec(LifeManaForm.ManaMods.value)) {
    Mana = AddStringAsNum(Mana, RegExp.$1);
    Mana = AddStringAsNum(Mana, RegExp.$2);
    Mana = AddStringAsNum(Mana, RegExp.$3);
    Mana = AddStringAsNum(Mana, RegExp.$4);
    Mana = AddStringAsNum(Mana, RegExp.$5);
    Mana = AddStringAsNum(Mana, RegExp.$6);
    Mana = AddStringAsNum(Mana, RegExp.$7);
  } else if (LifeManaForm.ManaMods.value == "") {
    // Do nothing
  } else {
    const manax = document.getElementById('lifmantxt');
    manax.value = "You may only have up to 7 mana modifiers.";
    return;
  }

  // Display Output
  const OutString = document.getElementById('lifmantxt');
  OutString.value = "Your total Life should be: " + Life + "\nYour total Mana should be: " + Mana;
}

// Pure calculation functions for testing
function calcLife(charClass, level, baseVit, itemVit, lifeMods) {
  let clvl = level;
  if (clvl == 50) clvl = 49;
  lifeMods = lifeMods || 0;

  const data = {
    Warrior: { bonus: WarriorLifeBonus, gain: WarriorLifeGain, char: WarriorLifeChar, item: WarriorLifeItem },
    Rogue: { bonus: RogueLifeBonus, gain: RogueLifeGain, char: RogueLifeChar, item: RogueLifeItem },
    Sorcerer: { bonus: SorcererLifeBonus, gain: SorcererLifeGain, char: SorcererLifeChar, item: SorcererLifeItem },
    Monk: { bonus: MonkLifeBonus, gain: MonkLifeGain, char: MonkLifeChar, item: MonkLifeItem },
    Bard: { bonus: BardLifeBonus, gain: BardLifeGain, char: BardLifeChar, item: BardLifeItem },
    Barbarian: { bonus: BarbarianLifeBonus, gain: BarbarianLifeGain, char: BarbarianLifeChar, item: BarbarianLifeItem }
  };

  const d = data[charClass];
  if (!d) return 0;

  let life = d.bonus + (clvl * d.gain) + (baseVit * d.char) + (itemVit * d.item) + lifeMods;

  // Classes with fractional multipliers need truncation
  if (charClass === 'Rogue' || charClass === 'Monk' || charClass === 'Bard' || charClass === 'Barbarian') {
    life = Math.floor(life);
  }

  return life;
}

function calcMana(charClass, level, baseMag, itemMag, manaMods) {
  let clvl = level;
  if (clvl == 50) clvl = 49;
  manaMods = manaMods || 0;

  const data = {
    Warrior: { bonus: WarriorManaBonus, gain: WarriorManaGain, char: WarriorManaChar, item: WarriorManaItem },
    Rogue: { bonus: RogueManaBonus, gain: RogueManaGain, char: RogueManaChar, item: RogueManaItem },
    Sorcerer: { bonus: SorcererManaBonus, gain: SorcererManaGain, char: SorcererManaChar, item: SorcererManaItem },
    Monk: { bonus: MonkManaBonus, gain: MonkManaGain, char: MonkManaChar, item: MonkManaItem },
    Bard: { bonus: BardManaBonus, gain: BardManaGain, char: BardManaChar, item: BardManaItem },
    Barbarian: { bonus: BarbarianManaBonus, gain: BarbarianManaGain, char: BarbarianManaChar, item: BarbarianManaItem }
  };

  const d = data[charClass];
  if (!d) return 0;

  let mana = d.bonus + (clvl * d.gain) + (baseMag * d.char) + (itemMag * d.item) + manaMods;

  // Classes with fractional multipliers need truncation
  if (charClass === 'Rogue' || charClass === 'Monk' || charClass === 'Bard') {
    mana = Math.floor(mana);
  }

  return mana;
}

function parseModifiers(modString) {
  if (!modString || modString === '') return 0;
  if (!Rexp3.test(modString)) return NaN;

  let total = 0;
  const matches = modString.match(/[+-]\d+/g);
  if (matches) {
    matches.forEach(m => {
      total += parseInt(m, 10);
    });
  }
  return total;
}

// Export for testing (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    truncate,
    AddStringAsNum,
    calcLife,
    calcMana,
    parseModifiers,
    // Character data exports
    characterData: {
      Warrior: {
        startMagic: WarriorStartMagic, startVitality: WarriorStartVitality,
        maxMagic: WarriorMaxMagic, maxVitality: WarriorMaxVitality,
        lifeGain: WarriorLifeGain, manaGain: WarriorManaGain,
        lifeChar: WarriorLifeChar, manaChar: WarriorManaChar,
        lifeItem: WarriorLifeItem, manaItem: WarriorManaItem,
        lifeBonus: WarriorLifeBonus, manaBonus: WarriorManaBonus
      },
      Rogue: {
        startMagic: RogueStartMagic, startVitality: RogueStartVitality,
        maxMagic: RogueMaxMagic, maxVitality: RogueMaxVitality,
        lifeGain: RogueLifeGain, manaGain: RogueManaGain,
        lifeChar: RogueLifeChar, manaChar: RogueManaChar,
        lifeItem: RogueLifeItem, manaItem: RogueManaItem,
        lifeBonus: RogueLifeBonus, manaBonus: RogueManaBonus
      },
      Sorcerer: {
        startMagic: SorcererStartMagic, startVitality: SorcererStartVitality,
        maxMagic: SorcererMaxMagic, maxVitality: SorcererMaxVitality,
        lifeGain: SorcererLifeGain, manaGain: SorcererManaGain,
        lifeChar: SorcererLifeChar, manaChar: SorcererManaChar,
        lifeItem: SorcererLifeItem, manaItem: SorcererManaItem,
        lifeBonus: SorcererLifeBonus, manaBonus: SorcererManaBonus
      },
      Monk: {
        startMagic: MonkStartMagic, startVitality: MonkStartVitality,
        maxMagic: MonkMaxMagic, maxVitality: MonkMaxVitality,
        lifeGain: MonkLifeGain, manaGain: MonkManaGain,
        lifeChar: MonkLifeChar, manaChar: MonkManaChar,
        lifeItem: MonkLifeItem, manaItem: MonkManaItem,
        lifeBonus: MonkLifeBonus, manaBonus: MonkManaBonus
      },
      Bard: {
        startMagic: BardStartMagic, startVitality: BardStartVitality,
        maxMagic: BardMaxMagic, maxVitality: BardMaxVitality,
        lifeGain: BardLifeGain, manaGain: BardManaGain,
        lifeChar: BardLifeChar, manaChar: BardManaChar,
        lifeItem: BardLifeItem, manaItem: BardManaItem,
        lifeBonus: BardLifeBonus, manaBonus: BardManaBonus
      },
      Barbarian: {
        startMagic: BarbarianStartMagic, startVitality: BarbarianStartVitality,
        maxMagic: BarbarianMaxMagic, maxVitality: BarbarianMaxVitality,
        lifeGain: BarbarianLifeGain, manaGain: BarbarianManaGain,
        lifeChar: BarbarianLifeChar, manaChar: BarbarianManaChar,
        lifeItem: BarbarianLifeItem, manaItem: BarbarianManaItem,
        lifeBonus: BarbarianLifeBonus, manaBonus: BarbarianManaBonus
      }
    },
    // Regex exports for testing
    Rexp,
    Rexp3
  };
}
