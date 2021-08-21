<template>
  <div class="sidebar-container">
    <div class="sidebar-logo-container" :style="{ width: isCollapse ? '64px' : siderbarStyObj.menuWidth }">LOGO</div>
    <el-menu class="sidebar" mode="vertical" :collapse="isCollapse" :collapse-transition="false" :default-active="defaultActive" @select="handleSelect">
      <template v-for="(item, i) in menuList">
        <el-submenu :index="item.path" :key="i" v-if="item.children.length > 0">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item :index="itemJ.path" v-for="(itemJ, j) in item.children" :key="j">
              <i :class="itemJ.icon"></i>
              {{ itemJ.title }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item :index="item.path" :key="i" v-else>
          <i :class="item.icon"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import siderbarStyObj from '@/styles/sidebarConfig.scss';
import { mapGetters } from 'vuex';
export default {
  name: 'sidebar',
  computed: {
    ...mapGetters(['isCollapse'])
  },
  data() {
    return {
      menuList: this.$store.getters.menus,
      defaultActive: ''
    };
  },
  created() {
    this.getRouter();
  },
  watch: {
    $route() {
      this.getRouter();
    }
  },
  methods: {
    getRouter() {
      const route = this.$route;
      if (route.meta.title && route.meta.title === '首页') {
        this.defaultActive = route.path.substring(0, route.path.length - 1);
      } else {
        this.defaultActive = route.path;
      }
    },
    siderbarStyObj() {
      return siderbarStyObj;
    },
    handleSelect(index, indexPath) {
      const route = this.$route;
      const dynamicRouter = this.$store.getters.dynamicRouter;
      let meta = new Object();
      const verPath = (children, pPath) => {
        children.forEach(itemJ => {
          if (pPath === itemJ.path) {
            meta = itemJ.meta;
          } else {
            if (itemJ.children && itemJ.children.length) {
              verPath(itemJ.children, itemJ.path);
            }
          }
        });
      };
      dynamicRouter.forEach(item => {
        if (item.path === index) {
          meta = item.meta;
        } else {
          if (item.children && item.children.length) {
            verPath(item.children, index);
          }
        }
      });
      if (index !== route.path) {
        if (index === '/home') {
          this.$router.push({ path: index });
        } else {
          this.$store.dispatch('login/getButtonAuthority', meta.id).then(() => {
            if (!!meta.key) {
              this.$router.push({ path: '/pages' });
            } else {
              this.$router.push({ path: index });
            }
          });
        }
      }
    }
  }
};
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
