<template>
  <el-form class="search-module-container" :inline="true" ref="elForm" size="small" :model="form" :rules="rules">
    <el-form-item :label="item.name + ':'" v-for="(item, i) in queryData" :key="i" v-cloak>
      <el-input v-model="item.value" :placeholder="'请输入' + item.name" v-if="item.queryType === 'input'" clearable></el-input>
      <!-- <el-select v-model="item.field" :placeholder="'请选择' + item.name" v-else-if="item.queryType === 'select'">
        <el-option v-for="(items, i) in conditionList" :key="i" :label="items.name" :value="items.value"></el-option>
      </el-select> -->
      <!-- <el-input v-model="item.field" :placeholder="'请输入' + item.name" v-if="item.queryType === 'input'"></el-input> -->
    </el-form-item>
    <!-- <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" size="mini" @click="handleSearch()" v-hasBtn="1003">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    queryData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        name: ''
      },
      rules: {}
    };
  },
  watch: {
    queryData(val) {}
  },
  methods: {
    handleSearch() {
      this.$emit('update:queryData', this.queryData);
      this.$emit('handleSearch');
    }
  }
};
</script>

<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
/deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
  margin-bottom: 10px;
}
</style>
