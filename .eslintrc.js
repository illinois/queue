module.exports = {
  // parser: 'babel-eslint',
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  plugins: ['@typescript-eslint', 'react-hooks'],
  rules: {
    /**
     * JavaScript
     */
    'no-unused-vars': [
      'error',
      { args: 'after-used', argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.jsx', '.tsx'] },
    ],
    'react/destructuring-assignment': 'off',
    // TODO re-enable after https://github.com/yannickcr/eslint-plugin-react/issues/1809
    'react/sort-comp': 'off',
    'no-console': ['error', { allow: ['error'] }],
    'arrow-body-style': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to', 'route'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'import/prefer-default-export': 'off',
    /**
     * TypeScript
     */
    '@typescript-eslint/no-unused-vars': [
      'error',
      { args: 'after-used', argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    // Reenable this once we have more complete and comprehensive types
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
