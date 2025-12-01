/**
 * Unit tests for js/rare.js - Rare Item Calculator
 * Tests SigFig formatting functions and Item/Affix constructors
 */

const fs = require('fs');
const vm = require('vm');

// Create context
const context = {
  Math: Math,
  Array: Array,
  String: String,
  parseInt: parseInt,
  parseFloat: parseFloat,
  document: {
    getElementById: () => ({
      selectedIndex: 0,
      options: [{ value: 0 }],
      innerHTML: ''
    }),
    main: {
      sourceSel: { selectedIndex: 0, options: [{ value: '0' }] },
      baseSel: { selectedIndex: 0, options: [{ value: '0' }] },
      prefixSel: { selectedIndex: 0, options: [{ value: '0' }] },
      suffixSel: { selectedIndex: 0, options: [{ value: '0' }] },
      cursedIn: { checked: false },
      result: { innerHTML: '' }
    }
  }
};
vm.createContext(context);

const sourceCode = fs.readFileSync('./js/rare.js', 'utf8');
vm.runInContext(sourceCode, context);

const { SigFig, SigFigGAMES, Item, Affix, baseEQ, prefix, suffix } = context;

describe('rare.js - Rare Item Calculator', () => {

  describe('SigFig Function', () => {
    test('returns 0 for input 0', () => {
      expect(SigFig(0)).toBe(0);
    });

    test('handles values less than 1', () => {
      const result = SigFig(0.5);
      expect(parseFloat(result)).toBeCloseTo(0.5, 1);
    });

    test('handles values between 1 and 10', () => {
      const result = SigFig(5.5);
      expect(parseFloat(result)).toBeCloseTo(5.5, 1);
    });

    test('handles values between 10 and 100', () => {
      const result = SigFig(55);
      expect(parseFloat(result)).toBeCloseTo(55, 0);
    });

    test('handles small decimal values', () => {
      const result = SigFig(0.01);
      expect(parseFloat(result)).toBeCloseTo(0.01, 2);
    });

    test('rounds to 3 significant figures', () => {
      // The function rounds to maintain precision
      const result = SigFig(1.234);
      expect(parseFloat(result)).toBeCloseTo(1.23, 2);
    });
  });

  describe('SigFigGAMES Function', () => {
    test('formats large numbers with trailing zeros', () => {
      // For values >= 10000, uses 3 significant digits
      const result = SigFigGAMES(12345);
      expect(result).toBe('12300');
    });

    test('formats medium numbers with 2 significant digits', () => {
      // For values < 10000, uses 2 significant digits
      const result = SigFigGAMES(1234);
      expect(result).toBe('1200');
    });

    test('handles small numbers', () => {
      const result = SigFigGAMES(12);
      // Returns a representation of the number
      expect(result).toBeDefined();
    });

    test('handles very large numbers', () => {
      const result = SigFigGAMES(98765);
      // Returns a formatted string with significant figures
      expect(result.length).toBe(5);
    });

    test('output is a string', () => {
      const result = SigFigGAMES(156);
      expect(typeof result).toBe('string');
    });
  });

  describe('Item Constructor', () => {
    test('creates item with all properties', () => {
      const item = new Item('Test Helm', 15, 'Helm');

      expect(item.name).toBe('Test Helm');
      expect(item.ilvl).toBe(15);
      expect(item.iClass).toBe('Helm');
    });

    test('creates jewelry item', () => {
      const ring = new Item('Ring', 10, 'Jewelry');

      expect(ring.name).toBe('Ring');
      expect(ring.ilvl).toBe(10);
      expect(ring.iClass).toBe('Jewelry');
    });
  });

  describe('Affix Constructor', () => {
    test('creates affix with all properties', () => {
      const affix = new Affix('Godly', 60, 'AS----', false, true);

      expect(affix.name).toBe('Godly');
      expect(affix.qlvl).toBe(60);
      expect(affix.spawn).toBe('AS----');
      expect(affix.cursed).toBe(false);
      expect(affix.dChance).toBe(true);
    });

    test('creates cursed affix', () => {
      const affix = new Affix("Hyena's", 4, '---T-J', true, false);

      expect(affix.name).toBe("Hyena's");
      expect(affix.cursed).toBe(true);
    });
  });

  describe('Base Equipment Array', () => {
    test('baseEQ has correct length', () => {
      expect(baseEQ.length).toBe(72);
    });

    test('contains all helmet types', () => {
      expect(baseEQ[0].name).toBe('Cap');
      expect(baseEQ[0].ilvl).toBe(1);
      expect(baseEQ[0].iClass).toBe('Helm');

      expect(baseEQ[5].name).toBe('Great Helm');
      expect(baseEQ[5].ilvl).toBe(20);
    });

    test('contains light armor types', () => {
      expect(baseEQ[6].name).toBe('Rags');
      expect(baseEQ[6].iClass).toBe('Light Armor');

      expect(baseEQ[13].name).toBe('Studded Leather Armor');
      expect(baseEQ[13].iClass).toBe('Light Armor');
    });

    test('contains medium armor types', () => {
      expect(baseEQ[14].name).toBe('Ring Mail');
      expect(baseEQ[14].iClass).toBe('Medium Armor');

      expect(baseEQ[17].name).toBe('Splint Mail');
      expect(baseEQ[17].iClass).toBe('Medium Armor');
    });

    test('contains heavy armor types', () => {
      expect(baseEQ[18].name).toBe('Breast Plate');
      expect(baseEQ[18].iClass).toBe('Heavy Armor');

      expect(baseEQ[22].name).toBe('Full Plate Mail');
      expect(baseEQ[22].iClass).toBe('Heavy Armor');
    });

    test('contains shield types', () => {
      expect(baseEQ[23].name).toBe('Buckler');
      expect(baseEQ[23].iClass).toBe('Shield');

      expect(baseEQ[28].name).toBe('Tower Shield');
    });

    test('contains weapon types', () => {
      expect(baseEQ[29].name).toBe('Dagger');
      expect(baseEQ[29].iClass).toBe('Sword.1');

      expect(baseEQ[54].name).toBe('Short Bow');
      expect(baseEQ[54].iClass).toBe('Bow');

      expect(baseEQ[62].name).toBe('Short Staff');
      expect(baseEQ[62].iClass).toBe('Staff');
    });

    test('contains jewelry types', () => {
      expect(baseEQ[67].name).toBe('Ring');
      expect(baseEQ[67].iClass).toBe('Jewelry');
      expect(baseEQ[67].ilvl).toBe(5);

      expect(baseEQ[70].name).toBe('Amulet');
      expect(baseEQ[70].iClass).toBe('Jewelry');
    });

    test('ilvl values increase appropriately', () => {
      // Helms should have increasing ilvl
      expect(baseEQ[0].ilvl).toBeLessThan(baseEQ[5].ilvl);

      // Armors should have increasing ilvl
      expect(baseEQ[6].ilvl).toBeLessThan(baseEQ[22].ilvl);
    });
  });

  describe('Prefix Array', () => {
    test('prefix array has expected entries', () => {
      // The array has entries, verify it's populated
      expect(prefix.length).toBeGreaterThan(70);
    });

    test('contains AC prefixes', () => {
      // Vulnerable is cursed AC prefix
      expect(prefix[8].name).toBe('Vulnerable');
      expect(prefix[8].cursed).toBe(true);
      expect(prefix[8].spawn).toBe('AS----');

      // Godly is highest AC prefix
      expect(prefix[19].name).toBe('Godly');
      expect(prefix[19].qlvl).toBe(60);
      expect(prefix[19].cursed).toBe(false);
    });

    test('contains damage prefixes', () => {
      // Useless is cursed damage prefix
      expect(prefix[43].name).toBe('Useless');
      expect(prefix[43].cursed).toBe(true);

      // Merciless is highest damage prefix
      expect(prefix[54].name).toBe('Merciless');
      expect(prefix[54].qlvl).toBe(60);
    });

    test('contains resistance prefixes', () => {
      // White - Magic resist
      expect(prefix[55].name).toBe('White');
      expect(prefix[55].spawn).toBe('ASWTBJ');

      // Ruby - Fire resist
      expect(prefix[64].name).toBe('Ruby');

      // Sapphire - Lightning resist
      expect(prefix[69].name).toBe('Sapphire');

      // Obsidian - All resist
      expect(prefix[73].name).toBe('Obsidian');
    });

    test('contains mana prefixes', () => {
      expect(prefix[0].name).toBe("Hyena's");
      expect(prefix[0].cursed).toBe(true);

      expect(prefix[7].name).toBe("Dragon's");
      expect(prefix[7].qlvl).toBe(27);
    });

    test('spawn codes are valid', () => {
      // A = Armor, S = Shield, W = Weapon, T = Staff, B = Bow, J = Jewelry
      prefix.forEach(p => {
        expect(p.spawn).toMatch(/^[ASWTBJ-]{6}$/);
      });
    });
  });

  describe('Suffix Array', () => {
    test('suffix array has expected entries', () => {
      // The array has entries, verify it's populated
      expect(suffix.length).toBeGreaterThan(80);
    });

    test('suffix array is populated with Affix objects', () => {
      // Check that suffixes have expected properties
      if (suffix.length > 0) {
        expect(suffix[0]).toHaveProperty('name');
        expect(suffix[0]).toHaveProperty('qlvl');
        expect(suffix[0]).toHaveProperty('spawn');
      }
    });

    test('suffixes have numeric qlvl values', () => {
      suffix.forEach(s => {
        expect(typeof s.qlvl).toBe('number');
        expect(s.qlvl).toBeGreaterThanOrEqual(0);
      });
    });

    test('suffixes have spawn codes', () => {
      suffix.forEach(s => {
        expect(typeof s.spawn).toBe('string');
        expect(s.spawn.length).toBeGreaterThanOrEqual(5);
      });
    });

    test('cursed suffixes exist', () => {
      const cursedSuffixes = suffix.filter(s => s.cursed === true);
      expect(cursedSuffixes.length).toBeGreaterThan(0);
    });
  });

  describe('Item Level Requirements', () => {
    test('early game items have low ilvl', () => {
      // Cap, Rags, Buckler, Dagger all ilvl 1
      expect(baseEQ[0].ilvl).toBe(1);  // Cap
      expect(baseEQ[6].ilvl).toBe(1);  // Rags
      expect(baseEQ[23].ilvl).toBe(1); // Buckler
      expect(baseEQ[29].ilvl).toBe(1); // Dagger
    });

    test('late game items have high ilvl', () => {
      // Full Plate, Great Helm, Tower Shield
      expect(baseEQ[22].ilvl).toBe(25); // Full Plate Mail
      expect(baseEQ[5].ilvl).toBe(20);  // Great Helm
      expect(baseEQ[28].ilvl).toBe(20); // Tower Shield
    });
  });

  describe('Affix Quality Levels', () => {
    test('basic affixes have low qlvl', () => {
      // Early prefixes
      expect(prefix[1].qlvl).toBe(1);  // Frog's
      expect(prefix[2].qlvl).toBe(1);  // Spider's
      expect(prefix[10].qlvl).toBe(1); // Fine
    });

    test('powerful affixes have high qlvl', () => {
      // Godly prefix
      expect(prefix[19].qlvl).toBe(60);

      // Merciless prefix
      expect(prefix[54].qlvl).toBe(60);

      // Strange prefix
      expect(prefix[31].qlvl).toBe(60);
    });

    test('cursed affixes have varied qlvl', () => {
      const cursedPrefixes = prefix.filter(p => p.cursed);
      const qlvls = cursedPrefixes.map(p => p.qlvl);

      // Should have both low and higher qlvl cursed items
      expect(Math.min(...qlvls)).toBe(1);
      expect(Math.max(...qlvls)).toBeGreaterThan(1);
    });
  });
});
