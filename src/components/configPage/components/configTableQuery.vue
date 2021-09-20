<template>
  <el-form class="search-module-container" :inline="true" ref="elForm" size="mini" v-cloak>
    <el-form-item :label="item.name + ':'" v-for="(item, i) in queryModuleData" :key="i">
      <el-input v-model="item.value" :placeholder="`请输入${item.name}`" v-if="item.queryType === 'input'" clearable></el-input>
      <el-select v-model="item.value" :placeholder="`请选择${item.name}`" v-else-if="item.queryType === 'select'">
        <el-option v-for="(items, i) in item.selectArray" :key="i" :label="items.key" :value="items.value"></el-option>
      </el-select>
      <DateRange :value.sync="item.value" v-else-if="item.queryType === 'date'" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="handleSearch()">查询</el-button>
      <el-button type="primary" size="mini" @click="handleReset()">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import DateRange from '@/components/dateRange';
export default {
  components: {
    DateRange
  },
  props: {
    queryModuleData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  methods: {
    handleSearch() {
      this.$emit('update:queryModuleData', this.queryModuleData);
      this.$emit('handleSearch');
    },
    handleReset() {
      this.queryModuleData.forEach(item => this.$set(item, 'value', ''));
      this.$emit('update:queryModuleData', this.queryModuleData);
      this.$emit('handleReset');
    }
  }
};
</script>

<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
/deep/ .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 5px;
}
/deep/ .el-button + .el-button {
  margin-left: 5px;
}
</style>
