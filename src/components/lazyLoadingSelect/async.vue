<!--
  异步懒加载数据
-->
<template>
  <a-select
    :placeholder="placeholder"
    :showSearch="showSearch"
    :optionFilterProp="optionFilterProp"
    :show-arrow="showArrow"
    @popupScroll="popupScroll"
    :label-in-value="labelInValue"
    @change="change"
    @search="search"
    @dropdownVisibleChange="updateCurrOptions"
    :value="value"
    :dropdown-match-select-width="dropdownMatchSelectWidth"
    :option-label-prop="optionLabelProp"
    :filterOption="false"
    :allowClear="allowClear"
    :not-found-content="
      fetching ? undefined : (searchName || !isMustSearchGetOptions) && currOptions.length === 0 ? '搜索结果为空' : null
    "
    :default-active-first-option="defaultActiveFirstOption"
    :open="open"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <template slot="suffixIcon">
      <slot name="suffixIcon"></slot>
    </template>
    <slot :currOptions="currOptions">
      <a-select-option
        v-for="item in currOptions"
        :key="item[fieldNames.key || fieldNames.value]"
        :value="item[fieldNames.value]"
        :title="item[fieldNames.label]"
      >
        {{ item[fieldNames.label] }}
      </a-select-option>
    </slot>
  </a-select>
</template>
<script>
import { Select, Spin } from 'ant-design-vue'
function getCurrPaginationData(pageNo, pageSize, array) {
  const offset = (pageNo - 1) * pageSize
  return offset + pageSize >= array.length ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize)
}
export default {
  components: {
    ASelect: Select,
    ASelectOption: Select.Option,
    ASpin: Spin
  },
  data() {
    return {
      currOptions: [], // 当前渲染的数据
      searchName: '',
      pageNum: 1,
      dataSource: [], // 已知全部数据 用于非异步分页
      isScrollLoading: false,
      open: false,
      fetching: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
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
    pageSize: {
      type: Number,
      default: 50,
      required: false
    },
    // 异步获取数据的总条数
    total: {
      type: Number,
      required: true
    },
    // 异步加载数据
    getAsyncOptions: {
      type: Function,
      required: true,
      default: function() {
        return []
      }
    },
    // 是否异步分页
    isAsyncPagination: {
      type: Boolean,
      default: false,
      required: false
    },
    value: {
      type: undefined,
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
    defaultActiveFirstOption: {
      type: Boolean,
      required: false,
      default: false
    },
    labelInValue: {
      type: Boolean,
      required: false,
      default: false
    },
    // isMustSearchGetOptions为false表示有初始化数据(既选择器作为选择框又作为搜索框)，为true时表示选择器作为搜索框(即无初始化数据)
    isMustSearchGetOptions: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  mounted() {
    this._lastFetchId = 0
  },
  methods: {
    change(value, option) {
      this.$emit('change', value, option)
    },
    updateCurrOptions(isOpen) {
      console.log(isOpen, 'isOpen')
      this.open = isOpen
      this.searchName = ''
      if (isOpen) {
        if (!this.isMustSearchGetOptions) {
          if (!this.showSearch && this.currOptions.length) {
            return
          }
          this.search()
          return
        }
        // 保留上一次结果 暂时不考虑currOptions大数据优化性能
        // 防止进入滚动分页(仅选择器作为搜索框时会触发这个问题) start
        /*
                    因为选择器默认关闭下拉列表输入框的搜索内容会不见（所以我们把搜索值会置为空），
                    假如是异步滚动分页，那么滚动发起异步请求时：搜索条件为上一步的搜索条件显然不合适，搜索条件为空也显然不合适
                    所以这里我们打开时保留上一次搜索结果，但是防止进入滚动分页（即关闭后再次打开，不允许滚动加载上一次的数据了）
                    为了保持一致，前端分页也如此

                    例子：搜索条件为name='x'总共total=4页,已加载两页name='x'，pageNum=1和name='x'，pageNum=2,此时关闭选择器。
                          再次打开，因为清空了搜索条件，即此时name='',因为还有数据将继续滚动分页，此时加载name=''，pageNum=3和name=''，pageNum=4。
                          查询条件变了，所以再次打开选择器时我们要阻止滚动分页
                */
        const total = this.currOptions.length
        this.$emit('update:total', total)
        this.pageNum = Math.ceil(total / this.pageSize) || 1
        // 防止进入滚动分页 end
        console.log(total, 'this.total', this.pageNum)
      } else {
        this.fetching = false
        this._inputSearchTimer && clearTimeout(this._inputSearchTimer)
      }
    },
    async setSearchResult(val, pageNum = this.pageNum, pageSize = this.pageSize) {
      this._lastFetchId += 1
      const fetchId = this._lastFetchId
      if (this.isAsyncPagination) {
        // 异步获取分页数据
        await this.getAsyncOptions({
          searchName: val,
          pageNum,
          pageSize
        }).then(res => {
          // 请求时序控制
          if (fetchId !== this._lastFetchId) {
            return
          }
          this.currOptions = res
        })
      } else {
        // 异步获取全部数据
        await this.getAsyncOptions({
          searchName: val
        }).then(res => {
          if (fetchId !== this._lastFetchId) {
            return
          }
          this.dataSource = res
          console.log(res, 'res')
          this.currOptions = getCurrPaginationData(this.pageNum, this.pageSize, this.dataSource) // 前端获取分页数据
        })
      }
    },
    search(val) {
      if (!this.open) return
      this.searchName = val
      this._inputSearchTimer && clearTimeout(this._inputSearchTimer)
      this.currOptions = []
      this.dataSource = []
      if (val || !this.isMustSearchGetOptions) {
        this.fetching = true
      } else {
        this.fetching = false
      }
      this._inputSearchTimer = setTimeout(async () => {
        this.pageNum = 1
        if (!val && this.isMustSearchGetOptions) return // 作为搜索框用时且搜索输入为空 不发起请求
        await this.setSearchResult(val)
        this.fetching = false
      }, 600)
    },
    async popupScroll(e) {
      const { target } = e
      const scrollHeight = target.scrollHeight - target.scrollTop
      const clientHeight = target.clientHeight
      // 滚动条触顶
      if (scrollHeight === 0 && clientHeight === 0) {
        this.pageNum = 1
      } else {
        // 滚动条触底
        if (scrollHeight < clientHeight + 5) {
          if (this.isScrollLoading) return
          const sourceLength = this.total
          console.log(sourceLength, 'sourceLength')
          if (this.pageNum < Math.ceil(sourceLength / this.pageSize)) {
            this.pageNum = this.pageNum + 1
            if (this.isAsyncPagination) {
              this.isScrollLoading = true
              this.currOptions = this.currOptions.concat(
                await this.getAsyncOptions({
                  // 异步获取分页数据
                  searchName: this.searchName,
                  pageNum: this.pageNum,
                  pageSize: this.pageSize
                })
              )
              this.isScrollLoading = false
            } else {
              this.currOptions = this.currOptions.concat(
                getCurrPaginationData(this.pageNum, this.pageSize, this.dataSource) // 前端获取分页数据
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
