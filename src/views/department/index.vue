<template>
  <div class="container">
    <div class="app-container">
      <el-tree default-expand-all :data="depts" :props="defaultProps" :expand-on-click-node="false">
        <!-- 节点结构 -->
        <!-- v-slot="{ node, data }" 只能作用在template -->
        <template v-slot="{ data }">
          <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <!-- $event 实参 表示类型 -->
              <span style="margin-right: 10px">管理员</span>
              <el-dropdown @command="clickItem($event,data.id)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <AddDept ref="addDeptRef" :show-dialog.sync="showDialog" :current-node-id="currentNodeId" @updateDepartment="updateDepartment" />
  </div>
</template>
<script>
import { delDepartment, getDepartments } from '@/api/department'
import { transListToTree } from '@/utils'
import AddDept from '@/views/department/components/add-dept.vue'
export default {
  name: 'Department',
  components: { AddDept },
  data() {
    return {
      currentNodeId: null, // 存储当前点击的id
      showDialog: false,
      depts: [{
        name: '传智教育',
        children: [
          { name: '总裁办' },
          { name: '行政部' },
          { name: '财务部' }
        ]
      }],
      defaultProps: {
        label: 'name'
      }
    }
  },
  created() {
    this.getDepartmentFn()
  },
  methods: {
    async getDepartmentFn() {
      const res = await getDepartments()
      this.depts = transListToTree(res, 0)
    },
    updateDepartment() {
      this.getDepartmentFn()
    },
    async clickItem(type, id) {
      // 这里的id需要保存到data里面之后 才可以传到子组件
      this.currentNodeId = id
      if (type === 'add') {
        this.showDialog = true
      } else if (type === 'edit') {
        // console.log('编辑', this.currentNodeId)
        this.$nextTick(() => {
          this.$refs.addDeptRef.getDepartDetail()
        })
        this.showDialog = true
      } else {
        this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await delDepartment(id)
          this.$message.success('删除成功')
          this.getDepartmentFn()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }

  }
}
</script>
<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}
.tree-manager {
  width: 50px;
  display: inline-block;
  margin: 10px;
}
</style>
