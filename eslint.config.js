const reactNativeConfig = require('@react-native/eslint-config/flat');

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      'lib/**',
      '*.config.js',
    ],
  },
  ...reactNativeConfig,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
];
