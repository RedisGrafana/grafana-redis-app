import grafanaConfig from './.config/eslint.config.mjs';

export default [
  {
    ignores: ['dist/**', '.config/**', 'coverage/**'],
  },
  ...grafanaConfig,
];
