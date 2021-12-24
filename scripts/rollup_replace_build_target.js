const BUILD_TARGET_MAGIC_STRING = '__BUILD_TARGET__';

/**
 *
 * @param {'esm'|'cjs'} options.moduleFormat valid values are esm and cjs
 * @param {number} options.languageTarget valid values are 5, 2015, 2016 ... 2020
 */
export function generateBuildTargetReplaceConfig({ moduleFormat, languageTarget }) {
  if (typeof languageTarget !== 'number') {
    throw Error(`LanguageTarget accepts only number.`);
  }

  // simplified input validation
  if (languageTarget != 5 && languageTarget < 2015) {
    throw Error(`Invalid languageTarget ${languageTarget}. Valid values are 5, 2015, 2016, etc.`);
  }

  let buildTarget = '';

  switch (moduleFormat.toLowerCase()) {
    case 'esm':
      buildTarget = 'esm';
      break;
    case 'cjs':
      buildTarget = 'cjs';
      break;
    default:
      throw Error(`Unsupported module format ${moduleFormat}. Valid values are esm and cjs.`);
  }

  buildTarget += languageTarget;

  return {
    [BUILD_TARGET_MAGIC_STRING]: buildTarget,
  };
}
