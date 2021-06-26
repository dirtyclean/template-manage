import axios from 'axios'
import { notification, message } from 'ant-design-vue'
import qs from 'qs'
import router from '../router'
import { constant } from '../config'
import { getStorage } from '@/utils/storage/localStorage'
let timeout = 60 * 1000
if (process.env.NODE_ENV !== 'development') {
  timeout = 60 * 1000
}
let hasNotification = false

const service = axios.create({
  timeout,
  baseURL: constant.BASEURL
})

service.interceptors.request.use(config => {
  const token = getStorage('token')
  if (token) {
    config.headers.pcbstoken = token
  }
  return config
})

service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (!response.data && response.data !== false) {
        return Promise.reject(response)
      }
      return response.data
    } else {
      Promise.reject(new Error('response-error'))
    }
  },
  error => {
    console.log(error)
    return Promise.reject(error.response)
  }
)

const createNotification = function (msg) {
  console.log(hasNotification, 'hasNotification')
  if (!hasNotification) {
    notification.open({
      message: '系统通知',
      description: msg || '登陆状态过期，请重新登陆',
      onClose () {
        hasNotification = false
      }
    })
    hasNotification = true
  }
}
const notification401 = msg => {
  createNotification(msg) // msg
  setTimeout(() => {
    router.push('/login')
  })
}
function whenErr (url, resolve, reject, error = '') {
  console.log(error)
  const { status, data } = error
  const isProduction = process.env.NODE_ENV === 'production'
  switch (status) {
    case 401:
      notification401(data.msg)
      return reject(error)
    case 404:
      isProduction && message.error('404未找到')
      !isProduction && message.error(`/${url} --> 404 not found`)
      return reject(error)
  }
  if (!data) {
    // 无任何内容返回
    isProduction && message.error('无任何内容返回')
    !isProduction && message.error(`/${url} --> This request has no response data available`)
  } else if (data.type || data.msg) {
    // 后端封装错误
    isProduction &&
            message.error(h => {
              return <span domPropsInnerHTML={data.msg || '服务器响应出错'}></span>
            })
    !isProduction &&
            message.error(h => {
              return <span domPropsInnerHTML={data.msg || data.type}></span>
            })
  } else if (error.data instanceof ArrayBuffer) {
    message.error('服务器响应出错')
  } else {
    // 其他
    isProduction && message.error('服务器响应出错')
    !isProduction && message.error(JSON.stringify(data))
  }
  return reject(error)
}

function get (url, data, responseType = '', otherConfig = {}) {
  return new Promise((resolve, reject) => {
    service({
      method: 'get',
      url: url,
      params: data || '',
      responseType,
      ...otherConfig
    })
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        whenErr(url, resolve, reject, e)
      })
  })
}

function put (url, data, isJson = false, otherConfig = {}) {
  return new Promise((resolve, reject) => {
    service({
      method: 'put',
      url: url,
      data: isJson ? data : qs.stringify(data),
      ...otherConfig
    })
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        whenErr(url, resolve, reject, e)
      })
  })
}

function del (url, data, isJson = false) {
  return new Promise((resolve, reject) => {
    service({
      method: 'delete',
      url: url,
      params: isJson ? '' : data || '',
      data: isJson ? data : null
    })
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        whenErr(url, resolve, reject, e)
      })
  })
}

function post (url, data, isJson = false, otherConfig = {}) {
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url: url,
      data: isJson ? data : qs.stringify(data),
      ...otherConfig
    })
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        whenErr(url, resolve, reject, e)
      })
  })
}

export default {
  post,
  get,
  put,
  del,
  notification401
}
