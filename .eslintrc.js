module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['react-hooks'],
  rules: {
    'no-unused-vars': [
      'error',
      { args: 'after-used', argsIgnorePattern: '^_' },
    ],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/destructuring-assignment': ['off'],
    // TODO re-enable after https://github.com/yannickcr/eslint-plugin-react/issues/1809
    'react/sort-comp': ['off'],
    'no-console': ['error', { allow: ['error'] }],
    'arrow-body-style': ['off'],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to', 'route'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
  },
}
