<template>
  <div>
    <el-dialog :visible="showDialog" :title="title" @close="close">

      <el-form ref="addDeptForm" label-width="120px" :model="formData" :rules="rules">
        <el-form-item prop="name" label="部门名称">
          <el-input v-model="formData.name" placeholder="2-10个字符" size="mini" style="width: 90%" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" placeholder="2-10个字符" size="mini" style="width: 90%" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="managerId">
          <el-select v-model="formData.managerId" placeholder="请选择负责人" size="mini" style="width: 90%">
            <el-option
              v-for="item in managerList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="formData.introduce" placeholder="1-100个字符" type="textarea" size="mini" :rows="4" style="width: 90%" />
        </el-form-item>
        <el-form-item>
          <!-- 按钮 -->
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button size="mini" type="primary" @click="addFn">确定</el-button>
              <el-button size="mini" @click="close">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addDepartment, getDepartmentDetail, getDepartments, getManagerList, updateDepartment } from '@/api/department'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: Number
  },
  data() {
    return {
      managerList: [], // 存储负责人列表

      formData: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称
        pid: '' // 父级部门的id
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
          { validator: async(rule, value, callback) => {
            let depts = await getDepartments()
            //   编辑的逻辑单独处理
            if (this.formData.id) {
              depts = depts.filter(item => item.id !== this.formData.id)
            }
            depts.some(item => item.name === value) ? callback(new Error('部门名称已存在')) : callback()
          }, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
          { validator: async(rule, value, callback) => {
            // 调用接口获取所有的部门数据
            let depts = await getDepartments()
            //   编辑的逻辑单独处理
            if (this.formData.id) {
              depts = depts.filter(item => item.id !== this.formData.id)
            }
            depts.some(item => item.code === value) ? callback(new Error('部门编码已存在')) : callback()
          }, trigger: 'blur' }
        ],
        managerId: [
          { required: true, message: '部门负责人不能为空', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '添加部门'
    }
  },
  created() {
    this.getManagerList()
  },
  methods: {
    close() {
      this.formData = {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称
        pid: '' // 父级部门的id
      }
      this.$refs.addDeptForm.resetFields()
      this.$emit('update:showDialog', false)
    },
    async getManagerList() {
      this.managerList = await getManagerList()
    },
    async addFn() {
      await this.$refs.addDeptForm.validate()
      if (this.formData.id) {
        await updateDepartment(this.formData)
        this.$message.success(`编辑部门成功`)
      } else {
        await addDepartment({ ...this.formData, pid: this.currentNodeId })
        // 通知父组件更新
        // 提示消息
        this.$message.success(`新增部门成功`)
      }
      this.close()
      this.$emit('updateDepartment')
    },
    async getDepartDetail() {
      this.formData = await getDepartmentDetail(this.currentNodeId)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  width: 620px;
}
</style>
