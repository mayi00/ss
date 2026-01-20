import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

/**
 * 创建 Vite 插件配置数组
 * @returns {Array} 返回包含各种 Vite 插件的配置
 */
export function createVitePlugins(env) {
  const plugins = [
    // 配置自动导入插件，用于自动导入常用的 Vue 相关库和组件
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      eslintrc: {
        enabled: true,
        filepath: './vite/.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
      dts: false,
      resolvers: [
        // 自动导入 Element Plus
        ElementPlusResolver(),
      ],
      // 是否在 vue 模板中自动导入
      vueTemplate: true,
    }),
    // 配置组件自动导入插件，用于自动导入指定目录下的组件
    Components({
      // 默认导入组件文件夹，组件会自动引入
      dirs: ['src/components'],
      resolvers: [
        // ElementPlus 组件自动按需引入
        ElementPlusResolver(),
      ],
    }),
    // 配置 Vue 官方插件
    vue(),
    // 配置 Gzip 压缩插件
    viteCompression({
      // 生成的压缩包后缀名
      ext: '.gz',
      // 压缩算法
      algorithm: 'gzip',
      // 最小压缩文件大小 (bytes)
      threshold: 10240,
      // 是否删除原始文件
      deleteOriginFile: false,
      // 仅压缩指定类型的文件
      filter: /\.(js|css|html|svg)$/,
    }),
  ]

  return plugins
}
