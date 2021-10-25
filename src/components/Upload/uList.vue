<template>
  <div>
    <div class="upload-list" :style="item.file_type === 15 ? 'display:block' : ''" v-for="(item, index) in list" :key="index">
      <div class="img-list" v-if="item.file_type === 10">
        <img :src="item.file_url" alt />
        <img class="del" :src="require('@/static/del.png')" alt @click="remove(index)" />
      </div>
      <div class="videos" v-else-if="item.file_type === 15">
        <video :src="item.file_url" controls preload height="200px" width="100%"></video>
        <img class="del" :src="require('@/static/del.png')" alt @click="remove(index)" />
      </div>
      <div class="img-list" v-else>
        <img :src="item.cover_url" alt />
        <div class="file_name">
          <el-tooltip class="item" effect="dark" :content="item.file_name" placement="top-start">
            <span>{{ item.file_name }}</span>
          </el-tooltip>
        </div>
        <img class="del" :src="require('@/static/del.png')" alt @click="remove(index)" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'uList',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    //移除图片触发
    remove(index) {
      this.$emit('update:list', this.list.splice(index, 1));
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-list {
  margin: 5px 10px 0 0;
  display: inline-block;
  .img-list {
    position: relative;
    width: 120px;
    height: 120px;
    vertical-align: middle;
    img {
      width: 120px;
      height: 120px;
      border-radius: 6px;
    }
  }
  .videos {
    position: relative;
    margin: 10px 0 0 0;
    width: 100%;
    height: 200px;
    border: 1px solid #eee;
  }
  .del {
    cursor: pointer;
    position: absolute;
    top: -2px;
    right: -3px;
    width: 18px !important;
    height: 18px !important;
  }
  .file_name {
    position: absolute;
    left: 0;
    bottom: 20px;
    width: 120px;
    padding: 0 10px;
    text-align: center;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
