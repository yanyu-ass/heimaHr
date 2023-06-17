<template>
  <div>
    <el-upload :before-upload="beforeUpload" action="" :show-file-list="false" class="avatar-uploader" :http-request="uploadImage">
      <img v-if="value" :src="value" alt="" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'// 引入cos-js-sdk-v5
export default {
  name: 'ImageUpload',
  props: {
    value: {
      type: String,
      default: null
    }
  },
  methods: {
    // xiangzi-1317278180
    // ap-nanjing
    // AKIDJcu6EXxGPKcjeL2Zu31qSukOsAFAxhQ3
    // zsiPvNnAScgbLuJoBNOFMasCVqFiIyeG
    beforeUpload(file) {
      // size属性表示文件大小，单位为字节
      // type属性表示文件类型，如image/jpeg、image/png
      const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 5 // 5M

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    },
    uploadImage(params) {
      // console.log(params)
      const cos = new COS({
        SecretKey: 'zsiPvNnAScgbLuJoBNOFMasCVqFiIyeG',
        SecretId: 'AKIDJcu6EXxGPKcjeL2Zu31qSukOsAFAxhQ3'
      })
      cos.putObject({
        Bucket: 'xiangzi-1317278180',
        Region: 'ap-nanjing',
        Key: params.file.name,
        Body: params.file,
        StorageClass: 'STANDARD'
      }, (err, data) => {
        if (err) return
        if (data.statusCode === 200 && data.Location) {
          this.$emit('input', 'http://' + data.Location)
        } else {
          this.$message.error('上传失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
