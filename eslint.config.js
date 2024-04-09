import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default [
  js.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic
    },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2020,
      globals: {
        es6: true,
        node: true,
        browser: false
      }
    },
    rules: {
      quotes: [2, 'single'],
      indent: [2, 2, {SwitchCase: 1}],
      semi: [2, 'always'],
      camelcase: [2, {properties: 'always'}],
      '@stylistic/linebreak-style': [2, 'unix'],
      '@stylistic/brace-style': [2, '1tbs', {allowSingleLine: true}],
    }
  }
]
