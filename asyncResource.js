'use strict';

const fs = require('fs');
const util = require('util');
const { AsyncResource, createHook } = require('async_hooks');

const hooks = {};
const createLog = name => hooks[name] = (...args) => fs.writeSync(1, `${util.format(name, ...args)}\n`);
['init', 'before', 'after', 'destroy', 'promiseResolve'].forEach(createLog);

createHook(hooks).enable();

// 自動的にinitが呼ばれる
const asyncResource = new AsyncResource('Async');

// Callbackを呼ぶ直前に呼ぶ
asyncResource.emitBefore();

// Callbackが終了した直後に呼ぶ
asyncResource.emitAfter();

// AsyncResourceが破棄される時に呼ぶ
asyncResource.emitDestroy();

// AsyncResourceのインスタンスに割り当てられたasyncIdを返す
asyncResource.asyncId();

// 呼び出し元のasyncIdを返す
asyncResource.triggerAsyncId();
