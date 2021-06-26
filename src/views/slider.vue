<template>
    <a-menu
        theme="light"
        mode="inline"
        :selectedKeys="selectedKeys"
        :defaultOpenKeys="defaultOpenKeys"
        @openChange="onOpenChange"
        :open-keys="openKeys"
        @click="menuClick"
    >
        <template v-for="menu in menus">
            <a-sub-menu v-if="menu.children && menu.children.length > 0" :key="menu.router">
                <span slot="title" class="p-title">
                    <a-icon :component="getIcon(menu.router)"></a-icon>
                    <span>{{ menu.label }}</span>
                </span>
                <template v-for="child in menu.children">
                    <a-menu-item :key="child.router">
                        <span>{{ child.label }}</span>
                    </a-menu-item>
                </template>
            </a-sub-menu>
            <a-menu-item v-else :key="menu.router">
                <span class="p-title">
                    <a-icon :component="getIcon(menu.router)"></a-icon>
                    <span>{{ menu.label }}</span>
                </span>
            </a-menu-item>
        </template>
    </a-menu>
</template>

<script>
import { Menu, Icon } from 'ant-design-vue'
import { getItemById } from '@/utils/methods'
const { SubMenu } = Menu
export default {
  name: 'slider',
  components: {
    AMenu: Menu,
    ASubMenu: SubMenu,
    AMenuItem: Menu.Item,
    AIcon: Icon
  },
  data () {
    const userInfo = this.userInfo
    let menus = []
    if (userInfo) {
      menus = userInfo.menus
    }
    return {
      selectedKeys: [],
      defaultOpenKeys: [],
      openKeys: [],
      menus,
      getItemById
    }
  },
  mounted () {
    this.selectedKeys = this.$route.path.split('/').filter(key => key)
    this.openKeys = this.selectedKeys.slice(0, 1)
  },
  computed: {},
  watch: {
    $route () {
      this.selectedKeys = this.$route.path.split('/').filter(key => key)
    }
  },
  methods: {
    getIcon (router) {
      const item = getItemById(this.$router.options.routes, router, 'name')
      if (item && item.meta) {
        return item.meta.icon
      }
    },
    onOpenChange (openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      this.rootSubmenuKeys = this.menus.map(({ router }) => router)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    menuClick ({ keyPath, key }) {
      console.log(keyPath, key)
      this.selectedKeys = keyPath
      this.$router.push({
        path: `/${keyPath.reverse().join('/')}`
      }) // name方式不会去404
    }
  }
}
</script>

<style scoped lang="scss"></style>
