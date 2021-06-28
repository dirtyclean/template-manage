<template>
  <div style="height: 100%">
    <a-layout class="layout" id="components-layout-demo-custom-trigger">
      <a-layout-header class="header-layout">
        <self-header></self-header>
      </a-layout-header>
      <a-layout style="padding:25px">
        <a-layout-sider :trigger="null" collapsible class="custom-sider" style="background: #fff;min-width:13%;">
          <self-slider></self-slider>
        </a-layout-sider>
        <a-layout>
          <a-layout-content class="content-layout">
            <breadcrumb :title="$route.meta.title"></breadcrumb>
            <div style="flex: 1;overflow: auto hidden">
              <router-view></router-view>
            </div>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
    <a-modal
      :title="dialogParams.dialogTitle"
      :destroyOnClose="true"
      :visible="dialogParams.dialogVisible"
      @cancel="closeDialogInFW"
      :maskClosable="false"
      :footer="null"
      :width="dialogParams.width"
      :dialogClass="dialogParams.dialogClass"
    >
      <component :is="dialogParams.dialogComponent" v-bind.sync="dialogParams.dialogParams" />
    </a-modal>
  </div>
</template>
<script>
import SelfHeader from './header'
import SelfSlider from './slider'
import { Layout, Modal } from 'ant-design-vue'
import breadcrumb from '@/components/breadcrumb'
const { Header, Sider, Content } = Layout
export default {
  components: {
    SelfHeader,
    SelfSlider,
    ALayout: Layout,
    ALayoutHeader: Header,
    ALayoutSider: Sider,
    ALayoutContent: Content,
    breadcrumb,
    AModal: Modal
  },
  data () {
    return {
      dialogParams: {
        dialogTitle: '框架弹窗',
        dialogVisible: false,
        dialogComponent: null,
        dialogParams: null,
        width: '40%',
        dialogClass: 'custom-modal'
      }
    }
  },
  mounted () {
    this.REG_ON_EVT(this._uid, this.EVT_ENUM.FW_SHOW_DIALOG, this.openDialogInFW)
    this.REG_ON_EVT(this._uid, this.EVT_ENUM.FW_CLOSE_DIALOG, this.closeDialogInFW)
  },
  beforeDestroy () {
    console.log('beforeDestroy', this)
    this.REG_OFF_EVT(this._uid)
  },
  methods: {
    closeDialogInFW () {
      console.log('closeDialogInFW')
      this.dialogParams.dialogComponent = null
      this.dialogParams.dialogVisible = false
    },
    openDialogInFW ({ title, component, params }) {
      console.log('openDialogInFW')
      this.dialogParams.dialogTitle = title
      this.dialogParams.dialogParams = params
      this.dialogParams.dialogComponent = component
      this.dialogParams.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
@keyframes blink {
  0% {
    opacity: 1;
  }
  30% {
    opacity: 0.7;
  }
  100% {
    opacity: 0;
  }
}

.content-layout {
  display: flex;
  flex-direction: column;
  padding-left: 30px;
  > div {
    width: 100%;
  }
}

.layout {
  height: 100%;
  width: 100%;
  .header-layout {
    background: #fff;
    padding: 0 50px 0 34px;
  }
}

#components-layout-demo-custom-trigger .trigger {
  cursor: pointer;
  font-size: 18px;
  padding: 10px 30px 0;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  background: rgba(255, 255, 255, 0.2);
  height: 32px;
  margin: 16px;
}
</style>
