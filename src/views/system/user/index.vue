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
    </simpleTable>
  </div>
</template>

<script>
import { Icon, Button } from 'ant-design-vue'
export default {
  name: 'user',
  components: {
    AIcon: Icon,
    AButton: Button
  },
  data() {
    return {
      // table
      columns: [
        {
          title: '用户名',
          dataIndex: 'x'
        },
        {
          title: '姓名',
          dataIndex: 'xx'
        },
        {
          title: '联系电话',
          dataIndex: 'xxx'
        },
        {
          title: '角色',
          dataIndex: 'xxxx'
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
          searchKey: 'name',
          antdApi: {
            placeholder: '搜索用户名',
            allowClear: true
          }
        },
        {
          type: 'input',
          searchKey: 'phone',
          antdApi: {
            placeholder: '搜索手机号码'
          }
        }
      ],
      searchParams: {
        name: '',
        phone: ''
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
            rowCount,
            cs: 234
          }
        })
    }
  }
}
</script>
