<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'

defineOptions({ name: 'App' })

console.log('App Init')
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>

<style lang="less" scoped></style>
