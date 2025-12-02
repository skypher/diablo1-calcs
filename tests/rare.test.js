/**
 * Unit tests for js/rare.js - Rare Item Calculator
 * Tests SigFig formatting functions and Item/Affix constructors
 */

const {
  Item,
  Affix,
  Spell,
  Monster,
  uMonster,
  SigFig,
  SigFigGAMES,
  baseEQ,
  prefix,
  suffix,
  spell,
  invalidCombo,
  monster,
  uniqueMonster,
  // New pure calculation functions
  calcBaseDropChance,
  calcQualityChance,
  countValidAffixes,
  getItemClassIndex,
  calcAffixSpawnChance,
  isAffixValid,
  isAffixPairValid,
  calcUniqueMonsterDropChance,
  calcDungeonLevelDropChance,
  getMonsterIlvl,
  getDifficultyBonus
} = require('../js/rare.js');

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

  describe('Spell Constructor', () => {
    test('creates spell with all properties', () => {
      const testSpell = new Spell('Test Spell', 10, true);
      expect(testSpell.name).toBe('Test Spell');
      expect(testSpell.qlvl).toBe(10);
      expect(testSpell.spawnStaff).toBe(true);
    });

    test('creates non-staff spell', () => {
      const testSpell = new Spell('Identify', null, false);
      expect(testSpell.name).toBe('Identify');
      expect(testSpell.qlvl).toBeNull();
      expect(testSpell.spawnStaff).toBe(false);
    });
  });

  describe('Spell Array', () => {
    test('spell array has 28 spells', () => {
      expect(spell.length).toBe(28);
    });

    test('contains Apocalypse as highest level', () => {
      expect(spell[0].name).toBe('Apocalypse');
      expect(spell[0].qlvl).toBe(15);
    });

    test('contains basic spells', () => {
      const fireball = spell.find(s => s.name === 'Fireball');
      expect(fireball).toBeDefined();
      expect(fireball.qlvl).toBe(7);

      const healing = spell.find(s => s.name === 'Healing');
      expect(healing).toBeDefined();
      expect(healing.qlvl).toBe(1);
    });

    test('Identify and Infravision are non-staff spells', () => {
      const identify = spell.find(s => s.name === 'Identify');
      const infravision = spell.find(s => s.name === 'Infravision');

      expect(identify.spawnStaff).toBe(false);
      expect(infravision.spawnStaff).toBe(false);
    });
  });

  describe('Monster Constructor', () => {
    test('creates monster with all properties', () => {
      const testMonster = new Monster('Test Monster', 15);
      expect(testMonster.name).toBe('Test Monster');
      expect(testMonster.mlvl).toBe(15);
    });
  });

  describe('Monster Array', () => {
    test('monster array has 84 monsters', () => {
      expect(monster.length).toBe(84);
    });

    test('contains early dungeon monsters', () => {
      expect(monster[0].name).toBe('Zobmie');
      expect(monster[0].mlvl).toBe(1);

      expect(monster[8].name).toBe('Skeleton');
      expect(monster[8].mlvl).toBe(1);
    });

    test('contains late dungeon monsters', () => {
      expect(monster[79].name).toBe('Blood Knight');
      expect(monster[79].mlvl).toBe(30);

      expect(monster[83].name).toBe('Advocate');
      expect(monster[83].mlvl).toBe(30);
    });

    test('monster levels increase with index', () => {
      // Generally, later monsters have higher mlvl
      expect(monster[0].mlvl).toBeLessThan(monster[79].mlvl);
    });
  });

  describe('uMonster Constructor', () => {
    test('creates unique monster with all properties', () => {
      const testUnique = new uMonster('Test Boss', 15, 20, 'Zombie', 5, 0.25);
      expect(testUnique.name).toBe('Test Boss');
      expect(testUnique.mlvl).toBe(15);
      expect(testUnique.ilvl).toBe(20);
      expect(testUnique.type).toBe('Zombie');
      expect(testUnique.dlvl).toBe(5);
      expect(testUnique.prob).toBe(0.25);
    });
  });

  describe('Unique Monster Array', () => {
    test('uniqueMonster array has 69 entries', () => {
      expect(uniqueMonster.length).toBe(69);
    });

    test('contains early unique monsters', () => {
      expect(uniqueMonster[0].name).toBe('Rotfeast the Hungry');
      expect(uniqueMonster[0].dlvl).toBe(2);
    });

    test('unique monsters have spawn probabilities', () => {
      uniqueMonster.forEach(um => {
        if (um) {
          expect(um.prob).toBeGreaterThan(0);
          expect(um.prob).toBeLessThanOrEqual(1);
        }
      });
    });

    test('unique monsters are tied to monster types', () => {
      expect(uniqueMonster[0].type).toBe('Zombie');
      expect(uniqueMonster[4].type).toBe('Fallen One');
    });
  });

  describe('Invalid Affix Combinations', () => {
    test('invalidCombo array has 48 entries', () => {
      expect(invalidCombo.length).toBe(48);
    });

    test('contains forbidden prefix/suffix pairs', () => {
      // First 24 are prefixes, second 24 are corresponding suffixes
      expect(invalidCombo[0]).toBe("Angel's");
      expect(invalidCombo[24]).toBe("Trouble");

      expect(invalidCombo[5]).toBe("Gold");
      expect(invalidCombo[29]).toBe("Pit");
    });

    test('Gold prefix has multiple forbidden suffixes', () => {
      let goldCount = 0;
      for (let i = 0; i < 24; i++) {
        if (invalidCombo[i] === 'Gold') goldCount++;
      }
      expect(goldCount).toBeGreaterThan(1);
    });
  });

  describe('calcBaseDropChance Function', () => {
    test('returns standard drop chance', () => {
      expect(calcBaseDropChance()).toBe(0.107);
    });
  });

  describe('calcQualityChance Function', () => {
    test('returns no quality for low level', () => {
      const thresholds = { magic: 10, rare: 20, unique: 30 };
      const result = calcQualityChance(5, thresholds);
      expect(result.magic).toBe(0);
      expect(result.rare).toBe(0);
      expect(result.unique).toBe(0);
    });

    test('returns magic quality at magic threshold', () => {
      const thresholds = { magic: 10, rare: 20, unique: 30 };
      const result = calcQualityChance(10, thresholds);
      expect(result.magic).toBe(1.0);
      expect(result.rare).toBe(0);
      expect(result.unique).toBe(0);
    });

    test('returns magic and rare at rare threshold', () => {
      const thresholds = { magic: 10, rare: 20, unique: 30 };
      const result = calcQualityChance(20, thresholds);
      expect(result.magic).toBe(0.7);
      expect(result.rare).toBe(0.3);
      expect(result.unique).toBe(0);
    });

    test('returns all qualities at unique threshold', () => {
      const thresholds = { magic: 10, rare: 20, unique: 30 };
      const result = calcQualityChance(30, thresholds);
      expect(result.magic).toBe(0.6);
      expect(result.rare).toBe(0.3);
      expect(result.unique).toBe(0.1);
    });
  });

  describe('getItemClassIndex Function', () => {
    test('returns correct index for armor types', () => {
      expect(getItemClassIndex('Helm')).toBe(0);
      expect(getItemClassIndex('Armor')).toBe(0);
    });

    test('returns correct index for shield', () => {
      expect(getItemClassIndex('Shield')).toBe(1);
    });

    test('returns correct index for weapon types', () => {
      expect(getItemClassIndex('Sword.1')).toBe(2);
      expect(getItemClassIndex('Sword.2')).toBe(2);
      expect(getItemClassIndex('Axe')).toBe(2);
      expect(getItemClassIndex('Club.1')).toBe(2);
      expect(getItemClassIndex('Club.2')).toBe(2);
    });

    test('returns correct index for staff', () => {
      expect(getItemClassIndex('Staff')).toBe(3);
    });

    test('returns correct index for bow', () => {
      expect(getItemClassIndex('Bow')).toBe(4);
    });

    test('returns correct index for jewelry', () => {
      expect(getItemClassIndex('Jewelry')).toBe(5);
    });

    test('returns -1 for unknown class', () => {
      expect(getItemClassIndex('Unknown')).toBe(-1);
    });
  });

  describe('countValidAffixes Function', () => {
    test('counts prefixes valid for Helm at ilvl 20', () => {
      // At ilvl 20, should count prefixes with A in spawn code and qlvl <= 20
      const count = countValidAffixes(prefix, 20, 'Helm');
      expect(count).toBeGreaterThan(0);
    });

    test('counts prefixes valid for Sword.1 at ilvl 30', () => {
      const count = countValidAffixes(prefix, 30, 'Sword.1');
      expect(count).toBeGreaterThan(0);
    });

    test('counts all affixes for unknown item class (no filter)', () => {
      // When item class is unknown, classIndex is -1, charAt(-1) returns ''
      // which doesn't equal '-', so all affixes with qlvl <= ilvl are counted
      const count = countValidAffixes(prefix, 30, 'Unknown');
      expect(count).toBeGreaterThan(0);
    });

    test('counts more affixes at higher ilvl', () => {
      const lowCount = countValidAffixes(prefix, 5, 'Shield');
      const highCount = countValidAffixes(prefix, 60, 'Shield');
      expect(highCount).toBeGreaterThan(lowCount);
    });
  });

  describe('calcAffixSpawnChance Function', () => {
    test('returns 0 for affix with qlvl higher than ilvl', () => {
      const godlyPrefix = prefix.find(p => p.name === 'Godly'); // qlvl 60
      expect(calcAffixSpawnChance(godlyPrefix, 10, 'Shield')).toBe(0);
    });

    test('returns 0 for invalid item class', () => {
      const finePrefix = prefix.find(p => p.name === 'Fine' && p.spawn.includes('A'));
      expect(calcAffixSpawnChance(finePrefix, 30, 'Unknown')).toBe(0);
    });

    test('returns 2 for dChance affix', () => {
      // Fine (AS----) has dChance = true
      const finePrefix = prefix.find(p => p.name === 'Fine' && p.dChance === true);
      if (finePrefix) {
        expect(calcAffixSpawnChance(finePrefix, 30, 'Helm')).toBe(2);
      }
    });

    test('returns 1 for non-dChance affix', () => {
      // Spider's has dChance = false
      const spiderPrefix = prefix.find(p => p.name === "Spider's");
      expect(calcAffixSpawnChance(spiderPrefix, 30, 'Staff')).toBe(1);
    });
  });

  describe('isAffixValid Function', () => {
    test('returns true for valid affix', () => {
      // Fine (AS----) is valid for Helm (index 0)
      const finePrefix = prefix.find(p => p.name === 'Fine' && p.spawn.includes('A'));
      expect(isAffixValid(finePrefix, 30, 'Helm')).toBe(true);
    });

    test('returns false for affix with qlvl too high', () => {
      const godlyPrefix = prefix.find(p => p.name === 'Godly'); // qlvl 60
      expect(isAffixValid(godlyPrefix, 10, 'Shield')).toBe(false);
    });

    test('returns false for affix that cannot spawn on item class', () => {
      // Dragon's (---T-J) cannot spawn on Helm
      const dragonPrefix = prefix.find(p => p.name === "Dragon's");
      expect(isAffixValid(dragonPrefix, 30, 'Helm')).toBe(false);
    });

    test('returns false for unknown item class', () => {
      const finePrefix = prefix.find(p => p.name === 'Fine');
      expect(isAffixValid(finePrefix, 30, 'Unknown')).toBe(false);
    });
  });

  describe('isAffixPairValid Function', () => {
    test('returns true for valid combination', () => {
      expect(isAffixPairValid('Godly', 'Ages', invalidCombo)).toBe(true);
    });

    test('returns false for invalid Angel + Trouble combination', () => {
      expect(isAffixPairValid("Angel's", 'Trouble', invalidCombo)).toBe(false);
    });

    test('returns false for invalid Gold + Pit combination', () => {
      expect(isAffixPairValid('Gold', 'Pit', invalidCombo)).toBe(false);
    });

    test('returns true when prefix not in invalid list', () => {
      expect(isAffixPairValid('Obsidian', 'Ages', invalidCombo)).toBe(true);
    });
  });

  describe('calcUniqueMonsterDropChance Function', () => {
    test('returns prob from unique monster data', () => {
      const rotfeast = uniqueMonster.find(um => um.name === 'Rotfeast the Hungry');
      expect(calcUniqueMonsterDropChance(rotfeast)).toBe(rotfeast.prob);
    });

    test('returns probability between 0 and 1', () => {
      uniqueMonster.forEach(um => {
        if (um) {
          const chance = calcUniqueMonsterDropChance(um);
          expect(chance).toBeGreaterThan(0);
          expect(chance).toBeLessThanOrEqual(1);
        }
      });
    });
  });

  describe('calcDungeonLevelDropChance Function', () => {
    test('returns 0.107 for church levels (1-4)', () => {
      expect(calcDungeonLevelDropChance(1)).toBe(0.107);
      expect(calcDungeonLevelDropChance(4)).toBe(0.107);
    });

    test('returns 0.107 for catacombs levels (5-8)', () => {
      expect(calcDungeonLevelDropChance(5)).toBe(0.107);
      expect(calcDungeonLevelDropChance(8)).toBe(0.107);
    });

    test('returns 0.107 for caves levels (9-12)', () => {
      expect(calcDungeonLevelDropChance(9)).toBe(0.107);
      expect(calcDungeonLevelDropChance(12)).toBe(0.107);
    });

    test('returns 0.107 for hell levels (13-16)', () => {
      expect(calcDungeonLevelDropChance(13)).toBe(0.107);
      expect(calcDungeonLevelDropChance(16)).toBe(0.107);
    });
  });

  describe('getMonsterIlvl Function', () => {
    test('calculates item level correctly', () => {
      expect(getMonsterIlvl(10, 0)).toBe(10);
      expect(getMonsterIlvl(10, 15)).toBe(25);
      expect(getMonsterIlvl(30, 30)).toBe(60);
    });

    test('returns mlvl when no difficulty bonus', () => {
      expect(getMonsterIlvl(1, 0)).toBe(1);
      expect(getMonsterIlvl(30, 0)).toBe(30);
    });
  });

  describe('getDifficultyBonus Function', () => {
    test('returns 0 for Normal difficulty', () => {
      expect(getDifficultyBonus('Normal')).toBe(0);
    });

    test('returns 15 for Nightmare difficulty', () => {
      expect(getDifficultyBonus('Nightmare')).toBe(15);
    });

    test('returns 30 for Hell difficulty', () => {
      expect(getDifficultyBonus('Hell')).toBe(30);
    });

    test('returns 0 for unknown difficulty', () => {
      expect(getDifficultyBonus('Unknown')).toBe(0);
      expect(getDifficultyBonus('')).toBe(0);
    });
  });
});
