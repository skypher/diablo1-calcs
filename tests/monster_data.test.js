/**
 * Unit tests for js/monster_data.js - Monster Data Definitions
 * Tests monster statistics and data structure
 */

const {
  monster_attributes,
  monsterArray
} = require('../js/monster_data.js');

describe('monster_data.js - Monster Data Definitions', () => {

  describe('monster_attributes Constructor', () => {
    test('creates monster with all attributes', () => {
      const monster = new monster_attributes(
        'Test Monster', 'TestClass', 1, 5, 10, 50, 100, 25, 30, 5, 15, 'R', 'I', '-', 'I', 'R', '-', 500
      );

      expect(monster.m_type).toBe('Test Monster');
      expect(monster.m_class).toBe('TestClass');
      expect(monster.m_dlvllow).toBe(1);
      expect(monster.m_dlvlhigh).toBe(5);
      expect(monster.m_mlvl).toBe(10);
      expect(monster.m_hitpointslow).toBe(50);
      expect(monster.m_hitpointshigh).toBe(100);
      expect(monster.m_armor).toBe(25);
      expect(monster.m_tohit).toBe(30);
      expect(monster.m_damagelow).toBe(5);
      expect(monster.m_damagehigh).toBe(15);
      expect(monster.m_resm1).toBe('R');
      expect(monster.m_resf1).toBe('I');
      expect(monster.m_resl1).toBe('-');
      expect(monster.m_resm2).toBe('I');
      expect(monster.m_resf2).toBe('R');
      expect(monster.m_resl2).toBe('-');
      expect(monster.m_experience).toBe(500);
    });
  });

  describe('monsterArray', () => {
    test('contains all monsters', () => {
      expect(monsterArray.length).toBe(88);
    });

    test('contains Zombie as first monster', () => {
      expect(monsterArray[0].m_type).toBe('Zombie');
      expect(monsterArray[0].m_class).toBe('Zombie');
      expect(monsterArray[0].m_mlvl).toBe(1);
    });

    test('contains Advocate as last monster', () => {
      const lastIndex = monsterArray.length - 1;
      expect(monsterArray[lastIndex].m_type).toBe('Advocate');
      expect(monsterArray[lastIndex].m_class).toBe('Mage');
      expect(monsterArray[lastIndex].m_mlvl).toBe(30);
    });

    test('monsters have increasing levels', () => {
      // Check that early monsters have low levels
      expect(monsterArray[0].m_mlvl).toBe(1);
      expect(monsterArray[1].m_mlvl).toBe(2);
      // Check that late monsters have high levels
      const lastIndex = monsterArray.length - 1;
      expect(monsterArray[lastIndex].m_mlvl).toBe(30);
    });

    test('all monsters have valid resistance values', () => {
      const validRes = ['-', 'R', 'I', 'r'];
      monsterArray.forEach(monster => {
        expect(validRes).toContain(monster.m_resm1);
        expect(validRes).toContain(monster.m_resf1);
        expect(validRes).toContain(monster.m_resl1);
        expect(validRes).toContain(monster.m_resm2);
        expect(validRes).toContain(monster.m_resf2);
        expect(validRes).toContain(monster.m_resl2);
      });
    });

    test('all monsters have positive experience', () => {
      monsterArray.forEach(monster => {
        expect(monster.m_experience).toBeGreaterThan(0);
      });
    });

    test('all monsters have valid dungeon level ranges', () => {
      monsterArray.forEach(monster => {
        expect(monster.m_dlvllow).toBeGreaterThanOrEqual(1);
        expect(monster.m_dlvlhigh).toBeLessThanOrEqual(16);
        expect(monster.m_dlvlhigh).toBeGreaterThanOrEqual(monster.m_dlvllow);
      });
    });

    test('all monsters have valid hitpoint ranges', () => {
      monsterArray.forEach(monster => {
        expect(monster.m_hitpointslow).toBeGreaterThan(0);
        expect(monster.m_hitpointshigh).toBeGreaterThanOrEqual(monster.m_hitpointslow);
      });
    });

    test('all monsters have valid damage ranges', () => {
      monsterArray.forEach(monster => {
        expect(monster.m_damagelow).toBeGreaterThanOrEqual(1);
        expect(monster.m_damagehigh).toBeGreaterThanOrEqual(monster.m_damagelow);
      });
    });
  });

  describe('Monster Classes', () => {
    test('contains all zombie variants', () => {
      const zombies = monsterArray.filter(m => m.m_class === 'Zombie');
      expect(zombies.length).toBe(4);
      expect(zombies.map(m => m.m_type)).toContain('Zombie');
      expect(zombies.map(m => m.m_type)).toContain('Ghoul');
      expect(zombies.map(m => m.m_type)).toContain('Rotting Carcass');
      expect(zombies.map(m => m.m_type)).toContain('Black Death');
    });

    test('contains all skeleton variants', () => {
      const skeletons = monsterArray.filter(m => m.m_class === 'Skeleton');
      expect(skeletons.length).toBe(4);
    });

    test('contains all balrog variants', () => {
      const balrogs = monsterArray.filter(m => m.m_class === 'Balrog');
      expect(balrogs.length).toBe(4);
      expect(balrogs.map(m => m.m_type)).toContain('Slayer');
      expect(balrogs.map(m => m.m_type)).toContain('Guardian');
      expect(balrogs.map(m => m.m_type)).toContain('Vortex Lord');
      expect(balrogs.map(m => m.m_type)).toContain('Balrog');
    });

    test('contains all knight variants', () => {
      const knights = monsterArray.filter(m => m.m_class === 'Knight');
      expect(knights.length).toBe(4);
      expect(knights.map(m => m.m_type)).toContain('Black Knight');
      expect(knights.map(m => m.m_type)).toContain('Blood Knight');
    });

    test('contains all mage variants', () => {
      const mages = monsterArray.filter(m => m.m_class === 'Mage');
      expect(mages.length).toBe(4);
      expect(mages.map(m => m.m_type)).toContain('Counselor');
      expect(mages.map(m => m.m_type)).toContain('Advocate');
    });
  });

  describe('Specific Monster Stats', () => {
    test('Zombie has correct stats', () => {
      const zombie = monsterArray.find(m => m.m_type === 'Zombie');
      expect(zombie.m_mlvl).toBe(1);
      expect(zombie.m_armor).toBe(5);
      expect(zombie.m_tohit).toBe(10);
      expect(zombie.m_damagelow).toBe(2);
      expect(zombie.m_damagehigh).toBe(5);
      expect(zombie.m_experience).toBe(54);
    });

    test('Blood Knight has correct stats', () => {
      const bloodKnight = monsterArray.find(m => m.m_type === 'Blood Knight');
      expect(bloodKnight.m_mlvl).toBe(30);
      expect(bloodKnight.m_armor).toBe(85);
      expect(bloodKnight.m_tohit).toBe(130);
      expect(bloodKnight.m_hitpointslow).toBe(200);
      expect(bloodKnight.m_hitpointshigh).toBe(200);
      expect(bloodKnight.m_experience).toBe(5130);
    });

    test('Advocate has correct stats', () => {
      const advocate = monsterArray.find(m => m.m_type === 'Advocate');
      expect(advocate.m_mlvl).toBe(30);
      expect(advocate.m_armor).toBe(0); // Mages have 0 armor
      expect(advocate.m_resm2).toBe('I');
      expect(advocate.m_resf2).toBe('I');
      expect(advocate.m_resl2).toBe('I');
    });

    test('Lava Maw has correct stats', () => {
      const lavaMaw = monsterArray.find(m => m.m_type === 'Lava Maw');
      expect(lavaMaw.m_mlvl).toBe(25);
      expect(lavaMaw.m_class).toBe('SpittingTerror');
      expect(lavaMaw.m_armor).toBe(35);
    });
  });

  describe('Resistance Patterns', () => {
    test('Mages have 0 armor', () => {
      const mages = monsterArray.filter(m => m.m_class === 'Mage');
      mages.forEach(mage => {
        expect(mage.m_armor).toBe(0);
      });
    });

    test('Skeletons are immune to magic', () => {
      const skeletons = monsterArray.filter(m => m.m_class === 'Skeleton');
      skeletons.forEach(skeleton => {
        expect(skeleton.m_resm1).toBe('I');
        expect(skeleton.m_resm2).toBe('I');
      });
    });

    test('Blood Knight has triple immunity on Hell', () => {
      const bloodKnight = monsterArray.find(m => m.m_type === 'Blood Knight');
      expect(bloodKnight.m_resm2).toBe('I');
      expect(bloodKnight.m_resf2).toBe('R');
      expect(bloodKnight.m_resl2).toBe('I');
    });
  });

  describe('Dungeon Level Distribution', () => {
    test('Church monsters (levels 1-4)', () => {
      const churchMonsters = monsterArray.filter(m => m.m_dlvllow <= 4 && m.m_dlvlhigh <= 6);
      expect(churchMonsters.length).toBeGreaterThan(0);
    });

    test('Hell/Chaos monsters (levels 13-16)', () => {
      const hellMonsters = monsterArray.filter(m => m.m_dlvllow >= 10);
      expect(hellMonsters.length).toBeGreaterThan(0);
      expect(hellMonsters.map(m => m.m_type)).toContain('Blood Knight');
      expect(hellMonsters.map(m => m.m_type)).toContain('Advocate');
    });
  });
});
