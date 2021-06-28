<template>
  <div class="error-page">
    <div class="error-code">
      4
      <span>0</span>
      3
    </div>
    <div class="error-desc">啊哦~ 你无该页面的访问权限</div>
    <div class="error-handle">
      <a-button class="error-btn" type="primary" size="large" @click="$router.go(-3)">返回上一页</a-button>
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
      this.$router.go(-2)
    }
  },
  mounted () {
    // 触发浏览器默认返回事件，vue-seamless-scroll会报错，这里我们自己定义返回
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.goBack, false)
    }
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.goBack, false)
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
