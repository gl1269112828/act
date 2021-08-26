<template>
  <div class="menus-container">
    <div class="operate-container">
      <el-form :inline="true" :model="pageData" class="demo-form-inline" size="mini">
        <el-form-item label="菜单名称:">
          <el-input v-model="pageData.dynamicFilters[0].value" placeholder="请输入菜单名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleSearch()" v-hasBtn="1003">查询</el-button>
          <el-button type="primary" size="mini" @click="handleAdd()" v-hasBtn="1001">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <LTable :isLoading="isLoading" :tableHeader="tableHeader" :tableData="tableData" :total="total" :pageData="pageData" :getTableList="getTableList">
      <template slot="operate" slot-scope="scope">
        <div class="table-btn">
          <el-button type="text" size="mini" @click="handleEdit(scope.data)" v-hasBtn="1002">编辑</el-button>
          <el-button type="text" size="mini" @click="handleDelete(scope.data)" v-hasBtn="1004">删除</el-button>
        </div>
      </template>
    </LTable>
    <AddPopups :showAdd="isAdd" v-on:hidePopups="isAdd = false" />
    <EditPopups :showEdit="isEdit" v-on:hidePopups="isEdit = false" :itemObj="itemObj" />
  </div>
</template>

<script>
import { getMenus, deleteMenus } from '@/api/system';
import AddPopups from './components/add';
import EditPopups from './components/edit';
export default {
  name: 'menus',
  components: {
    AddPopups,
    EditPopups
  },
  data() {
    return {
      isLoading: false, //加载表格
      tableHeader: [
        { label: '序号', width: '60' },
        { label: '名称', prop: 'name' },
        { label: '图标', prop: 'icon' },
        { label: '级别', prop: 'level' },
        { label: '路由', prop: 'url' },
        { label: 'key', prop: 'key' },
        { label: '创建时间', prop: 'createTime' },
        { label: '操作', prop: 'operate', width: '100', render: true }
      ],
      tableData: [], //表格数据
      total: 0, //表格总数
      pageData: {
        pageIndex: 1,
        pageMax: 10,
        dynamicFilters: [{ field: 'name', operate: 'Like', value: '' }]
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
        if (!query.dynamicFilters[0].value) {
          query.dynamicFilters = [];
        }
        const { data } = await getMenus(query);
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
    //删除
    handleDelete(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteMenus({ id: data.id }).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getTableList();
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped></style>
