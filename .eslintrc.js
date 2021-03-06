module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'ember',
    'html',
    'json',
    'node'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true,
    node: true
  },
  rules: {
      'ember/closure-actions': 0,

      /*** Possible Errors ***/

      'no-template-curly-in-string': 2,
      'no-unsafe-negation': 2,

      /*** Best Practices ***/

      'curly': 2,
      'eqeqeq': 2,
      'guard-for-in': 0,
      'no-caller': 2,
      'no-eq-null': 2,
      'no-eval': 2,
      'no-multi-spaces': [2, {
        'exceptions': {
          'ObjectExpression': true,
          'Property': true
        }
      }],
      'no-unused-expressions': [2, {
        allowShortCircuit: true,
        allowTernary: true
      }],
      'wrap-iife': 0,
      'yoda': 2,

      /*** Variables ***/

      'no-unused-vars': 2,
      'no-use-before-define': [2, 'nofunc'],

      /*** Stylistic Issues ***/

      'array-bracket-spacing': 2,
      'block-spacing': 2,
      'brace-style': [2, '1tbs', {
        'allowSingleLine': true
      }],
      'camelcase': 2,
      'comma-spacing': 2,
      'comma-style': 2,
      'eol-last': 2,
      'func-call-spacing': 2,
      'indent': [2, 2, {
        'SwitchCase': 1,
        'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 }
      }],
      'key-spacing': 2,
      'keyword-spacing': 2,
      'linebreak-style': [2, 'unix'],
      'new-parens': 2,
      'no-array-constructor': 2,
      'no-bitwise': 2,
      'no-lonely-if': 2,
      'no-mixed-operators': 2,
      'no-plusplus': 0,
      'no-trailing-spaces': 2,
      'no-unneeded-ternary': 2,
      'no-whitespace-before-property': 2,
      'object-curly-spacing': [2, 'always'],
      'semi-spacing': 2,
      'space-before-blocks': 2,
      'space-before-function-paren': [2, 'never'],
      'space-in-parens': 2,
      'space-infix-ops': 2,
      'space-unary-ops': 2,
      'quotes': [2, 'single', {
        'allowTemplateLiterals': true
      }],
      'wrap-regex': 2,

      /*** ECMAScript 6 ***/

      'arrow-parens': [2, 'as-needed'],
      'arrow-spacing': 2,
      'generator-star-spacing': 2,
      'no-confusing-arrow': [2, {
        'allowParens': true
      }],
      'no-useless-computed-key': 2,
      'rest-spread-spacing': 2,
      'symbol-description': 2,
      'template-curly-spacing': 2,
      'yield-star-spacing': 2
    }
};
