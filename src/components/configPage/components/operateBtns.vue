<template>
  <div class="operate-btns-container">
    <el-button type="primary" size="mini" v-for="(item, i) in operates" :key="i" @click="handleOperate">{{ item.name }}</el-button>
  </div>
</template>

<script>
import { getOperate } from '@/api/system';
export default {
  data() {
    return {
      operates: []
    };
  },
  created() {
    this.getOperateBtns();
  },
  methods: {
    async getOperateBtns() {
      const authoritys = JSON.parse(sessionStorage.getItem('authoritys')) || [];
      const { data } = await getOperate({ dynamicFilters: [] });
      this.operates = data.datas || [];
      console.log(authoritys);
      console.log(data);
    },
    handleOperate() {}
  }
};
</script>

<style lang="scss" scoped>
.operate-btns-container {
  margin-bottom: 18px;
}
</style>
