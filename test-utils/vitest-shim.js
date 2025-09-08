// Minimal shim so tests importing from 'vitest' can run under Jest
const jestGlobals = require('@jest/globals')
module.exports = {
  beforeEach: jestGlobals.beforeEach,
  afterEach: jestGlobals.afterEach,
  beforeAll: jestGlobals.beforeAll,
  afterAll: jestGlobals.afterAll,
  describe: jestGlobals.describe,
  it: jestGlobals.it,
  test: jestGlobals.test,
  expect: jestGlobals.expect
}


