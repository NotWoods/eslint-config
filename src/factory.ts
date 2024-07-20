import process from 'node:process'
import fs from 'node:fs'
import { isPackageExists } from 'local-pkg'
import { FlatConfigComposer } from 'eslint-flat-config-utils'
import type { Linter } from 'eslint'
import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from './types'
import {
  astro,
  comments,
  ignores,
  imports,
  javascript,
  jsx,
  node,
  react,
  svelte,
  test,
  typescript,
  unicorn,
} from './configs'
import { interopDefault } from './utils'
import { regexp } from './configs/regexp'

const flatConfigProps: (keyof TypedFlatConfigItem)[] = [
  'name',
  'files',
  'ignores',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings',
]

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function notwoods(
  options: OptionsConfig & TypedFlatConfigItem = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.FlatConfig[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    astro: enableAstro = false,
    componentExts = [],
    gitignore: enableGitignore = true,
    isInEditor = !!((process.env.VSCODE_PID || process.env.VSCODE_CWD || process.env.JETBRAINS_IDE || process.env.VIM || process.env.NVIM) && !process.env.CI),
    jsx: enableJsx = true,
    react: enableReact = false,
    regexp: enableRegexp = true,
    svelte: enableSvelte = false,
    typescript: enableTypeScript = isPackageExists('typescript'),
  } = options

  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r(enableGitignore)]))
    }
    else {
      if (fs.existsSync('.gitignore'))
        configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r()]))
    }
  }

  const typescriptOptions = resolveSubOptions(options, 'typescript')
  const tsconfigPath = 'tsconfigPath' in typescriptOptions ? typescriptOptions.tsconfigPath : undefined

  // Base configs
  configs.push(
    ignores(),
    javascript({
      overrides: getOverrides(options, 'javascript'),
    }),
    comments(),
    node(),
    imports(),
    unicorn(),
  )

  if (enableJsx) {
    configs.push(jsx())
  }

  if (enableTypeScript) {
    configs.push(typescript({
      ...typescriptOptions,
      componentExts,
      overrides: getOverrides(options, 'typescript'),
    }))
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp))
  }

  if (options.test ?? true) {
    configs.push(test({
      isInEditor,
      overrides: getOverrides(options, 'test'),
    }))
  }

  if (enableReact) {
    configs.push(react({
      overrides: getOverrides(options, 'react'),
      tsconfigPath,
    }))
  }

  if (enableSvelte) {
    configs.push(svelte({
      overrides: getOverrides(options, 'svelte'),
      typescript: !!enableTypeScript,
    }))
  }

  if (enableAstro) {
    configs.push(astro({
      overrides: getOverrides(options, 'astro'),
    }))
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options)
      acc[key] = options[key] as any
    return acc
  }, {} as TypedFlatConfigItem)
  if (Object.keys(fusedConfig).length)
    configs.push([fusedConfig])

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

  composer = composer
    .append(
      ...configs,
      ...userConfigs as any,
    )

  return composer
}

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean'
    ? {} as any
    : options[key] || {}
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
) {
  const sub = resolveSubOptions(options, key)
  return {
    ...(options.overrides as any)?.[key],
    ...'overrides' in sub
      ? sub.overrides
      : {},
  }
}
