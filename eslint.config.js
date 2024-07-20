// @ts-check
import notwoods from './dist/index.js'

export default notwoods(
  {
    react: true,
    svelte: true,
    astro: true,
    typescript: true,
  },
  {
    ignores: [
      'fixtures',
      '_fixtures',
    ],
  },
)
