<template>
  <div class="edit">
    <el-dialog
      title="编辑页面"
      :visible="showPageEdit"
      :close-on-click-modal="false"
      width="1200px"
      top="10vh"
      @close="hidePopups()"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="160px"
        size="small"
        v-loading="boxLoading"
        element-loading-text="拼命加载中"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="页面名称:" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入页面名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="页面标识:" prop="password">
              <el-input v-model="form.password" placeholder="请输入页面标识" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配置类型:" prop="roleId">
              <el-select v-model="form.roleId" placeholder="-配置类型-" clearable>
                <el-option
                  v-for="item in roleList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据提取地址:" prop="password">
              <el-input v-model="form.password" placeholder="请输入数据提取地址" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认提取数据条件:" prop="password">
              <el-input v-model="form.password" placeholder="请输入默认提取数据条件" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否具备行操作列:" prop="roleId">
              <el-select v-model="form.roleId" placeholder="-是否具备行操作-" clearable>
                <el-option
                  v-for="item in roleList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行操作宽度:" prop="password">
              <el-input v-model="form.password" placeholder="请输入行操作宽度" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否具备多选:" prop="roleId">
              <el-select v-model="form.roleId" placeholder="-是否具备多选-" clearable>
                <el-option
                  v-for="item in roleList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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
    showPageEdit: {
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
      boxLoading: false,
      btnLoading: false,
      roleList: [],
      form: {
        id: undefined,
        userName: undefined, //用户名称
        password: undefined, //密码
        roleId: undefined //角色id
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ], //用户名称
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }] //角色
      }
    };
  },
  watch: {
    showPageEdit(val) {
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    async getData() {
      try {
        this.boxLoading = true;
        const { data } = await getRole({ pageIndex: 1, pageMax: 99999, dynamicFilters: [] });
        this.roleList = data.datas;
        Object.keys(this.form).forEach(key => {
          if (key !== "password") {
            this.form[key] = this.itemObj[key];
          }
        });
        this.boxLoading = false;
      } catch (error) {
        this.boxLoading = false;
      }
    },
    // 添加
    confirm() {
      let form = this.form;
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          addOrEditUser(form)
            .then(response => {
              this.hidePopups();
              this.$notify.success({ title: '修改成功' });
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
<style lang="scss" scoped>
/deep/ .el-select {
  display: block;
}
</style>



