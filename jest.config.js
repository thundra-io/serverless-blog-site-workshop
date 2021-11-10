const config = {
    setupFilesAfterEnv: ['./__tests__/config/extensions/expect-eventually.js'],
    name: 'test-js-summit-2021-test-1',
    verbose: true,
    testRunner: 'jest-circus/runner',
    testEnvironment: '@thundra/core/dist/bootstrap/foresight/jest/JestDefaultEnvironment.js',
    testPathIgnorePatterns: [
        '__tests__/config',
        'frontend',
    ]
};

module.exports = config;
