<template>
  <div class="add">
    <el-dialog
      title="添加用户"
      :visible="showAdd"
      :close-on-click-modal="false"
      width="800px"
      top="10vh"
      @close="hidePopups()"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="用户名称:" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名称" clearable />
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" show-password clearable />
        </el-form-item>
        <el-form-item label="角色:" prop="roleId">
          <el-select v-model="form.roleId" placeholder="请选择角色" clearable>
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
import { addOrEditUser, getRole } from "@/api/system";
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
      roleList: [],
      form: {
        userName: undefined, //用户名称
        password: undefined, //密码
        roleId: undefined //角色id
      },
      rules: {
        userName: [{ required: true, message: "请输入用户名称", trigger: "blur" }], //用户名称
        password: [{ required: true, message: "请输入密码", trigger: "blur" }], //密码
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }] //角色
      }
    };
  },
  watch: {
    showAdd(val) {
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    async getData() {
      const { data } = await getRole({ pageIndex: 1, pageMax: 99999, dynamicFilters: [] });
      this.roleList = data.datas;
    },
    // 添加
    confirm() {
      let form = this.form;
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          addOrEditUser(form).then(response => {
            this.hidePopups();
            this.$notify.success({ title: '添加成功' });
            this.$parent.getTableList();
            this.btnLoading = false;
          }).catch(err => {
            this.btnLoading = false;
          });
        }
      });
    },
    hidePopups() {
      this.$emit("hidePopups");
      this.$refs.form.resetFields();
      this.$store.dispatch("common/initObj", this.form);
    },
    cancel() {
      this.hidePopups();
    }
  }
};
</script>
<style lang="scss" scoped></style>



