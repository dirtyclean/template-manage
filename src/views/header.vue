<template>
  <div class="content h-between-center">
    <div class="h-box vh-items-center vh-grow">
      <img src="../assets/img/png/logo.png" height="62" width="50" />
      <div class="ml20 psr">
        <div class="logo-title mb6">
          XXXX系统
        </div>
        <!-- <div class="sub-title">Forest Fire Prevention</div> -->
      </div>
    </div>
    <div class="h-box vh-items-center">
      <a-select
        v-if="false"
        v-model="userRole"
        @change="switchRole"
        class="mr20"
        placeholder="选择角色"
        style="width: 200px"
        title="角色切换"
      >
        <a-select-option value="lucy1">
          Lucy1
        </a-select-option>
        <a-select-option value="lucy2">
          Lucy2
        </a-select-option>
      </a-select>
      <div class="admin-name mr12">
        {{ name }}
      </div>
      <a-dropdown placement="bottomLeft">
        <div class="avatar h-box vh-items-center vh-content-center mr10"></div>
        <a-menu slot="overlay" @click="menuClick">
          <a-menu-item key="modification">
            <div class="menu-item-content">
              <a-icon :component="passwordChangeIcon" class="menu-item-icon" />
              密码修改
            </div>
          </a-menu-item>
          <a-menu-item key="logout">
            <div class="menu-item-content">
              <a-icon :component="returnLoginIcon" class="menu-item-icon" />
              退出登录
            </div>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <changePasswordModal
      v-if="isOpenChangePasswordModal"
      :isShowModal.sync="isOpenChangePasswordModal"
      :isInitPassword.sync="isInitPassword"
      :isResetPassword.sync="isResetPassword"
    />
  </div>
</template>

<script>
import passwordChangeIcon from '../assets/img/svg/password-change.svg'
import changePasswordModal from './system/userPasswordChange'
import returnLoginIcon from '../assets/img/svg/return-login.svg'
import { Menu, Icon, Dropdown, Select } from 'ant-design-vue'
import { setStorage, getStorage } from '@/utils/storage/localStorage'
export default {
  name: 'SelfHeader',
  components: {
    AIcon: Icon,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    ADropdown: Dropdown,
    changePasswordModal,
    ASelect: Select,
    ASelectOption: Select.Option
  },
  data () {
    let isResetPassword
    let name = ''
    const userInfo = this.userInfo
    if (userInfo) {
      isResetPassword = userInfo.isResetPassword
      name = userInfo.realName || userInfo.userName
    }
    return {
      passwordChangeIcon,
      returnLoginIcon,
      isOpenChangePasswordModal: false,
      isResetPassword,
      isInitPassword: undefined,
      name,
      userRole: getStorage('currUserRole') || undefined // 用户角色
    }
  },
  created () {
    this.checkPassword()
  },
  methods: {
    switchRole () {
      setStorage('currUserRole', this.userRole)
      this.$router.go(0)
    },
    checkPassword () {
      this.$apiReq.user
        .checkPassword()
        .then(isNoChangePassword => {
          this.isInitPassword = !isNoChangePassword
        })
        .finally(() => {
          if (this.isInitPassword || this.isResetPassword) {
            this.isOpenChangePasswordModal = true
          }
        })
    },
    menuClick ({ key }) {
      if (key === 'modification') {
        this.isOpenChangePasswordModal = true
      } else if (key === 'logout') {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.logo-title {
  height: 22px;
  color: #162146;
  font-weight: 800;
  font-size: 18px;
  font-family: AlibabaPuHuiTi, AlibabaPuHuiTi-Heavy, sans-serif;
  line-height: 22px;
  letter-spacing: 3px;
  text-align: left;
  span {
    font-family: AlibabaPuHuiTi-Medium, sans-serif;
  }
}

.sub-title {
  height: 9px;
  color: #162146;
  font-weight: 600;
  font-size: 14px;
  line-height: 9px;
  letter-spacing: 0;
  text-align: left;
  transform: scale(0.5) translate(-50%, 0);
}

.admin-name {
  height: 14px;
  color: #0d1722;
  font-weight: 500;
  font-size: 14px;
  font-family: AlibabaPuHuiTi, AlibabaPuHuiTi-Medium, sans-serif;
  line-height: 14px;
  letter-spacing: 1px;
  text-align: left;
}

.avatar {
  width: 41px;
  height: 43px;
  background-color: #8490b5;
  background-image: url('../assets/img/png/avatar.png');
  border-radius: 10px;
}

.drop-down-link {
  color: #0d1722;
  font-weight: 500;
  font-size: 14px;
  font-family: AlibabaPuHuiTi, AlibabaPuHuiTi-Medium, sans-serif;
  line-height: 14px;
  letter-spacing: 1px;
  text-align: left;
}
.menu-item-content {
  display: flex;
  align-items: center;
  margin: 10px 15px;
  .menu-item-icon {
    margin-right: 20px;
    font-size: 20px;
  }
}
</style>
