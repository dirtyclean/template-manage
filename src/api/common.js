import url from '../url-config.js'
import req from '../request'
import { constant } from '../config'
import { getStorage } from '@/utils/localStorage.js'
export const getFileToken = ({ file }) => {
  const crypto = require('crypto')
  const MD5_VALUE = crypto.createHash('md5')
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsBinaryString(file) // 读法异步的
    reader.onloadend = () => {
      // 这个事件在读取结束后，无论成功或者失败都会触发
      if (reader.error) {
        reject(new Error(`读取文件错误，原因：${reader.error}`))
      } else {
        const fileHash = MD5_VALUE.update(reader.result).digest('hex')
        req
          .get(url.fileToken, {
            hash: fileHash,
            userToken: constant.TOKEN_PREFIX + getStorage('Authorization')
          })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(e => {
            reject(e)
          })
      }
    }
    reader.onerror = error => reject(error)
  })
}
export const getFile = ({ id }) => req.get(url.filePreview + '/' + id, { id })
export const getFileUrl = ({ id }) => {
  return `${url.filePreview}/${id}`
}
export const commonApi = {
  getFile,
  getFileToken,
  getFileUrl
}
