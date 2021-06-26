<template>
  <div ref="chart"></div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  name: 'bar',
  components: {},
  props: {
    // 图表选项
    option: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    loading: {
      type: Boolean,
      required: false
    },
    // 大数据
    appendData: {
      type: [Array, Object],
      required: false
    },
    isClearChart: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      chart: null
    }
  },
  computed: {},
  watch: {
    // 监听图表数据加载完成
    loading: {
      immediate: false,
      handler (loading) {
        if (!loading) {
          this.chartHideLoading()
          this.renderChart()
        } else {
          this.chartShowLoading()
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    renderChart (seriesIndex = 0) {
      const startTime = Date.now()
      console.log(this.option, 'this.option')
      console.log('开始')
      this.isClearChart && this.chart.clear() // 清空画布: 不清空可能导致绘制前会闪烁前一次的画布，但是清空了则会少一些动画
      this.chart.setOption(Object.assign(this.option))
      // 大数据优化渲染
      if (this.appendData) {
        if (Array.isArray(this.appendData)) {
          // 单曲线
          this.chart.appendData({
            seriesIndex,
            data: this.appendData
          })
        } else {
          // 多曲线
          Object.entries(this.appendData).forEach(([index, data]) => {
            this.chart.appendData({
              seriesIndex: ~~index,
              data
            })
          })
        }
      }
      // this.chart.resize(); // echarts版本 5.0.2版本 setOption后调用resize不会出现动画
      console.log((Date.now() - startTime) / 1000, '用时')
    },
    // 初始化
    init () {
      // 实例化图表
      this.chart = echarts.init(this.$refs.chart)
      this.chartShowLoading()
      // 响应屏幕变化
      addEventListener('resize', this.resize)
    },
    // 图表加载中
    chartShowLoading () {
      // 5.0.2版本 ---> 防止loading中, tooltip出现
      const chartBox = document.getElementsByClassName('chart-box')[0]
      chartBox && (chartBox.firstChild.style.zIndex = 2)
      // 等待加载
      this.chart.showLoading({
        text: '正在加载...',
        color: '#0084FF',
        textColor: '#333333',
        maskColor: '#ffffff',
        zlevel: 0
      })
    },
    chartHideLoading () {
      const chartBox = document.getElementsByClassName('chart-box')[0]
      chartBox && (chartBox.firstChild.style.zIndex = 1)
      this.chart.hideLoading()
    },
    // 响应宽度变化
    resize () {
      this.chart.resize()
    }
  },
  beforeDestroy () {
    console.log('beforeDestroy')
    this.chart.dispose()
    removeEventListener('resize', this.resize)
  }
}
</script>
<style lang="scss"></style>
