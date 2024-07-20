import eslint from '@eslint/js'
import globals from 'globals'
import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

export async function javascript(
  options: OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  return [
    eslint.configs.recommended,
    {
      languageOptions: {
        ecmaVersion: 2022,
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          document: 'readonly',
          navigator: 'readonly',
          window: 'readonly',
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ecmaVersion: 2022,
          sourceType: 'module',
        },
        sourceType: 'module',
      },
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
      name: 'antfu/javascript/setup',
    },
    {
      name: 'antfu/javascript/rules',
      rules: {
        'dot-notation': ['error', { allowKeywords: true }],
        'no-use-before-define': ['error', { classes: false, functions: false, variables: true }],

        'accessor-pairs': ['error', { enforceForClassMembers: true, setWithoutGet: true }],
        'array-callback-return': 'error',
        'eqeqeq': ['error', 'allow-null'],
        'no-alert': 'error',
        'no-async-promise-executor': 'error',
        'no-caller': 'error',
        'no-compare-neg-zero': 'error',
        'no-cond-assign': ['error', 'always'],
        'no-control-regex': 'error',
        'no-empty-character-class': 'error',
        'no-eval': 'error',
        'no-ex-assign': 'error',
        'no-extra-bind': 'error',
        'no-implied-eval': 'error',
        'no-invalid-regexp': 'error',
        'no-iterator': 'error',
        'no-new-native-nonconstructor': 'error',
        'no-new-wrappers': 'error',
        'no-octal-escape': 'error',
        'no-proto': 'error',
        'no-restricted-globals': [
          'error',
          { message: 'Use `globalThis` instead.', name: 'global' },
        ],
        'no-restricted-properties': [
          'error',
          { message: 'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.', property: '__proto__' },
          { message: 'Use `Object.defineProperty` instead.', property: '__defineGetter__' },
          { message: 'Use `Object.defineProperty` instead.', property: '__defineSetter__' },
          { message: 'Use `Object.getOwnPropertyDescriptor` instead.', property: '__lookupGetter__' },
          { message: 'Use `Object.getOwnPropertyDescriptor` instead.', property: '__lookupSetter__' },
        ],
        'no-self-compare': 'error',
        'no-template-curly-in-string': 'error',
        'no-throw-literal': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unneeded-ternary': ['error', { defaultAssignment: false }],
        'no-unused-expressions': ['error', {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true,
        }],
        'no-useless-return': 'error',
        'prefer-arrow-callback': [
          'error',
          {
            allowNamedFunctions: true,
            allowUnboundThis: true,
          },
        ],
        'prefer-promise-reject-errors': 'error',
        'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'sort-imports': [
          'error',
          {
            allowSeparatedGroups: false,
            ignoreCase: false,
            ignoreDeclarationSort: true,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          },
        ],

        'symbol-description': 'error',
        'valid-typeof': ['error', { requireStringLiterals: true }],

        ...overrides,
      },
    },
  ]
}
