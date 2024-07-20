import type { TypedFlatConfigItem } from '../types'
import { pluginImport } from '../plugins'

export async function imports(options: {} = {}): Promise<TypedFlatConfigItem[]> {
  const {} = options

  return [
    {
      name: 'antfu/imports/rules',
      plugins: {
        'import-x': pluginImport,
      },
      rules: {
        'import-x/first': 'error',
        'import-x/no-duplicates': 'error',
        'import-x/no-empty-named-blocks': 'error',
        'import-x/no-self-import': 'error',
        'import-x/no-webpack-loader-syntax': 'error',
        'import-x/order': 'error',
      },
    }
  ]
}
