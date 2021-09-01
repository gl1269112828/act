<template>
  <div class="tagsview-container">
    <i class="el-icon-arrow-left tagsview-l" @click="handleScrollLeft()" />
    <div class="tagsview-c" ref="tagview">
      <div
        class="tagsview-item"
        :class="item.checked ? 'item-checked' : ''"
        v-for="(item, i) in tags"
        :key="i"
        @mousemove="mousemoveTag(item)"
        @mouseleave="mouseleaveTag(item)"
        @click="handleLink(item)"
      >
        <span class="item-text">{{ item.name }}</span>
        <img class="item-delete" :src="require('@/static/tagDelete.png')" v-show="item.isDelete" @click.stop="handleDeleteItem(item)" alt />
      </div>
    </div>

    <div class="tagsview-r">
      <i class="right-icon el-icon-arrow-right" @click="handleScrollRight()" />
      <el-dropdown class="down-icon">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" trigger="click">
          <el-dropdown-item @click.native="handleCloseOther">关闭其他</el-dropdown-item>
          <el-dropdown-item @click.native="handleCloseAll">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tagsview',
  data() {
    return {
      tags: [{ name: '首页', path: '/home', query: {}, isDelete: false, checked: false }],
      scrollLeft: 0
    };
  },
  watch: {
    $route(route) {
      this.getTags(route);
    }
  },
  methods: {
    getTags(route) {
      let tags = this.tags;
      if (route.meta.title === '首页') {
        return;
      }
      tags.forEach(item => {
        item.checked = false;
        if (item.query.id == route.query.id) {
          item.checked = true;
        }
      });
      if (!!route.query.key) {
        let dynamicRouter = this.$store.getters.dynamicRouter;
        dynamicRouter.forEach(item => {
          if (item.path === '/configPage') {
            item.children.forEach(itemJ => {
              if (itemJ.meta.key === route.query.key && !tags.some(item => item.query.id == route.query.id)) {
                tags.push({
                  name: itemJ.meta.title,
                  path: itemJ.path,
                  query: { id: itemJ.meta.id, key: itemJ.meta.key },
                  isDelete: false,
                  checked: true
                });
              }
            });
          }
        });
      } else {
        if (!tags.some(item => item.query.id == route.query.id)) {
          tags.push({
            name: route.meta.title,
            path: route.path,
            query: { id: route.query.id, key: route.query.key },
            isDelete: false,
            checked: true
          });
        }
      }
    },
    handleLink(item) {
      if (!item.checked) {
        this.$router.push({ path: item.path, query: item.query });
      }
    },
    handleDeleteItem(item) {
      this.tags = this.tags.filter(items => items.name !== item.name);
    },
    mousemoveTag(item) {
      item.isDelete = true;
    },
    mouseleaveTag(item) {
      item.isDelete = false;
    },
    handleCloseOther() {
      const route = this.$route;
      this.tags = this.tags.filter(item => item.name === route.meta.title);
    },
    handleCloseAll() {
      this.tags = [{ name: '首页', path: '/home', query: {}, isDelete: false, checked: false }];
    },
    handleScrollLeft() {
      let scrollLeft = this.scrollLeft + 400;
      this.$nextTick(() => {
        this.$refs.tagview.scrollLeft = scrollLeft;
        this.scrollLeft = scrollLeft;
      });
    },
    handleScrollRight() {
      let scrollLeft = this.scrollLeft - 400;
      this.$nextTick(() => {
        this.$refs.tagview.scrollLeft = scrollLeft;
        this.scrollLeft = scrollLeft;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.tagsview-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background-color: #fff;
  font-size: 14px;
  .tagsview-l {
    cursor: pointer;
    width: 40px;
    min-width: 40px;
    text-align: center;
    border-right: 1px solid #eee;
  }
  .tagsview-c {
    width: 100%;
    height: 50px;
    white-space: nowrap;
    overflow: hidden;
    overflow-x: scroll;
    .tagsview-item {
      display: inline-block;
      line-height: 50px;
      padding: 0 10px;
      text-align: center;
      vertical-align: middle;
      .item-delete {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        margin: 0 0 2px 2px;
        vertical-align: middle;
      }
    }
    .tagsview-item:hover {
      cursor: pointer;
      color: rgba(24, 144, 255, 0.8);
    }
    .item-checked {
      color: rgba(24, 144, 255, 0.8);
    }
  }
  .tagsview-c::-webkit-scrollbar {
    display: none;
  }
  .tagsview-r {
    display: flex;
    align-items: center;
  }
  .tagsview-r .right-icon,
  .down-icon {
    cursor: pointer;
    width: 40px;
    min-width: 40px;
    border-left: 1px solid #eee;
    text-align: center;
  }
}
</style>
