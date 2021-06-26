const telNum = /(^1[3456789]\d{9}$)|(^4\d{9}$)|(^8\d{7,9}$)|(^9\d{4}$)/ // 校验1、4、8、9开头的电话号码
const code = /^[A-Za-z0-9]+$/ // 数字字母
const number = /^[0-9]+$/ // 数字
const isTelNum = val => {
  return telNum.test(val)
}
const isCode = val => {
  return code.test(val)
}
const isNumber = val => {
  return number.test(val)
}
const passwordIsPass = password => {
  if (
    !(
      /.*[a-z]{1,}.*/.test(password) &&
      /.*[A-Z]{1,}.*/.test(password) &&
      /.*\d{1,}.*/.test(password) &&
      /.*[~!@#$%^&*\\.?]{1,}.*/.test(password)
    )
  ) {
    return false
  } else {
    return true
  }
}
module.exports = {
  isTelNum,
  isCode,
  passwordIsPass,
  isNumber
}
