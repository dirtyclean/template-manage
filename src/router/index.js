import Vue from 'vue'
import Router from 'vue-router'
import { getStorage } from '@/utils/storage/localStorage'
import apiRequest from '@/api/index'
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
const Layout = {
  template: `
      <router-view></router-view>
  `
}
export const asyncRoutes = [
  {
    path: '/',
    component: () => import('../views/index.vue'),
    children: [
      {
        path: '/template',
        name: 'template',
        component: () => import('../views/template/index.vue'),
        meta: { icon: () => import('@/assets/img/svg/template.svg') }
      },
      {
        path: '/system',
        component: Layout,
        redirect: '/notChild',
        meta: { icon: () => import('@/assets/img/svg/system.svg') },
        children: [
          {
            path: 'menu',
            name: 'menu',
            component: () => import('@/views/system/menu/index')
          },
          {
            path: 'user',
            name: 'user',
            component: () => import('@/views/system/user/index')
          },
          {
            path: 'role',
            name: 'role',
            component: () => import('@/views/system/role/index')
          },
          {
            path: 'version',
            name: 'version',
            component: () => import('@/views/system/version/index')
          }
        ]
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
    routes: [...constantRoutes, ...asyncRoutes]
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
