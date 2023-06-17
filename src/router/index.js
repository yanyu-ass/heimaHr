import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
import departmentRouter from './modules/department'
import approvalRouter from './modules/approval'
import attendanceRouter from './modules/attendance'
import employeeRouter from './modules/employee'
import permissionRouter from './modules/permission'
import roleRouter from './modules/role'
import salaryRouter from './modules/salary'
import socialRouter from './modules/social'
// const req = require.context('./modules', false, /\.js$/)
// const asyncR = req.keys().map(item => req(item).default)
// 动态路由
export const asyncRoutes = [
  departmentRouter,
  roleRouter,
  employeeRouter,
  permissionRouter,
  attendanceRouter,
  approvalRouter,
  salaryRouter,
  socialRouter]
// 给Vue添加中间件函数(插件)

// 知识点: 执行()里东西
// 情况1: ()里函数, 直接执行Router里的一切
// 情况2: ()里对象, 执行对象install方法内的一切
// 全局注册RouterView和RouterLink组件
// 给Vue原型上添加$router和$route2个属性
Vue.use(Router)
// 知识点1: 路由是一套映射关系
// path路径对应component组件的映射关系
// 效果: 你切换浏览器上路由地址, 上这个数组里遍历匹配规则路径
// 命中后, 就会吧component对应的组件挂载到router-view位置上
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'), // 异步加载(懒加载组件-当路由路径命中这个path, 才会现去引入对应组件代码)
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }

  // 404 page must be placed at the end !!!
  // 404还是在最后, 但是最关键的path: '*'
  // 数组是有顺序的, 前面的对象里path都没有和当前路由路径匹配上就到了这里
  // 重定向redirect: 改变浏览器地址栏/404, 显示404页面->路由地址好看一些
  // 不显示那个错误的路由地址(难看)
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history',
  // 在路由切换时, 滚回到网页的顶部
  scrollBehavior: () => ({ y: 0 }),
  // 把两个路由数组合并到一起
  // routes: [...asyncRoutes, ...constantRoutes]
  routes: [...constantRoutes]
})

const router = createRouter()

// 重置路由对象-得讲到后面再用
// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
