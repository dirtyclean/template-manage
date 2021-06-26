<template>
  <a-form-model
    :model="form"
    ref="form"
    :labelCol="{ span: 4 }"
    :wrapperCol="{ span: 18 }"
    :rules="rules"
    :colon="false"
    labelAlign="right"
  >
    <a-row :gutter="10">
      <a-col :span="24" class="mb16">
        <a-form-model-item label="操作人" prop="operator">
          <a-input placeholder="请输入操作人" v-model.trim="form.operator" allowClear />
        </a-form-model-item>
      </a-col>
      <a-col :span="24">
        <a-button type="primary" class="fr" @click="handleOk" :loading="confirmLoading">确定</a-button>
      </a-col>
    </a-row>
  </a-form-model>
</template>
<script>
import { Button, Input, Row, Col, FormModel } from 'ant-design-vue'
export default {
  data() {
    let operator = ''
    const userInfo = this.userInfo
    if (userInfo) {
      operator = userInfo.realName || userInfo.userName
    }
    return {
      confirmLoading: false,
      form: {
        operator
      },
      rules: {
        operator: [
          {
            required: true,
            trigger: 'change',
            message: '请输入操作人'
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
    ACol: Col
  },
  props: {
    params: {
      required: true,
      type: [Object]
    }
  },
  beforeDestroy() {
    this.$refs.form && this.$refs.form.resetFields()
  },
  mounted() {
    this.beforeShowModal()
  },
  methods: {
    beforeShowModal() {},
    async handleOk() {
      this.confirmLoading = true
      this.$refs.form.validate(async valid => {
        console.log(valid, 'valid')
        if (valid) {
          const saveFunctionKey = 'save'
          this[saveFunctionKey]()
            .then(() => {
              this.$message.success('操作成功')
              this.RAISE_EVT(this.EVT_ENUM.FW_CLOSE_DIALOG)
              this.params.updateData()
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
    }
  }
}
</script>
<style scoped></style>
