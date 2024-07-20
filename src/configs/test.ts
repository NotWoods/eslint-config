import { interopDefault } from '../utils'
import type { OptionsFiles, OptionsHasTypeScript, OptionsIsInEditor, OptionsOverrides, TypedFlatConfigItem } from '../types'
import { GLOB_TESTS } from '../globs'

export async function test(
  options:OptionsHasTypeScript &  OptionsFiles & OptionsIsInEditor & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = GLOB_TESTS,
    isInEditor = false,
    overrides = {},
  } = options

  const [
    pluginVitest
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-vitest')),
  ])

  return [
    pluginVitest.configs.env,
    pluginVitest.configs.recommended,
    {
      files,
      name: 'notwoods/test/rules',
      rules: {
        'vitest/no-focused-tests': isInEditor ? 'off' : 'error',
        'vitest/prefer-hooks-in-order': 'error',

        ...overrides,
      },
      settings: {
        vitest: {
          typecheck: options.typescript
        }
      },
    },
  ]
}
