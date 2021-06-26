import Vue from 'vue'
import SvgIcon from '@/components/svgIcon/index.vue' // svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('@/assets/img/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
