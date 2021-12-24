/* eslint-disable import/no-extraneous-dependencies */
import json from '@rollup/plugin-json';
import typescript from 'typescript';
import replace from 'rollup-plugin-replace';
import typescriptPlugin from 'rollup-plugin-typescript2';

import { generateBuildTargetReplaceConfig } from '../../scripts/rollup_replace_build_target';

import pkg from './package.json';

const deps = Object.keys(Object.assign({}, pkg.peerDependencies, pkg.dependencies));

const es5BuildPlugins = [
  typescriptPlugin({
    typescript,
  }),
  json(),
];

const es2017BuildPlugins = [
  typescriptPlugin({
    typescript,
    tsconfigOverride: {
      compilerOptions: {
        target: 'es2017',
      },
    },
  }),
  json({ preferConst: true }),
];

const esmBuilds = [
  {
    input: 'src/index.ts',
    output: { file: pkg.esm5, format: 'es', sourcemap: true },
    plugins: [
      ...es5BuildPlugins,
      replace(generateBuildTargetReplaceConfig({ moduleFormat: 'esm', languageTarget: 5 })),
    ],
    external: (id) => deps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.browser,
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      ...es2017BuildPlugins,
      replace(generateBuildTargetReplaceConfig({ moduleFormat: 'esm', languageTarget: 2017 })),
    ],
    external: (id) => deps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
  },
];

const cjsBuilds = [
  {
    input: 'src/index.ts',
    output: [{ file: pkg.main, format: 'cjs', sourcemap: true }],
    plugins: [
      ...es5BuildPlugins,
      replace(generateBuildTargetReplaceConfig({ moduleFormat: 'cjs', languageTarget: 5 })),
    ],
    external: (id) => deps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
  },
];

// eslint-disable-next-line import/no-default-export
export default [...esmBuilds, ...cjsBuilds];
