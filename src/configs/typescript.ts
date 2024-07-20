import process from 'node:process'
import tsEslint from 'typescript-eslint'
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from '../globs'
import type { OptionsComponentExts, OptionsFiles, OptionsOverrides, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '../types'

export async function typescript(
  options: OptionsFiles & OptionsComponentExts & OptionsOverrides & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    componentExts = [],
    overrides = {},
    parserOptions = {},
  } = options

  const files = options.files ?? [
    GLOB_TS,
    GLOB_TSX,
    ...componentExts.map(ext => `**/*.${ext}`),
  ]

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX]
  const ignoresTypeAware = options.ignoresTypeAware ?? [
    `${GLOB_MARKDOWN}/**`,
    GLOB_ASTRO_TS,
  ]
  const tsconfigPath = options?.tsconfigPath
    ? options.tsconfigPath
    : undefined
  const isTypeAware = !!tsconfigPath

  const typeAwareRules: TypedFlatConfigItem['rules'] = tsEslint.configs.strictTypeCheckedOnly.at(-1)?.rules

  return [
    tsEslint.configs.base,
    tsEslint.configs.eslintRecommended,
    // assign type-aware parser for type-aware files and type-unaware parser for the rest
    {
      files,
      languageOptions: {
        parser: tsEslint.parser,
        parserOptions: {
          extraFileExtensions: componentExts.map(ext => `.${ext}`),
          sourceType: 'module',
          ...isTypeAware
            ? {
                projectService: {
                  allowDefaultProject: ['./*.js'],
                  defaultProject: tsconfigPath,
                },
                tsconfigRootDir: process.cwd(),
              }
            : {},
          ...parserOptions as any,
        },
      },
      name: `notwoods/typescript/${isTypeAware ? 'type-aware-parser' : 'parser'}`,
    },
    {
      files,
      name: 'notwoods/typescript/rules',
      rules: {
        ...tsEslint.configs.strict.at(-1)?.rules,

        'dot-notation': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/dot-notation': ['error', { allowKeywords: true }],
        '@typescript-eslint/no-use-before-define': ['error', { classes: false, functions: false, variables: true }],

        '@typescript-eslint/ban-ts-comment': ['error', {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': false,
          'ts-check': false,
        }],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false, prefer: 'type-imports' }],
        '@typescript-eslint/method-signature-style': ['error', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        '@typescript-eslint/no-dupe-class-members': 'error',
        '@typescript-eslint/no-dynamic-delete': 'off',
        '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/no-invalid-void-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-redeclare': 'error',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-wrapper-object-types': 'error',
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/triple-slash-reference': 'off',
        '@typescript-eslint/unified-signatures': 'off',
        ...overrides,
      },
    },
    ...isTypeAware
      ? [{
          files: filesTypeAware,
          ignores: ignoresTypeAware,
          name: 'notwoods/typescript/rules-type-aware',
          rules: typeAwareRules,
        }]
      : [],
    {
      files: ['**/*.d.?([cm])ts'],
      name: 'notwoods/typescript/disables/dts',
      rules: {
        '@eslint-community/eslint-comments/no-unlimited-disable': 'off',
        'import-x/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
      },
    },
    {
      files: ['**/*.{test,spec}.ts?(x)'],
      name: 'notwoods/typescript/disables/test',
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      name: 'notwoods/typescript/disables/cjs',
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ]
}
