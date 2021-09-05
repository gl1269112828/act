<template>
  <div class="operate-btns-container">
    <el-button type="primary" size="mini" v-for="(item, i) in operateButtons" :key="i" @click="handleOperate(item, i)" v-cloak>{{ item.name }}</el-button>
  </div>
</template>

<script>
export default {
  props: {
    operateButtons: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  methods: {
    handleOperate(item) {
      this.$emit('handleOperate', item);
    }
  }
};
</script>

<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
</style>
