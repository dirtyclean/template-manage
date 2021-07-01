function getCookie(key) {
  try {
    if (document.cookie.length > 0) {
      let startIdx = document.cookie.indexOf(key + '=')
      if (startIdx !== -1) {
        startIdx = startIdx + key.length + 1
        let endIdx = document.cookie.indexOf(';', startIdx)
        if (endIdx === -1) endIdx = document.cookie.length
        return unescape(document.cookie.substring(startIdx, endIdx))
      }
    }
    return ''
  } catch (e) {}
}

function setCookie(key, value, expiredays) {
  const exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = key + '=' + escape(value) + (expiredays == null ? '' : ';expires=' + exdate.toGMTString())
}
export default {
  setCookie,
  getCookie
}
