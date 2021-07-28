<template>
  <div class="nav-bar-container definition-flex">
    <div class="logo-container">LOGO</div>
    <div class="nav-bar-content"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "@/styles/sidebarConfig.scss";
.nav-bar-container {
  height: 60px;
  border-bottom: solid 1px #e6e6e6;
  box-sizing: border-box;
}
.logo-container {
  width: $menuWidth;
  line-height: 60px;
  background-color: #409EFF;
  text-align: center;
  font-weight: bold;
  color: #ffffff;
}
</style>