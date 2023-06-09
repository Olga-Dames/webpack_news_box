module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['airbnb'],
  rules: {
    'linebreak-style': ['error', 'windows'],
    'implicit-arrow-linebreak': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  env: {
    browser: true,
    node: true,
  },
};
