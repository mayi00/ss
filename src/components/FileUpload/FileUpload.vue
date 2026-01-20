<script setup>
import { ElMessage } from 'element-plus'
import { autoConvertStorageUnits } from '@/utils/unitConversion.js'

defineOptions({ name: 'FileUpload' })

const props = defineProps({
  // 控制弹框显示/隐藏
  dialogVisible: { type: Boolean, default: false },
  // 对话框的宽度
  width: { type: [String, Number], default: '500' },
  // 弹框title
  title: { type: String, default: '上传文件' },
  // 是否需要遮罩层
  modal: { type: Boolean, default: true },
  // 为 Dialog 启用可拖拽功能
  draggable: { type: Boolean, default: true },
  // 是否支持多选文件
  multiple: { type: Boolean, default: true },
  // 是否启用拖拽上传
  drag: { type: Boolean, default: true },
  // 允许上传文件的最大数量
  limit: { type: [Number, String], default: 1 },
  // 接受上传的文件类型
  accept: { type: [String, Array], default: '.xls,.xlsx' },
  // 上传时的按钮loading
  loading: { type: Boolean, default: false },
  // 文件大小限制，单位：KB，默认5MB
  maxSize: { type: [Number, String], default: 1024 * 5 },
})
const emits = defineEmits(['on-confirm', 'on-cancel'])

// 控制弹框显示/隐藏
const dialogVisible = ref(false)
// 是否支持多选文件
const multipleChoice = computed(() => {
  if (props.limit > 1) {
    return props.multiple
  } else {
    return false
  }
})
// 允许上传文件的最大数量
const limitNum = computed(() => {
  return Number(props.limit)
})
const uploadTip = computed(() => {
  return props.drag ? '将文件拖到此处或点击上传' : '点击上传'
})
// 已上传的文件列表
const fileList = ref([])
// 是否禁用上传，当文件数量达到限制时禁用上传按钮
const disabled = computed(() => {
  return fileList.value.length >= limitNum.value
})

watch(
  () => props.dialogVisible,
  newVal => {
    dialogVisible.value = newVal
  },
  { immediate: true }
)

// 选择文件超过限制时的回调
function onExceed() {
  ElMessage.warning(`最多允许上传${props.limit}个文件`)
}
// 上传文件之前
function beforeUpload(file) {
  // console.log('file', file)
  // 文件大小限制
  const maxSize = parseInt(props.maxSize)
  if (file.size / 1024 > maxSize) {
    const max = autoConvertStorageUnits(maxSize, 'KB')
    ElMessage.error(`文件大小不能超过 ${max.value} ${max.unit}`)
    return false
  }
  // 文件数量限制
  if (fileList.value.length >= props.limit) {
    ElMessage.warning(`最多允许上传${props.limit}个文件`)
    return false
  }
  // 上传同一个文件时，提示用户
  const isSameFile = fileList.value.some(
    item => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified
  )
  if (isSameFile) {
    ElMessage.warning('已选择相同的文件，请重新选择')
    return false
  }
  fileList.value.push(file)
  return false
}
// 删除已选择的文件
function handleDelFile(file) {
  const i = fileList.value.findIndex(item => item.uid === file.uid)
  if (i !== -1) {
    fileList.value.splice(i, 1)
  }
}
// 取消
function handleCancel() {
  emits('on-cancel')
  fileList.value = []
}
// 确定
function handleConfirm() {
  if (fileList.value.length === 0) {
    ElMessage.error('请选择要上传的文件')
  } else {
    emits('on-confirm', fileList.value)
    fileList.value = []
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :modal="modal"
    :draggable="draggable"
    :before-close="handleCancel"
  >
    <el-upload
      action=""
      :multiple="multipleChoice"
      :drag="drag"
      :accept="accept"
      :on-exceed="onExceed"
      :before-upload="beforeUpload"
      :disabled="disabled"
      :limit="limitNum"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <p>{{ uploadTip }}</p>
    </el-upload>

    <ul v-if="fileList.length > 0" class="file-list">
      <li v-for="item in fileList" :key="item.uid" class="file-box">
        <el-tooltip effect="dark" :content="item.name" placement="top">
          <template #content>
            <p style="max-width: 300px; max-height: 200px; overflow-y: auto">
              {{ item.name }}
            </p>
          </template>
          <span class="file-name g-single-ellipsis">{{ item.name }}</span>
        </el-tooltip>
        <el-icon class="file-del" size="18px" @click="handleDelFile(item)"><CircleClose /></el-icon>
      </li>
    </ul>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="handleConfirm">确定</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.file-list {
  margin-top: 8px;

  .file-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 24px;

    .file-name {
      flex: 1;
      margin-right: 32px;
      cursor: default;
    }

    .file-del {
      color: #999;
      cursor: pointer;

      &:hover {
        color: #f00;
      }
    }
  }
}
</style>
