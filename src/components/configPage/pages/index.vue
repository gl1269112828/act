<template>
  <div class="config-page-container" v-loading="isLoading">
    <QueryModule class="config-page-header" :queryData.sync="queryData" @handleSearch="handleSearch" />
    <OperateBtns />
    <LTable :tableHeader="tableHeader" :tableData="tableData" :total="total" :pageData="pageData" :getTableList="getTableList">
      <template slot="operate" slot-scope="scope">
        <div class="table-btn">
          <el-button type="text" size="small" @click="handleEdit(scope.data)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.data)" :disabled="scope.data.id === 1 ? true : false">删除</el-button>
        </div>
      </template>
    </LTable>
  </div>
</template>

<script>
import request from '@/utils/request';
import { getPageDetail } from '@/api/configManage';
import QueryModule from '../components/queryModule';
import OperateBtns from '../components/operateBtns';
export default {
  components: {
    QueryModule,
    OperateBtns
  },
  data() {
    return {
      isLoading: false,
      pageData: {},

      queryData: [],

      tableHeader: [],
      tableData: [],
      total: 0,
      pageData: {}
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
        this.pageData = data.pageTable;
        const fields = JSON.parse(data.pageTable.fields);

        let headers = [];
        let queries = [];

        fields.forEach(item => {
          headers.push({ label: item.name, prop: item.field, width: item.width });
          if (item.isQuery) {
            queries.push({ name: item.name, queryType: item.queryType, field: item.field, operate: item.condition, value: '' });
          }
        });

        if (data.pageTable.isRow) {
          headers.push({ label: '操作', prop: 'operate', width: data.pageTable.rowWith, render: true });
        }

        this.tableHeader = headers;
        this.queryData = queries;

        this.getBtns();
        this.getTableList();

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
    }
  }
};
</script>

<style lang="sass" scoped></style>
