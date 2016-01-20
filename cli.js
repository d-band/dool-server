#!/usr/bin/env node
'use strict';

var program = require('commander');

program
  .version(require('./package').version, '-v, --version')
  .option('-p, --port <port>', 'port')
  .option('--https', 'https')
  .parse(process.argv);

program.cwd = process.cwd();
require('./lib/server')(program);
