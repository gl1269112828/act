<template>
  <div class="sidebar-container">
    <div
      class="sidebar-logo-container"
      :style="{ width: isCollapse ? '64px' : siderbarStyObj.menuWidth  }"
    >LOGO</div>
    <el-menu
      class="sidebar"
      mode="vertical"
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="defaultActive"
      @select="handleSelect"
    >
      <template v-for="(item,i) in menuList">
        <el-submenu :index="item.path" :key="i" v-if="item.children.length>0">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item :index="itemJ.path" v-for="(itemJ,j) in item.children" :key="j">
              <i :class="itemJ.icon"></i>
              {{itemJ.title}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item :index="item.path" :key="i" v-else>
          <i :class="item.icon"></i>
          <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import siderbarStyObj from "@/styles/sidebarConfig.scss";
import { mapGetters } from "vuex";
export default {
  name: "sidebar",
  computed: {
    ...mapGetters(["isCollapse"]),
  },
  data() {
    return {
      menuList: this.$store.getters.roleMenus,
      defaultActive: "",
    }
  },
  created() {
    this.getRouter();
  },
  watch: {
    $route() {
      this.getRouter();
    },
  },
  methods: {
    getRouter() {
      const route = this.$route;
      this.defaultActive = route.fullPath;
    },
    siderbarStyObj() {
      return siderbarStyObj
    },
    handleSelect(index, indexPath) {
      console.log(index)
      return
      this.$router.push({ path: index })
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/sidebarConfig.scss';
.sidebar-container {
  .sidebar-logo-container {
    width: $menuWidth;
    line-height: 60px;
    background-color: #409eff;
    text-align: center;
    font-weight: bold;
    color: #ffffff;
  }
  .sidebar {
    height: calc(100vh - 60px);
  }
}
</style>