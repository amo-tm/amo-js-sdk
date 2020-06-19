import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';

import pkg from './package.json';

const PLUGINS = [
  babel({
    extensions: ['.js'],
  }),
  replace({
    _VERSION: JSON.stringify(pkg.version),
  }),
];

export default [
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, name: 'AmoSDK', format: 'cjs' },
      { file: pkg.module, name: 'AmoSDK', format: 'es' },
    ],
    plugins: PLUGINS,
  },
];
