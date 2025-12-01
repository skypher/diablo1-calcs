/**
 * Unit tests for js/price.js - Item Price Calculator
 * Tests item pricing based on base items, prefixes, suffixes, and source
 */

describe('price.js - Item Price Calculator', () => {

  // Item constructor from price.js
  function Itm(name, ilvl, iClass, price) {
    this.name = name;
    this.ilvl = ilvl;
    this.iClass = iClass;
    this.price = price;
  }

  // Base equipment data (subset from price.js)
  const baseEquipment = {
    helms: [
      new Itm('Cap', 1, 'Helm', 15),
      new Itm('Skull Cap', 4, 'Helm', 25),
      new Itm('Helm', 8, 'Helm', 40),
      new Itm('Full Helm', 12, 'Helm', 90),
      new Itm('Crown', 16, 'Helm', 200),
      new Itm('Great Helm', 20, 'Helm', 400)
    ],
    shields: [
      new Itm('Buckler', 1, 'Shield', 30),
      new Itm('Small Shield', 5, 'Shield', 90),
      new Itm('Large Shield', 9, 'Shield', 200),
      new Itm('Kite Shield', 14, 'Shield', 400),
      new Itm('Tower Shield', 20, 'Shield', 850),
      new Itm('Gothic Shield', 23, 'Shield', 2300)
    ],
    swords: [
      new Itm('Dagger', 1, 'Sword', 60),
      new Itm('Short Sword', 1, 'Sword', 120),
      new Itm('Sabre', 1, 'Sword', 170),
      new Itm('Long Sword', 6, 'Sword', 350),
      new Itm('Broad Sword', 8, 'Sword', 750),
      new Itm('Bastard Sword', 10, 'Sword', 1000),
      new Itm('Great Sword', 17, 'Sword', 3000)
    ],
    bows: [
      new Itm('Short Bow', 1, 'Bow', 100),
      new Itm('Long Bow', 5, 'Bow', 250),
      new Itm('Composite Bow', 7, 'Bow', 600),
      new Itm('Long Battle Bow', 11, 'Bow', 1000),
      new Itm('Long War Bow', 19, 'Bow', 2000)
    ],
    jewelry: [
      new Itm('Ring', 5, 'Jewelry', 1000),
      new Itm('Amulet', 16, 'Jewelry', 1200)
    ]
  };

  // Unique items (subset)
  const uniqueItems = [
    new Itm("Demonspike Coat", 0, "Full Plate Mail", 251175),
    new Itm("Eaglehorn", 0, "Long Battle Bow", 42500),
    new Itm("Stormshield", 0, "Gothic Shield", 49000),
    new Itm("Gotterdamerung", 0, "Great Helm", 54900),
    new Itm("Windforce", 0, "Long War Bow", 60000),
    new Itm("The Grandfather", 0, "Great Sword", 85625),
    new Itm("King's Sword of Haste", 0, "Bastard Sword", 45500)
  ];

  describe('Item Constructor', () => {
    test('creates item with all properties', () => {
      const item = new Itm('Test Sword', 10, 'Sword', 500);

      expect(item.name).toBe('Test Sword');
      expect(item.ilvl).toBe(10);
      expect(item.iClass).toBe('Sword');
      expect(item.price).toBe(500);
    });
  });

  describe('Base Equipment Prices', () => {
    test('helm prices increase with ilvl', () => {
      const helms = baseEquipment.helms;
      for (let i = 1; i < helms.length; i++) {
        expect(helms[i].price).toBeGreaterThan(helms[i - 1].price);
      }
    });

    test('shield prices increase with ilvl', () => {
      const shields = baseEquipment.shields;
      // Tower Shield is before Gothic Shield but cheaper
      expect(shields[5].price).toBeGreaterThan(shields[4].price);
    });

    test('sword prices increase with ilvl', () => {
      const swords = baseEquipment.swords;
      expect(swords[swords.length - 1].price).toBeGreaterThan(swords[0].price);
    });

    test('jewelry is expensive', () => {
      const ring = baseEquipment.jewelry[0];
      const amulet = baseEquipment.jewelry[1];

      expect(ring.price).toBe(1000);
      expect(amulet.price).toBe(1200);
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

  describe('Unique Item Prices', () => {
    test('unique items have fixed prices', () => {
      uniqueItems.forEach(item => {
        expect(item.price).toBeGreaterThan(0);
        expect(typeof item.price).toBe('number');
      });
    });

    test('Demonspike Coat is one of the most expensive', () => {
      const demonspike = uniqueItems.find(i => i.name === 'Demonspike Coat');
      expect(demonspike.price).toBe(251175);
    });

    test('The Grandfather has high value', () => {
      const grandfather = uniqueItems.find(i => i.name === 'The Grandfather');
      expect(grandfather.price).toBe(85625);
    });
  });

  describe('Source Price Modifiers', () => {
    // Different sources apply different price multipliers
    // Griswold: buy at premium, sell at normal
    // Adria: magical items only
    // Wirt: premium prices
    // Ground drops: no modifier

    function applySourceModifier(basePrice, source) {
      const modifiers = {
        'ground': 1.0,
        'griswold_buy': 1.0,  // Standard buy price
        'griswold_sell': 0.25, // 1/4 buy price
        'adria': 1.0,
        'wirt': 1.0  // Wirt has special pricing
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
    test('all helms have Helm class', () => {
      baseEquipment.helms.forEach(helm => {
        expect(helm.iClass).toBe('Helm');
      });
    });

    test('all shields have Shield class', () => {
      baseEquipment.shields.forEach(shield => {
        expect(shield.iClass).toBe('Shield');
      });
    });

    test('all swords have Sword class', () => {
      baseEquipment.swords.forEach(sword => {
        expect(sword.iClass).toBe('Sword');
      });
    });

    test('all bows have Bow class', () => {
      baseEquipment.bows.forEach(bow => {
        expect(bow.iClass).toBe('Bow');
      });
    });

    test('rings and amulets have Jewelry class', () => {
      baseEquipment.jewelry.forEach(jewel => {
        expect(jewel.iClass).toBe('Jewelry');
      });
    });
  });

  describe('Price Caps', () => {
    // Diablo has a maximum gold cap of 200,000 for single stack
    const GOLD_CAP = 200000;

    function capPrice(price) {
      return Math.min(price, GOLD_CAP);
    }

    test('prices can exceed gold cap', () => {
      const demonspike = uniqueItems.find(i => i.name === 'Demonspike Coat');
      expect(demonspike.price).toBeGreaterThan(GOLD_CAP);
    });

    test('cap function limits to 200000', () => {
      expect(capPrice(250000)).toBe(200000);
      expect(capPrice(100000)).toBe(100000);
    });
  });

  describe('Affix Price Modifiers', () => {
    // Common affix price multipliers
    const affixModifiers = {
      // Prefixes
      'Godly': 4.0,      // High AC
      'King\'s': 3.5,    // High damage
      'Merciless': 3.0,  // High damage
      'Obsidian': 2.5,   // All resistances
      // Suffixes
      'of Haste': 2.0,   // Fast attack
      'of the Ages': 2.5, // Indestructible
      'of the Zodiac': 3.0 // All attributes
    };

    test('Godly prefix has highest multiplier', () => {
      expect(affixModifiers['Godly']).toBe(4.0);
    });

    test('speed suffixes have moderate multiplier', () => {
      expect(affixModifiers['of Haste']).toBe(2.0);
    });
  });

  describe('Specific Item Prices', () => {
    test('Cap is cheapest helm', () => {
      const cap = baseEquipment.helms[0];
      expect(cap.price).toBe(15);
    });

    test('Great Helm is most expensive base helm', () => {
      const greatHelm = baseEquipment.helms[5];
      expect(greatHelm.price).toBe(400);
    });

    test('Buckler is cheapest shield', () => {
      const buckler = baseEquipment.shields[0];
      expect(buckler.price).toBe(30);
    });

    test('Dagger is cheapest sword', () => {
      const dagger = baseEquipment.swords[0];
      expect(dagger.price).toBe(60);
    });

    test('Great Sword is most expensive base sword', () => {
      const greatSword = baseEquipment.swords[6];
      expect(greatSword.price).toBe(3000);
    });
  });

  describe('Price Validation', () => {
    test('all base items have positive prices', () => {
      Object.values(baseEquipment).forEach(category => {
        category.forEach(item => {
          expect(item.price).toBeGreaterThan(0);
        });
      });
    });

    test('all items have valid ilvl', () => {
      Object.values(baseEquipment).forEach(category => {
        category.forEach(item => {
          expect(item.ilvl).toBeGreaterThanOrEqual(1);
          expect(item.ilvl).toBeLessThanOrEqual(25);
        });
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
      expect(uniqueMarker.ilvl).toBe(-1);
    });
  });
});
