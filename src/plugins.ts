// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck

import pluginCommentsConfigs from '@eslint-community/eslint-plugin-eslint-comments/configs'
export const pluginComments = {
  configs: pluginCommentsConfigs,
}

export * as pluginImport from 'eslint-plugin-import-x'
export { default as pluginNode } from 'eslint-plugin-n'
export { default as pluginUnicorn } from 'eslint-plugin-unicorn'
