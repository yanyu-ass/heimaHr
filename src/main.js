import Vue from 'vue'
//  normalize.css是一个可以定制的CSS文件，它让不同的浏览器在渲染网页元素的时候形式更统一
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入element-ui的语言包
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// 引入全局样式
import '@/styles/index.scss' // global css
// 引入App.vue 全局组件
import App from './App'
// 引入vuex
import store from './store'
// 引入路由
import router from './router'
// 引入图标
import '@/icons' // icon
// 引入权限控制
import '@/permission' // permission control
// 引入mock
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
// 注册element-ui
// Vue.use(ElementUI, { locale })
// 设置多语言为英文
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
// 生产环境提示
Vue.config.productionTip = false
Vue.directive('auth', {
  inserted(el, binding) {
    // console.log(el)
    // console.log(binding)
    // 如果可以找到这个权限, 就不删除
    const { roles: { points }} = store.state.user.userInfo
    if (!points.includes(binding.value)) {
      // el.parentNode.removeChild(el)
      el.remove()
    }
  }
})
// 创建vue实例
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
