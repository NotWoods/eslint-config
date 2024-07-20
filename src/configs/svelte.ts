import { ensurePackages, interopDefault } from '../utils'
import type { OptionsFiles, OptionsHasTypeScript, OptionsOverrides, TypedFlatConfigItem } from '../types'
import { GLOB_SVELTE } from '../globs'

export async function svelte(
  options: OptionsHasTypeScript & OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SVELTE],
    overrides = {},
  } = options

  await ensurePackages([
    'eslint-plugin-svelte',
  ])

  const [
    pluginSvelte,
    parserSvelte,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-svelte')),
    interopDefault(import('svelte-eslint-parser')),
  ])

  return [
    ...pluginSvelte.configs['flat/recommended'],
    {
      files,
      languageOptions: {
        parser: parserSvelte,
        parserOptions: {
          extraFileExtensions: ['.svelte'],
          parser: options.typescript
            ? (await interopDefault(import('typescript-eslint'))).parser
            : null,
        },
      },
      name: 'notwoods/svelte/rules',
      processor: pluginSvelte.processors['.svelte'],
      rules: {
        ...overrides,
      },
    },
  ]
}
