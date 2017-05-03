'use strict';

import { address } from 'ip';
import build from 'dool-build';
import WebpackDevServer from 'webpack-dev-server';

export default function(args) {
  const webpack = build.webpack;
  // Get config.
  let cfgs = build.config({
    cwd: args.cwd
  });

  let devServer = { disableHostCheck: true };
  cfgs.forEach((v) => {
    v.devtool = 'eval';
    v.plugins.push(new webpack.HotModuleReplacementPlugin());
    Object.assign(devServer, v.devServer);
  });

  const compiler = webpack(cfgs);

  // Hack: remove extract-text-webpack-plugin log
  args.verbose || compiler.plugin('done', function(stats) {
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
      chunks: !!args.verbose,
      modules: !!args.verbose,
      chunkModules: !!args.verbose,
      hash: !!args.verbose,
      version: !!args.verbose
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