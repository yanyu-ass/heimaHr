import request from '@/utils/request'

/**
 * 获取首页数据
 * @returns {*}
 */
export const getHomeDataAPI = () => request({
  url: '/home/data'
})
/**
 * 获取通知
 * @returns {*}
 */
export const getMessageListAPI = () => request({
  url: '/home/notice'
})
