<template>
  <div>
    <contentHeader :filterComponentsData="filterComponentsData" :searchParams.sync="searchParams" @search="search">
      <template slot="btn">
        <a-button class="ml20" type="primary" @click="openModal()">
          <a-icon type="plus"></a-icon>
          新增
        </a-button>
      </template>
    </contentHeader>
    <simpleContent :columns="columns">
      <template v-slot:operate="record">
        <span>操作{{ record }}</span>
      </template>
    </simpleContent>
  </div>
</template>

<script>
import { getFinalPageNum } from '@/utils/methods'
import simpleContent from '@/components/content/simple-content'
import contentHeader from '@/components/content/content-header'
import { Icon, Button } from 'ant-design-vue'
import { DATEPICK_OPTION } from '@/config'
export default {
  name: 'content-simple',
  components: {
    simpleContent,
    contentHeader,
    AIcon: Icon,
    AButton: Button
  },
  data() {
    return {
      // table
      columns: [
        {
          title: '自定义指令',
          dataIndex: 'directives',
          customRender: () => {
            const directives = [{ name: 'has', value: ['add'], modifiers: {} }]
            return <span {...{ directives }}>测试自定义指令</span>
          }
        },
        {
          title: '作用域插槽',
          dataIndex: 'slot',
          scopedSlots: { customRender: 'operate' },
          width: 200
        }
      ],
      filterComponentsData: [
        {
          type: 'input',
          searchKey: 'input',
          antdApi: {
            placeholder: '搜索',
            allowClear: true
          }
        },
        {
          type: 'select',
          searchKey: 'select',
          antdApi: {
            placeholder: '选择',
            options: [
              {
                label: '123',
                value: '123'
              }
            ]
          }
        },
        {
          type: 'cascader',
          antdApi: {
            placeholder: '级联',
            allowClear: false
          },
          searchKey: 'cascader'
        },
        {
          type: 'date-picker',
          antdApi: {
            placeholder: '日期'
          },
          searchKey: 'date-picker'
        },
        {
          type: 'range-picker',
          searchKey: 'range-picker',
          antdApi: {
            placeholder: ['开始日期', '结束日期'],
            ...DATEPICK_OPTION({
              showTime: false,
              format: 'YYYY-MM-DD'
            })
          }
        }
      ],
      searchParams: {
        input: '默认',
        select: undefined,
        'date-picker': this.$moment(),
        'range-picker': [],
        cascader: []
      },
      tableData: [],
      tableLoading: false,
      currRow: undefined
    }
  },
  computed: {},
  mounted() {
    this.getTableData()
  },
  methods: {
    search() {
      console.log('search', this.searchParams)
    },
    openModal() {
      this.RAISE_EVT(this.EVT_ENUM.FW_SHOW_DIALOG, {
        component: () => import('./modal/index.vue'),
        params: {
          isAdd: true,
          init: () => {
            this.init()
          }
        },
        title: '新增'
      })
    },
    del(delId) {
      this.$apiReq.delApk({ id: delId }).then(() => {
        this.$message.success('删除成功')
        this.pagination.current = getFinalPageNum(
          this.pagination.total,
          this.pagination.current,
          this.pagination.pageSize,
          1
        )
        this.getTableData()
      })
    },
    async getTableData() {
      this.tableLoading = true
      this.$apiReq
        .getVersionList({
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize
        })
        .then(({ list, rowCount }) => {
          this.tableLoading = false
          this.tableData = list
          this.pagination.total = rowCount
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
