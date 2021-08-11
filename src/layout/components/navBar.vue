<template>
  <div class="nav-bar-container definition-flex">
    <div class="nav-bar-fold">
      <i :class=" isCollapse? 'el-icon-s-unfold' :'el-icon-s-fold' " @click="handleCollapse"></i>
    </div>
    <div class="nav-bar-info">
      <el-dropdown>
        <span class="el-dropdown-link">
          欢迎您，演示用户
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <i class="el-icon-setting"></i>
            密码修改
          </el-dropdown-item>
          <el-dropdown-item @click.native="handleLoginOut">
            <i class="el-icon-switch-button"></i>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["isCollapse"]),
  },
  data() {
    return {}
  },
  methods: {
    handleCollapse() {
      this.$store.commit("setting/SET_COLLAPSE", !this.$store.getters.isCollapse);
    },
    handleLoginOut() {
      this.$store.dispatch("login/logout").then(() => {
        this.$router.push({ name: "login" })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-bar-container {
  justify-content: space-between;
  padding: 0 16px;
  height: 60px;
  border-bottom: solid 1px #e6e6e6;
  box-sizing: border-box;
  .nav-bar-fold {
    line-height: 60px;
    font-size: 24px;
    i {
      cursor: pointer;
    }
  }
  .nav-bar-info {
    line-height: 60px;
  }
}
</style>