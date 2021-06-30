import Vue from 'vue'
import Router from 'vue-router'
import { getStorage } from '@/utils/storage/localStorage'
import apiRequest from '@/api/index'
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
export const asyncRoutes = [
  {
    path: '/',
    component: () => import('../views/index.vue'),
    redirect: '/template',
    name: '/',
    children: [
      {
        path: '/template',
        component: () => import('../views/template/index.vue'),
        name: 'template',
        meta: { icon: () => import('@/assets/img/svg/template.svg') }
      },
      {
        path: '/system',
        component: () => import('../views/system/index.vue'),
        name: 'system',
        meta: { icon: () => import('@/assets/img/svg/system.svg') },
        redirect: '/notChild', // 不授予任何子权限，重定向到/notChild
        children: []
      }
    ]
  }
]
const constantRoutes = [
  {
    path: '/login',
    component: () => import('../views/login.vue'),
    name: 'login'
  },
  {
    path: '/403',
    component: () => import('../views/error-page/403.vue')
  },
  {
    path: '/notChild',
    component: () => import('../views/error-page/notChild.vue'),
    name: 'notChild'
  }
]
const createRouter = () => {
  return new Router({
    routes: [...constantRoutes]
  })
}
const router = createRouter()
const resetRouter = function () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
// 使用钩子函数对路由进行权限跳转
router.beforeEach(async (to, from, next) => {
  const isLogin = getStorage('token')
  if (!isLogin) {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  } else {
    if (router.options.routes.length <= constantRoutes.length) {
      console.log('====获取userInfo====...')
      await apiRequest.user.getUserInfo()
      next({ ...to, replace: true })
    } else {
      next()
    }
  }
  setTimeout(() => {
    const loadDom = document.getElementById('initLoading')
    loadDom && loadDom.remove()
  }, 200)
})
export { resetRouter }
export default router
