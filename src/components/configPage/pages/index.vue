<template>
  <div class="config-page-container" v-if="showPage === 1">
    <QueryModule class="config-page-header" :queryData.sync="queryData" @handleSearch="handleSearch" @handleReset="handleReset" />
    <OperateButtonModule :operateButtons="operateButtons" @handleOperate="handleOperate" />
    <LTable
      class="l-table"
      :isLoading="isLoading"
      :tableHeader="tableHeader"
      :tableData="tableData"
      :total="total"
      :pageData="pageData"
      :selectTableData.sync="selectTableData"
      :getTableList="getTableList"
    >
      <template :slot="item.prop" slot-scope="scope" v-for="(item, i) in slotData">
        <span :key="i">
          <template v-for="(itemJ, j) in item.selectArray">
            <el-tag :key="j" v-if="itemJ.value.indexOf(scope.data[item.prop]) > -1">
              {{ itemJ.key }}
            </el-tag>
          </template>
        </span>
      </template>
    </LTable>
    <FormPopups :showOperate="isOperate" :operateObj="operateObj" :operateFields="operateFields" :selectTableData="selectTableData" v-on:hidePopups="isOperate = false" />
  </div>
  <el-empty description="暂无配置信息" v-else-if="showPage === 2"></el-empty>
</template>

<script>
import request from '@/utils/request';
import { getPageDetail } from '@/api/configManage';
import QueryModule from '../components/queryModule';
import OperateButtonModule from '../components/operateButtonModule';
import FormPopups from '../components/formPopups';

export default {
  components: {
    QueryModule,
    OperateButtonModule,
    FormPopups
  },
  data() {
    return {
      isLoading: false,
      showPage: 0,
      pageData: {},

      queryData: [],

      slotData: [],
      tableHeader: [],
      tableData: [],
      selectTableData: [],
      total: 0,
      pageData: {},

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
        this.isLoading = true;
        const { data } = await getPageDetail(key);
        if (data.pageConfigs) {
          this.showPage = 1;

          this.pageData = data.pageConfigs;
          const fields = JSON.parse(data.pageConfigs.fields);

          if (!!data.pageConfigs.buttons) {
            this.operateButtons = JSON.parse(data.pageConfigs.buttons);
          }

          let headers = [{ label: 'selection', width: 60 }];
          let queries = [];
          let slots = [];

          for (let i = 0; i < fields.length; i++) {
            const item = fields[i];

            if (!!item.url) {
              item['selectArray'] = (await request({ url: item.url, method: 'GET' })).data;

              slots.push({ selectArray: item.selectArray, prop: item.field });
              headers.push({ label: item.name, prop: item.field, width: item.width, render: true });
            } else {
              headers.push({ label: item.name, prop: item.field, width: item.width });
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

          // console.log(JSON.parse(JSON.stringify(queries)));
          // console.log(JSON.parse(JSON.stringify(headers)));

          this.operateFields = fields;
          this.slotData = slots;
          this.tableHeader = headers;
          this.queryData = queries;

          await this.getTableList();
        } else {
          this.showPage = 2;
        }

        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    async getTableList() {
      let pageQuery = [];
      this.queryData.forEach(item => {
        if (!!item.value) {
          if (item.queryType === 'date') {
            const dates = item.value.split(',');
            dates.forEach(itemJ => {
              item.value = itemJ;
              pageQuery.push(item);
            });
          } else {
            pageQuery.push(item);
          }
        }
      });
      const pageData = {
        pageIndex: 1,
        pageMax: 10,
        dynamicFilters: pageQuery
      };
      // console.log(this.queryData);
      // console.log(pageData);
      // return;
      const resTable = await request({ url: this.pageData.dataUrl, method: 'post', data: pageData });
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
        if (item.fields.length === 1 && item.fields[0].fieldsType === 'submit') {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
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
  margin-top: 10px;
}
.config-page-prompt {
  margin-top: 100px;
  text-align: center;
  font-size: 20px;
  color: #999;
}
</style>
