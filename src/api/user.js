import req from '@/utils/request.js'
import { sortMinToNull, getTreeData } from '../utils/methods'
import { addRoutes } from '@/router/permission'
import Vue from 'vue'
const menus = [
  {
    label: 'template',
    router: 'template',
    children: [
      {
        router: 'template:del'
      },
      {
        router: 'template:add'
      },
      {
        router: 'template:edit'
      }
    ]
  },
  {
    label: 'system',
    router: 'system',
    children: [
      {
        router: 'menu',
        label: 'menu'
      },
      {
        router: 'user',
        label: 'user'
      },
      {
        router: 'role',
        label: 'role'
      },
      {
        router: 'version',
        label: 'version'
      }
    ]
  }
]
const sortMenu = data => {
  const sort = list => {
    list = sortMinToNull(list)
    list.forEach(item => {
      if (item.children?.length) {
        sort(item.children)
      }
    })
  }
  sort(data)
  return data
}
const setPromiseBtns = data => {
  const find = (list, parent) => {
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i]
      if (parent && item.router.includes(':')) {
        if (parent.promiseBtns) {
          parent.promiseBtns.push(item.router.split(':')[1])
        } else {
          parent.promiseBtns = [item.router.split(':')[1]]
        }
        list.splice(i, 1)
      }
      if (item.children?.length) {
        find(item.children, item)
      }
    }
  }
  find(data)
  return data
}
const login = ({ password, account, scene, sessionId, sig, token }) => {
  return req.post(
    '/login',
    {
      password,
      account,
      scene,
      sessionId,
      sig,
      token
    },
    true
  )
}
const getUserHavePromiseMenus = async () => {
  return await req.get('/user/users/queryPermission', {}).then(({ menus, configs }) => {
    return {
      menus: sortMenu(getTreeData(menus || [], 'id', 'permissionPid')),
      configs: sortMenu(getTreeData(configs || [], 'id', 'permissionPid'))
    }
  })
}
const changePassword = ({ surePassword: confirmPassword, newPassword, password: oldPassword }) => {
  return req.post('/user/users/password', {
    confirmPassword,
    newPassword,
    oldPassword
  })
}
const checkPassword = () => {
  return req.get('/user/users/checkPassword', {})
}
const getUserInfo = async () => {
  return await req
    .get('/user/users/getUserInfo', {})
    .then(res => {
      const { realName, userId, userName, isProvince, isResetPassword, areaId, areaCode } = res
      const menus = getTreeData(res.menus || [], 'id', 'permissionPid')
      res.menus = sortMenu(setPromiseBtns(menus))
      res.roleLevels = res.roleLevels
        ? Object.entries(res.roleLevels)
          .map(([value, name]) => ({ value: ~~value, name }))
          .filter(({ name }) => name)
        : []
      Vue.prototype.setUserInfo({
        realName,
        userId,
        userName,
        isProvince,
        isResetPassword,
        areaId, // 权限判断
        menus: res.menus,
        roleLevels: res.roleLevels,
        areaCode
      })
      addRoutes({ menus: res.menus })
      console.log(res.menus, 'res.menus', Vue.prototype)
      return res
    })
    .catch(() => {
      console.log('catch')
      if (process.env.NODE_ENV !== 'production') {
        addRoutes({ menus: sortMenu(setPromiseBtns(menus)) })
      }
      Vue.prototype.setUserInfo({ menus: sortMenu(setPromiseBtns(menus)) })
      return {}
    })
}
export default {
  user: {
    login,
    changePassword,
    checkPassword,
    getUserHavePromiseMenus,
    getUserInfo
  },
  getList: () => {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve({
          list: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
          rowCount: 10
        })
      }, 2000)
    })
  },
  del: async () => {
    return true
  }
}
