<template>
    <div class="table">
        <a-table
            :columns="columns"
            :loading="false"
            :data-source="tableData"
            :class="tableType"
            :scroll="{ y: true }"
            :pagination="pagination"
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
export default {
  name: 'simple-content',
  components: {
    ATable: Table
  },
  props: {
    columns: {
      required: true,
      type: Array
    },
    getTableData: {
      required: true,
      type: Function
    },
    tableType: {
      required: false,
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableData: [{ id: '123' }],
      tableLoading: false,
      pagination: PAGINATION()
    }
  },
  computed: {},
  mounted () {
    this.renderData()
  },
  methods: {
    handleTableChange (pagination) {
      console.log(pagination)
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getTableData()
    },
    async renderData () {
      this.tableLoading = true
      this.getTableData({
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }).then(({ list, rowCount }) => {
        this.tableLoading = false
        this.tableData = list
        this.pagination.total = rowCount
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
