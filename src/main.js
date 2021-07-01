import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { download } from '@/utils/methods'
import apiRequest from '@/api/index'
import req from '@/utils/request.js'
import moment from 'moment'
import 'moment/locale/zh-cn'
import filters from '@/utils/filters'
import xss from 'xss'
import { Message, Notification } from 'ant-design-vue'
import config from './config'
import simpleTable from '@/components/content/simple-table'
import contentHeader from '@/components/content/content-header'
import '@/utils/editor'
import '@/utils/directives'
import '@/utils/sysEvt/sysEvtBus'
import '@/icons'
moment.locale('zh-cn')
simpleTable.install = function (Vue) {
  Vue.component(simpleTable.name, simpleTable)
}
contentHeader.install = function (Vue) {
  Vue.component(contentHeader.name, contentHeader)
}

Message.config({
  duration: 2,
  maxCount: 3, // 最大显示数, 超过限制时，最早的消息会被自动关闭
  top: 70
})
const plugins = {}
plugins.install = vue => {
  Vue.prototype.$download = download
  vue.prototype.$moment = moment
  Vue.prototype.$apiReq = apiRequest
  Vue.prototype.$filters = filters
  Vue.prototype.$message = Message
  Vue.prototype.$notification = Notification
  Vue.prototype.$notification401 = req.notification401
  vue.prototype.$config = config
  Vue.prototype.xss = xss
  Vue.prototype.setUserInfo = userInfo => {
    Vue.prototype.userInfo = userInfo || {}
  }
}
Vue.use(plugins)
Vue.use(simpleTable)
Vue.use(contentHeader)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
