module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['ts','js','json'],
  transform: {
    '^.+\\.ts$': ['@swc/jest', {
      jsc: { parser: { syntax: 'typescript', decorators: true }, target: 'es2022' },
      module: { type: 'commonjs' }
    }]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
