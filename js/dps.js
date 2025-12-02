// DPS Calculator
// Calculates damage per second by weapon type and character class

// Swing speed data by class and weapon type
const swingSpeeds = {
  sword: {
    Warrior: { normal: 0.45, swiftness: 0.40, speed: 0.35 },
    Rogue: { normal: 0.50, swiftness: 0.45, speed: 0.40 },
    Sorcerer: { normal: 0.60, swiftness: 0.55, speed: 0.50 },
    Monk: { normal: 0.60, swiftness: 0.55, speed: 0.50 },
    Bard: { normal: 0.50, swiftness: 0.45, speed: 0.40 },
    Barbarian: {
      normal: [0.45, 0.40],      // one-hand / two-hand
      swiftness: [0.40, 0.35],
      speed: [0.35, 0.30]
    }
  },
  axe: {
    Warrior: { normal: 0.50, swiftness: 0.45, speed: 0.40 },
    Rogue: { normal: 0.65, swiftness: 0.60, speed: 0.55 },
    Sorcerer: { normal: 0.80, swiftness: 0.75, speed: 0.70 },
    Monk: { normal: 0.70, swiftness: 0.65, speed: 0.60 },
    Bard: { normal: 0.65, swiftness: 0.60, speed: 0.55 },
    Barbarian: { normal: 0.40, swiftness: 0.35, speed: 0.30 }
  },
  staff: {
    Warrior: { normal: 0.55, swiftness: 0.50, speed: 0.45 },
    Rogue: { normal: 0.55, swiftness: 0.50, speed: 0.45 },
    Sorcerer: { normal: 0.60, swiftness: 0.55, speed: 0.50 },
    Monk: { normal: 0.40, swiftness: 0.35, speed: 0.30 },
    Bard: { normal: 0.55, swiftness: 0.50, speed: 0.45 },
    Barbarian: { normal: 0.55, swiftness: 0.50, speed: 0.45 }
  },
  bow: {
    Warrior: { normal: 0.55, swiftness: 0.50 },
    Rogue: { normal: 0.35, swiftness: 0.30 },
    Sorcerer: { normal: 0.80, swiftness: 0.75 },
    Monk: { normal: 0.70, swiftness: 0.70 },
    Bard: { normal: 0.55, swiftness: 0.55 },
    Barbarian: { normal: 0.55, swiftness: 0.55 }
  }
};

// Calculate DPS
function calculateDPS(avgDamage, swingTime) {
  return parseFloat((avgDamage / swingTime).toFixed(2));
}

// DOM form handler
function avgdps(theForm) {
  theForm.display.value = "Suffix:" + "\nNormal & Readiness:" + "\nSwiftness:" + "\nSpeed & Haste:";

  if (theForm.basetype.value == "sword") {
    theForm.display1.value = "Warrior:" + "\n" + parseFloat(theForm.avg.value / .45).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .4).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .35).toFixed(2);
    theForm.display2.value = "Rogue:" + "\n" + parseFloat(theForm.avg.value / .5).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .45).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .4).toFixed(2);
    theForm.display3.value = "Sorcerer:" + "\n" + parseFloat(theForm.avg.value / .6).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .5).toFixed(2);
    theForm.display4.value = "Monk:" + "\n" + parseFloat(theForm.avg.value / .6).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .5).toFixed(2);
    theForm.display5.value = "Bard:" + "\n" + parseFloat(theForm.avg.value / .5).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .45).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .4).toFixed(2);
    theForm.display6.value = "Barbarian:" + "\n" + parseFloat(theForm.avg.value / .45).toFixed(2) + " / " + parseFloat(theForm.avg.value / .4).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .4).toFixed(2) + " / " + parseFloat(theForm.avg.value / .35).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .35).toFixed(2) + " / " + parseFloat(theForm.avg.value / .3).toFixed(2);
  }

  if (theForm.basetype.value == "axe") {
    theForm.display1.value = "Warrior:" + "\n" + parseFloat(theForm.avg.value / .5).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .45).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .4).toFixed(2);
    theForm.display2.value = "Rogue:" + "\n" + parseFloat(theForm.avg.value / .65).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .6).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2);
    theForm.display3.value = "Sorcerer:" + "\n" + parseFloat(theForm.avg.value / .8).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .75).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .7).toFixed(2);
    theForm.display4.value = "Monk:" + "\n" + parseFloat(theForm.avg.value / .7).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .65).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .6).toFixed(2);
    theForm.display5.value = "Bard:" + "\n" + parseFloat(theForm.avg.value / .65).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .6).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2);
    theForm.display6.value = "Barbarian:" + "\n" + parseFloat(theForm.avg.value / .4).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .35).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .3).toFixed(2);
  }

  if (theForm.basetype.value == "staff") {
    theForm.display1.value = "Warrior:" + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .5).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .45).toFixed(2);
    theForm.display2.value = "Rogue:" + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .5).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .45).toFixed(2);
    theForm.display3.value = "Sorcerer:" + "\n" + parseFloat(theForm.avg.value / .6).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .5).toFixed(2);
    theForm.display4.value = "Monk:" + "\n" + parseFloat(theForm.avg.value / .4).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .35).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .3).toFixed(2);
    theForm.display5.value = "Bard:" + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .5).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .45).toFixed(2);
    theForm.display6.value = "Barbarian:" + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .5).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .45).toFixed(2);
  }

  if (theForm.basetype.value == "bow") {
    theForm.display1.value = "Warrior:" + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .5).toFixed(2);
    theForm.display2.value = "Rogue:" + "\n" + parseFloat(theForm.avg.value / .35).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .3).toFixed(2);
    theForm.display3.value = "Sorcerer:" + "\n" + parseFloat(theForm.avg.value / .8).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .75).toFixed(2);
    theForm.display4.value = "Monk:" + "\n" + parseFloat(theForm.avg.value / .7).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .7).toFixed(2);
    theForm.display5.value = "Bard:" + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2);
    theForm.display6.value = "Barbarian:" + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2) + "\n" + parseFloat(theForm.avg.value / .55).toFixed(2);
  }
}

// Export for testing (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    swingSpeeds,
    calculateDPS,
    avgdps
  };
}
