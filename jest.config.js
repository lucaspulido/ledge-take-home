module.exports = {

  preset:'ts-jest',

  testEnvironment:'node',

  roots:[
    '<rootDir>/src',
    '<rootDir>/tests'
  ],

  moduleFileExtensions:[
    'ts',
    'js'
  ],

  testMatch:[

    '**/*.spec.ts'

  ],

  collectCoverageFrom:[

    'src/**/*.ts',

    '!src/server.ts',

    '!src/**/*.d.ts'

  ],
  setupFilesAfterEnv:['<rootDir>/tests/setup.ts'],

  testTimeout:300000

};