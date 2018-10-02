module.exports = {
  root: true,
  env: {
    browser: true,
    jest: true
  },
  extends: ['@isaac.frontend/eslint-config-es6', 'plugin:vue/essential'],
  rules: {
    semi: [2, 'always'],
    'comma-dangle': [2, 'never'],
    'max-len': [2, { ignoreComments: true, code: 160 }],
    'import/no-extraneous-dependencies': [2, { packageDir: './' }],
    'class-methods-use-this': [0],
    'linebreak-style': [0, 'unix'],
    'no-param-reassign': [0, { props: false }],
    indent: ['error', 2],
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        mjs: 'never'
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: ['html', 'vue'],
  settings: {
    'import/resolver': 'webpack'
  }
};
