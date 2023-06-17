import request from '@/utils/request'

// JSDOC注释, 写代码的时候vscode会给你提示
// 封装工具函数可以用这种注释-必须挨着代码

/**
 * 登录
 * @param {*} data 请求参数
 * @returns Promise对象
 */
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @returns {*}
 */
export function getUserInfo() {
  return request({
    url: '/sys/profile'
  })
}

/**
 * 更新密码
 * **/
export function updatePassword(data) {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}
