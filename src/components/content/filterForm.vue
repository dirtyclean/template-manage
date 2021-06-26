<template>
  <!-- 数量超过一个 显示重置按钮 -->
  <a-form-model layout="inline" class="index-search-form-model">
    <a-form-model-item
      v-for="({ antdApi, type, searchKey, fieldNames = { label: 'label', value: 'value' } },
      index) in filterComponentsData"
      :key="index"
    >
      <a-input
        v-if="type === 'input'"
        @change="search"
        v-model="searchParams[searchKey]"
        v-bind="{
          ...antdApi
        }"
      />
      <a-select
        v-if="type === 'select'"
        v-model="searchParams[searchKey]"
        @change="search"
        showSearch
        optionFilterProp="title"
        v-bind="{
          ...antdApi
        }"
      >
        <a-select-option
          v-for="(item, index) in antdApi.options"
          :key="index"
          :value="item[fieldNames.value]"
          :title="item[fieldNames.label]"
        >
          {{ item[fieldNames.label] }}
        </a-select-option>
      </a-select>
      <a-cascader
        :showSearch="true"
        v-model="searchParams[searchKey]"
        @change="search"
        v-if="type === 'cascader'"
        v-bind="{
          ...antdApi
        }"
      />
      <a-range-picker
        v-if="type === 'range-picker'"
        v-bind="{ ...antdApi }"
        v-model="searchParams[searchKey]"
        @change=";(!antdApi.showTime || allowClear || antdApi.allowClear) && search()"
        @ok="antdApi.showTime && search()"
      />
      <a-date-picker
        v-if="type === 'date-picker'"
        v-model="searchParams[searchKey]"
        v-bind="{
          ...antdApi
        }"
        @change="search"
      />
    </a-form-model-item>
    <a-form-model-item v-if="filterComponentsData.length > 1">
      <a-button class="ml20" @click="reset()" icon="retweet">
        重置
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { FormModel, Input, Select, Button, DatePicker, Cascader } from 'ant-design-vue'
const { RangePicker } = DatePicker
export default {
  name: 'filterForm',
  components: {
    AFormModel: FormModel,
    AInput: Input,
    AFormModelItem: FormModel.Item,
    ASelect: Select,
    ASelectOption: Select.Option,
    AButton: Button,
    ADatePicker: DatePicker,
    ARangePicker: RangePicker,
    ACascader: Cascader
  },
  data () {
    this.inputSearchTimer = null
    this.initSearchParams = {}
    return {}
  },
  props: {
    searchParams: {
      type: Object,
      required: false
    },
    filterComponentsData: {
      type: Array,
      required: false
    }
  },
  watch: {},
  mounted () {
    this.initSearchParams = {
      ...this.searchParams
    }
  },
  methods: {
    search () {
      clearTimeout(this.inputSearchTimer)
      this.inputSearchTimer = setTimeout(() => {
        this.$emit('search')
      }, 600)
    },
    reset () {
      this.$emit('update:searchParams', {
        ...this.initSearchParams
      })
      this.$emit('search')
    }
  }
}
</script>

<style lang="scss" scoped></style>
