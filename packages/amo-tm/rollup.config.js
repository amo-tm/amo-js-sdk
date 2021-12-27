/* eslint-disable @typescript-eslint/no-require-imports */

import { resolve } from 'path';

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolveModule from '@rollup/plugin-node-resolve';
import rollupTypescriptPlugin from 'rollup-plugin-typescript2';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'typescript';

import pkg from './package.json';

const external = Object.keys(pkg.dependencies || {});
const plugins = [sourcemaps(), resolveModule(), json(), commonjs()];

const typescriptPlugin = rollupTypescriptPlugin({
  typescript,
});

const componentBuilds = pkg.components.map((component) => {
  const pkg = require(`./${component}/package.json`);
  return {
    input: `${component}/index.ts`,
    output: [
      {
        file: resolve(component, pkg.main),
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: resolve(component, pkg.main.replace('.cjs.js', '.mjs')),
        format: 'es',
        sourcemap: true,
      },
      {
        file: resolve(component, pkg.browser),
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [...plugins, typescriptPlugin],
    external: (id) => external.some((dep) => id === dep || id.startsWith(`${dep}/`)),
  };
});
// eslint-disable-next-line import/no-default-export
export default componentBuilds;
