import type { TypedFlatConfigItem } from '../types'
import { pluginComments } from '../plugins'

export async function comments(): Promise<TypedFlatConfigItem[]> {
  return [
    pluginComments.configs.recommended,
    {
      name: 'notwoods/eslint-comments/rules',
      rules: {
        "@eslint-community/eslint-comments/disable-enable-pair": ["error", {"allowWholeFile": true}],
      },
    },
  ]
}
