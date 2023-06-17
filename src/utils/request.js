import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
const { VUE_APP_BASE_API } = process.env

// 你们项目在开发的时候如何区分环境
// 1. 通过命令行参数区分
// 2. 通过环境变量区分
// 3. 通过配置文件区分
// 4. 通过域名区分
// 5. 通过前缀区分
// 6. 通过端口区分
// 7. 通过ip区分
// 8. 通过host区分
// 9. 通过不同的请求地址区分
// 10. 通过不同的请求方式区分
// 11. 通过不同的请求参数区分
// 12. 通过不同的请求头区分
// 13. 通过不同的响应头区分
// 14. 通过不同的响应状态码区分

const request = axios.create({
  baseURL: VUE_APP_BASE_API,
  timeout: 5000
})

request.interceptors.request.use((config) => {
  const token = store.getters.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

request.interceptors.response.use((response) => {
  if (response.data instanceof Blob) return response.data
  // 真实的后端返回的数据在response.data里
  const { data, message, success } = response.data
  //   只有success为true data数据才可用
  if (success) {
    return data
  }
  // 进行全局的错误提示
  Message.error(message)
  return Promise.reject(message)
}, error => {
  // console.dir(error)
  if (error.response.status === 401) {
  //   退出登录
    store.dispatch('user/logout')
    //   重定向到login
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统出错 请联系后端程序员')
  return Promise.reject(error)
})
export default request
