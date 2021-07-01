const noDataFormat = value => {
  let data = value + ''
  data = data.trim() ? data : ''
  if (['null', 'undefined', '', 'NaN'].includes(data)) {
    return ' - '
  } else {
    return value
  }
}
export default {
  noDataFormat
}
