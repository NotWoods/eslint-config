import type { TypedFlatConfigItem } from '../types'
import { pluginNode } from '../plugins'

export async function node(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'antfu/node/rules',
      plugins: {
        n: pluginNode,
      },
      rules: {
        'n/no-deprecated-api': 'error',
        'n/no-exports-assign': 'error',
        'n/no-new-require': 'error',
        'n/no-path-concat': 'error',
        'n/prefer-global/buffer': ['error', 'never'],
        'n/prefer-global/console': ['error', 'always'],
        'n/prefer-global/process': ['error', 'never'],
        'n/prefer-global/text-decoder': ['error', 'always'],
        'n/prefer-global/text-encoder': ['error', 'always'],
        'n/prefer-global/url': ['error', 'always'],
        'n/prefer-global/url-search-params': ['error', 'always'],
        'n/prefer-promises/dns': 'error',
        'n/prefer-promises/fs': 'error',
        'n/process-exit-as-throw': 'error',
      },
    },
  ]
}
