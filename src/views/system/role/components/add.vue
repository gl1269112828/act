<template>
  <div class="add">
    <el-dialog title="添加角色" :visible="showAdd" :close-on-click-modal="false" width="800px" top="10vh" @close="hidePopups()">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="角色名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input type="textarea" :rows="4" v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()" size="small">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirm()" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addOrEditRole } from '@/api/system';
export default {
  props: {
    showAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btnLoading: false,
      form: {
        name: undefined, //角色名称
        remark: undefined //备注
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }] //角色名称
      }
    };
  },
  methods: {
    // 添加
    confirm() {
      let form = this.form;
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          addOrEditRole(form)
            .then(response => {
              this.hidePopups();
              this.$notify.success({ title: '添加成功' });
              this.$parent.getTableList();
              this.btnLoading = false;
            })
            .catch(err => {
              this.btnLoading = false;
            });
        }
      });
    },
    hidePopups() {
      this.$emit('hidePopups');
      this.$refs.form.resetFields();
      this.$store.dispatch('common/initObj', this.form);
    },
    cancel() {
      this.hidePopups();
    }
  }
};
</script>
<style lang="scss" scoped></style>
