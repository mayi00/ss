<script setup>
import * as XLSX from 'xlsx'
import FileUpload from '@/components/FileUpload/FileUpload.vue'

defineOptions({ name: 'StudentClassHours' })

// 控制上传弹框的显示/隐藏
const dialogVisible = ref(false)
// 上传文件时的loading
const loading = ref(false)
// excel数据
const excelData = ref([])
// 学生的课时数据所在的行
const STUDENT_DATA_ROWS = [
  3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 27, 28, 29, 30, 31, 32, 35, 36, 37, 38, 39, 40, 43,
  44, 45, 46, 47, 48,
]

// 打开上传弹框
function handleUploadDialogOpen() {
  dialogVisible.value = true
}
// 关闭弹框
function handleUploadDialogClose() {
  dialogVisible.value = false
}
// 确认上传
async function handleUploadConfirm(fileList) {
  loading.value = true
  const start = performance.now()
  excelData.value = await readExcel(fileList[0])
  const end = performance.now()
  console.log(`读取excel数据耗时：${end - start}ms`)
  loading.value = false
  dialogVisible.value = false
  if (excelData.value.length === 1) {
    handleDownload(excelData.value[0])
  }
}

// 读取excel数据
function readExcel(file) {
  return new Promise(resolve => {
    const fileReader = new FileReader()
    fileReader.onload = event => {
      const binaryStr = event.target.result
      const workbook = XLSX.read(binaryStr, { type: 'binary' })
      console.log('excel原始数据', workbook)

      // 解析所有的sheet数据
      const excelData = []
      workbook.SheetNames.forEach(sheetName => {
        const sheet = {
          sheetName,
          sheetData: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]),
        }
        excelData.push(sheet)
      })
      console.log('json序列化后的excel数据', excelData)

      resolve(excelData)
    }
    // 由于 readAsBinaryString 已弃用，使用 readAsArrayBuffer 替代
    fileReader.readAsArrayBuffer(file)
  })
}

// 下载
function handleDownload(sheet) {
  console.time('handleDownload')
  /**
   * 从原始数据中把学生姓名和对应的课时数据过滤出来
   * 过滤出包含'EMPTY'关键词的列，并按行合并数据
   */
  const filteredData = []
  sheet.sheetData.forEach(item => {
    if (STUDENT_DATA_ROWS.includes(item.__rowNum__)) {
      for (const key in item) {
        if (key.includes('EMPTY')) {
          filteredData.push(item[key])
        }
      }
    }
  })
  console.log('学生姓名和对应的课时数据', filteredData)

  // 按照学生姓名分组的课时数据
  const studentClassHours = {}
  filteredData.forEach((item, i) => {
    if (i % 2 === 0) {
      if (studentClassHours[item]) {
        studentClassHours[item].classHours.push(filteredData[i + 1])
      } else {
        studentClassHours[item] = {
          name: item,
          classHours: [filteredData[i + 1]],
          sum: 0,
        }
      }
    }
  })

  // 计算每个学生的课时数据之和及所有学生的合计课时数据
  let totolClassHours = 0
  for (const key in studentClassHours) {
    studentClassHours[key].classHours.forEach(classHourItem => {
      studentClassHours[key].sum += classHourItem
    })
    totolClassHours += studentClassHours[key].sum
  }
  console.log('按照学生姓名分组的课时数据', studentClassHours)
  console.log('所有学生的合计课时数据', totolClassHours)

  // 构造下载数据格式
  const downloadData = Object.values(studentClassHours).map((studentInfo, i) => {
    const obj = {
      序号: String(i + 1),
      姓名: studentInfo.name,
      总计: studentInfo.sum,
    }
    studentInfo.classHours.forEach((timeItem, j) => {
      obj[`第${j + 1}节`] = timeItem
    })
    return obj
  })

  // 把总计的数据push进构造下载数据
  const obj = {
    序号: '',
    姓名: '',
    总计: totolClassHours,
  }
  downloadData.push(obj)
  console.log('下载的数据格式', downloadData)
  downloadExcel(downloadData, sheet.sheetName)
}

// 下载excel
function downloadExcel(val, name) {
  const fileName = `${name}.xlsx`
  const sheetName = 'Sheet 1'

  const excel = XLSX.utils.book_new()
  const data = XLSX.utils.json_to_sheet(val)

  XLSX.utils.book_append_sheet(excel, data, sheetName)
  XLSX.writeFile(excel, fileName)
  console.timeEnd('handleDownload')
}
</script>

<template>
  <div class="g-container">
    <h1>学生课时</h1>
    <el-card class="card">
      <el-button type="primary" @click="handleUploadDialogOpen">上传文件</el-button>
      <p v-if="excelData.length > 1" class="tip">检测到存在多个Sheet页，请选择一个下载</p>
      <ul v-if="excelData.length > 1" class="sheet-list">
        <li v-for="item in excelData" :key="item.sheetName" class="sheet-item" @click="handleDownload(item)">
          {{ item.sheetName }}
        </li>
      </ul>
    </el-card>

    <FileUpload
      :dialog-visible="dialogVisible"
      accept=".xls,.xlsx"
      :loading="loading"
      @on-confirm="handleUploadConfirm"
      @on-cancel="handleUploadDialogClose"
    />
  </div>
</template>

<style lang="less" scoped>
.card {
  text-align: center;

  .tip {
    margin: 15px 0;
    color: #666;
    font-size: 14px;
  }

  .sheet-list {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    padding: 0;
    list-style: none;

    .sheet-item {
      padding: 8px 12px;
      color: #409eff;
      background-color: #f5f7fa;
      border-radius: 4px;
      transition: all 0.3s;
      cursor: pointer;

      &:hover {
        background-color: #ecf5ff;
        box-shadow: 0 2px 6px rgb(0 0 0 / 10%);
        transform: translateY(-2px);
      }
    }
  }
}
</style>
