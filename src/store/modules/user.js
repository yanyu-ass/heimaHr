import { getToken, removeToken, setToken } from '@/utils/auth'
import { getUserInfo, login } from '@/api/user'
import { constantRoutes, resetRouter } from '@/router'

/**
 * @type {import('vuex').Module}
 */
const user = {
  //  开启命名空间
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {},
    routes: constantRoutes // 静态路由的数组
  },
  mutations: {
    setToken(state, token) {
      // 把toke数据存储到vuex中
      state.token = token
      //   本地存储
      setToken(token)
    },
    removeToken(state) {
      state.token = ''
      removeToken()
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setRoutes(state, newRoutes) {
      state.routes = [...constantRoutes, ...newRoutes] // 静态路由 + 动态路由
    }
  },
  actions: {
    //     登录的接口会在actions中进行调用
    async handleLogin(ctx, payload) {
      const res = await login(payload)
      ctx.commit('setToken', res)
    },
    async getUserInfo(ctx) {
      const res = await getUserInfo()
      ctx.commit('setUserInfo', res)
      return res// 为什么要返回res: 因为后面要用到这个数据
    },
    logout(ctx) {
      // 清空token
      ctx.commit('removeToken')
      // 清空用户信息
      ctx.commit('setUserInfo', {})
      // 清空路由
      resetRouter()
    }
  }
}
export default user
