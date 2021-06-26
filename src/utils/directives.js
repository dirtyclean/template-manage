import Vue from 'vue'
import clickoutside from './clickoutside'
Vue.directive('clickoutside', clickoutside)
/** 权限指令**/
Vue.directive('has', {
  inserted: function(el, binding, vnode) {
    // 获取按钮权限
    const promiseBtns = vnode.context.$route.meta.promiseBtns || []
    const { value } = binding
    if (!promiseBtns.includes(value)) {
      el.remove()
    }
  }
})
