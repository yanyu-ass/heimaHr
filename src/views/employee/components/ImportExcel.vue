<template>
  <el-dialog
    width="500px"
    title="员工导入"
    :visible="showExcelDialog"
    @close="$emit('update:showExcelDialog', false)"
  >
    <el-row type="flex" justify="center">
      <div class="upload-excel">
        <input
          ref="excel-upload-input"
          class="excel-upload-input"
          type="file"
          accept=".xlsx, .xls"
          @change="uploadChange"
        >
        <div class="drop">
          <i class="el-icon-upload" />
          <el-button type="text" @click="downloadTemplateFn">下载导入模板</el-button>
          <span>将文件拖到此处或
            <el-button type="text" @click="uploadFn">点击上传</el-button>
          </span>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="end">
      <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
      <el-button size="mini" type="primary" @click="$emit('update:showExcelDialog', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>

import { getExportTemplate, uploadExcel } from '@/api/employee'
import FileSaver from 'file-saver'
import upload from 'element-ui/packages/upload'
export default {
  name: 'ImportExcel',
  props: {
    showExcelDialog: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    upload() {
      return upload
    }
  },
  methods: {
    async downloadTemplateFn() {
      const data = await getExportTemplate()
      FileSaver.saveAs(data, '员工导入模板.xlsx')
    },
    uploadFn() {
      this.$refs['excel-upload-input'].click()
    },
    async uploadChange(e) {
      const file = e.target.files[0]
      if (!file) return
      const formData = new FormData()
      formData.append('file', file)
      try {
        await uploadExcel(formData)
        this.$message.success('上传成功')
        this.$emit('uploadSuccess') // 通知父组件 我上传成功
        this.$emit('update:showExcelDialog', false) // 关闭弹层
      } catch (err) {
        console.log(err)
      } finally {
        this.$refs['excel-upload-input'].value = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin: 20px;
  width: 360px;
  height: 180px;
  align-items: center;
  color: #697086;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #dcdfe6;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 160px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .drop {
    line-height: 40px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
      color: #c0c4cc;
    }
  }
}
</style>
