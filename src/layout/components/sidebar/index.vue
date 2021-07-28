<template>
  <el-menu class="sidebar">
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-message"></i>导航一
      </template>
      <el-menu-item-group>
        <el-menu-item index="1-1">
          <i class="el-icon-message"></i>选项1
        </el-menu-item>
        <el-menu-item index="1-2">
          <i class="el-icon-message"></i>选项2
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="2">
      <i class="el-icon-setting"></i>
      <span slot="title">导航二</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "sidebar"
}
</script>

<style lang="scss" scoped>
.sidebar {
  height: calc(100vh - 60px);
}
</style>