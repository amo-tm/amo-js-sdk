module.exports = {
  extends: '../../config/.eslintrc.js',
  parserOptions: {
    // to make vscode-eslint work with monorepo
    // https://github.com/typescript-eslint/typescript-eslint/issues/251#issuecomment-463943250
    tsconfigRootDir: __dirname,

    project: 'tsconfig.json',
  },
};
