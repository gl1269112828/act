<template>
  <el-container>
    <el-header>
      <navBar></navBar>
    </el-header>
    <el-container>
      <el-aside>
        <sidebar></sidebar>
      </el-aside>
      <el-main>
        <appMain>
          <router-view></router-view>
        </appMain>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import sidebar from "./components/sidebar"
import appMain from "./components/appMain"
import navBar from "./components/navBar"
export default {
  name: "layout",
  components: {
    sidebar,
    navBar,
    appMain
  },
}
</script>

<style lang="scss" scoped>
</style>