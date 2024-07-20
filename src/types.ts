import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type * as pluginTypescript from 'typescript-eslint'
import type { ParserOptions } from '@typescript-eslint/parser'
import type { ConfigNames, RuleOptions } from './typegen'

export type Awaitable<T> = T | Promise<T>

export type Rules = RuleOptions

export type { ConfigNames }

export type TypedFlatConfigItem = typeof pluginTypescript.configs.base

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[]
}

export type OptionsTypescript =
  (OptionsTypeScriptWithTypes & OptionsOverrides)
  | (OptionsTypeScriptParserOptions & OptionsOverrides)

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[]
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[]

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[]
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string
}

export interface OptionsHasTypeScript {
  typescript?: boolean
}

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules']
}

export interface OptionsIsInEditor {
  isInEditor?: boolean
}

export interface OptionsConfig extends OptionsComponentExts {
  /**
   * Enable gitignore support.
   *
   * Passing an object to configure the options.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   * @default true
   */
  gitignore?: boolean | FlatGitignoreOptions

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript

  /**
   * Enable JSX related rules.
   *
   * Currently only stylistic rules are included.
   *
   * @default true
   */
  jsx?: boolean

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean | OptionsOverrides

  /**
   * Enable ASTRO support.
   *
   * Requires installing:
   * - `eslint-plugin-astro`
   *
   * Requires installing for formatting .astro:
   * - `prettier-plugin-astro`
   *
   * @default false
   */
  astro?: boolean | OptionsOverrides

  /**
   * Enable regexp rules.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-regexp/
   * @default true
   */
  regexp?: boolean | (OptionsOverrides)

  /**
   * Enable react rules.
   *
   * Requires installing:
   * - `@eslint-react/eslint-plugin`
   * - `eslint-plugin-react-hooks`
   *
   * @default false
   */
  react?: boolean | OptionsOverrides

  /**
   * Enable svelte rules.
   *
   * Requires installing:
   * - `eslint-plugin-svelte`
   *
   * @default false
   */
  svelte?: boolean

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  isInEditor?: boolean

  /**
   * Provide overrides for rules for each integration.
   *
   * @deprecated use `overrides` option in each integration key instead
   */
  overrides?: {
    javascript?: TypedFlatConfigItem['rules']
    typescript?: TypedFlatConfigItem['rules']
    test?: TypedFlatConfigItem['rules']
    react?: TypedFlatConfigItem['rules']
    svelte?: TypedFlatConfigItem['rules']
  }
}
