'use strict';

const fs = require('fs');
const util = require('util');
const asyncHooks = require('async_hooks');

const map = new Map();

function init(asyncId) {
  map.set(asyncId, 1);
  fs.writeSync(1, `init\tasyncId: ${asyncId} mapSize: ${map.size}\n`);
}

function destroy(asyncId) {
  map.delete(asyncId);
  fs.writeSync(1, `destroy\tasyncId: ${asyncId} mapSize: ${map.size}\n`);
}

asyncHooks.createHook({ init, destroy }).enable();

const queue = [];
(function start() {
  new Promise(resolve => queue.push(resolve));
  setTimeout(start, 100);
})();
