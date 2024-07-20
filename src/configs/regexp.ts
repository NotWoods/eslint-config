import * as regexpPlugin from "eslint-plugin-regexp"
import type { TypedFlatConfigItem } from '../types'

export async function regexp(
  options: {} = {},
): Promise<TypedFlatConfigItem[]> {
  return [
    regexpPlugin.configs['flat/recommended'],
  ]
}
