<template>
  <div class="app-main-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.app-main-container {
  height: calc(100vh - 80px);
  padding: 10px;
}
</style>