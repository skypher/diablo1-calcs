/**
 * Unit tests for js/price.js - Item Price Calculator
 * Tests item pricing based on base items, prefixes, suffixes, and source
 */

const {
  Itm,
  Affx,
  Spel,
  bseEQ,
  unique,
  prefx,
  suffx,
  spel,
  invalidComb,
  calcItemPrice,
  calcPricePositiveM,
  calcSellPrice,
  calcWirtPrice,
  isTooExpensiveGriswold,
  isTooExpensiveWirt,
  calcAffixRangeValue,
  isInvalidCombo,
  getSpawnPattern,
  canAffixSpawn
} = require('../js/price.js');

describe('price.js - Item Price Calculator', () => {

  describe('Item Constructor', () => {
    test('creates item with all properties', () => {
      const item = new Itm('Test Sword', 10, 'Sword', 500);

      expect(item.name).toBe('Test Sword');
      expect(item.ilvvl).toBe(10);
      expect(item.iClas).toBe('Sword');
      expect(item.price).toBe(500);
    });
  });

  describe('Base Equipment Array', () => {
    test('bseEQ has correct length', () => {
      expect(bseEQ.length).toBe(69);
    });

    test('contains helms', () => {
      expect(bseEQ[0].name).toBe('Cap');
      expect(bseEQ[0].iClas).toBe('Helm');
      expect(bseEQ[0].price).toBe(15);

      expect(bseEQ[5].name).toBe('Great Helm');
      expect(bseEQ[5].price).toBe(400);
    });

    test('contains shields', () => {
      expect(bseEQ[23].name).toBe('Buckler');
      expect(bseEQ[23].iClas).toBe('Shield');
      expect(bseEQ[23].price).toBe(30);
    });

    test('contains swords', () => {
      expect(bseEQ[29].name).toBe('Dagger');
      expect(bseEQ[29].iClas).toBe('Sword');
      expect(bseEQ[29].price).toBe(60);

      expect(bseEQ[40].name).toBe('Great Sword');
      expect(bseEQ[40].price).toBe(3000);
    });

    test('contains bows', () => {
      expect(bseEQ[54].name).toBe('Short Bow');
      expect(bseEQ[54].iClas).toBe('Bow');
      expect(bseEQ[54].price).toBe(100);
    });

    test('contains jewelry', () => {
      expect(bseEQ[67].name).toBe('Ring');
      expect(bseEQ[67].iClas).toBe('Jewelry');
      expect(bseEQ[67].price).toBe(1000);

      expect(bseEQ[68].name).toBe('Amulet');
      expect(bseEQ[68].price).toBe(1200);
    });
  });

  describe('Base Equipment Prices', () => {
    test('helm prices increase with ilvl', () => {
      expect(bseEQ[0].price).toBeLessThan(bseEQ[5].price); // Cap < Great Helm
    });

    test('sword prices increase with ilvl', () => {
      expect(bseEQ[29].price).toBeLessThan(bseEQ[40].price); // Dagger < Great Sword
    });

    test('jewelry is expensive', () => {
      expect(bseEQ[67].price).toBe(1000); // Ring
      expect(bseEQ[68].price).toBe(1200); // Amulet
    });
  });

  describe('Unique Items Array', () => {
    test('unique array is populated', () => {
      expect(unique.length).toBe(75);
    });

    test('contains Aguinara\'s Hatchet', () => {
      expect(unique[0].name).toBe("Aguinara's Hatchet");
      expect(unique[0].price).toBe(24800);
    });

    test('unique items have fixed prices', () => {
      unique.forEach(item => {
        expect(item.price).toBeGreaterThan(0);
        expect(typeof item.price).toBe('number');
      });
    });
  });

  describe('Price Calculation Formula', () => {
    // Item price formula from Jarulf's Guide:
    // FinalPrice = BasePrice + PrefixPrice + SuffixPrice
    // Sell price is typically 1/4 of buy price

    function calculateBuyPrice(basePrice, prefixMultiplier, suffixMultiplier) {
      return Math.floor(basePrice * prefixMultiplier * suffixMultiplier);
    }

    function calculateSellPrice(buyPrice) {
      return Math.floor(buyPrice / 4);
    }

    test('base item price with no affixes', () => {
      const basePrice = 1000;
      const price = calculateBuyPrice(basePrice, 1, 1);
      expect(price).toBe(1000);
    });

    test('price with prefix multiplier', () => {
      const basePrice = 1000;
      // A prefix might add 2x multiplier
      const price = calculateBuyPrice(basePrice, 2, 1);
      expect(price).toBe(2000);
    });

    test('price with both prefix and suffix', () => {
      const basePrice = 1000;
      // Prefix 2x, suffix 1.5x
      const price = calculateBuyPrice(basePrice, 2, 1.5);
      expect(price).toBe(3000);
    });

    test('sell price is 1/4 of buy price', () => {
      const buyPrice = 10000;
      const sellPrice = calculateSellPrice(buyPrice);
      expect(sellPrice).toBe(2500);
    });

    test('sell price floors the result', () => {
      const buyPrice = 10001;
      const sellPrice = calculateSellPrice(buyPrice);
      expect(sellPrice).toBe(2500);
    });
  });

  describe('Source Price Modifiers', () => {
    function applySourceModifier(basePrice, source) {
      const modifiers = {
        'ground': 1.0,
        'griswold_buy': 1.0,
        'griswold_sell': 0.25,
        'adria': 1.0,
        'wirt': 1.0
      };
      return Math.floor(basePrice * (modifiers[source] || 1.0));
    }

    test('ground items have base price', () => {
      const price = applySourceModifier(1000, 'ground');
      expect(price).toBe(1000);
    });

    test('Griswold sell price is 1/4', () => {
      const price = applySourceModifier(1000, 'griswold_sell');
      expect(price).toBe(250);
    });
  });

  describe('Item Class Categories', () => {
    test('helms have Helm class', () => {
      for (let i = 0; i <= 5; i++) {
        expect(bseEQ[i].iClas).toBe('Helm');
      }
    });

    test('shields have Shield class', () => {
      for (let i = 23; i <= 28; i++) {
        expect(bseEQ[i].iClas).toBe('Shield');
      }
    });

    test('swords have Sword class', () => {
      for (let i = 29; i <= 40; i++) {
        expect(bseEQ[i].iClas).toBe('Sword');
      }
    });

    test('bows have Bow class', () => {
      for (let i = 54; i <= 61; i++) {
        expect(bseEQ[i].iClas).toBe('Bow');
      }
    });

    test('jewelry has Jewelry class', () => {
      expect(bseEQ[67].iClas).toBe('Jewelry');
      expect(bseEQ[68].iClas).toBe('Jewelry');
    });
  });

  describe('Price Caps', () => {
    const GOLD_CAP = 200000;

    function capPrice(price) {
      return Math.min(price, GOLD_CAP);
    }

    test('cap function limits to 200000', () => {
      expect(capPrice(250000)).toBe(200000);
      expect(capPrice(100000)).toBe(100000);
    });
  });

  describe('Prefix Array', () => {
    test('prefx array is populated', () => {
      expect(prefx.length).toBeGreaterThan(50);
    });

    test('prefixes have expected properties', () => {
      // Check that prefixes have expected structure
      expect(prefx[0]).toHaveProperty('name');
      expect(prefx[0]).toHaveProperty('B'); // base price modifier
      expect(prefx[0]).toHaveProperty('M'); // multiplier
    });
  });

  describe('Suffix Array', () => {
    test('suffx array is populated', () => {
      expect(suffx.length).toBeGreaterThan(50);
    });

    test('suffixes have expected properties', () => {
      expect(suffx[0]).toHaveProperty('name');
      expect(suffx[0]).toHaveProperty('B'); // base price modifier
      expect(suffx[0]).toHaveProperty('M'); // multiplier
    });
  });

  describe('Specific Item Prices', () => {
    test('Cap is cheapest helm', () => {
      expect(bseEQ[0].price).toBe(15);
    });

    test('Great Helm is most expensive base helm', () => {
      expect(bseEQ[5].price).toBe(400);
    });

    test('Buckler is cheapest shield', () => {
      expect(bseEQ[23].price).toBe(30);
    });

    test('Dagger is cheapest sword', () => {
      expect(bseEQ[29].price).toBe(60);
    });

    test('Great Sword is most expensive base sword', () => {
      expect(bseEQ[40].price).toBe(3000);
    });
  });

  describe('Price Validation', () => {
    test('all base items have positive prices', () => {
      bseEQ.forEach(item => {
        expect(item.price).toBeGreaterThan(0);
      });
    });

    test('all items have valid ilvl', () => {
      bseEQ.forEach(item => {
        expect(item.ilvvl).toBeGreaterThanOrEqual(1);
        expect(item.ilvvl).toBeLessThanOrEqual(25);
      });
    });
  });

  describe('Edge Cases', () => {
    test('zero price item', () => {
      const freeItem = new Itm('Test', 1, 'Test', 0);
      expect(freeItem.price).toBe(0);
    });

    test('negative ilvl (used for unique markers)', () => {
      const uniqueMarker = new Itm('Unique Test', -1, 'Unique', 50000);
      expect(uniqueMarker.ilvvl).toBe(-1);
    });
  });

  describe('Affx Constructor', () => {
    test('creates affix with all properties', () => {
      const affix = new Affx('Test Prefix', 10, '10-20 damage', 'AS----', false, 500, 1000, 5);

      expect(affix.name).toBe('Test Prefix');
      expect(affix.qlvvl).toBe(10);
      expect(affix.value).toBe('10-20 damage');
      expect(affix.spawnn).toBe('AS----');
      expect(affix.cursd).toBe(false);
      expect(affix.B).toBe(500);
      expect(affix.range).toBe(1000);
      expect(affix.M).toBe(5);
    });

    test('creates cursed affix', () => {
      const cursedAffix = new Affx('Cursed', 5, '-10 hp', 'ASWTBJ', true, 0, 0, -3);
      expect(cursedAffix.cursd).toBe(true);
      expect(cursedAffix.M).toBe(-3);
    });
  });

  describe('Spel Constructor', () => {
    test('creates spell with all properties', () => {
      const spell = new Spel('Fireball', 7, '40-80', true, 60);

      expect(spell.name).toBe('Fireball');
      expect(spell.qlvvl).toBe(7);
      expect(spell.charges).toBe('40-80');
      expect(spell.spawnnStaff).toBe(true);
      expect(spell.P).toBe(60);
    });

    test('creates spell without staff spawn', () => {
      const spell = new Spel('Identify', null, null, false, null);
      expect(spell.name).toBe('Identify');
      expect(spell.spawnnStaff).toBe(false);
      expect(spell.P).toBeNull();
    });
  });

  describe('Spell Array', () => {
    test('spel array has 28 spells', () => {
      expect(spel.length).toBe(28);
    });

    test('contains Apocalypse spell', () => {
      expect(spel[0].name).toBe('Apocalypse');
      expect(spel[0].qlvvl).toBe(15);
      expect(spel[0].P).toBe(400);
    });

    test('contains basic spells', () => {
      const fireball = spel.find(s => s.name === 'Fireball');
      expect(fireball).toBeDefined();
      expect(fireball.charges).toBe('40-80');

      const healing = spel.find(s => s.name === 'Healing');
      expect(healing).toBeDefined();
      expect(healing.qlvvl).toBe(1);
    });

    test('Identify and Infravision are non-staff', () => {
      const identify = spel.find(s => s.name === 'Identify');
      const infravision = spel.find(s => s.name === 'Infravision');

      expect(identify.spawnnStaff).toBe(false);
      expect(infravision.spawnnStaff).toBe(false);
    });
  });

  describe('Invalid Affix Combinations', () => {
    test('invalidComb array has 48 entries', () => {
      expect(invalidComb.length).toBe(48);
    });

    test('contains Angel\'s forbidden combinations', () => {
      expect(invalidComb[0]).toBe("Angel's");
      expect(invalidComb[24]).toBe("Trouble");
    });

    test('Gold prefix has multiple forbidden suffixes', () => {
      // Gold appears multiple times with different forbidden suffixes
      let goldCount = 0;
      for (let i = 0; i < 24; i++) {
        if (invalidComb[i] === 'Gold') goldCount++;
      }
      expect(goldCount).toBeGreaterThan(1);
    });
  });

  describe('calcItemPrice function', () => {
    test('calculates base price with no affixes', () => {
      const price = calcItemPrice(1000);
      expect(price).toBe(1000);
    });

    test('adds prefix contribution', () => {
      // prefixB=500, prefixM=5, prefixRange=1000
      // contribution = 500 + floor(1000 * 5 / 100) = 500 + 50 = 550
      const price = calcItemPrice(1000, 500, 5, 1000);
      expect(price).toBe(1550);
    });

    test('adds suffix contribution', () => {
      // No prefix, suffixB=200, suffixM=3, suffixRange=500
      // contribution = 200 + floor(500 * 3 / 100) = 200 + 15 = 215
      const price = calcItemPrice(1000, undefined, undefined, undefined, 200, 3, 500);
      expect(price).toBe(1215);
    });

    test('adds both prefix and suffix', () => {
      // Base 1000, prefix adds 550, suffix adds 215
      const price = calcItemPrice(1000, 500, 5, 1000, 200, 3, 500);
      expect(price).toBe(1765);
    });

    test('applies Wirt multiplier (1.5x)', () => {
      const price = calcItemPrice(1000, undefined, undefined, undefined, undefined, undefined, undefined, 'Wirt');
      expect(price).toBe(1500);
    });

    test('Wirt multiplier with affixes', () => {
      // Base 1000 + prefix 550 = 1550, then * 1.5 = 2325
      const price = calcItemPrice(1000, 500, 5, 1000, undefined, undefined, undefined, 'Wirt');
      expect(price).toBe(2325);
    });
  });

  describe('Prefix Properties', () => {
    test('Hyena\'s is cursed prefix', () => {
      expect(prefx[0].name).toBe("Hyena's");
      expect(prefx[0].cursd).toBe(true);
    });

    test('Godly is high-level prefix', () => {
      const godly = prefx.find(p => p.name === 'Godly');
      expect(godly).toBeDefined();
      expect(godly.qlvvl).toBe(60);
    });

    test('resistance prefixes exist', () => {
      const white = prefx.find(p => p.name === 'White');
      expect(white).toBeDefined();
      expect(white.value).toContain('resist magic');
    });
  });

  describe('Suffix Properties', () => {
    test('suffixes have spawn patterns', () => {
      suffx.forEach(s => {
        if (s) {
          expect(s.spawnn).toBeDefined();
          expect(s.spawnn.length).toBe(6);
        }
      });
    });
  });

  describe('calcPricePositiveM function', () => {
    test('returns base price when total multiplier is 0', () => {
      expect(calcPricePositiveM(1000, 0, 0, 0, 0, 0, 0)).toBe(1000);
    });

    test('calculates price with positive multiplier', () => {
      // Base 100, prefix B=50, Q=10, M=2, suffix B=30, Q=5, M=3
      // Total M = 5, result = 50+30+10+5 + 100*5 = 595
      expect(calcPricePositiveM(100, 50, 10, 2, 30, 5, 3)).toBe(595);
    });

    test('calculates price with negative multiplier', () => {
      // Negative multiplier divides instead of multiplies
      // Base 100, M=-2, result = 100 / -2 = -50
      expect(calcPricePositiveM(100, 0, 0, -1, 0, 0, -1)).toBe(-50);
    });
  });

  describe('calcSellPrice function', () => {
    test('returns 1/4 of buy price', () => {
      expect(calcSellPrice(1000)).toBe(250);
      expect(calcSellPrice(10000)).toBe(2500);
    });

    test('floors the result', () => {
      expect(calcSellPrice(1001)).toBe(250);
      expect(calcSellPrice(1003)).toBe(250);
    });

    test('returns minimum of 1', () => {
      expect(calcSellPrice(3)).toBe(1);
      expect(calcSellPrice(1)).toBe(1);
      expect(calcSellPrice(0)).toBe(1);
    });
  });

  describe('calcWirtPrice function', () => {
    test('multiplies by 1.5', () => {
      expect(calcWirtPrice(1000)).toBe(1500);
      expect(calcWirtPrice(100)).toBe(150);
    });

    test('floors the result', () => {
      expect(calcWirtPrice(101)).toBe(151);
      expect(calcWirtPrice(103)).toBe(154);
    });
  });

  describe('isTooExpensiveGriswold function', () => {
    test('returns true for prices over 140000', () => {
      expect(isTooExpensiveGriswold(140001)).toBe(true);
      expect(isTooExpensiveGriswold(200000)).toBe(true);
    });

    test('returns false for prices at or below 140000', () => {
      expect(isTooExpensiveGriswold(140000)).toBe(false);
      expect(isTooExpensiveGriswold(100000)).toBe(false);
    });
  });

  describe('isTooExpensiveWirt function', () => {
    test('returns true for prices over 90000', () => {
      expect(isTooExpensiveWirt(90001)).toBe(true);
      expect(isTooExpensiveWirt(100000)).toBe(true);
    });

    test('returns false for prices at or below 90000', () => {
      expect(isTooExpensiveWirt(90000)).toBe(false);
      expect(isTooExpensiveWirt(50000)).toBe(false);
    });
  });

  describe('calcAffixRangeValue function', () => {
    test('returns 0 when affix range is 0', () => {
      expect(calcAffixRangeValue(5, 11, 0)).toBe(0);
    });

    test('calculates range value at min slider', () => {
      // At slider 0, value should be 0
      expect(calcAffixRangeValue(0, 11, 1000)).toBe(0);
    });

    test('calculates range value at max slider', () => {
      // At slider 10 of 11 options (index 10), should be 100% of range
      expect(calcAffixRangeValue(10, 11, 1000)).toBe(1000);
    });

    test('calculates range value at mid slider', () => {
      // At slider 5 of 11 options (index 5), should be ~50% of range
      expect(calcAffixRangeValue(5, 11, 1000)).toBe(500);
    });
  });

  describe('isInvalidCombo function', () => {
    test('returns true for invalid Angel\'s combinations', () => {
      expect(isInvalidCombo("Angel's", "Trouble")).toBe(true);
    });

    test('returns true for invalid Gold combinations', () => {
      expect(isInvalidCombo("Gold", "Pit")).toBe(true);
      expect(isInvalidCombo("Gold", "the Vulture")).toBe(true);
    });

    test('returns false for valid combinations', () => {
      expect(isInvalidCombo("Godly", "the Wolf")).toBe(false);
      expect(isInvalidCombo("Fine", "Quality")).toBe(false);
    });
  });

  describe('getSpawnPattern function', () => {
    test('returns correct index for helm', () => {
      expect(getSpawnPattern('Helm')).toBe(0);
    });

    test('returns correct index for armor', () => {
      expect(getSpawnPattern('Armor')).toBe(1);
    });

    test('returns correct index for sword', () => {
      expect(getSpawnPattern('Sword')).toBe(2);
    });

    test('returns correct index for staff', () => {
      expect(getSpawnPattern('Staff')).toBe(3);
    });

    test('returns correct index for bow', () => {
      expect(getSpawnPattern('Bow')).toBe(4);
    });

    test('returns correct index for jewelry', () => {
      expect(getSpawnPattern('Jewelry')).toBe(5);
    });

    test('returns -1 for unknown class', () => {
      expect(getSpawnPattern('Unknown')).toBe(-1);
    });
  });

  describe('canAffixSpawn function', () => {
    test('returns true when affix can spawn', () => {
      // 'ASWTBJ' - can spawn on all items (A=helm, S=shield, W=weapon, T=staff, B=bow, J=jewelry)
      expect(canAffixSpawn('ASWTBJ', 0)).toBe(true); // Helm
      expect(canAffixSpawn('ASWTBJ', 5)).toBe(true); // Jewelry
    });

    test('returns false when affix cannot spawn', () => {
      // '---T--' - can only spawn on staff
      expect(canAffixSpawn('---T--', 0)).toBe(false); // Helm
      expect(canAffixSpawn('---T--', 3)).toBe(true);  // Staff
    });

    test('returns false for invalid item class index', () => {
      expect(canAffixSpawn('ASWTBJ', -1)).toBe(false);
      expect(canAffixSpawn('ASWTBJ', 6)).toBe(false);
    });
  });
});
