<template>
  <div class="config-page-container">
    <QueryModule class="config-page-header" :queryData="queryData" />
    <LTable
      :isLoading="isLoading"
      :tableHeader="tableHeader"
      :tableData="tableData"
      :total="total"
      :pageData="pageData"
      :getTableList="getTableList"
    >
      <template slot="operate" slot-scope="scope">
        <div class="table-btn">
          <el-button type="text" size="small" @click="handleEdit(scope.data)">编辑</el-button>
          <el-button
            type="text"
            size="small"
            @click="handleDelete(scope.data)"
            :disabled="scope.data.id === 1 ? true : false"
          >删除</el-button>
        </div>
      </template>
    </LTable>
  </div>
</template>

<script>
import QueryModule from './components/queryModule';
export default {
  components: {
    QueryModule
  },
  data() {
    return {
      isLoading: false,
      queryData: [],
      tableHeader: [],
      tableData: [],
      total: 0,
      pageData: {}
    };
  },
  methods: {
    getTableList() { }
  }
};
</script>

<style lang="sass" scoped></style>
