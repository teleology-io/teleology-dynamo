
module.exports = {
  transform: {
    '^.+\\.js?$': 'babel-jest',
  },
  timers: 'fake',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
};