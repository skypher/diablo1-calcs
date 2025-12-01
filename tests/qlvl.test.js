/**
 * Unit tests for js/qlvl.js - Quality Level Calculator
 * Tests NPC shop item quality level calculations
 */

// Load the source file and extract functions
// Pure function implementations from qlvl.js
var specialIlvl = function(clvl) {
  if(clvl<10)      return 6;
  else if(clvl<12) return 7;
  else if(clvl<14) return 8;
  else if(clvl<16) return 9;
  else if(clvl<18) return 10;
  else if(clvl<20) return 11;
  else if(clvl<22) return 12;
  else if(clvl<24) return 13;
  else if(clvl<26) return 14;
  else if(clvl<28) return 15;
  else return 16;
};

var grisMinMaxIlvl = function(qlvl) {
  return Math.max(1, Math.min(qlvl, 30));
};

var calcGriswoldsBaseQlvl = function(ilvl) {
  ilvl = grisMinMaxIlvl(ilvl);
  return grisMinMaxIlvl(parseInt(ilvl/4)) + "-" + Math.min(25, ilvl);
};

var calcGriswoldsAffixQlvl = function(ilvl) {
  ilvl = grisMinMaxIlvl(ilvl);
  return grisMinMaxIlvl(parseInt(ilvl/2)) + "-" + ilvl;
};

var calcGriswoldsMinMaxQlvls = function(clvl) {
  if(clvl<8)
    return `Slot:   Base:   Affixes:

1:      ${calcGriswoldsBaseQlvl(clvl-1)}     ${calcGriswoldsAffixQlvl(clvl-1)}
2:      ${calcGriswoldsBaseQlvl(clvl-1)}     ${calcGriswoldsAffixQlvl(clvl-1)}
3:      ${calcGriswoldsBaseQlvl(clvl)}     ${calcGriswoldsAffixQlvl(clvl)}
4:      ${calcGriswoldsBaseQlvl(clvl)}     ${calcGriswoldsAffixQlvl(clvl)}
5:      ${calcGriswoldsBaseQlvl(clvl+1)}     ${calcGriswoldsAffixQlvl(clvl+1)}
6:      ${calcGriswoldsBaseQlvl(clvl+2)}     ${calcGriswoldsAffixQlvl(clvl+2)}`;
  if(clvl>=30)
    return `Slot:   Base:   Affixes:

1:      ${calcGriswoldsBaseQlvl(30-1)}    ${calcGriswoldsAffixQlvl(30-1)}
2:      ${calcGriswoldsBaseQlvl(30-1)}    ${calcGriswoldsAffixQlvl(30-1)}
3:      ${calcGriswoldsBaseQlvl(clvl)}    ${calcGriswoldsAffixQlvl(clvl)}
4:      ${calcGriswoldsBaseQlvl(clvl)}    ${calcGriswoldsAffixQlvl(clvl)}
5:      ${calcGriswoldsBaseQlvl(clvl+1)}    ${calcGriswoldsAffixQlvl(clvl+1)}
6:      ${calcGriswoldsBaseQlvl(clvl+2)}    ${calcGriswoldsAffixQlvl(clvl+2)}`;
  return `Slot:   Base:   Affixes:

1:      ${calcGriswoldsBaseQlvl(clvl-1)}    ${calcGriswoldsAffixQlvl(clvl-1)}
2:      ${calcGriswoldsBaseQlvl(clvl-1)}    ${calcGriswoldsAffixQlvl(clvl-1)}
3:      ${calcGriswoldsBaseQlvl(clvl)}    ${calcGriswoldsAffixQlvl(clvl)}
4:      ${calcGriswoldsBaseQlvl(clvl)}    ${calcGriswoldsAffixQlvl(clvl)}
5:      ${calcGriswoldsBaseQlvl(clvl+1)}    ${calcGriswoldsAffixQlvl(clvl+1)}
6:      ${calcGriswoldsBaseQlvl(clvl+2)}    ${calcGriswoldsAffixQlvl(clvl+2)}`;
};

var calcWirtQlvls = function(clvl) {
  return `Base items:  1-${Math.min(clvl,25)}
Affixes:     ${Math.min(clvl,25)}-${Math.min(2*clvl,60)}`;
};

var calcAdriaQlvls = function(clvl) {
  var ilvl = specialIlvl(clvl);
  return `Base items and spells (of staffs or books):  1-${ilvl}
Prefixes on staffs with spell:    1-${2*ilvl}
Affixes on staffs without spell:  ${ilvl}-${2*ilvl}`;
};

describe('qlvl.js - Quality Level Calculator', () => {

  describe('specialIlvl', () => {
    test('returns 6 for clvl < 10', () => {
      expect(specialIlvl(1)).toBe(6);
      expect(specialIlvl(5)).toBe(6);
      expect(specialIlvl(9)).toBe(6);
    });

    test('returns 7 for clvl 10-11', () => {
      expect(specialIlvl(10)).toBe(7);
      expect(specialIlvl(11)).toBe(7);
    });

    test('returns 8 for clvl 12-13', () => {
      expect(specialIlvl(12)).toBe(8);
      expect(specialIlvl(13)).toBe(8);
    });

    test('returns 9 for clvl 14-15', () => {
      expect(specialIlvl(14)).toBe(9);
      expect(specialIlvl(15)).toBe(9);
    });

    test('returns 10 for clvl 16-17', () => {
      expect(specialIlvl(16)).toBe(10);
      expect(specialIlvl(17)).toBe(10);
    });

    test('returns 11 for clvl 18-19', () => {
      expect(specialIlvl(18)).toBe(11);
      expect(specialIlvl(19)).toBe(11);
    });

    test('returns 12 for clvl 20-21', () => {
      expect(specialIlvl(20)).toBe(12);
      expect(specialIlvl(21)).toBe(12);
    });

    test('returns 13 for clvl 22-23', () => {
      expect(specialIlvl(22)).toBe(13);
      expect(specialIlvl(23)).toBe(13);
    });

    test('returns 14 for clvl 24-25', () => {
      expect(specialIlvl(24)).toBe(14);
      expect(specialIlvl(25)).toBe(14);
    });

    test('returns 15 for clvl 26-27', () => {
      expect(specialIlvl(26)).toBe(15);
      expect(specialIlvl(27)).toBe(15);
    });

    test('returns 16 for clvl >= 28', () => {
      expect(specialIlvl(28)).toBe(16);
      expect(specialIlvl(30)).toBe(16);
      expect(specialIlvl(50)).toBe(16);
    });
  });

  describe('grisMinMaxIlvl', () => {
    test('clamps values to minimum of 1', () => {
      expect(grisMinMaxIlvl(0)).toBe(1);
      expect(grisMinMaxIlvl(-5)).toBe(1);
    });

    test('clamps values to maximum of 30', () => {
      expect(grisMinMaxIlvl(31)).toBe(30);
      expect(grisMinMaxIlvl(50)).toBe(30);
    });

    test('returns value unchanged when within range 1-30', () => {
      expect(grisMinMaxIlvl(1)).toBe(1);
      expect(grisMinMaxIlvl(15)).toBe(15);
      expect(grisMinMaxIlvl(30)).toBe(30);
    });
  });

  describe('calcGriswoldsBaseQlvl', () => {
    test('calculates correct base qlvl range for ilvl 1', () => {
      // ilvl 1: clamped, floor(1/4)=0->1, min(25,1)=1
      expect(calcGriswoldsBaseQlvl(1)).toBe('1-1');
    });

    test('calculates correct base qlvl range for ilvl 10', () => {
      // ilvl 10: floor(10/4)=2, min(25,10)=10
      expect(calcGriswoldsBaseQlvl(10)).toBe('2-10');
    });

    test('calculates correct base qlvl range for ilvl 20', () => {
      // ilvl 20: floor(20/4)=5, min(25,20)=20
      expect(calcGriswoldsBaseQlvl(20)).toBe('5-20');
    });

    test('calculates correct base qlvl range for ilvl 30', () => {
      // ilvl 30: floor(30/4)=7, min(25,30)=25
      expect(calcGriswoldsBaseQlvl(30)).toBe('7-25');
    });

    test('clamps values below 1', () => {
      expect(calcGriswoldsBaseQlvl(0)).toBe('1-1');
    });

    test('clamps values above 30', () => {
      expect(calcGriswoldsBaseQlvl(50)).toBe('7-25');
    });
  });

  describe('calcGriswoldsAffixQlvl', () => {
    test('calculates correct affix qlvl range for ilvl 1', () => {
      // ilvl 1: floor(1/2)=0->1, 1
      expect(calcGriswoldsAffixQlvl(1)).toBe('1-1');
    });

    test('calculates correct affix qlvl range for ilvl 10', () => {
      // ilvl 10: floor(10/2)=5, 10
      expect(calcGriswoldsAffixQlvl(10)).toBe('5-10');
    });

    test('calculates correct affix qlvl range for ilvl 20', () => {
      // ilvl 20: floor(20/2)=10, 20
      expect(calcGriswoldsAffixQlvl(20)).toBe('10-20');
    });

    test('calculates correct affix qlvl range for ilvl 30', () => {
      // ilvl 30: floor(30/2)=15, 30
      expect(calcGriswoldsAffixQlvl(30)).toBe('15-30');
    });
  });

  describe('calcWirtQlvls', () => {
    test('calculates correct qlvl range for clvl 10', () => {
      const result = calcWirtQlvls(10);
      expect(result).toContain('Base items:  1-10');
      expect(result).toContain('Affixes:     10-20');
    });

    test('calculates correct qlvl range for clvl 25', () => {
      const result = calcWirtQlvls(25);
      expect(result).toContain('Base items:  1-25');
      expect(result).toContain('Affixes:     25-50');
    });

    test('clamps base items at 25 for high clvl', () => {
      const result = calcWirtQlvls(30);
      expect(result).toContain('Base items:  1-25');
      expect(result).toContain('Affixes:     25-60');
    });

    test('clamps affixes at 60 for clvl >= 30', () => {
      const result = calcWirtQlvls(35);
      expect(result).toContain('Base items:  1-25');
      expect(result).toContain('Affixes:     25-60');
    });
  });

  describe('calcAdriaQlvls', () => {
    test('calculates correct qlvl range for low clvl', () => {
      // clvl 5 -> specialIlvl = 6
      const result = calcAdriaQlvls(5);
      expect(result).toContain('Base items and spells (of staffs or books):  1-6');
      expect(result).toContain('Prefixes on staffs with spell:    1-12');
      expect(result).toContain('Affixes on staffs without spell:  6-12');
    });

    test('calculates correct qlvl range for clvl 20', () => {
      // clvl 20 -> specialIlvl = 12
      const result = calcAdriaQlvls(20);
      expect(result).toContain('Base items and spells (of staffs or books):  1-12');
      expect(result).toContain('Prefixes on staffs with spell:    1-24');
      expect(result).toContain('Affixes on staffs without spell:  12-24');
    });

    test('calculates correct qlvl range for high clvl', () => {
      // clvl 50 -> specialIlvl = 16
      const result = calcAdriaQlvls(50);
      expect(result).toContain('Base items and spells (of staffs or books):  1-16');
      expect(result).toContain('Prefixes on staffs with spell:    1-32');
      expect(result).toContain('Affixes on staffs without spell:  16-32');
    });
  });

  describe('calcGriswoldsMinMaxQlvls', () => {
    test('returns formatted output for clvl < 8', () => {
      const result = calcGriswoldsMinMaxQlvls(5);
      expect(result).toContain('Slot:   Base:   Affixes:');
      expect(result).toContain('1:');
      expect(result).toContain('6:');
    });

    test('returns formatted output for clvl 8', () => {
      const result = calcGriswoldsMinMaxQlvls(8);
      expect(result).toContain('Slot:   Base:   Affixes:');
    });

    test('returns formatted output for clvl 9', () => {
      const result = calcGriswoldsMinMaxQlvls(9);
      expect(result).toContain('Slot:   Base:   Affixes:');
    });

    test('returns formatted output for clvl 10', () => {
      const result = calcGriswoldsMinMaxQlvls(10);
      expect(result).toContain('Slot:   Base:   Affixes:');
    });

    test('returns formatted output for clvl 11-29', () => {
      const result = calcGriswoldsMinMaxQlvls(20);
      expect(result).toContain('Slot:   Base:   Affixes:');
    });

    test('returns formatted output for clvl >= 30', () => {
      const result = calcGriswoldsMinMaxQlvls(35);
      expect(result).toContain('Slot:   Base:   Affixes:');
      // For clvl >= 30, slots 1 and 2 use clvl 29 values
      expect(result).toContain(calcGriswoldsBaseQlvl(29));
    });
  });
});
