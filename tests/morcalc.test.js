/**
 * Unit tests for js/morcalc.js - Monster Calculator
 * Tests experience calculations and attribute constructors
 */

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
  specialArray,
  autoHit,
  autoMiss,
  // New pure calculation functions
  calcMeleeToHit,
  calcBowToHit,
  calcSpellToHit,
  calcMonsterToHit,
  calcBlockingChance,
  calcEffectiveMonsterLevel,
  calcEffectiveMonsterArmor,
  calcEffectiveMonsterTohit,
  calcMonsterExperience,
  calcMonsterHP,
  calcMonsterDamage,
  clampToHit
} = require('../js/morcalc.js');

// Mock global.internal for calcExp tests
global.internal = {
  ia_game: 'MP Diablo'
};

describe('morcalc.js - Monster Calculator', () => {

  describe('calcExp - Experience Calculation', () => {
    beforeEach(() => {
      // Reset internal game state for each test
      global.internal.ia_game = 'MP Diablo';
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
      global.internal.ia_game = 'SP Diablo';
      // In SP, exp is capped at baseExp
      // mLevel = 20, pLevel = 10
      // mExp = floor(100 * (1.0 + (20-10)/10)) = floor(100 * 2.0) = 200
      // SP cap: min(200, 100) = 100
      expect(calcExp(100, 20, 10)).toBe(100);
    });

    test('caps MP experience based on player level', () => {
      global.internal.ia_game = 'MP Diablo';
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
      global.internal.ia_game = 'SP Hellfire';
      expect(calcExp(100, 20, 10)).toBe(100); // Capped at baseExp
    });

    test('works correctly for MP Hellfire', () => {
      global.internal.ia_game = 'MP Hellfire';
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

  describe('game_attributes Constructor', () => {
    test('creates game with type', () => {
      const game = new game_attributes('Test Game');
      expect(game.g_type).toBe('Test Game');
    });
  });

  describe('special_attributes Constructor', () => {
    test('creates special with type', () => {
      const special = new special_attributes('Test Special');
      expect(special.s_type).toBe('Test Special');
    });
  });

  describe('monstergroup_attributes Constructor', () => {
    test('creates monster group with all attributes', () => {
      const mg = new monstergroup_attributes(
        'TestGroup', 'Demon', 'Diablo', 'Weapon', 'Magic', 10, 20, 'None', 8, 4, 12
      );
      expect(mg.mg_type).toBe('TestGroup');
      expect(mg.mg_class).toBe('Demon');
      expect(mg.mg_game).toBe('Diablo');
      expect(mg.mg_attack).toBe('Weapon');
      expect(mg.mg_attack2).toBe('Magic');
      expect(mg.mg_attack2tohit).toBe(10);
      expect(mg.mg_attack2damage).toBe(20);
      expect(mg.mg_attack3).toBe('None');
      expect(mg.mg_speed).toBe(8);
      expect(mg.mg_recovery).toBe(4);
      expect(mg.mg_swing).toBe(12);
    });
  });

  describe('Combat Constants', () => {
    test('autoHit is 5', () => {
      expect(autoHit).toBe(5);
    });

    test('autoMiss is 95', () => {
      expect(autoMiss).toBe(95);
    });
  });

  describe('Weapon Attack Modes', () => {
    test('Bare is Melee mode', () => {
      expect(weaponArray[0].w_mode).toBe('Melee');
    });

    test('Bow is Arrow mode', () => {
      const bow = weaponArray.find(w => w.w_type === 'Bow');
      expect(bow.w_mode).toBe('Arrow');
    });

    test('all weapons have valid modes', () => {
      const validModes = ['Melee', 'Arrow', 'Spell'];
      weaponArray.forEach(w => {
        expect(validModes).toContain(w.w_mode);
      });
    });
  });

  describe('Player Stat Caps', () => {
    test('Warrior has highest Diablo strength cap', () => {
      const warrior = playerArray[0];
      expect(warrior.p_strength).toBe(425);
    });

    test('Rogue has highest Diablo dexterity cap', () => {
      const rogue = playerArray[1];
      expect(rogue.p_dexterity).toBe(415);
    });

    test('Sorceror has highest Diablo magic cap', () => {
      const sorceror = playerArray[2];
      expect(sorceror.p_magic).toBe(425);
    });

    test('Hellfire classes have 0 for Diablo stats', () => {
      const monk = playerArray[3];
      expect(monk.p_strength).toBe(0);
      expect(monk.p_magic).toBe(0);
      expect(monk.p_dexterity).toBe(0);
      expect(monk.p_vitality).toBe(0);
    });

    test('Hellfire classes have valid HF stats', () => {
      const monk = playerArray[3];
      expect(monk.p_hfstrength).toBe(385);
      expect(monk.p_hfmagic).toBe(315);
      expect(monk.p_hfdexterity).toBe(375);
    });
  });

  describe('Difficulty Modifiers', () => {
    test('Nightmare has intermediate modifiers', () => {
      const nightmare = difficultyArray[1];
      expect(nightmare.d_mlvl).toBe(15);
      expect(nightmare.d_armor).toBe(50);
      expect(nightmare.d_tohit).toBe(85);
      expect(nightmare.d_damage1).toBe(2);
      expect(nightmare.d_experience1).toBe(2);
    });

    test('HP multipliers scale with difficulty', () => {
      expect(difficultyArray[0].d_hitpoints1).toBe(0);
      expect(difficultyArray[1].d_hitpoints1).toBe(3);
      expect(difficultyArray[2].d_hitpoints1).toBe(4);
    });
  });

  describe('Dungeon Level Sections', () => {
    test('Church levels are 1-4', () => {
      for (let i = 0; i < 4; i++) {
        expect(dlvlArray[i].dlvl_section).toBe('Church');
      }
    });

    test('Catacombs levels are 5-8', () => {
      for (let i = 4; i < 8; i++) {
        expect(dlvlArray[i].dlvl_section).toBe('Catacombs');
      }
    });

    test('Caves levels are 9-12', () => {
      for (let i = 8; i < 12; i++) {
        expect(dlvlArray[i].dlvl_section).toBe('Caves');
      }
    });

    test('Hell levels are 13-16', () => {
      for (let i = 12; i < 16; i++) {
        expect(dlvlArray[i].dlvl_section).toBe('Hell');
      }
    });

    test('Hellfire has Hive and Crypt', () => {
      expect(dlvlArray[16].dlvl_section).toBe('Hive');
      expect(dlvlArray[20].dlvl_section).toBe('Crypt');
    });
  });

  describe('Special Options Array', () => {
    test('contains all 8 options', () => {
      expect(specialArray[0].s_type).toBe('Plain Monsters');
      expect(specialArray[1].s_type).toBe('Boss Monsters');
      expect(specialArray[2].s_type).toBe('Special Monsters');
      expect(specialArray[3].s_type).toBe('Player vs Player');
      expect(specialArray[4].s_type).toBe('Golem vs Monster');
      expect(specialArray[5].s_type).toBe('Trap Encounters');
      expect(specialArray[6].s_type).toBe('Item Drops');
      expect(specialArray[7].s_type).toBe('Assorted Stats');
    });
  });

  describe('calcMeleeToHit Function', () => {
    test('calculates basic melee to-hit', () => {
      // baseToHit=50, playerLevel=30, weaponBonus=20, monsterArmor=50
      expect(calcMeleeToHit(50, 30, 20, 50)).toBe(50);
    });

    test('Warrior melee bonus increases to-hit', () => {
      const warrior = playerArray[0];
      const result = calcMeleeToHit(100, 30, warrior.p_bwtohit, 50);
      expect(result).toBe(100); // 100 + 30 + 20 - 50
    });

    test('high monster armor reduces to-hit', () => {
      expect(calcMeleeToHit(50, 30, 20, 100)).toBe(0); // 50 + 30 + 20 - 100
    });
  });

  describe('calcBowToHit Function', () => {
    test('calculates basic bow to-hit', () => {
      // baseToHit=50, dex=100, playerLevel=30, bowBonus=20, monsterArmor=50
      // 50 + floor(100/2) + 30 + 20 - 50 = 50 + 50 + 30 + 20 - 50 = 100
      expect(calcBowToHit(50, 100, 30, 20, 50)).toBe(100);
    });

    test('Rogue bow bonus increases to-hit', () => {
      const rogue = playerArray[1];
      // 50 + floor(200/2) + 30 + 20 - 50 = 50 + 100 + 30 + 20 - 50 = 150
      expect(calcBowToHit(50, 200, 30, rogue.p_bbtohit, 50)).toBe(150);
    });

    test('dexterity is halved and floored', () => {
      // dex=101 -> floor(50.5) = 50
      expect(calcBowToHit(0, 101, 0, 0, 0)).toBe(50);
    });
  });

  describe('calcSpellToHit Function', () => {
    test('calculates basic spell to-hit', () => {
      // magic=100, magicBonus=20, monsterLevel=30
      // 50 + 100 + 20 - 30 - 30 = 110
      expect(calcSpellToHit(100, 20, 30)).toBe(110);
    });

    test('Sorcerer magic bonus increases to-hit', () => {
      const sorceror = playerArray[2];
      // 50 + 200 + 20 - 30 - 30 = 210
      expect(calcSpellToHit(200, sorceror.p_bmtohit, 30)).toBe(210);
    });

    test('monster level is doubled in formula', () => {
      // Each monster level reduces to-hit by 2
      const baseResult = calcSpellToHit(100, 0, 10);  // 50 + 100 + 0 - 20 = 130
      const higherLevel = calcSpellToHit(100, 0, 15); // 50 + 100 + 0 - 30 = 120
      expect(baseResult - higherLevel).toBe(10); // 5 more mlvl = 10 less to-hit
    });
  });

  describe('calcMonsterToHit Function', () => {
    test('calculates monster to-hit against player', () => {
      // monsterTohit=100, monsterLevel=20, playerLevel=30, playerArmor=50, autohitMin=15
      // 30 + 100 + 20 + 20 - 30 - 30 - 50 = 60
      expect(calcMonsterToHit(100, 20, 30, 50, 15)).toBe(60);
    });

    test('enforces autohit minimum', () => {
      // Low result should be clamped to autohitMin
      expect(calcMonsterToHit(0, 0, 50, 100, 15)).toBe(15);
    });

    test('Hell difficulty autohit is 30 on dlvl 16', () => {
      // Result below 30 should be clamped to 30
      expect(calcMonsterToHit(10, 10, 40, 50, 30)).toBe(30);
    });
  });

  describe('calcBlockingChance Function', () => {
    test('calculates basic blocking chance', () => {
      // dex=150, playerLevel=30, monsterLevel=20, blockBonus=20
      // 150 - 20 - 20 + 30 + 30 + 20 = 190
      expect(calcBlockingChance(150, 30, 20, 20)).toBe(190);
    });

    test('Warrior block bonus applied', () => {
      const warrior = playerArray[0];
      // dex=150, playerLevel=30, monsterLevel=30, blockBonus=30
      // 150 - 30 - 30 + 30 + 30 + 30 = 180
      expect(calcBlockingChance(150, 30, 30, warrior.p_bblock)).toBe(180);
    });

    test('monster level difference affects blocking', () => {
      // Each player level adds 2, each monster level subtracts 2
      const baseLine = calcBlockingChance(100, 30, 30, 0);  // 100
      const morePLevel = calcBlockingChance(100, 35, 30, 0); // +10
      expect(morePLevel - baseLine).toBe(10);
    });
  });

  describe('calcEffectiveMonsterLevel Function', () => {
    test('Normal difficulty has no bonus', () => {
      expect(calcEffectiveMonsterLevel(20, 0)).toBe(20);
    });

    test('Nightmare adds 15 to monster level', () => {
      expect(calcEffectiveMonsterLevel(20, 15)).toBe(35);
    });

    test('Hell adds 30 to monster level', () => {
      expect(calcEffectiveMonsterLevel(20, 30)).toBe(50);
    });
  });

  describe('calcEffectiveMonsterArmor Function', () => {
    test('Normal difficulty has no bonus', () => {
      expect(calcEffectiveMonsterArmor(50, 0)).toBe(50);
    });

    test('Nightmare adds 50 to armor', () => {
      expect(calcEffectiveMonsterArmor(50, 50)).toBe(100);
    });

    test('Hell adds 80 to armor', () => {
      expect(calcEffectiveMonsterArmor(50, 80)).toBe(130);
    });
  });

  describe('calcEffectiveMonsterTohit Function', () => {
    test('Normal difficulty has no bonus', () => {
      expect(calcEffectiveMonsterTohit(100, 0)).toBe(100);
    });

    test('Nightmare adds 85 to to-hit', () => {
      expect(calcEffectiveMonsterTohit(100, 85)).toBe(185);
    });

    test('Hell adds 120 to to-hit', () => {
      expect(calcEffectiveMonsterTohit(100, 120)).toBe(220);
    });
  });

  describe('calcMonsterExperience Function', () => {
    test('Normal difficulty is base experience', () => {
      // baseExp=100, multiplier=1, adder=0
      expect(calcMonsterExperience(100, 1, 0)).toBe(100);
    });

    test('Nightmare doubles and adds 2000', () => {
      // baseExp=100, multiplier=2, adder=2000
      expect(calcMonsterExperience(100, 2, 2000)).toBe(2200);
    });

    test('Hell quadruples and adds 4000', () => {
      // baseExp=100, multiplier=4, adder=4000
      expect(calcMonsterExperience(100, 4, 4000)).toBe(4400);
    });
  });

  describe('calcMonsterHP Function', () => {
    test('Normal difficulty is base HP', () => {
      // baseHP=100, multiplier=0, adder=0 (Normal uses 0 multiplier)
      expect(calcMonsterHP(100, 0, 0)).toBe(0);
    });

    test('Nightmare HP calculation', () => {
      // baseHP=100, multiplier=3, adder=1
      expect(calcMonsterHP(100, 3, 1)).toBe(301);
    });

    test('Hell HP calculation', () => {
      // baseHP=100, multiplier=4, adder=3
      expect(calcMonsterHP(100, 4, 3)).toBe(403);
    });
  });

  describe('calcMonsterDamage Function', () => {
    test('Normal difficulty is base damage', () => {
      expect(calcMonsterDamage(10, 0, 0)).toBe(0);
    });

    test('Nightmare damage calculation', () => {
      // baseDamage=10, multiplier=2, adder=4
      expect(calcMonsterDamage(10, 2, 4)).toBe(24);
    });

    test('Hell damage calculation', () => {
      // baseDamage=10, multiplier=4, adder=6
      expect(calcMonsterDamage(10, 4, 6)).toBe(46);
    });
  });

  describe('clampToHit Function', () => {
    test('clamps values below autoHit', () => {
      expect(clampToHit(3, 5, 95)).toBe(5);
      expect(clampToHit(-10, 5, 95)).toBe(5);
    });

    test('clamps values above autoMiss', () => {
      expect(clampToHit(98, 5, 95)).toBe(95);
      expect(clampToHit(150, 5, 95)).toBe(95);
    });

    test('returns value unchanged within range', () => {
      expect(clampToHit(50, 5, 95)).toBe(50);
      expect(clampToHit(5, 5, 95)).toBe(5);
      expect(clampToHit(95, 5, 95)).toBe(95);
    });
  });
});
