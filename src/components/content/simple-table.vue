<template>
  <div class="content-rb">
    <a-table
      v-bind="{
        ...antdOtherApi
      }"
      :columns="columns"
      :loading="false"
      :data-source="tableData"
      :class="tableType"
      :scroll="{ y: true }"
      :pagination="paging"
      @change="handleTableChange"
    >
      <template slot="operate" slot-scope="text, record">
        <slot name="operate" :record="record"></slot>
      </template>
    </a-table>
  </div>
</template>

<script>
import { Table } from 'ant-design-vue'
import { PAGINATION } from '@/config'
import { getFinalPageNum } from '@/utils/methods'
export default {
  name: 'simpleTable',
  components: {
    ATable: Table
  },
  props: {
    columns: {
      required: true,
      type: Array
    },
    getAsyncTableData: {
      required: true,
      type: Function
      // validator: (value) => {
      // }
    },
    asyncDelApi: {
      required: false,
      type: Function
    },
    tableType: {
      required: false,
      type: String,
      default: ''
    },
    pagination: {
      required: false,
      type: [Object, Boolean],
      default: () => {
        return PAGINATION()
      }
    },
    antdOtherApi: {
      required: false,
      type: [Object]
    }
  },
  data () {
    return {
      tableData: [],
      tableLoading: false,
      paging: this.pagination
    }
  },
  computed: {},
  mounted () {
    this.renderTable()
  },
  methods: {
    handleTableChange (pagination) {
      console.log('handleTableChange')
      this.paging = {
        ...pagination
      }
      this.$nextTick(() => {
        this.renderTable()
      })
    },
    del (successMessage = '删除成功') {
      console.log('del')
      this.asyncDelApi().then(() => {
        this.$message.success(successMessage)
        this.paging.current = getFinalPageNum(
          this.pagination.total,
          this.pagination.current,
          this.pagination.pageSize,
          1
        )
        this.renderTable()
      })
    },
    async renderTable () {
      console.log('renderData', this.pagination)
      this.tableLoading = true
      this.getAsyncTableData({
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }).then(({ list, rowCount }) => {
        this.tableLoading = false
        this.tableData = list
        rowCount && (this.paging.total = rowCount)
      })
    }
  }
}
</script>
