<template>
  <div class="navbar">
    <!-- 左侧汉堡包图标
      左侧导航开启时, 面包图标处于激活状态(看<方向)
      绑定汉堡包点击事件, 实现切换左侧导航显示/隐藏
     -->
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!-- 面包屑导航xxx/xxx/xxx这个 -->
    <breadcrumb class="breadcrumb-container" />

    <!-- 右侧菜单 -->
    <div class="right-menu">
      <!-- 它是elementUI的下拉菜单, trigger点击时候下拉菜单出现 -->
      <el-dropdown class="avatar-container" trigger="click">
        <!-- 元素1, 为此下来菜单显示的标签 -->
        <div class="avatar-wrapper">
          <!--          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
          <img
            v-if="avatar"
            :src="avatar"
            class="user-avatar"
          >
          <span v-else class="username">{{ name?.charAt(0) }}</span>
          <span
            class="
            name"
          >{{ name }}</span>
          <i class="el-icon-setting" />
        </div>
        <!-- 下拉列表 -->
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :visible.sync="showDialog" title="修改密码" width="500px" @close="btnCancel">
      <el-form ref="passwordForm" label-width="120px" label-position="right" :model="passForm" :rules="rules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" type="password" show-password size="small" style="width: 80%" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" type="password" show-password size="small" style="width: 80%" />
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" type="password" show-password size="small" style="width: 80%" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="submit">确认修改</el-button>
          <el-button size="mini" @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar', // 左侧导航状态对象
      'avatar', // 头像地址
      'name' // 用户名
    ])
  },
  data() {
    return {
      showDialog: false,
      passForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              console.log(this.passForm)
              if (this.passForm.newPassword === value) {
                callback()
              } else {
                callback(new Error('两次输入密码不一致!'))
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    // 调用vuex里切换左侧导航出现/隐藏
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录点击事件
    async logout() {
      await this.$store.dispatch('user/logout')
      // 传递当前未遂地址
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    updatePassword() {
      this.showDialog = true
    },
    async submit() {
      // 校验表单
      await this.$refs.passwordForm.validate()
      // 发起请求
      await updatePassword(this.passForm)
      this.$message.success('修改成功')
      this.btnCancel()
      this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    btnCancel() {
      this.$refs.passwordForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    .username {
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 50%;
      background: #04c9be;
      color: #fff;
      margin-right: 4px;
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-wrapper {
      margin-top: 5px;
      position: relative;
      display: flex;
      align-items: center;
      .name {
        //  用户名称距离右侧距离
        margin:0 10px;
        font-size: 16px;
      }
      .el-icon-setting {
        font-size: 20px;
        margin-right: 20px;
      }
      .user-avatar {
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
  }
}
</style>
