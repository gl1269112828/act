<template>
  <div class="automated-configuration-container">
    <div class="operate-container">
      <el-form class="demo-form-inline" :inline="true" :model="pageData" size="mini">
        <el-form-item label="页面名称:">
          <el-input v-model="pageData.dynamicFilters[0].value" placeholder="请输入页面名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="页面标识:">
          <el-input v-model="pageData.dynamicFilters[1].value" placeholder="请输入页面标识" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleSearch()" v-hasBtn="1003">查询</el-button>
          <el-button type="primary" size="mini" @click="handleAdd()" v-hasBtn="1001">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
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
          <el-button type="text" size="mini" @click="handleTableConfig(scope.data)" v-hasBtn="1006">表格配置</el-button>
          <el-button type="text" size="mini" @click="handleBtnConfig(scope.data)" v-hasBtn="1007">按钮配置</el-button>
          <el-button type="text" size="mini" @click="handleFieldConfig(scope.data)" v-hasBtn="1008">字段配置</el-button>
          <el-button type="text" size="mini" @click="handleDelete(scope.data)" v-hasBtn="1004">删除</el-button>
        </div>
      </template>
    </LTable>
    <AddPopups :showAdd="isAdd" v-on:hidePopups="isAdd = false" />
    <EditPopups :showEdit="isEdit" v-on:hidePopups="isEdit = false" :itemObj="itemObj" />
  </div>
</template>

<script>
import AddPopups from './components/add';
import EditPopups from './components/edit';
import { getAutomatedConfiguration } from '@/api/configManage';
export default {
  name: 'sysUser',
  components: {
    AddPopups,
    EditPopups
  },
  data() {
    return {
      isLoading: false, //加载表格
      tableHeader: [
        { label: '序号', width: '60' },
        { label: '页面名称', prop: 'name' },
        { label: '页面标识', prop: 'key' },
        // { label: '配置类型', prop: 'createTime', width: '150' },
        // { label: '数据提取地址', prop: 'createTime', width: '300' },
        // { label: '默认提取数据条件', prop: 'createTime', width: '150' },
        // { label: '是否具备多选', prop: 'createTime', width: '150' },
        // { label: '是否具备操作列', prop: 'createTime', width: '150' },
        // { label: '操作列宽度', prop: 'createTime', width: '150' },
        // { label: '创建时间', prop: 'createTime' },
        { label: '操作', prop: 'operate', width: '260', render: true }
      ],
      tableData: [], //表格数据
      total: 0, //表格总数
      pageData: {
        pageIndex: 1,
        pageMax: 10,
        dynamicFilters: [
          { field: 'name', operate: 'Like', value: '' },
          { field: 'key', operate: 'Like', value: '' }
        ]
      }, //分页查询数据
      isAdd: false,
      isEdit: false,
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
        let query = JSON.parse(JSON.stringify(this.pageData));
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
    //添加
    handleAdd() {
      this.isAdd = true;
    },
    //编辑
    handleEdit(data) {
      this.itemObj = data;
      this.isEdit = true;
    },
    handleTableConfig(){},
    handleBtnConfig(){},
    handleFieldConfig(){},

    //删除
    handleDelete(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser({ id: data.id }).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getTableList();
          });
        })
        .catch(() => { });
    }
  }
};
</script>
<style lang="scss" scoped></style>
