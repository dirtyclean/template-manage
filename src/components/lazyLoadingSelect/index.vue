<!--
  非异步懒加载数据
  通过search过滤数据，filterOption和optionFilterProp属性在这里无效
-->
<template>
    <a-select
        :placeholder="placeholder"
        :showSearch="showSearch"
        :optionFilterProp="optionFilterProp"
        :show-arrow="showArrow"
        @popupScroll="popupScroll"
        @change="change"
        @search="search"
        @dropdownVisibleChange="updateCurrOptions"
        :value="value"
        :dropdown-match-select-width="dropdownMatchSelectWidth"
        :option-label-prop="optionLabelProp"
        :filterOption="false"
        :allowClear="allowClear"
        :not-found-content="notFoundContent"
        :default-active-first-option="defaultActiveFirstOption"
        :open="open"
        :label-in-value="labelInValue"
    >
        <slot :currOptions="currOptions">
            <a-select-option
                v-for="(item, index) in currOptions"
                :key="index"
                :value="item[fieldNames.value]"
                :title="item[fieldNames.label]"
            >
                {{ item[fieldNames.label] }}
            </a-select-option>
        </slot>
    </a-select>
</template>
<script>
import { Select } from 'ant-design-vue'
function getCurrPaginationData (pageNo, pageSize, array) {
  const offset = (pageNo - 1) * pageSize
  return offset + pageSize >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + pageSize)
}

export default {
  components: {
    ASelect: Select,
    ASelectOption: Select.Option
  },
  data () {
    return {
      currOptions: [], // 当前渲染的数据
      searchName: '',
      pageNum: 1,
      dataSource: [], // 已知全部数据 定义dataSource是为了防止直接篡改options
      open: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 分页条数
    pageSize: {
      type: Number,
      default: 50,
      required: false
    },
    // 自定义过滤函数
    filterFuction: {
      type: Function,
      required: false,
      default: function (searchName) {
        return this.dataSource.filter(item => item[this.fieldNames.label].includes(searchName)) || []
      }
    },
    // 要渲染到下拉列表的全部数据
    options: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    // 自定义 options 中 label name 的字段
    fieldNames: {
      type: Object,
      required: false,
      default: () => {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    value: {
      type: [String, undefined],
      required: false,
      default: undefined
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    showSearch: {
      type: Boolean,
      required: false,
      default: false
    },
    optionFilterProp: {
      type: String,
      required: false,
      default: 'value'
    },
    showArrow: {
      type: Boolean,
      default: true,
      required: false
    },
    optionLabelProp: {
      type: String,
      required: false,
      default: 'children'
    },
    dropdownMatchSelectWidth: {
      type: Boolean,
      required: false,
      default: true
    },
    allowClear: {
      type: Boolean,
      required: false,
      default: false
    },
    notFoundContent: {
      type: String,
      required: false
    },
    // 搜索时 默认选中第一条数据
    defaultActiveFirstOption: {
      type: Boolean,
      required: false,
      default: false
    },
    labelInValue: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    options: {
      immediate: false,
      handler (options) {
        this.dataSource = options.map(item => ({ ...item }))
        this.pageNum = 1
        this.searchName = ''
        this.currOptions = options.map(item => ({ ...item }))
      }
    }
  },
  computed: {
    textValue () {
      if (typeof this.value === 'object') {
        return this.value[this.fieldNames.value]
      } else {
        return this.value
      }
    }
  },
  methods: {
    change (value, option) {
      this.$emit('change', value, option)
    },
    updateCurrOptions (isOpen) {
      console.log(isOpen, 'isOpen')
      this.searchName = '' // 因为选择器默认关闭下拉列表输入框的搜索内容会不见（所以我们把搜索值会置为空）
      if (isOpen) {
        // 不保留上一次结果 将下拉列表数据置为第一页数据（优化性能） 将已选中的置为第一条数据(使高亮)
        this.pageNum = 1
        const options = this.options.map(item => ({ ...item }))
        if (this.textValue) {
          const delIndex = options.findIndex(item => item[this.fieldNames.value] === this.textValue)
          if (delIndex > -1) {
            const delItem = options[delIndex]
            options.splice(delIndex, 1) // 删除已选中的
            options.splice(0, 0, delItem) // 将已选中的添加到第一条
            this.dataSource = [...options]
          }
        }
        this.currOptions = getCurrPaginationData(this.pageNum, this.pageSize, options)
      } else {
        this._inputSearchTimer && clearTimeout(this._inputSearchTimer)
        this.currOptions = this.dataSource.map(item => ({ ...item })) // 防止手动设置值时，选择器不能显示
      }
      this.open = isOpen
    },
    search (val) {
      if (!this.open) return
      this.searchName = val
      this._inputSearchTimer && clearTimeout(this._inputSearchTimer)
      this._inputSearchTimer = setTimeout(() => {
        this.pageNum = 1
        // filterOption为布尔类型时: 设置为false，即不走与optionFilterProp连用的组件自带过滤，此时optionFilterProp失效；
        // filterOption为函数类型时：可通过返回true/false自定义过滤，此时optionFilterProp同样失效；
        // 这里我们不使用filterOption，通过search改变currOptions，达到自定义过滤的目的
        this.currOptions = getCurrPaginationData(
          this.pageNum,
          this.pageSize,
          this.filterFuction(this.searchName)
        )
      }, 600)
    },
    popupScroll (e) {
      const { target } = e
      const scrollHeight = target.scrollHeight - target.scrollTop
      const clientHeight = target.clientHeight
      // 滚动条触顶
      if (scrollHeight === 0 && clientHeight === 0) {
        this.pageNum = 1
      } else {
        // 滚动条触底
        if (scrollHeight < clientHeight + 5) {
          const sourceLength = !this.searchName
            ? this.dataSource.length
            : this.filterFuction(this.searchName).length
          if (this.pageNum < Math.ceil(sourceLength / this.pageSize)) {
            this.pageNum = this.pageNum + 1
            if (!this.searchName) {
              // 下拉框无查询条件
              this.currOptions = this.currOptions.concat(
                getCurrPaginationData(this.pageNum, this.pageSize, this.dataSource)
              )
            } else {
              // 下拉框有查询条件
              const searchedData = this.filterFuction(this.searchName)
              this.currOptions = this.currOptions.concat(
                getCurrPaginationData(this.pageNum, this.pageSize, searchedData)
              )
            }
            console.log(this.currOptions, 'this.currOptions', sourceLength)
          }
        }
      }
    }
  }
}
</script>
