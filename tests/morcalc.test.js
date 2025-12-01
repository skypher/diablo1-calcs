/**
 * Unit tests for js/morcalc.js - Monster Calculator
 * Tests experience calculations and attribute constructors
 */

const fs = require('fs');
const vm = require('vm');

// Create context for executing source
const context = {
  Math: Math,
  Array: Array,
  alert: () => {},
  document: {
    combat: {
      player: { selectedIndex: 0 },
      weapon: { selectedIndex: 0 },
      extra: { selectedIndex: 0 },
      difficulty: { selectedIndex: 0 },
      dlvl: { selectedIndex: 0 },
      clvl: { selectedIndex: 0 },
      game: { selectedIndex: 0 },
      special: { selectedIndex: 0 },
      results: { value: '' },
      results2: { value: '' },
      str_fld: { value: '' },
      mag_fld: { value: '' },
      dex_fld: { value: '' },
      vit_fld: { value: '' },
      armor_fld: { value: '' },
      tohit_fld: { value: '' },
      damlow_fld: { value: '' },
      damhigh_fld: { value: '' },
      resmagic_fld: { value: '' },
      resfire_fld: { value: '' },
      reslightning_fld: { value: '' },
      duelclvl: { selectedIndex: 0 },
      duelstr_fld: { value: '' },
      duelmag_fld: { value: '' },
      dueldex_fld: { value: '' },
      duelarmor_fld: { value: '' },
      dueltohit_fld: { value: '' },
      duelres_fld: { value: '' },
      slvl: { selectedIndex: 0 }
    }
  },
  internal: {
    ia_game: 'MP Diablo',
    ia_player: 'Warrior',
    ia_clvl: 1,
    ia_weapon: 'Bare',
    ia_slvl: 0,
    ia_strength: 0,
    ia_magic: 0,
    ia_dexterity: 0,
    ia_vitality: 0,
    ia_armor: 0,
    ia_tohit: 0,
    ia_damlow: 0,
    ia_damhigh: 0,
    ia_resmagic: 0,
    ia_resfire: 0,
    ia_reslightning: 0,
    ia_difficulty: 'Normal',
    ia_dlvl: '1',
    ia_special: 'Plain Monsters',
    ia_extra: 'Zombie',
    ia_duelclvl: 1,
    ia_duelstrength: 0,
    ia_duelmagic: 0,
    ia_dueldexterity: 0,
    ia_duelarmor: 0,
    ia_dueltohit: 0,
    ia_duelresistance: 0
  },
  internalflags: {
    player_flag: false,
    clvl_flag: false,
    weapon_flag: false,
    slvl_flag: false,
    strength_flag: false,
    magic_flag: false,
    dexterity_flag: false,
    vitality_flag: false,
    armor_flag: false,
    tohit_flag: false,
    damlow_flag: false,
    damhigh_flag: false,
    resmagic_flag: false,
    resfire_flag: false,
    reslightning_flag: false,
    game_flag: false,
    difficulty_flag: false,
    dlvl_flag: false,
    special_flag: false,
    extra_flag: false,
    duelclvl_flag: false,
    duelstrength_flag: false,
    duelmagic_flag: false,
    dueldexterity_flag: false,
    duelarmor_flag: false,
    dueltohit_flag: false,
    duelresistance_flag: false
  }
};

// Create mock monsterArray
context.monsterArray = [{ m_armor: 20, m_mlvl: 5, m_tohit: 30, m_experience: 100 }];

vm.createContext(context);

const sourceCode = fs.readFileSync('./js/morcalc.js', 'utf8');
vm.runInContext(sourceCode, context);

const {
  calcExp,
  player_attributes,
  weapon_attributes,
  game_attributes,
  difficulty_attributes,
  dlvl_attributes,
  special_attributes,
  monstergroup_attributes,
  playerArray,
  weaponArray,
  gameArray,
  difficultyArray,
  dlvlArray,
  specialArray
} = context;

describe('morcalc.js - Monster Calculator', () => {

  describe('calcExp - Experience Calculation', () => {
    beforeEach(() => {
      // Reset internal game state for each test
      context.internal.ia_game = 'MP Diablo';
    });

    test('returns 0 when player level is 10 or more above monster level', () => {
      // If (pLevel - mLevel) >= 10, mExp = 0
      expect(calcExp(100, 5, 15)).toBe(0);
      expect(calcExp(100, 10, 20)).toBe(0);
      expect(calcExp(100, 1, 11)).toBe(0);
    });

    test('calculates base experience when levels are equal', () => {
      // mExp = floor(baseExp * (1.0 + (mLevel - pLevel)/10))
      // When mLevel == pLevel: mExp = floor(100 * 1.0) = 100
      expect(calcExp(100, 10, 10)).toBe(100);
    });

    test('increases experience when monster level is higher', () => {
      // mLevel = 15, pLevel = 10
      // mExp = floor(100 * (1.0 + (15-10)/10)) = floor(100 * 1.5) = 150
      // But MP cap at level 10 is 200 * 10 = 2000, so 150 passes
      expect(calcExp(100, 15, 10)).toBe(150);
    });

    test('decreases experience when player level is higher', () => {
      // mLevel = 10, pLevel = 15
      // mExp = floor(100 * (1.0 + (10-15)/10)) = floor(100 * 0.5) = 50
      expect(calcExp(100, 10, 15)).toBe(50);
    });

    test('caps SP experience at base experience', () => {
      context.internal.ia_game = 'SP Diablo';
      // In SP, exp is capped at baseExp
      // mLevel = 20, pLevel = 10
      // mExp = floor(100 * (1.0 + (20-10)/10)) = floor(100 * 2.0) = 200
      // SP cap: min(200, 100) = 100
      expect(calcExp(100, 20, 10)).toBe(100);
    });

    test('caps MP experience based on player level', () => {
      context.internal.ia_game = 'MP Diablo';
      // Level 1 cap: 100
      expect(calcExp(500, 20, 1)).toBeLessThanOrEqual(100);

      // Level 2 cap: 231
      expect(calcExp(500, 20, 2)).toBeLessThanOrEqual(231);

      // Level 3 cap: 402
      expect(calcExp(1000, 20, 3)).toBeLessThanOrEqual(402);

      // Level 4 cap: 624
      expect(calcExp(1500, 20, 4)).toBeLessThanOrEqual(624);

      // Level 5 cap: 912
      expect(calcExp(2000, 20, 5)).toBeLessThanOrEqual(912);

      // Level 6+ cap: 200 * pLevel
      expect(calcExp(3000, 30, 10)).toBeLessThanOrEqual(2000);
    });

    test('works correctly for SP Hellfire', () => {
      context.internal.ia_game = 'SP Hellfire';
      expect(calcExp(100, 20, 10)).toBe(100); // Capped at baseExp
    });

    test('works correctly for MP Hellfire', () => {
      context.internal.ia_game = 'MP Hellfire';
      // Same caps as MP Diablo
      expect(calcExp(500, 20, 1)).toBeLessThanOrEqual(100);
    });
  });

  describe('player_attributes Constructor', () => {
    test('creates player with all attributes', () => {
      const player = new player_attributes(
        'TestClass', 100, 150, 50, 75, 80, 120, 60, 90,
        200, 250, 300, 50, 10, 15, 5, 20, 3, 5
      );

      expect(player.p_type).toBe('TestClass');
      expect(player.p_strength).toBe(100);
      expect(player.p_hfstrength).toBe(150);
      expect(player.p_magic).toBe(50);
      expect(player.p_hfmagic).toBe(75);
      expect(player.p_dexterity).toBe(80);
      expect(player.p_hfdexterity).toBe(120);
      expect(player.p_vitality).toBe(60);
      expect(player.p_hfvitality).toBe(90);
      expect(player.p_armor).toBe(200);
      expect(player.p_hfarmor).toBe(250);
      expect(player.p_tohit).toBe(300);
      expect(player.p_damage).toBe(50);
      expect(player.p_bwtohit).toBe(10);
      expect(player.p_bbtohit).toBe(15);
      expect(player.p_bmtohit).toBe(5);
      expect(player.p_bblock).toBe(20);
      expect(player.p_blocking).toBe(3);
      expect(player.p_recovery).toBe(5);
    });
  });

  describe('weapon_attributes Constructor', () => {
    test('creates weapon with all attributes', () => {
      const weapon = new weapon_attributes('TestWeapon', 'Melee', 9, 10, 12, 7, 10, 9);

      expect(weapon.w_type).toBe('TestWeapon');
      expect(weapon.w_mode).toBe('Melee');
      expect(weapon.w_warrior).toBe(9);
      expect(weapon.w_rogue).toBe(10);
      expect(weapon.w_sorceror).toBe(12);
      expect(weapon.w_monk).toBe(7);
      expect(weapon.w_bard).toBe(10);
      expect(weapon.w_barbarian).toBe(9);
    });
  });

  describe('difficulty_attributes Constructor', () => {
    test('creates difficulty with all modifiers', () => {
      const diff = new difficulty_attributes('Hell', 30, 4, 3, 97, 80, 120, 4, 6, 4, 4000);

      expect(diff.d_type).toBe('Hell');
      expect(diff.d_mlvl).toBe(30);
      expect(diff.d_hitpoints1).toBe(4);
      expect(diff.d_hitpoints2).toBe(3);
      expect(diff.d_hfhitpoints).toBe(97);
      expect(diff.d_armor).toBe(80);
      expect(diff.d_tohit).toBe(120);
      expect(diff.d_damage1).toBe(4);
      expect(diff.d_damage2).toBe(6);
      expect(diff.d_experience1).toBe(4);
      expect(diff.d_experience2).toBe(4000);
    });
  });

  describe('dlvl_attributes Constructor', () => {
    test('creates dungeon level with all attributes', () => {
      const dlvl = new dlvl_attributes('16', 'Hell', 'Diablo', 16, 30);

      expect(dlvl.dlvl_type).toBe('16');
      expect(dlvl.dlvl_section).toBe('Hell');
      expect(dlvl.dlvl_game).toBe('Diablo');
      expect(dlvl.dlvl_number).toBe(16);
      expect(dlvl.dlvl_autohit).toBe(30);
    });
  });

  describe('Predefined Data Arrays', () => {
    test('playerArray contains all 6 classes', () => {
      expect(playerArray.length).toBe(6);
      expect(playerArray[0].p_type).toBe('Warrior');
      expect(playerArray[1].p_type).toBe('Rogue');
      expect(playerArray[2].p_type).toBe('Sorceror');
      expect(playerArray[3].p_type).toBe('Monk');
      expect(playerArray[4].p_type).toBe('Bard');
      expect(playerArray[5].p_type).toBe('Barbarian');
    });

    test('weaponArray contains all weapon types', () => {
      expect(weaponArray.length).toBe(7);
      expect(weaponArray[0].w_type).toBe('Bare');
      expect(weaponArray[1].w_type).toBe('Axe');
      expect(weaponArray[2].w_type).toBe('Bow');
      expect(weaponArray[3].w_type).toBe('Club');
      expect(weaponArray[4].w_type).toBe('Shield');
      expect(weaponArray[5].w_type).toBe('Staff');
      expect(weaponArray[6].w_type).toBe('Sword');
    });

    test('gameArray contains all game types', () => {
      expect(gameArray.length).toBe(4);
      expect(gameArray[0].g_type).toBe('MP Diablo');
      expect(gameArray[1].g_type).toBe('SP Diablo');
      expect(gameArray[2].g_type).toBe('MP Hellfire');
      expect(gameArray[3].g_type).toBe('SP Hellfire');
    });

    test('difficultyArray contains all difficulties', () => {
      expect(difficultyArray.length).toBe(3);
      expect(difficultyArray[0].d_type).toBe('Normal');
      expect(difficultyArray[1].d_type).toBe('Nightmare');
      expect(difficultyArray[2].d_type).toBe('Hell');
    });

    test('Normal difficulty has no modifiers', () => {
      const normal = difficultyArray[0];
      expect(normal.d_mlvl).toBe(0);
      expect(normal.d_armor).toBe(0);
      expect(normal.d_tohit).toBe(0);
      expect(normal.d_experience1).toBe(1);
      expect(normal.d_experience2).toBe(0);
    });

    test('Hell difficulty has maximum modifiers', () => {
      const hell = difficultyArray[2];
      expect(hell.d_mlvl).toBe(30);
      expect(hell.d_armor).toBe(80);
      expect(hell.d_tohit).toBe(120);
      expect(hell.d_experience1).toBe(4);
      expect(hell.d_experience2).toBe(4000);
    });

    test('dlvlArray contains all dungeon levels', () => {
      expect(dlvlArray.length).toBe(24);
      // Diablo levels 1-16
      expect(dlvlArray[0].dlvl_type).toBe('1');
      expect(dlvlArray[15].dlvl_type).toBe('16');
      // Hellfire levels
      expect(dlvlArray[16].dlvl_type).toBe('Hive 1');
      expect(dlvlArray[20].dlvl_type).toBe('Crypt 1');
    });

    test('dlvl autohit values are correct', () => {
      // Levels 1-13: autohit 15
      for (let i = 0; i < 13; i++) {
        expect(dlvlArray[i].dlvl_autohit).toBe(15);
      }
      // Level 14: autohit 20
      expect(dlvlArray[13].dlvl_autohit).toBe(20);
      // Level 15: autohit 25
      expect(dlvlArray[14].dlvl_autohit).toBe(25);
      // Level 16: autohit 30
      expect(dlvlArray[15].dlvl_autohit).toBe(30);
    });

    test('specialArray contains all special options', () => {
      expect(specialArray.length).toBe(8);
      expect(specialArray[0].s_type).toBe('Plain Monsters');
      expect(specialArray[3].s_type).toBe('Player vs Player');
    });
  });

  describe('Player Class Bonuses', () => {
    test('Warrior has melee bonus', () => {
      expect(playerArray[0].p_bwtohit).toBe(20);
      expect(playerArray[0].p_bbtohit).toBe(10);
      expect(playerArray[0].p_bmtohit).toBe(0);
    });

    test('Rogue has bow bonus', () => {
      expect(playerArray[1].p_bwtohit).toBe(0);
      expect(playerArray[1].p_bbtohit).toBe(20);
      expect(playerArray[1].p_bmtohit).toBe(0);
    });

    test('Sorceror has magic bonus', () => {
      expect(playerArray[2].p_bwtohit).toBe(0);
      expect(playerArray[2].p_bbtohit).toBe(0);
      expect(playerArray[2].p_bmtohit).toBe(20);
    });
  });
});
