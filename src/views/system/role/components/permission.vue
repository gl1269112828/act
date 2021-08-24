<template>
  <div class="permission">
    <el-dialog title="配置角色权限" :visible="showPermission" :close-on-click-modal="false" width="800px" top="10vh" @close="hidePopups()">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small" v-loading="boxLoading" element-loading-text="拼命加载中">
        <el-form-item label="权限:">
          <el-tree ref="tree" style="margin-top:4px" :props="props" :data="treeData" node-key="id" show-checkbox :default-checked-keys="defaultChecked" @check-change="handleCheckChange"></el-tree>
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
import { permissionRoleTree, permissionRole } from '@/api/system';
export default {
  props: {
    showPermission: {
      type: Boolean,
      default: false
    },
    itemObj: {
      type: Object,
      defalut: () => ({})
    }
  },
  data() {
    return {
      btnLoading: false,
      boxLoading: false,
      props: {
        label: 'lable'
      },
      treeData: [],
      defaultChecked: [],
      form: {
        roleId: null, //角色id
        menuIds: [] //权限
      },
      rules: {}
    };
  },
  watch: {
    showPermission(val) {
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    async getData() {
      this.boxLoading = true;
      try {
        const { data } = await permissionRoleTree({
          roleId: this.itemObj.id
        });
        this.treeData = data.list;
        this.defaultChecked = data.menuIds;
        this.form.roleId = this.itemObj.id;
        this.boxLoading = false;
      } catch (error) {
        this.boxLoading = false;
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      let ridsa = this.$refs.tree.getCheckedNodes();
      let ridsb = this.$refs.tree.getHalfCheckedNodes();
      let trees = [...ridsb, ...ridsa];
      this.form.menuIds = trees.map(item => item.id);
    },
    // 添加
    confirm() {
      let form = this.form;
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          permissionRole(form)
            .then(response => {
              this.hidePopups();
              this.$notify.success({ title: '配置权限成功' });
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
      this.treeData = [];
    },
    cancel() {
      this.hidePopups();
    }
  }
};
</script>
<style lang="scss" scoped></style>
