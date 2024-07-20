import { ensurePackages, interopDefault, toArray } from '../utils'
import type { OptionsFiles, OptionsOverrides, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '../types'
import { GLOB_SRC } from '../globs'

export async function react(
  options: OptionsTypeScriptWithTypes & OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    overrides = {},
  } = options

  await ensurePackages([
    '@eslint-react/eslint-plugin',
    'eslint-plugin-react-hooks',
  ])

  const tsconfigPath = options?.tsconfigPath
    ? toArray(options.tsconfigPath)
    : undefined
  const isTypeAware = !!tsconfigPath

  const [
    pluginReact,
    pluginReactHooks,
    pluginTypescript,
  ] = await Promise.all([
    interopDefault(import('@eslint-react/eslint-plugin')),
    interopDefault(import('eslint-plugin-react-hooks')),
    (import('typescript-eslint')),
  ])

  return [
    isTypeAware ? pluginReact.configs['recommended-type-checked'] : pluginReact.configs.recommended,
    {
      name: 'notwoods/react/react-hooks',
      ...pluginReactHooks.configs.recommended,
      plugins: {
        'react-hooks': pluginReactHooks,
      },
    },
    {
      files,
      languageOptions: {
        parser: pluginTypescript.parser,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ...isTypeAware ? { project: tsconfigPath } : {},
        },
        sourceType: 'module',
      },
      name: 'notwoods/react/rules',
      rules: {
        // overrides
        ...overrides,
      },
    },
  ]
}
