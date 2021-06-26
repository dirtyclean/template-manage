<template>
  <div>
    <contentHeader :filterComponentsData="filterComponentsData" :searchParams.sync="searchParams" @search="updateTable">
      <template slot="btn">
        <a-button class="ml20" type="primary" @click="openModal()">
          <a-icon type="plus"></a-icon>
          新增
        </a-button>
      </template>
    </contentHeader>
    <simpleTable :columns="columns" :getAsyncTableData="getTableData" ref="simpleTable" :asyncDelApi="del">
      <template v-slot:operate="record">
        <span>作用域插槽{{ record }}</span>
      </template>
    </simpleTable>
  </div>
</template>

<script>
import { Icon, Button } from 'ant-design-vue'
import { DATEPICK_OPTION } from '@/config'

export default {
  name: 'content-simple',
  components: {
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
        },
        {
          title: '操作',
          dataIndex: 'operate',
          customRender: (text, record) => {
            return (
              <div>
                <span
                  class="primary-color mr10"
                  on-click={() => {
                    this.openModal(record)
                  }}
                >
                  编辑
                </span>
                <span
                  class="danger-color"
                  on-click={() => {
                    this.$refs.simpleTable.del()
                  }}
                >
                  删除
                </span>
              </div>
            )
          },
          width: 200
        }
      ],
      // filter
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
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    updateTable() {
      this.$refs.simpleTable.renderTable()
    },
    openModal(record) {
      this.RAISE_EVT(this.EVT_ENUM.FW_SHOW_DIALOG, {
        component: () => import('./modal/index.vue'),
        params: {
          currRow: record,
          updateData: () => {
            this.updateTable()
          }
        },
        title: record ? '编辑' : '新增'
      })
    },
    async del(delId) {
      await this.$apiReq.del({ id: delId })
    },
    async getTableData(
      pagination = {
        pageNum: 1,
        pageSize: 10
      }
    ) {
      console.log(pagination, this.searchParams)
      return await this.$apiReq
        .getList({
          ...pagination,
          ...this.searchParams
        })
        .then(({ list, rowCount }) => {
          return {
            list,
            rowCount
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
