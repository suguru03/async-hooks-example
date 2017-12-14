'use strict';

const fs = require('fs');
const util = require('util');
const asyncHooks = require('async_hooks');

const hooks = {
  // Resourceが生成されるときに呼ばれる
  init(asyncId, type, triggerAsyncId, resource) {
    const obj = {
      asyncId,
      type,
      triggerAsyncId,
      resource
    };
    fs.writeSync(1, `init\n${util.format(obj)}\n`);
  },
  // Resourceのcallbackが呼ばれる直前に呼ばれる
  before(asyncId) {
    fs.writeSync(1, `before\t${util.format({ asyncId })}\n`);
  },
  // Resourceのcallbackが終了したときに呼ばれる
  after(asyncId) {
    fs.writeSync(1, `after\t${util.format({ asyncId })}\n`);
  },
  // Resourceが破棄されるときに呼ばれる
  destroy(asyncId) {
    fs.writeSync(1, `destroy\t${util.format({ asyncId })}\n`);
  },
  // Promiseのresolveが呼ばれるタイミングで呼ばれる
  promiseResolve(asyncId) {
    fs.writeSync(1, `promiseResolve\t${util.format({ asyncId })}\n`);
  }
};

// Hookの生成
const asyncHook = asyncHooks.createHook(hooks);

// Hookを有効にする
asyncHook.enable();

// 1秒おきにResourceの生成
(function start() {
  // 実行中のasyncId
  const eid = asyncHooks.executionAsyncId();
  // 呼び出し元のasyncId
  const tid = asyncHooks.triggerAsyncId();
  console.log(`start\teid: ${eid} tid: ${tid}`);
  setTimeout(start, 1000);
})();

// 10秒後にhookを無効にする
setTimeout(() => asyncHook.disable(), 10000);
