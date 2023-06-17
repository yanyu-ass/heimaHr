<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model.trim="queryParams.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
        <!-- 树形组件 -->
        <el-tree ref="treeRef" :data="depts" highlight-current :props="defaultProps" default-expand-all :expand-on-click-node="false" node-key="id" @current-change="selectNode" />
      </div>
      <div class="right">
        <el-row class-name="opeate-tools" type="flex" justify="end">
          <el-button v-auth="'add'" size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog=true">excel导入</el-button>
          <el-button size="mini" @click="exportEmp">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{row}">
              <el-avatar :size="30" :src="row.staffPhoto">
                <span class="username">{{ row.username?.charAt(0) }}</span>
              </el-avatar>

            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{row}">
              {{ row.formOfEmployment === 1 ? '正式' : row.formOfEmployment === 0?'非正式':'无' }}
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作" width="280px">
            <template v-slot="{row}">
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text" @click="btnRole(row.id)">角色</el-button>
              <el-popconfirm
                v-auth="'delete'"
                title="确定要删除当前员工吗？"
                @onConfirm="delEmployeeFn(row.id)"
              >
                <template #reference>
                  <el-button size="mini" type="text" style="margin-left: 15px">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            layout="total,prev, pager, next"
            :total="total"
            @current-change="currentChange"
          />
        </el-row>
      </div>
    </div>
    <ImportExcel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getDepts" />
    <el-dialog :visible.sync="showRoleDialog" title="分配角色">
      <!-- 弹层内容 -->
      <!-- checkbox -->
      <el-checkbox-group v-model="roleIds">
        <!-- 放置n个的checkbox  要执行checkbox的存储值 item.id-->
        <el-checkbox
          v-for="item in roleList"
          :key="item.id"
          :label="item.id"
        >{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="mini" @click="btnRoleOK">确定</el-button>
            <el-button size="mini" @click="showRoleDialog = false">取消</el-button>
          </el-col>
        </el-row>
      </template>

    </el-dialog>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import { getDepartments } from '@/api/department'
import { transListToTree } from '@/utils'
import {
  assignRole,
  delEmployee,
  exportEmployee,
  getEmployeeDetail,
  getEmployeeList,
  getEnableRoleList
} from '@/api/employee'
import debouce from 'lodash/debounce'
import ImportExcel from '@/views/employee/components/ImportExcel.vue'
export default {
  name: 'Employee',
  components: { ImportExcel },
  data() {
    return {
      // 存储查询参数
      queryParams: {
        departmentId: null,
        page: 1, // 当前页码
        pagesize: 10,
        keyword: ''
      },
      list: [],
      total: 0,
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showExcelDialog: false,
      showRoleDialog: false, // 用来控制角色弹层的显示
      roleList: [], // 接收角色列表
      roleIds: [], // 用来双向绑定数据的
      currentUserId: null// 用来存储当前用户的id
    }
  },
  created() {
    this.getDepts()
  },
  methods: {
    currentChange(val) {
      this.queryParams.page = val
      this.getEmpList()
    },
    selectNode(data) {
      this.queryParams.departmentId = data.id
      this.queryParams.page = 1
      this.getEmpList()
    },
    async getDepts() {
      const res = await getDepartments()
      this.depts = transListToTree(res, 0)
      this.queryParams.departmentId = this.depts[0].id// 默认把第一个节点的id进行记录
      //   默认把第一个节点选中
      this.$nextTick(() => {
        this.$refs.treeRef.setCurrentKey(this.depts[0].id)
      })
      this.getEmpList()
    },
    async getEmpList() {
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
    },
    changeValue: debouce(function() {
      this.queryParams.page = 1
      this.getEmpList()
    }, 500),
    // 导出
    async exportEmp() {
      const res = await exportEmployee()
      FileSaver.saveAs(res, '员工列表.xlsx')
    },
    async delEmployeeFn(id) {
      if (this.list.length === 1 && this.queryParams.page > 1) {
        this.queryParams.page--
      }
      await delEmployee(id)
      this.$message.success('删除成功')
      this.getEmpList()
    },
    // 点击角色按钮弹出层
    async btnRole(id) {
      this.roleList = await getEnableRoleList()
      // 记录当前点击的id 因为后边 确定取消要存取给对应的用户
      this.currentUserId = id
      const { roleIds } = await getEmployeeDetail(id)
      this.roleIds = roleIds
      this.showRoleDialog = true // 调整顺序
    },
    // 点击角色的确定
    async  btnRoleOK() {
      await assignRole({
        id: this.currentUserId,
        roleIds: this.roleIds
      })
      this.$message.success('分配用户角色成功')
      this.showRoleDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background: #2a55fa;
    color: white;
    transition: 0.3s;
  }
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }

  .right {
    flex: 1;
    padding: 20px;

    .opeate-tools {
      margin: 10px;
    }

    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display: inline-block;
    }
  }
}

</style>
