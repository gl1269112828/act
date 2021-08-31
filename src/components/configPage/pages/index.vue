<template>
  <div class="config-page-container">
    <QueryModule class="config-page-header" :queryData.sync="queryData" @handleSearch="handleSearch" />
    <OperateBtns :operateButtons="operateButtons" @handleOperate="handleOperate" />
    <LTable :isLoading="isLoading" :tableHeader="tableHeader" :tableData="tableData" :total="total" :pageData="pageData" :selectTableData.sync="selectTableData" :getTableList="getTableList"></LTable>
    <PublicPopups :showOperate="isOperate" :operateObj="operateObj" :operateFields="operateFields" :selectTableData="selectTableData" v-on:hidePopups="isOperate = false" />
  </div>
</template>
A

<script>
import request from '@/utils/request';
import { getPageDetail } from '@/api/configManage';
import QueryModule from '../components/queryModule';
import OperateBtns from '../components/operateBtns';
import PublicPopups from '../components/publicPopups';

export default {
  components: {
    QueryModule,
    OperateBtns,
    PublicPopups
  },
  data() {
    return {
      isLoading: false,
      pageData: {},

      queryData: [],

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
    $route(to, from) {
      this.getData(to.query.key);
    }
  },
  methods: {
    async getData(key) {
      try {
        this.isLoading = true;

        const { data } = await getPageDetail(key);
        this.pageData = data.pageConfigs;
        const fields = JSON.parse(data.pageConfigs.fields);
        this.operateButtons = JSON.parse(data.pageConfigs.buttons);

        let headers = [{ label: 'selection', width: 60 }];
        let queries = [];

        fields.forEach(item => {
          headers.push({ label: item.name, prop: item.field, width: item.width });
          if (item.isQuery) {
            queries.push({ name: item.name, queryType: item.queryType, field: item.field, operate: item.condition, value: '' });
          }
        });

        this.operateFields = fields;
        this.tableHeader = headers;
        this.queryData = queries;

        await this.getTableList();

        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    async getTableList() {
      let pageQuery = [];
      this.queryData.forEach(item => {
        if (!!item.value) {
          pageQuery.push(item);
        }
      });
      const pageData = {
        pageIndex: 1,
        pageMax: 10,
        dynamicFilters: pageQuery
      };
      const resTable = await request({ url: this.pageData.dataUrl, method: 'post', data: pageData });
      this.total = resTable.data.totalCount;
      this.tableData = resTable.data.datas;
    },
    handleSearch() {
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

<style lang="scss" scoped></style>
