module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    jest: true,
    node: true,
  },
  extends: [
    'airbnb-base', 
    'plugin:prettier/recommended',
  ],
  plugins: [
    'prettier',
  ],
  rules: {
    'arrow-parens': ['error', 'always'],
    'no-param-reassign': 0,
    'no-console': 0,
    'max-len': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,

    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'always',
      },
    ],
  },
};