<template>
  <div class="automated-configuration-container">
    <div class="operate-container">
      <el-form class="demo-form-inline" :inline="true" :model="tableQueryData" size="mini">
        <el-form-item label="页面名称:">
          <el-input v-model="tableQueryData.dynamicFilters[0].value" placeholder="请输入页面名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="页面标识:">
          <el-input v-model="tableQueryData.dynamicFilters[1].value" placeholder="请输入页面标识" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleSearch()" v-hasBtn="1003">查询</el-button>
          <el-button type="primary" size="mini" @click="handleAdd()" v-hasBtn="1001">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <LTable :isLoading="isLoading" :tableHeader="tableHeader" :tableData="tableData" :total="total" :tableQueryData.sync="tableQueryData" :getTableList="getTableList">
      <template slot="operate" slot-scope="scope">
        <div class="table-btn">
          <el-button type="text" size="mini" @click="handleEdit(scope.data)" v-hasBtn="1002">编辑</el-button>
          <el-button type="text" size="mini" @click="handleTableConfig(scope.data)" v-hasBtn="1006">表格配置</el-button>
          <el-button type="text" size="mini" @click="handleBtnConfig(scope.data)" v-hasBtn="1007">按钮配置</el-button>
          <el-button type="text" size="mini" @click="handleFieldConfig(scope.data)" v-hasBtn="1008">字段配置</el-button>
          <el-button type="text" size="mini" @click="handleDelete(scope.data)" v-hasBtn="1004">删除</el-button>
        </div>
      </template>
    </LTable>
    <AddPopups :showPageAdd="isPageAdd" v-on:hidePopups="isPageAdd = false" />
    <EditPopups :showPageEdit="isPageEdit" v-on:hidePopups="isPageEdit = false" :itemObj="itemObj" />
    <ConfigTablePopups :showConfigTable="isConfigTable" v-on:hidePopups="isConfigTable = false" :itemObj="itemObj" />
    <ConfigBtnPopups :showConfigBtn="isConfigBtn" v-on:hidePopups="isConfigBtn = false" :itemObj="itemObj" />
  </div>
</template>

<script>
import AddPopups from './components/add';
import EditPopups from './components/edit';
import ConfigTablePopups from './components/configTable';
import ConfigBtnPopups from './components/configBtn';

import { getAutomatedConfiguration, deleteConfiguration } from '@/api/configManage';
export default {
  name: 'sysUser',
  components: {
    AddPopups,
    EditPopups,
    ConfigTablePopups,
    ConfigBtnPopups
  },
  data() {
    return {
      isLoading: false, //加载表格
      tableHeader: [
        { label: '序号', width: '60' },
        { label: '页面名称', prop: 'name' },
        { label: '页面标识', prop: 'key' },
        {
          label: '页面标识1',
          prop: 'key',
          children: [
            { label: '页面标识2', prop: 'key' },
            { label: '页面标识3', prop: 'key' }
          ]
        },
        { label: '操作', prop: 'operate', width: '220', render: true }
      ],
      tableData: [], //表格数据
      total: 0, //表格总数
      tableQueryData: {
        pageIndex: 1,
        pageMax: 10,
        dynamicFilters: [
          { field: 'name', operate: 'Like', value: '' },
          { field: 'key', operate: 'Like', value: '' }
        ]
      }, //分页查询数据
      isPageAdd: false,
      isPageEdit: false,
      isConfigTable: false,
      isConfigBtn: false,
      itemObj: {}
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    //获取表格数据
    async getTableList() {
      this.isLoading = true;
      try {
        let query = JSON.parse(JSON.stringify(this.tableQueryData));
        if (!query.dynamicFilters[0].value && !query.dynamicFilters[0].value) {
          query.dynamicFilters = [];
        }
        const { data } = await getAutomatedConfiguration(query);
        this.total = data.totalCount;
        this.tableData = data.datas || [];
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    //搜索
    handleSearch() {
      this.getTableList();
    },
    handleAdd() {
      this.isPageAdd = true;
    },
    handleEdit(scope) {
      this.itemObj = scope;
      this.isPageEdit = true;
    },
    handleTableConfig(scope) {
      this.itemObj = scope;
      this.isConfigTable = true;
    },
    handleBtnConfig(scope) {
      this.itemObj = scope;
      this.isConfigBtn = true;
    },
    handleFieldConfig() {},

    //删除
    handleDelete(scope) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteConfiguration({ id: scope.id }).then(response => {
            this.$notify.success({ title: '删除成功' });
            this.getTableList();
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped></style>
