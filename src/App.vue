<template>
  <div id="app">
    <a-config-provider :locale="zhCN" :getPopupContainer="getPopupContainer" :transformCellText="transformCellText"
      ><router-view></router-view
    ></a-config-provider>
  </div>
</template>

<script>
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { getStorage } from '@/utils/storage/localStorage.js'
export default {
  name: 'App',
  components: {
    AConfigProvider: ConfigProvider
  },
  data () {
    return {
      zhCN,
      transformCellText: ({ text }) => {
        if (typeof text === 'string') {
          text = text.trim() ? text : ''
        }
        return text === 0 ? 0 : text || '-'
      },
      getPopupContainer: node => {
        if (node && node.classList.contains('dropdown-render-parent')) {
          return node.parentNode
        }
        return document.body
      }
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        const loadDom = document.getElementById('initLoading')
        loadDom && loadDom.remove()
      },
      // 深度观察监听
      deep: true,
      immediate: false
    }
  },
  methods: {
    getUserInfo () {
      const { userInfo } = this
      if ((!userInfo || !Object.keys(userInfo).length) && window.location.hash !== '#/login' && getStorage('token')) {
        console.log('获取userInfo', getStorage('currUserRole'), window.location.hash)
        this.$apiReq.user.getUserInfo()
      }
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang="scss">
@import '~@/assets/styles/main';
#app {
  width: 100%;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
