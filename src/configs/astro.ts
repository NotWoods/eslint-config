import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'
import { GLOB_ASTRO } from '../globs'
import { interopDefault } from '../utils'

export async function astro(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_ASTRO],
    overrides = {},
  } = options

  const [
    pluginAstro,
    parserAstro,
    typescriptPlugin,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-astro')),
    interopDefault(import('astro-eslint-parser')),
    (import('typescript-eslint')),
  ] as const)

  return [
    {
      name: 'antfu/astro/setup',
      plugins: {
        astro: pluginAstro,
      },
    },
    {
      files,
      languageOptions: {
        globals: pluginAstro.environments.astro.globals,
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: ['.astro'],
          parser: typescriptPlugin.parser,
        },
        sourceType: 'module',
      },
      name: 'antfu/astro/rules',
      processor: 'astro/client-side-ts',
      rules: {
        // use recommended rules
        'astro/missing-client-only-directive-value': 'error',
        'astro/no-conflict-set-directives': 'error',
        'astro/no-deprecated-astro-canonicalurl': 'error',
        'astro/no-deprecated-astro-fetchcontent': 'error',
        'astro/no-deprecated-astro-resolve': 'error',
        'astro/no-deprecated-getentrybyslug': 'error',
        'astro/no-set-html-directive': 'off',
        'astro/no-unused-define-vars-in-style': 'error',
        'astro/semi': 'off',
        'astro/valid-compile': 'error',

        ...overrides,
      },
    },
  ]
}
