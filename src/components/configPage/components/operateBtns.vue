<template>
  <div class="operate-btns-container">
    <el-button type="primary" size="mini" v-for="(item, i) in operates" :key="i" @click="handleOperate" v-show="item.name !== '查询'" v-cloak>{{ item.name }}</el-button>
  </div>
</template>

<script>
import { getOperate } from '@/api/system';
export default {
  props: {
    operates: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // operates: []
    };
  },
  created() {
    // this.getOperateBtns();
  },
  methods: {
    async getOperateBtns() {
      const authoritys = JSON.parse(sessionStorage.getItem('authoritys')) || [];
      const { data } = await getOperate({ dynamicFilters: [] });
      this.operates = data.datas || [];
      console.log(JSON.parse(JSON.stringify(authoritys)));
      console.log(JSON.parse(JSON.stringify(data)));
    },
    handleOperate() {}
  }
};
</script>

<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
.operate-btns-container {
  margin-bottom: 18px;
}
</style>
