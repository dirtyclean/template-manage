<template>
  <div class="error-page">
    <div class="error-code">
      4
      <span>0</span>
      4
    </div>
    <div class="error-desc">啊哦~ 你所访问的页面不存在子页面，请联系管理员授权</div>
    <div class="error-handle">
      <a-button class="error-btn" type="primary" size="large" @click="goBack">返回上一页</a-button>
    </div>
  </div>
</template>
<script>
import { Button } from 'ant-design-vue'
export default {
  components: {
    AButton: Button
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.error-page {
  align-items: center;
  background: #f3f3f3;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  width: 100%;
}

.error-code {
  color: #2d8cf0;
  font-size: 250px;
  font-weight: bolder;
  line-height: 1;
}

.error-code span {
  color: #00a854;
}

.error-desc {
  color: #777;
  font-size: 30px;
}

.error-handle {
  margin-top: 30px;
  padding-bottom: 200px;
}

.error-btn {
  margin-left: 100px;
}
</style>
