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
            <div style="overflow: auto hidden;flex: 1">
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
      <component :is="dialogParams.dialogComponent" :params.sync="dialogParams.dialogParams" />
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
  data() {
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
  mounted() {
    this.REG_ON_EVT(this._uid, this.EVT_ENUM.FW_SHOW_DIALOG, this.openDialogInFW)
    this.REG_ON_EVT(this._uid, this.EVT_ENUM.FW_CLOSE_DIALOG, this.closeDialogInFW)
  },
  beforeDestroy() {
    console.log('beforeDestroy', this)
    this.REG_OFF_EVT(this._uid)
  },
  methods: {
    closeDialogInFW() {
      console.log('closeDialogInFW')
      this.dialogParams.dialogComponent = null
      this.dialogParams.dialogVisible = false
    },
    openDialogInFW({ title, component, params }) {
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

.warning {
  color: red !important;
  animation: blink 1s linear infinite;
}

.seamless-warp {
  overflow: hidden;
  width: 570px;
  height: 25px;
  line-height: 25px;
  ul.item {
    width: 600px;
    li {
      float: left;
      margin-right: 10px;
    }
  }
}

.monitor-header {
  width: 100%;
  height: 70px;
  background: #ffffff;
  border-radius: 15px;
  margin-bottom: 25px;
  margin-right: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .have-alarm {
    border: none !important;
    background-color: #fff2f4;
    color: #ff0037 !important;
  }
  .monitor-alarm {
    width: 660px;
    height: 40px;
    border: 1px solid #d0d2d3;
    border-radius: 10px;
    margin-left: 4px;
    font-size: 14px;
    font-family: AlibabaPuHuiTi, AlibabaPuHuiTi-Regular;
    font-weight: 400;
    text-align: left;
    color: #2b3b45;
    letter-spacing: 1px;
    i {
      opacity: 0.5;
    }
  }
  .current-time {
    width: 300px;
    height: 40px;
    background: #f5f5f7;
    border-radius: 10px;
    margin-left: 20px;
    font-family: AlibabaPuHuiTi, AlibabaPuHuiTi-Regular;
    font-weight: 400;
    color: #2b3b45;
    letter-spacing: 1px;
    margin-right: 24px;
  }
  .alarm-number {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    font-size: 22px;
    font-family: BebasNeue;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 27px;
    background: #ff0037;
  }
  .monitor-link {
    width: 36px;
    height: 36px;
    background: #0084ff;
    border-radius: 6px;
    color: white;
    font-size: 20px;
  }
}

.content-layout {
  min-height: 280px;
  overflow: auto;
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  > div {
    width: 100%;
  }
}

.layout {
  width: 100%;
  height: 100%;
  .header-layout {
    background: #fff;
    padding: 0 50px 0 34px;
    height: 70px;
  }
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  padding: 10px 30px 0;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
