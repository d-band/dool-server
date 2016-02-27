#!/usr/bin/env node
'use strict';

var program = require('commander');

program
  .version(require('./package').version, '-v, --version')
  .option('-p, --port <port>', 'port')
  .option('--https', 'https')
  .parse(process.argv);

program.cwd = process.cwd();

// Fix https://github.com/postcss/postcss#nodejs-010-and-the-promise-api
require('es6-promise').polyfill();

require('./lib/server')(program);
