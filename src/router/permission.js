import router, { resetRouter, constantRoutes } from './index'
import { cloneDeep, getItemById } from '@/utils/methods'
import { getStorage } from '@/utils/storage/localStorage'
const addRoutes = userInfo => {
  resetRouter()
  let menus = []
  if (!userInfo) {
    const value = getStorage('userInfo')
    console.log(value, 'value')
    if (value) {
      menus = value.menus
    }
  } else {
    menus = userInfo.menus
  }
  console.log(menus, 'menus')
  // 用户权限router值的集合
  const routerValues = {}
  const getRouterValues = menus => {
    menus.forEach(({ children, router, label }) => {
      routerValues[router] = label
      if (children?.length) {
        getRouterValues(children)
      }
    })
  }
  getRouterValues(menus)
  console.log(routerValues, 'routerValues')
  // 从all路由里删除不在权限内的
  const getFilterRoutes = routes => {
    for (let i = routes.length - 1; i >= 0; i--) {
      const item = routes[i]
      // 删除不在用户权限内的
      if (!Object.keys(routerValues).includes(item.name)) {
        routes.splice(i, 1)
      } else if (item.children?.length) {
        getFilterRoutes(item.children)
      }
    }
  }
  let purviewRoutes = cloneDeep(constantRoutes)
  purviewRoutes.forEach(item => {
    if (item.path === '/') {
      if (item.children?.length) {
        getFilterRoutes(item.children)
      }
    }
  })
  // 在权限路由里 设置重定向/title/promiseBtns
  const formatPurviewRoutes = routes => {
    routes.forEach(item => {
      const menu = getItemById(menus, item.name, 'router')
      if (item.meta) {
        item.meta.title = routerValues[item.name]
        item.meta.promiseBtns = menu.promiseBtns
      } else {
        item.meta = {
          title: routerValues[item.name],
          promiseBtns: menu.promiseBtns
        }
      }
      if (item.children && item.children.length) {
        // 重定向到menus该级的第一个有权限的子级
        const purviewNames = item.children.map(({ name }) => name)
        const menuFirstChild = menu.children.find(({ router }) => purviewNames.includes(router)) || {}
        // 再从purview找到path
        console.log(menuFirstChild, 'firstChild')
        const redirectPath = (item.children.find(({ name }) => name === menuFirstChild.router) || {}).path
        item.redirect = redirectPath
        formatPurviewRoutes(item.children)
      }
    })
  }
  purviewRoutes.forEach(item => {
    if (item.path === '/') {
      if (item.children?.length) {
        // 根路径重定向到有权限的
        const purviewNames = item.children.map(({ name }) => name)
        const menuFirst = menus.find(({ router }) => purviewNames.includes(router)) || {}
        const redirectPath = (item.children.find(({ name }) => name === menuFirst.router) || {}).path
        item.redirect = redirectPath
        formatPurviewRoutes(item.children)
      } else {
        item.redirect = '/notChild'
      }
    }
  })
  // 404页面放到动态路由中，防止页面刷新时，通过接口获取菜单权限时直接404
  purviewRoutes = [
    ...purviewRoutes,
    {
      path: '*',
      component: () => import('../views/error-page/404.vue')
    }
  ]
  console.log(purviewRoutes, 'purviewRoutes')
  router.options.routes = [...router.options.routes, ...purviewRoutes]
  router.addRoutes([...purviewRoutes])
}
export { addRoutes }
