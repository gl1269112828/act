<template>
  <div class="add">
    <el-dialog
      title="添加页面"
      :visible="showAdd"
      :close-on-click-modal="false"
      width="1200px"
      top="10vh"
      @close="hidePopups()"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="页面名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入页面名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="页面标识:" prop="key">
              <el-input v-model="form.key" placeholder="请输入页面标识" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
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
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="接口地址:" prop="dataUrl">
              <el-input v-model="form.dataUrl" placeholder="请输入接口地址" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认提取数据条件:" prop="password">
              <el-select v-model="form.defaultQueryCondition" placeholder="-默认提取数据条件-" clearable>
                <el-option
                  v-for="(item,i) in conditionList"
                  :key="i"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否具备多选:" prop="isMultipe">
              <el-select v-model="form.isMultipe" placeholder="-是否具备多选-" clearable>
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
            <el-form-item label="是否具备操作列:" prop="isRow">
              <el-select v-model="form.isRow" placeholder="-是否具备操作列-" clearable>
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
            <el-form-item label="操作列宽度:" prop="rowWith">
              <el-input v-model="form.rowWith" placeholder="请输入操作列宽度" clearable />
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
import { addOrEditAutomatedConfiguration } from "@/api/configManage";
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
      conditionList: this.$store.getters.conditionList,
      roleList: [],
      form: {
        name: undefined,
        key: undefined,
        dataUrl: undefined,
        defaultQueryCondition: [],
        isMultipe: undefined,
        isRow: undefined,
        rowWith: undefined

      },
      rules: {
        name: [{ required: true, message: "请输入页面名称", trigger: "blur" }],
        key: [{ required: true, message: "请输入页面标识", trigger: "blur" }],
        dataUrl: [{ required: true, message: "请输入接口地址", trigger: "blur" }],
        defaultQueryCondition: [{ type: "array", required: true, message: "请输入接口地址", trigger: "change" }],
        isMultipe: [{ required: true, message: "请选择是否具备多选", trigger: "change" }],
        isRow: [{ required: true, message: "请选择是否具备操作列", trigger: "change" }],
        rowWith: [{ required: true, message: "请输入操作列宽度", trigger: "blur" }]
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
    },
    // 添加
    confirm() {
      let form = this.form;
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          addOrEditAutomatedConfiguration(form)
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



