'use strict';

const fs = require('fs');
const util = require('util');
const http = require('http');
const asyncHooks = require('async_hooks');

const delay = util.promisify(setTimeout);
const map = new Map();
const DELAY = 1;

process
  .on('uncaughtException', err => {
    console.log('uncaughtException', err);
  })
  .on('unhandledRejection', err => {
    console.log('unhandledRejection', err);
  });

const hooks = {};
const createLog = name => hooks[name] = (...args) => fs.writeSync(1, `${util.format(name, ...args)}\n`);
['init', 'before', 'after', 'destroy', 'promiseResolve'].forEach(createLog);

asyncHooks.createHook(hooks).enable();

http.createServer((req, res) => res.end()).listen(3000);
