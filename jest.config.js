module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/internals.js',
    '!js/parse_funcs.js',
    '!js/orkin.js',
    '!js/itmchk.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};
