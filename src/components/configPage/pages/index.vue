<template>
  <div class="config-page-container" v-if="showPage === 1">
    <ConfigTableQuery class="config-page-header" :queryModuleData.sync="queryModuleData" @handleSearch="handleSearch" @handleReset="handleReset" />
    <ConfigOperateButtons :operateButtons="operateButtons" @handleOperate="handleOperate" />
    <ConfigTable
      :tableLoading="tableLoading"
      :tableHeader="tableHeader"
      :tableSlotData="tableSlotData"
      :tableData="tableData"
      :total="total"
      :tableQueryData.sync="tableQueryData"
      :selectTableData.sync="selectTableData"
      :getTableList="getTableList"
    />
    <ConfigTableForm :showOperate="isOperate" :operateObj="operateObj" :operateFields="operateFields" :selectTableData="selectTableData" v-on:hidePopups="isOperate = false" />
  </div>
  <el-empty description="暂无配置信息" v-else-if="showPage === 2"></el-empty>
</template>

<script>
import request from '@/utils/request';
import { getPageDetail } from '@/api/configManage';
import ConfigTableQuery from '../components/configTableQuery';
import ConfigOperateButtons from '../components/configOperateButtons';
import ConfigTableForm from '../components/configTableForm';
import ConfigTable from '../components/configTable';
import PriceJson from '../oil/priceJson';

export default {
  components: {
    ConfigTableQuery,
    ConfigOperateButtons,
    ConfigTableForm,
    ConfigTable,
    PriceJson
  },
  data() {
    return {
      tableLoading: false,
      showPage: 0,
      pageData: {},

      queryModuleData: [],

      tableHeader: [],
      tableSlotData: [],
      tableData: [],
      selectTableData: [],
      total: 0,
      tableQueryData: {},

      operateButtons: [],
      operateFields: [],
      isOperate: false,
      operateObj: {}
    };
  },
  created() {
    this.getData(this.$route.query.key);
  },
  watch: {
    $route(to, form) {
      Object.assign(this.$data, this.$options.data());
      this.getData(to.query.key);
    }
  },
  methods: {
    async getData(key) {
      try {
        this.tableLoading = true;
        const { data } = await getPageDetail(key);
        if (data.pageConfigs) {
          this.showPage = 1;

          this.pageData = data.pageConfigs;

          const fields = JSON.parse(data.pageConfigs.fields);

          if (!!data.pageConfigs.buttons) {
            this.operateButtons = JSON.parse(data.pageConfigs.buttons);
          }
          let headers = [];
          let queries = [];
          let slots = [];

          for (let i = 0; i < fields.length; i++) {
            const item = fields[i];
            headers.push({ label: item.name, prop: item.field, width: item.width });
            if (!!item.url) {
              item['selectArray'] = (await request({ url: item.url, method: 'GET' })).data;
              slots.push({ selectArray: item.selectArray, prop: item.field });
              headers[i]['render'] = true;
            }
            if (item.isCustomize) {
              headers[i]['customize'] = true;
            }

            if (item.isQuery) {
              !!item.url
                ? queries.push({
                    name: item.name,
                    queryType: item.queryType,
                    field: item.field,
                    operate: item.condition,
                    selectArray: item.selectArray,
                    value: ''
                  })
                : queries.push({ name: item.name, queryType: item.queryType, field: item.field, operate: item.condition, value: '' });
            }
          }

          headers.unshift({ prop: 'selection' });
          headers.unshift({ prop: 'serialNumber' });
          // console.log(JSON.parse(JSON.stringify(queries)));
          // console.log(JSON.parse(JSON.stringify(fields)));
          // console.log(JSON.parse(JSON.stringify(slots)));
          // console.log(JSON.parse(JSON.stringify(headers)));

          this.queryModuleData = queries;
          this.operateFields = fields;
          this.tableSlotData = slots;
          this.tableHeader = headers;

          await this.getTableList();
        } else {
          this.showPage = 2;
        }

        this.tableLoading = false;
      } catch (error) {
        this.tableLoading = false;
      }
    },
    async getTableList() {
      let pageQuery = [];
      this.queryModuleData.forEach(item => {
        if (!!item.value) {
          if (item.queryType === 'date') {
            const dates = item.value.split(',');
            dates.forEach((itemJ, index) => {
              if (index === 0) {
                pageQuery.push({ field: item.field, operate: 'GreaterThanOrEqual', value: itemJ });
              } else if (index === 1) {
                pageQuery.push({ field: item.field, operate: 'LessThanOrEqual', value: itemJ });
              }
            });
          } else {
            pageQuery.push(item);
          }
        }
      });
      const tableQueryData = {
        pageIndex: this.tableQueryData.pageIndex || 1,
        pageMax: this.tableQueryData.pageMax || 10,
        dynamicFilters: pageQuery
      };
      this.tableQueryData = tableQueryData;
      const resTable = await request({ url: this.pageData.dataUrl, method: 'post', data: tableQueryData });
      this.total = resTable.data.totalCount;
      this.tableData = resTable.data.datas;
    },
    handleSearch() {
      this.getTableList();
    },
    handleReset() {
      this.getTableList();
    },
    handleOperate(item) {
      if (item.name === '添加') {
        this.operateObj = item;
        this.isOperate = true;
      } else {
        if (!this.selectTableData.length) {
          this.$message.warning('请选择一条数据');
          return;
        }
        if (!item.isBatch && this.selectTableData.length > 1) {
          this.$message.warning('最多选择一条数据');
          return;
        }
        console.log(item.fields);
        if (item.fields.length === 1 && item.fields[0].fieldsType === 'submit') {
          this.$confirm('是否确认执行此操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              let delData = {
                [item.fields[0].submitFieldsName]: this.selectTableData.map(items => items[item.fields[0].matchFiledsName])
              };
              request({ url: item.requestUrl, method: 'post', data: delData }).then(response => {
                this.$notify.success({ title: `${item.name}成功` });
                this.getTableList();
              });
            })
            .catch(err => {});
        } else {
          this.operateObj = item;
          this.isOperate = true;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.l-table {
  margin-top: 5px;
}
.config-page-prompt {
  margin-top: 100px;
  text-align: center;
  font-size: 20px;
  color: #999;
}
</style>
