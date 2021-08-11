<template>
  <div class="layout-container definition-flex">
    <sidebar></sidebar>
    <div class="layout-r">
      <navBar></navBar>
      <appMain></appMain>
    </div>
  </div>
</template>

<script>
import sidebar from "./components/sidebar"
import appMain from "./components/appMain"
import navBar from "./components/navBar"
import { mapGetters } from "vuex";
import siderbarStyObj from "@/styles/sidebarConfig.scss";
export default {
  name: "layout",
  computed: {
    ...mapGetters(["isCollapse"]),
  },
  components: {
    sidebar,
    navBar,
    appMain
  },
  data() {
    return {
    }
  },
  methods: {
    siderbarStyObj() {
      return siderbarStyObj
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/sidebarConfig.scss";
.layout-container {
  .layout-r {
    overflow: hidden;
    width: calc(100% - #{$menuWidth});
  }
}
</style>