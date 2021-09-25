<template>
  <div class="system-menu-container">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <el-checkbox-group v-model="operateList" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="(item, i) in menuCheckOptions" :key="i" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { getOperate } from '@/api/system';
export default {
  props: {
    selectTableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      operateList: [],
      menuCheckOptions: []
    };
  },
  created() {
    this.getData();
  },
  watch: {
    selectTableData(val) {
      console.log(val);
      if (val.length) {
        const operateModels = val[0].operateModels;
        this.operateList = operateModels.map(item => item.id);
        this.isIndeterminate = !!this.operateList.length && this.operateList.length < this.menuCheckOptions.length;
        this.checkAll = this.operateList.length === this.menuCheckOptions.length;
      }
    }
  },
  methods: {
    async getData() {
      const operateResponse = await getOperate({ pageIndex: 1, pageMax: 9999, dynamicFilters: [] });
      this.menuCheckOptions = operateResponse.data.datas;
      console.log(this.selectTableData);
    },
    handleCheckAllChange(val) {
      if (val) {
        this.operateList = this.menuCheckOptions.map(item => item.id);
      } else {
        this.operateList = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.menuCheckOptions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.menuCheckOptions.length;
    }
  }
};
</script>

<style></style>
