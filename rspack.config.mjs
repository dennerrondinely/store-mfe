import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';
import rspack from '@rspack/core';
import fs from 'fs';

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// delete pkg.dependencies['firebase'];

export default env => {
  const {
    mode = 'development',
    context = Repack.getDirname(import.meta.url),
    platform = process.env.PLATFORM,
    devServer = undefined,
  } = env;

  if (!platform) {
    throw new Error('Missing platform');
  }

  process.env.BABEL_ENV = mode;

  return {
    context: __dirname,
    entry: './index.js',
    resolve: {
      ...Repack.getResolveOptions(),
    },
    module: {
      rules: [
        ...Repack.getJsTransformRules(),
        ...Repack.getAssetTransformRules(),
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!react-native)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['module:@react-native/babel-preset'],
            },
          },
        },
      ],
    },
    plugins: [
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'Store',
        filename: 'Store.container.bundle',
        dts: false,
        exposes: {
          './Store': './src/index.ts',
        },
        shared: Object.fromEntries(
          Object.entries(pkg.dependencies).map(([dep, { version }]) => {
            return [
              dep,
              { singleton: true, eager: true, requiredVersion: version },
            ];
          }),
        ),
      }),
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
      }),
      new rspack.IgnorePlugin({
        resourceRegExp: /^firebase\/app/,
      }),
      new rspack.IgnorePlugin({
        resourceRegExp: /^firebase\/firestore/,
      }),
      new rspack.IgnorePlugin({
        resourceRegExp: /^Store\/Store/,
      }),
      new rspack.IgnorePlugin({
        resourceRegExp: /^@react-native-vector-icons\/.*/,
      }),
      new rspack.IgnorePlugin({
        resourceRegExp: /^react-native-paper/,
      }),
      new rspack.IgnorePlugin({
        resourceRegExp: /^@env/,
      }),
    ],
  };
};
