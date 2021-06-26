import Vue from 'vue'
const noDataFormat = value => {
  let data = value + ''
  data = data.trim() ? data : ''
  if (['null', 'undefined', '', 'NaN'].includes(data)) {
    return ' - '
  } else {
    return value
  }
}
Vue.filter('noDataFormat', function (value) {
  return noDataFormat(value)
})
export default {
  noDataFormat
}
