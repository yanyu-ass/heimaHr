<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <el-form ref="loginForm" :model="loginForm" :rules="rules">
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" show-password />
          </el-form-item>
          <el-form-item prop="isAgree">
            <!-- `checked` 为 true 或 false -->
            <el-checkbox v-model="loginForm.isAgree">用户平台使用协议</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 350px" @click="loginFn">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import { isDev } from '@/utils'

export default {
  name: 'Login',
  data() {
    return {
      // 数据对象
      loginForm: {
        mobile: isDev ? '13800000002' : '',
        password: isDev ? 'hm#qd@23!' : '',
        isAgree: isDev
      },
      //   校验规则对象
      rules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern: /^1[2-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '密码必须6-16位',
            trigger: 'blur'
          }
        ],
        isAgree: [
          /*   {
            // required只能检测null undefined "" 不能检测false
            required: true,
            message: '请同意用户平台使用协议',
            trigger: 'change'
          }*/
          {
            validator: (rule, value, callback) => {
              // rule校验规则
              // value当前表单值
              // // callback决定校验结果
              // console.log(rule)
              // console.log(value)
              // console.log(callback)
              // callback（）是一个函数
              // 如果调用的时候 不传参 或者传入一个undefined则为校验成功
              // 如果调用的时候传入一个错误对象 则会将错误对象的message属性值作为错误提示
              value ? callback() : callback(new Error('请同意用户平台使用协议'))
            }
          }
        ]
      }
    }
  },
  methods: {
    async loginFn() {
      await this.$refs.loginForm.validate()
      //   调用登录的actions
      await this.$store.dispatch('user/handleLogin', this.loginForm)
      //   跳转到首页
      this.$router.push(this.$route.query.redirect || '/')
    }
  }

}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
    no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color:#606266;
    }
  }
}
</style>
