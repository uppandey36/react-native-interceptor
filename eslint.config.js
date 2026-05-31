const reactNativeConfig = require('@react-native/eslint-config/flat');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      'lib/**',
      '*.config.js',
    ],
  },
  ...reactNativeConfig,
  prettierRecommended,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': [
        'error',
        {
          quoteProps: 'consistent',
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5',
          useTabs: false,
        },
      ],
    },
  },
];
