// Armor Calculator
// Simple AC calculation with rate modifier

function AcCalc(theForm) {
  const myAc = theForm.base.value * 1;
  const myAcRate = 1 + theForm.acrate.value * 0.01;
  theForm.ac.value = Math.floor(myAc * myAcRate);
}

// Pure calculation function for testing
function calculateAC(base, acrate) {
  const myAc = base * 1;
  const myAcRate = 1 + acrate * 0.01;
  return Math.floor(myAc * myAcRate);
}

// Export for testing (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AcCalc,
    calculateAC
  };
}
