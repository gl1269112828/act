<template>
  <el-form class="search-module-container" :inline="true"  ref="elForm" size="small" :model="form" :rules="rules">
    <el-form-item label="活动名称">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <!-- <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item> -->
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
  methods: {}
};
</script>

<style lang="scss" scoped></style>
