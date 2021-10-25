<template>
  <el-dialog :title="title + '上传'" append-to-body width="820px" top="10vh" :close-on-click-modal="false" :visible.sync="showUDialog" :before-close="handleClose">
    <div class="upload-content">
      <el-upload
        action="#"
        class="upload-file"
        :show-file-list="false"
        :multiple="multiple"
        :limit="uploadMultiple"
        :file-list="files"
        :on-exceed="handFileExceed"
        :http-request="handleupload"
        :before-upload="beforeUploadFile"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          <span>将文件拖到此处，或</span>
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">{{ prompt }}</div>
      </el-upload>
    </div>
    <u-list :list="files" />
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" class="btn-theme-color" size="mini" @click="handleEnter" v-show="files.length > 0">确 定</el-button>
      <el-button @click="handleClose" size="mini">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { uploadFile } from '@/api/login';
import uList from './uList.vue';
export default {
  name: 'uDialog',
  components: {
    uList
  },
  props: {
    showUDialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: true
    },
    uploadMultiple: {
      type: Number,
      default: 999999
    },
    prompt: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // isDisabled: false,
      files: [] //上传文件列表
    };
  },
  methods: {
    //确定
    handleEnter() {
      this.$emit('hidePopups');
      this.$parent.$emit('update:fileList', [...this.$parent.fileList, ...this.files]);
      this.files = [];
    },

    //取消（弹窗关闭）
    handleClose() {
      this.$emit('hidePopups');
      this.files = [];
    },

    //图片超出限制钩子
    handFileExceed(files, fileList) {
      // this.$message({
      //   type: 'warning',
      //   message: '只支持单文件上传'
      // });
    },

    //上传前
    beforeUploadFile(file) {
      const uploadFileType = this.$parent.uploadFileType;
      if (uploadFileType == 'excel') {
        //文档类型
        var FileExt = file.name.replace(/.+\./, '');
        if (['xls', 'xlsx'].indexOf(FileExt.toLowerCase()) === -1) {
          this.$message({
            type: 'warning',
            message: '请上传后缀名为xls、xlsx的附件！'
          });
          return false;
        }
      } else if (uploadFileType == 'img') {
        //照片
        var FileExt = file.name.replace(/.+\./, '');
        if (['png', 'jpg', 'jpeg'].indexOf(FileExt.toLowerCase()) === -1) {
          this.$message({
            type: 'warning',
            message: '请上传后缀名为png、jpg、jpeg的图片！'
          });
          return false;
        }
      } else if (uploadFileType == 'imgVideo') {
        //照片视频
        var FileExt = file.name.replace(/.+\./, '');
        if (['png', 'jpg', 'jpeg', 'mp3', 'mp4'].indexOf(FileExt.toLowerCase()) === -1) {
          this.$message({
            type: 'warning',
            message: '请上传图片或视频'
          });
          return false;
        }
      } else if (uploadFileType == 'wordExcel') {
        //word excel
        var FileExt = file.name.replace(/.+\./, '');
        if (['docx', 'doc', 'xlsx', 'xls'].indexOf(FileExt.toLowerCase()) === -1) {
          this.$message({
            type: 'warning',
            message: '请上传后缀名为xls、xlsx、docx、doc的模板'
          });
          return false;
        }
      }
    },

    //自定义上传
    handleupload(file) {
      const uploadFileType = this.$parent.uploadFileType;
      if (this.uploadFileType) {
        this.files.push(file.file);
      } else {
        const formData = new FormData();
        formData.append('file', file.file);
        uploadFile(formData).then(response => {
          this.files.push(response.data);
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-upload {
  display: block;
}
/deep/.el-upload-dragger {
  width: 100%;
}
/deep/ .el-upload__tip {
  margin: 6px 0;
}
/deep/ .el-dialog__body {
  padding: 30px 20px 0 20px;
}
/deep/ .el-dialog__title {
  color: #1890ff;
  font-weight: 500;
  font-size: 16px;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
}
</style>
