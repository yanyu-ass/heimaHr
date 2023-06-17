<template>
  <div class="container">
    <div class="app-container">
      <div class="role-operate">
        <el-button type="primary" size="mini" @click="showRoleDialog=true">添加角色</el-button>
      </div>
      <el-table :data="list">
        <el-table-column prop="name" label="角色" align="center">
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用" align="center">
          <template v-slot="{row}">
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" />
            <span v-else>  {{ stateMap[row.state]|| '无' }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" align="center">
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" size="mini" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <template v-if="row.isEdit">
              <el-button size="mini" type="primary" @click="btnEditOK(row)">确认</el-button>
              <el-button size="mini" @click="row.isEdit = false">取消</el-button>
            </template>
            <template v-else>
              <el-button size="mini" type="text" @click="btnPermission(row.id)">分配权限</el-button>
              <el-button size="mini" type="text" @click="editRow(row)">编辑</el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="confirmDel(row.id)">
                <template #reference>
                  <el-button style="margin-left:10px" size="mini" type="text">删除</el-button>

                </template>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" style="height: 60px" align="middle" justify="end">
        <el-pagination :total="total" layout="prev, pager, next" :current-page="pageParams.page" :page-size="pageParams.pagesize" @current-change="changePage" />
      </el-row>
    </div>
    <el-dialog :visible.sync="showRoleDialog" width="500px" @close="close">
      <el-form ref="roleFormRef" label-width="80px" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" sizi="mini" />
        </el-form-item>
        <el-form-item v-model="roleForm.state" label="启用">
          <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" type="textarea" placeholder="角色描述" />
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="mini" style="margin-left: -80px" @click="submit">确认</el-button>
          <el-button size="mini" @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 放置权限弹层 -->
    <el-dialog :visible.sync="showPermissionDialog" title="分配权限">
      <!-- 放置权限数据 -->
      <el-tree
        ref="permTree"
        check-strictly
        :default-checked-keys="permIds"
        node-key="id"
        :data="permissionData"
        :props="{ label: 'name' }"
        show-checkbox
        default-expand-all
      />
      <template #footer>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="mini" @click="btnPermissionOK">确定</el-button>
            <el-button size="mini" @click="showPermissionDialog = false">取消</el-button>
          </el-col>
        </el-row>
      </template>

    </el-dialog>
  </div>
</template>
<script>
import { addRole, assignPerm, delRole, getRoleDetail, getRoleList, updateRole } from '@/api/role'
import { getPermissionList } from '@/api/permission'
import { transListToTree } from '@/utils'

export default {
  name: 'Role',
  data() {
    return {
      showPermissionDialog: false,
      permissionData: [],
      // 控制新增角色弹窗的显示隐藏
      showRoleDialog: false,
      pageParams: {
        page: 1, // 第几页
        pagesize: 5 // 每页多少条
      },

      stateMap: {
        0: '未启用',
        1: '已启用'
      },
      roleForm: {
        name: '',
        description: '',
        state: 0 // 默认未1启用 关闭 0 打开1
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      list: [],
      total: 0,
      currentRoleId: null,
      permIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    editRow(row) {
      // 1.将当前行的isEdit设置为true
      row.isEdit = true
      // 2.将当前行的数据保存起来
      // this.$set(row, 'oldData', { ...row })
    },
    async getRoleList() {
      const res = await getRoleList(this.pageParams)
      this.list = res.rows
      // 给每一行数据添加一个isEdit标识
      this.list.forEach(item => {
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          name: item.name,
          description: item.description,
          state: item.state
        })
      })
      this.total = res.total
    },
    changePage(page) {
      this.pageParams.page = page
      this.getRoleList()
    },
    async submit() {
      await this.$refs.roleFormRef.validate()
      await addRole(this.roleForm)
      this.$message.success('添加角色成功')
      this.close()
    },
    close() {
      this.$refs.roleFormRef.resetFields()
      this.showRoleDialog = false
    },
    // 点击确定时触发
    async  btnEditOK(row) {
      if (row.editRow.name && row.editRow.description) {
        // 下一步操作
        await updateRole({ ...row.editRow, id: row.id })
        // 更新成功
        this.$message.success('更新角色成功')
        // 更新显示数据  退出编辑状态
        // row.name = row.editRow.name // eslint的一校验 误判
        // Object.assign(target, source)
        Object.assign(row, {
          ...row.editRow,
          isEdit: false // 退出编辑模式
        }) // 规避eslint的误判
      } else {
        this.$message.warning('角色和描述不能为空')
      }
    },
    //   删除
    async confirmDel(id) {
      await delRole(id)
      if (this.list.length === 1 && this.pageParams.page > 1) {
        this.pageParams.page--
      }
      this.$message.success('删除角色成功')
      this.getRoleList()
    },
    async  btnPermission(id) {
      this.currentRoleId = id
      const { permIds } = await getRoleDetail(id)
      this.permIds = permIds
      this.permissionData = transListToTree(await getPermissionList(), 0)
      this.showPermissionDialog = true
    },
    // 点击确定时触发
    async  btnPermissionOK() {
      await assignPerm({
        id: this.currentRoleId,
        permIds: this.$refs.permTree.getCheckedKeys()
      })
      this.$message.success('角色分配权限成功')
      this.showPermissionDialog = false
    }
  }
}
</script>
<style>
.role-operate {
padding: 10px;
}
</style>
