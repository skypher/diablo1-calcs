// Quality Level Calculator
// Calculates item quality levels for NPC shops

function specialIlvl(clvl) {
  if (clvl < 10) return 6;
  else if (clvl < 12) return 7;
  else if (clvl < 14) return 8;
  else if (clvl < 16) return 9;
  else if (clvl < 18) return 10;
  else if (clvl < 20) return 11;
  else if (clvl < 22) return 12;
  else if (clvl < 24) return 13;
  else if (clvl < 26) return 14;
  else if (clvl < 28) return 15;
  else return 16;
}

function grisMinMaxIlvl(qlvl) {
  return Math.max(1, Math.min(qlvl, 30));
}

function calcGriswoldsBaseQlvl(ilvl) {
  ilvl = grisMinMaxIlvl(ilvl);
  return grisMinMaxIlvl(parseInt(ilvl / 4)) + "-" + Math.min(25, ilvl);
}

function calcGriswoldsAffixQlvl(ilvl) {
  ilvl = grisMinMaxIlvl(ilvl);
  return grisMinMaxIlvl(parseInt(ilvl / 2)) + "-" + ilvl;
}

function calcGriswoldsMinMaxQlvls(clvl) {
  if (clvl < 8)
    return `Slot:   Base:   Affixes:

1:      ${calcGriswoldsBaseQlvl(clvl - 1)}     ${calcGriswoldsAffixQlvl(clvl - 1)}
2:      ${calcGriswoldsBaseQlvl(clvl - 1)}     ${calcGriswoldsAffixQlvl(clvl - 1)}
3:      ${calcGriswoldsBaseQlvl(clvl)}     ${calcGriswoldsAffixQlvl(clvl)}
4:      ${calcGriswoldsBaseQlvl(clvl)}     ${calcGriswoldsAffixQlvl(clvl)}
5:      ${calcGriswoldsBaseQlvl(clvl + 1)}     ${calcGriswoldsAffixQlvl(clvl + 1)}
6:      ${calcGriswoldsBaseQlvl(clvl + 2)}     ${calcGriswoldsAffixQlvl(clvl + 2)}`;
  if (clvl == 8)
    return `Slot:   Base:   Affixes:

1:      ${calcGriswoldsBaseQlvl(clvl - 1)}     ${calcGriswoldsAffixQlvl(clvl - 1)}
2:      ${calcGriswoldsBaseQlvl(clvl - 1)}     ${calcGriswoldsAffixQlvl(clvl - 1)}
3:      ${calcGriswoldsBaseQlvl(clvl)}     ${calcGriswoldsAffixQlvl(clvl)}
4:      ${calcGriswoldsBaseQlvl(clvl)}     ${calcGriswoldsAffixQlvl(clvl)}
5:      ${calcGriswoldsBaseQlvl(clvl + 1)}     ${calcGriswoldsAffixQlvl(clvl + 1)}
6:      ${calcGriswoldsBaseQlvl(clvl + 2)}    ${calcGriswoldsAffixQlvl(clvl + 2)}`;
  if (clvl == 9)
    return `Slot:   Base:   Affixes:

1:      ${calcGriswoldsBaseQlvl(clvl - 1)}     ${calcGriswoldsAffixQlvl(clvl - 1)}
2:      ${calcGriswoldsBaseQlvl(clvl - 1)}     ${calcGriswoldsAffixQlvl(clvl - 1)}
3:      ${calcGriswoldsBaseQlvl(clvl)}     ${calcGriswoldsAffixQlvl(clvl)}
4:      ${calcGriswoldsBaseQlvl(clvl)}     ${calcGriswoldsAffixQlvl(clvl)}
5:      ${calcGriswoldsBaseQlvl(clvl + 1)}    ${calcGriswoldsAffixQlvl(clvl + 1)}
6:      ${calcGriswoldsBaseQlvl(clvl + 2)}    ${calcGriswoldsAffixQlvl(clvl + 2)}`;
  if (clvl == 10)
    return `Slot:   Base:   Affixes:

1:      ${calcGriswoldsBaseQlvl(clvl - 1)}     ${calcGriswoldsAffixQlvl(clvl - 1)}
2:      ${calcGriswoldsBaseQlvl(clvl - 1)}     ${calcGriswoldsAffixQlvl(clvl - 1)}
3:      ${calcGriswoldsBaseQlvl(clvl)}    ${calcGriswoldsAffixQlvl(clvl)}
4:      ${calcGriswoldsBaseQlvl(clvl)}    ${calcGriswoldsAffixQlvl(clvl)}
5:      ${calcGriswoldsBaseQlvl(clvl + 1)}    ${calcGriswoldsAffixQlvl(clvl + 1)}
6:      ${calcGriswoldsBaseQlvl(clvl + 2)}    ${calcGriswoldsAffixQlvl(clvl + 2)}`;
  if (clvl > 10 && clvl < 30)
    return `Slot:   Base:   Affixes:

1:      ${calcGriswoldsBaseQlvl(clvl - 1)}    ${calcGriswoldsAffixQlvl(clvl - 1)}
2:      ${calcGriswoldsBaseQlvl(clvl - 1)}    ${calcGriswoldsAffixQlvl(clvl - 1)}
3:      ${calcGriswoldsBaseQlvl(clvl)}    ${calcGriswoldsAffixQlvl(clvl)}
4:      ${calcGriswoldsBaseQlvl(clvl)}    ${calcGriswoldsAffixQlvl(clvl)}
5:      ${calcGriswoldsBaseQlvl(clvl + 1)}    ${calcGriswoldsAffixQlvl(clvl + 1)}
6:      ${calcGriswoldsBaseQlvl(clvl + 2)}    ${calcGriswoldsAffixQlvl(clvl + 2)}`;
  else
    return `Slot:   Base:   Affixes:

1:      ${calcGriswoldsBaseQlvl(30 - 1)}    ${calcGriswoldsAffixQlvl(30 - 1)}
2:      ${calcGriswoldsBaseQlvl(30 - 1)}    ${calcGriswoldsAffixQlvl(30 - 1)}
3:      ${calcGriswoldsBaseQlvl(clvl)}    ${calcGriswoldsAffixQlvl(clvl)}
4:      ${calcGriswoldsBaseQlvl(clvl)}    ${calcGriswoldsAffixQlvl(clvl)}
5:      ${calcGriswoldsBaseQlvl(clvl + 1)}    ${calcGriswoldsAffixQlvl(clvl + 1)}
6:      ${calcGriswoldsBaseQlvl(clvl + 2)}    ${calcGriswoldsAffixQlvl(clvl + 2)}`;
}

function calcWirtQlvls(clvl) {
  return `Base items:  1-${Math.min(clvl, 25)}
Affixes:     ${Math.min(clvl, 25)}-${Math.min(2 * clvl, 60)}`;
}

function calcAdriaQlvls(clvl) {
  const ilvl = specialIlvl(clvl);
  return `Base items and spells (of staffs or books):  1-${ilvl}
Prefixes on staffs with spell:    1-${2 * ilvl}
Affixes on staffs without spell:  ${ilvl}-${2 * ilvl}`;
}

// DOM event handler for form submission
if (typeof $ !== 'undefined') {
  $(function() {
    $("#calc").on("submit", function(e) {
      e.preventDefault();
      const clvl = parseInt($("#clvl").val());
      $("#grisresult").html(calcGriswoldsMinMaxQlvls(clvl));
      $("#wirtresult").html(calcWirtQlvls(clvl));
      $("#adriaresult").html(calcAdriaQlvls(clvl));
    });
  });
}

// Export for testing (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    specialIlvl,
    grisMinMaxIlvl,
    calcGriswoldsBaseQlvl,
    calcGriswoldsAffixQlvl,
    calcGriswoldsMinMaxQlvls,
    calcWirtQlvls,
    calcAdriaQlvls
  };
}
