// 路由全局前置导航守卫
import router, { asyncRoutes } from './router'
import store from './store'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
Nprogress.configure({ showSpinner: false })
const white = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  Nprogress.start()
  // 关闭进度条的旋转圈
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      // 判断是否有用户信息
      // 没有用户信息就获取用户信息
      if (!store.getters.userId) {
        // 获取用户信息
        // 为什么加await: 因为获取用户信息是异步操作, 需要等待获取完毕后再执行后面的代码
        const res = await store.dispatch('user/getUserInfo')
        console.log(res)
        console.log(res.roles.menus)
        console.log(asyncRoutes)
        const filterRoutes = asyncRoutes.filter(item => {
          // 判断是否有权限
          return res.roles.menus.includes(item.meta.name)
        })
        store.commit('user/setRoutes', filterRoutes)
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
        //   进行动态路由匹配和筛选
      }
      next()
    }
  } else {
    if (white.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  Nprogress.done()
})
router.afterEach(() => {
  Nprogress.done()
})
