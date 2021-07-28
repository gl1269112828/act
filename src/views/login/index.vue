<template>
  <div class="login-container">
    <el-button type="success" @click="toHome">登录</el-button>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {}
  },
  methods: {
    toHome() {
      this.$router.push({ name: "home" })
    }
  }
}
</script>

<style>
</style>