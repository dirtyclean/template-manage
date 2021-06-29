import Vue from 'vue'
import Router from 'vue-router'
import { getStorage } from '@/utils/storage/localStorage'
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
export const constantRoutes = [
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
        redirect: '/notChild',
        children: []
      }
    ]
  }
]
const createRouter = () => {
  return new Router({
    routes: [
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
  })
}
const router = createRouter()
const resetRouter = function () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const isLogin = getStorage('token')
  if (!isLogin && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})
export { resetRouter }
export default router
