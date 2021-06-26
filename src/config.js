import moment from 'moment'
export const PAGINATION = (obj = {}) => {
  return {
    total: 0,
    position: 'bottom',
    current: 1,
    showSizeChanger: obj.showSizeChanger !== undefined ? obj.showSizeChanger : true,
    pageSizeOptions: obj.pageSizeOptions || ['5', '10', '20', '50'],
    pageSize: obj.pageSize || 10,
    'show-total': function (total) {
      return `共 ${total} 条`
    }
  }
}
export const DATEPICK_OPTION = (option = {}) => {
  const format = 'YYYY-MM-DD HH:mm'
  const showTime = {
    defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
    format: 'HH:mm'
  }
  option.format = option.format || format
  option.showTime = option.showTime === false ? false : option.showTime || showTime
  const disabledDate = option.isDisabledDate
    ? {
      disabledDate: current => {
        return current && current > moment().endOf('day')
      }
    }
    : {}
  return {
    showTime: option.showTime,
    format: option.format,
    ...disabledDate,
    defaultValue: option.defaultValue || [
      moment(moment().subtract(3, 'day'), option.format),
      moment(new Date(), option.format)
    ],
    separator: '-'
  }
}
export const constant = {}
const env = {
  projectTitle: process.env.VUE_APP_PROJECT_TITLE
}

export default {
  env,
  constant
}
