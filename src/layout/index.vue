<template>
  <div class="layout-container definition-flex">
    <sidebar></sidebar>
    <div class="layout-r" :style="{ width: dynamicWidth }">
      <navBar></navBar>
      <appMain></appMain>
    </div>
  </div>
</template>

<script>
import sidebar from './components/sidebar';
import appMain from './components/appMain';
import navBar from './components/navBar';
import siderbarStyObj from '@/styles/sidebarConfig.scss';
export default {
  name: 'layout',
  computed: {
    dynamicWidth() {
      const isCollapse = this.$store.getters.isCollapse;
      return isCollapse ? 'calc(100% - 64px)' : `calc(100% - ${siderbarStyObj.menuWidth})`;
    }
  },
  components: {
    sidebar,
    navBar,
    appMain
  },
  data() {
    return {};
  },

  methods: {
    siderbarStyObj() {
      return siderbarStyObj;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/sidebarConfig.scss';
.layout-container {
  .layout-r {
    overflow: hidden;
  }
}
</style>
