<template>
  <div class="content">
    <div class="main">
      <div class="hBox vh-items-center vh-content-center" style="margin-bottom:15%;">
        <img src="../assets/img/png/logo.png" height="62" width="50" />
        <div class="ml20 mt20 psr tljustify">
          <div class="logo-title mb15">
            XXX系统
          </div>
          <div class="sub-title"></div>
        </div>
      </div>
      <a-form id="formLogin" ref="formLogin" class="user-layout-login" :form="form" @submit="handleSubmit">
        <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder="账户"
            allowClear
            v-decorator="[
              'username',
              {
                initialValue: username,
                rules: [{ required: true, message: '请输入帐户名' }],
                validateTrigger: 'blur'
              }
            ]"
          >
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            size="large"
            allowClear
            placeholder="密码"
            v-decorator="[
              'password',
              {
                initialValue: password,
                rules: [{ required: true, message: '请输入密码' }],
                validateTrigger: 'blur'
              }
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input-password>
        </a-form-item>
        <!-- 智能验证 start -->
        <verify @loaded="startVerify" />
        <a-form-item>
          <div id="sc" style="margin:0;width:100%;"></div>
        </a-form-item>
        <!-- 智能验证 end -->
        <a-form-item>
          <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked', initialValue: rememberMe }]">
            记住账号
          </a-checkbox>
          <a-popover title="" placement="rightTop">
            <template slot="content">
              <img src="../assets/img/png/logo.png" />
            </template>
            <a-button type="link" class="fr">
              下载App
            </a-button>
          </a-popover>
        </a-form-item>
        <a-form-item style="margin-top:24px">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="login-btn"
            :loading="state.loginBtn"
            :disabled="state.loginBtn"
          >
            确定
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="beian">
      <div class="mb10">主办方：XXX</div>
      <div class="mb10">承建方：XXX&emsp;XXX</div>
    </div>
  </div>
</template>

<script>
import { Button, Form, Input, Icon, Checkbox, notification, Popover } from 'ant-design-vue'
import { getStorage, setStorage, removeStorage, clearStorage } from '@/utils/storage/localStorage.js'
export default {
  components: {
    AButton: Button,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    AIcon: Icon,
    ACheckbox: Checkbox,
    AInputPassword: Input.Password,
    APopover: Popover,
    verify: {
      render (createElement) {
        const self = this
        return createElement('script', {
          attrs: {
            type: 'text/javascript',
            src: 'https://g.alicdn.com/AWSC/AWSC/awsc.js'
          },
          on: {
            load () {
              self.$emit('loaded')
            }
          }
        })
      }
    }
  },
  data () {
    clearStorage()
    return {
      loginBtn: false,
      loginType: 0,
      username: getStorage('username') || '',
      password: getStorage('password') || '',
      rememberMe: getStorage('rememberMe') === 'true' || false,
      isLoginError: false,
      errorMessage: '',
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        smsSendBtn: false
      },
      verifyData: {}
    }
  },
  created () {},
  mounted () {},
  methods: {
    startVerify () {
      /* global AWSC */
      // 实例化ic对象
      AWSC.use('ic', (state, module) => {
        console.log(state, module)
        // 初始化
        window.ic = module.init({
          // 应用类型标识。它和使用场景标识（scene字段）一起决定了智能验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
          appkey: 'FFFF0N0N000000009449',
          // 使用场景标识。它和应用类型标识（appkey字段）一起决定了智能验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的scene值，请务必正确填写。
          scene: 'ic_login',
          // 声明智能验证需要渲染的目标元素ID。
          renderTo: 'sc',
          // 验证通过时会触发该回调参数。您可以在该回调参数中将会话ID（sessionId）、签名串（sig）、请求唯一标识（token）字段记录下来，随业务请求一同发送至您的服务端调用验签。
          success: data => {
            window.console && console.log(data.sessionId)
            window.console && console.log(data.sig)
            window.console && console.log(data.token)
            const { sessionId, sig, token } = data
            this.verifyData = {
              scene: 'ic_login',
              sessionId,
              sig,
              token
            }
          },
          width: '100%',
          // 验证失败时触发该回调参数
          fail: failCode => {
            console.log(failCode)
          },
          // 验证码加载异常时触发该回调参数
          error: function (errorCode) {
            console.log(errorCode)
          }
          // 该配置项为测试项 在仅用来测试验证码不同状态时使用。上线时请将其删除. 智能验证test配置项有4种不同的值对应不同的验证码状态，具体请参考文中参数定义说明部分。
          // test: module.TEST_PASS, // 测试智能验证通过
          // test: module.TEST_BLOCK, // 测试智能验证失败
          // test: module.TEST_NC_PASS, // 唤醒滑动验证并验证通过
          // test: module.TEST_NC_BLOCK, // 唤醒滑动验证并验证失败
        })
      })
    },
    async login (data) {
      const { token } = await this.$apiReq.login(data)
      setStorage('token', token)
      return await this.$apiReq.getUserInfo()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state
      } = this
      state.loginBtn = true
      const validateFieldsKey = ['username', 'password', 'rememberMe']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          if (!Object.keys(this.verifyData).length) {
            state.loginBtn = false
            this.$message.warning('未进行智能验证')
            return
          }
          console.log('login form', values)
          const loginParams = {}
          loginParams.password = values.password
          loginParams.account = values.username
          if (values.rememberMe) {
            setStorage('rememberMe', true)
            setStorage('username', values.username)
            setStorage('password', values.password)
          } else {
            removeStorage('rememberMe')
            removeStorage('username')
            removeStorage('password')
          }
          this.login({
            ...loginParams,
            ...this.verifyData
          })
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
              this.resetVerify()
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess (res) {
      res = res || {}
      const { menus } = res
      if (!menus || !menus.length) {
        this.$message.warning('您无任何权限, 请联系管理员!!')
        this.isLoginError = false
        return
      }
      this.$router.push({
        path: '/'
      })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        notification.success({
          message: '欢迎',
          description: '欢迎回来'
        })
      }, 1000)
      this.isLoginError = false
    },
    resetVerify () {
      window.ic.reset() // 将智能验证重置为初始状态
      this.verifyData = {}
    },
    requestFailed (err) {
      console.log(err, 'err')
      this.isLoginError = true
      this.errorMessage = ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试'
      notification.error({
        message: '错误',
        description: this.errorMessage,
        duration: 4
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.sm-pop {
  border: none !important;
}
/* stylelint-disable-next-line */
/deep/.nc-container .nc_wrapper {
  width: 96% !important;
}
/deep/.rect-top {
  height: 42px !important;
}
/deep/.sm-btn-fail .rect-bottom::after {
  border-bottom: 1px solid #f55742;
}
/deep/.sm-btn-success .rect-bottom::after {
  border-bottom: 1px solid #00de76;
}
/deep/.sm-btn-success .rect-bottom::after,
/deep/.sm-btn-fail .rect-bottom::after {
  height: 42px;
  width: 100%;
}
/deep/.sm-btn-success .rect-top::before,
/deep/.sm-btn-fail .rect-top::before {
  height: 100%;
}
/deep/.sm-btn-success .rect-top::after,
/deep/.sm-btn-fail .rect-top::after {
  right: unset;
}
/deep/#rectMask {
  width: calc(100% + 1px) !important;
}
.logo-title {
  color: #162146;
  font-family: AlibabaPuHuiTi, AlibabaPuHuiTi-Heavy, sans-serif;
  font-size: 28px;
  font-weight: 800;
  height: 22px;
  letter-spacing: 3px;
  line-height: 22px;
  text-align: left;
  span {
    font-family: AlibabaPuHuiTi-Medium, sans-serif;
  }
}
.sub-title {
  color: #162146;
  font-size: 20px;
  font-weight: 600;
  height: 9px;
  letter-spacing: 0;
  line-height: 9px;
  text-align: left;
  transform: scale(0.5) translate(-50%, 0);
  width: 200%;
}

.beian {
  bottom: 18%;
  color: #1e407f;
  font-size: 16px;
  font-weight: 400;
  height: 16px;
  line-height: 16px;
  position: absolute;
  text-align: center;
  width: 100%;
}

.content {
  background: url('../assets/img/png/login-bg.png') no-repeat bottom / contain #f5f7fd;
  position: relative;
}

.main {
  background: white;
  border-radius: 30px;
  left: 50%;
  padding: 4% 100px;
  position: absolute;
  top: 45%;
  transform: translate(-50%, -50%);
  width: 700px;
  .logo {
    display: block;
    margin: auto auto 40px;
  }
}

.user-layout-login {
  label {
    font-size: 14px;
  }

  button .login-btn {
    font-size: 16px;
    height: 40px;
    padding: 0 15px;
    width: 100%;
  }
}
</style>
