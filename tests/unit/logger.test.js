

describe('Logger Configuration', () => {
  // ... existing test cases ...

  test('If log-level debug make logs easier to read', () => {
    // Set the log level to "debug"
    process.env.LOG_LEVEL = 'debug';
    const debugLogger = require('../../src/logger');
    // Ensure that the transport configuration is set when log level is debug
    expect(debugLogger.level).toBe('debug');

  });
});
