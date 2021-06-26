<template>
  <a-modal
    title="修改密码"
    :visible="isShowModal"
    width="40%"
    :footer="null"
    dialogClass="custom-modal"
    :closable="!isInitPassword && !isResetPassword"
    :keyboard="false"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-form-model
      :model="form"
      ref="form"
      :labelCol="{ span: 3 }"
      :wrapperCol="{ span: 21 }"
      :rules="rules"
      :colon="false"
    >
      <a-row :gutter="10">
        <a-col :span="24" class="mb16" v-if="isInitPassword">
          <a-form-model-item label="" :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
            <a-alert message="您的密码为初始密码，请修改密码！" banner />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" class="mb16" v-if="isResetPassword">
          <a-form-model-item label="" :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
            <a-alert message="您的密码为重置密码，请修改密码！" banner />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" class="mb16">
          <a-form-model-item label="用户名" prop="username">
            <a-input
              :disabled="true"
              autoComplete="off"
              placeholder="请输入用户名"
              v-model.trim="form.username"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" class="mb16">
          <a-form-model-item label="原密码" prop="password">
            <a-input-password
              autoComplete="new-password"
              placeholder="请输入原密码"
              v-model.trim="form.password"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" class="mb16">
          <a-form-model-item label="新密码" prop="newPassword">
            <a-input-password
              autoComplete="new-password"
              placeholder="请输入新密码"
              v-model.trim="form.newPassword"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" class="mb16">
          <a-form-model-item label="确认密码" prop="surePassword">
            <a-input-password
              autoComplete="new-password"
              placeholder="请再次输入密码"
              v-model.trim="form.surePassword"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-button type="primary" class="fr" @click="handleOk" :loading="confirmLoading">确定</a-button>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>
<script>
import { Button, Input, Row, Col, Modal, FormModel, Alert } from 'ant-design-vue'
import { passwordIsPass } from '@/utils/validation'
export default {
  data () {
    let username = ''
    const userInfo = this.userInfo
    if (userInfo) {
      username = userInfo.userName
    }
    return {
      confirmLoading: false,
      form: {
        username,
        password: '',
        newPassword: '',
        surePassword: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        surePassword: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('请再次输入新密码'))
              }
              if (value !== this.form.newPassword) {
                return callback(new Error('两次密码不匹配'))
              }
              return callback()
            }
          }
        ],
        newPassword: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            required: true,
            message: '密码长度6-16位',
            trigger: 'blur',
            min: 6,
            max: 16
          },
          {
            trigger: 'blur',
            validator: (rule, newPassword, callback) => {
              if (newPassword === this.form.password) {
                return callback(new Error('新密码不能与原密码相同'))
              }
              // 和后端保持一致
              if (!passwordIsPass(newPassword)) {
                return callback(new Error('请包含大小写字母、数字、特殊字符'))
              }
              return callback()
            }
          }
        ]
      }
    }
  },
  components: {
    AButton: Button,
    AFormModelItem: FormModel.Item,
    AFormModel: FormModel,
    AInput: Input,
    ARow: Row,
    ACol: Col,
    AModal: Modal,
    AInputPassword: Input.Password,
    AAlert: Alert
  },
  props: {
    isShowModal: {
      required: true,
      type: Boolean
    },
    isInitPassword: {
      required: false,
      type: Boolean
    },
    isResetPassword: {
      required: false,
      type: Boolean
    }
  },
  watch: {
    isShowModal: {
      immediate: true,
      handler: function (isShowModal) {
        if (isShowModal) {
          this.beforeShowModal()
        } else {
          this.$refs.form && this.$refs.form.resetFields()
        }
      }
    }
  },
  beforeDestroy () {
    this.$refs.form && this.$refs.form.resetFields()
  },
  methods: {
    beforeShowModal () {},
    async save () {
      const { password, newPassword, surePassword } = this.form
      await this.$apiReq.user.changePassword({
        password,
        newPassword,
        surePassword
      })
    },
    async handleOk () {
      this.confirmLoading = true
      this.$refs.form.validate(async valid => {
        console.log(valid, 'valid')
        if (valid) {
          this.save()
            .then(() => {
              this.$emit('update:isShowModal', false)
              this.$emit('update:isInitPassword', false)
              this.$emit('update:isResetPassword', false)
              const userInfo = this.userInfo
              if (userInfo) {
                this.setUserInfo(
                  Object.assign(userInfo, {
                    isResetPassword: false
                  })
                )
              }
              // 重新登陆
              this.$notification.success({
                message: '操作成功',
                description: '请重新登陆'
              })
              this.$router.push('/login')
            })
            .catch(e => {
              console.log(e)
            })
            .finally(() => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
          return false
        }
      })
    },
    handleCancel () {
      this.$emit('update:isShowModal', false)
    }
  }
}
</script>
<style scoped></style>
