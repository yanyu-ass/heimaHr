<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" label-width="220px" :model="userInfo" :rules="rules">
          <!-- 姓名 部门 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfo.username" size="mini" class="inputW" clearable />
              </el-form-item>
            </el-col>

          </el-row>
          <!-- 工号 入职时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号">
                <el-input v-model="userInfo.workNumber" size="mini" class="inputW" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <!--手机 聘用形式  -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input
                  v-model="userInfo.mobile"
                  size="mini"
                  class="inputW"
                  max-length="11"
                  show-word-limit
                  clearable
                  :disabled="!!$route.params.id"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <SelectTree v-model="userInfo.departmentId" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select v-model="userInfo.formOfEmployment" size="mini" class="inputW" clearable placeholder="请选择">
                  <el-option label="正式" :value="1" />
                  <el-option label="非正式" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker
                  v-model="userInfo.timeOfEntry"
                  clearable
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker
                  v-model="userInfo.correctionTime"
                  clearable
                  size="mini"
                  type="date"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工照片 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像">
                <!-- 放置上传图片 -->
                <ImageUpload v-model="userInfo.staffPhoto" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存个人信息 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left:220px">
              <el-button size="mini" type="primary" @click="saveData">保存更新</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>

import SelectTree from '@/views/employee/select-tree.vue'
import { addEmployee, getEmployeeDetail, updateEmployee } from '@/api/employee'
import ImageUpload from '@/views/employee/components/image-upload.vue'

export default {
  name: 'EmployeeDetail',
  components: { ImageUpload, SelectTree },
  data() {
    return {
      userInfo: {
        username: '', // 用户名
        mobile: '', // 手机号
        workNumber: '', // 工号
        formOfEmployment: null, // 聘用形式
        departmentId: null, // 部门id
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }, {
          min: 1, max: 4, message: '姓名为1-4位'
        }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, {
          //   pattern 正则表达式
          pattern: /^1[3-9]\d{9}$/,
          message: '手机号格式不正确',
          trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '请选择聘用形式', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        timeOfEntry: [{ required: true, message: '请选择入职时间', trigger: 'blur' }],
        correctionTime: [{ required: true, message: '请选择转正时间', trigger: 'blur' }, {
          validator: (rule, value, callback) => {
            if (this.userInfo.timeOfEntry) {
              if (new Date(this.userInfo.timeOfEntry) > new Date(value)) {
                callback(new Error('转正时间不能小于入职时间'))
                return
              }
            }
            callback()
          }
        }]
      }

    }
  },
  created() {
    this.$route.params.id && this.getDetailFn()
  },
  methods: {
    async saveData() {
      await this.$refs.userForm.validate()
      this.$route.params.id ? await updateEmployee(this.userInfo) : await addEmployee(this.userInfo)
      this.$route.params.id ? this.$message.success('更新成功') : this.$message.success('添加成功')
      this.$router.back()
    },
    async getDetailFn() {
      this.userInfo = await getEmployeeDetail(this.$route.params.id)
    }
  }
}
</script>

<style scoped lang="scss">
.edit-form {
  background: #fff;
  padding: 20px;
  .inputW {
    width: 380px
  }
}

</style>
