// ts-jest is currently working with version 26.4.4

module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/build/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
};
