'use strict';

const fs = require('fs');
const util = require('util');
const asyncHooks = require('async_hooks');

const delay = util.promisify(setTimeout);
const DELAY = 1000;
const map = new Map();

function init(asyncId, type, triggerAsyncId, resource) {
  const obj = {
    asyncId,
    type,
    triggerAsyncId,
    resource
  };
  Error.captureStackTrace(obj, init);
  map.set(asyncId, [obj.stack, triggerAsyncId]);
  fs.writeSync(1, `init\n${util.format(obj)}\n`);
}

function destroy(asyncId) {
  fs.writeSync(1, `destroy\tasyncId: ${asyncId} mapSize: ${map.size}\n`);
  showStackTrace(asyncId);
  map.delete(asyncId);
}

function showStackTrace(asyncId) {
  const array = map.get(asyncId);
  if (!array) {
    return;
  }
  const [stack, tid] = array;
  fs.writeSync(1, `stack: \tasyncId: ${asyncId} triggetAsyncId: ${tid}\n${stack.replace(/(.*)\n/, '')}\n`);
  showStackTrace(tid);
}

asyncHooks.createHook({ init, destroy }).enable();

let promise = delay(DELAY);
for (let i = 0; i < 10; i++) {
  promise = promise.then(() => delay(DELAY));
}
