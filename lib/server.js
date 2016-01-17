'use strict';

const ip = require('ip');
const build = require('dool-build');
const WebpackDevServer = require('webpack-dev-server');

module.exports = function(args) {
  const webpack = build.webpack;
  // Get config.
  const cfg = build.config({
    cwd: args.cwd
  });

  cfg.devtool = '#source-map';
  cfg.plugins = [...cfg.plugins, new webpack.HotModuleReplacementPlugin()];

  const compiler = webpack(cfg);
  args.stats = {
    colors: true,
    chunks: false,
    modules: false,
    chunkModules: false,
    children: false,
    hash: false,
    version: false
  };
  const server = new WebpackDevServer(compiler, args);

  let port = args.port || 8000;
  server.listen(port, '0.0.0.0', function() {});

  let url = (args.https ? 'https://' : 'http://') + ip.address() + ':' + port;
  console.log('Starting up dool server.');
  console.log('Server url: ' + '\x1B[36m ' + url + ' \x1B[39m');
  console.log('Hit CTRL-C to stop the server');
  console.log(['\u001b[31m',
    '  ________               ______  ',
    '  ___  __ \\______ ______ ___  / ',
    '  __  / / /_  __ \\_  __ \\__  / ',
    '  _  /_/ / / /_/ // /_/ /_  /    ',
    '  /_____/  \\____/ \\____/ /_/   ',
    '                                 ',
    '\u001b[39m'
  ].join('\n'));

  return server;
}