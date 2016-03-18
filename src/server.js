'use strict';

import { address } from 'ip';
import build from 'dool-build';
import WebpackDevServer from 'webpack-dev-server';

export default function(args) {
  const webpack = build.webpack;
  // Get config.
  let cfg = build.config({
    cwd: args.cwd
  });

  cfg = Array.isArray(cfg) ? cfg : [cfg];

  let devServer = {};
  cfg.forEach((v) => {
    v.devtool = '#source-map';
    v.plugins.push(new webpack.HotModuleReplacementPlugin());
    Object.assign(devServer, v.devServer);
  });

  const compiler = webpack(cfg);

  // Hack: remove extract-text-webpack-plugin log
  compiler.plugin('done', function(stats) {
    stats.stats.forEach((stat) => {
      stat.compilation.children = stat.compilation.children.filter((child) => {
        return child.name !== 'extract-text-webpack-plugin';
      });
    });
  });

  const opts = {
    https: !!args.https,
    stats: {
      colors: true,
      children: true,
      chunks: false,
      modules: false,
      chunkModules: false,
      hash: false,
      version: false
    }
  };

  // webpack config passed to webpack-dev-server
  Object.assign(opts, devServer);

  let port = args.port || 8000;
  let server = new WebpackDevServer(compiler, opts);
  server.listen(port, '0.0.0.0', function() {});

  let url = (args.https ? 'https://' : 'http://') + address() + ':' + port;
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