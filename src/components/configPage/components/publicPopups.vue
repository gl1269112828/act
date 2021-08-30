<template>
  <div class="publicPopups">
    <el-dialog :title="operateObj.name" :visible="showOperate" :close-on-click-modal="false" width="800px" top="10vh" @close="hidePopups()">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item :label="item.name + ':'" v-for="(item, i) in formList" :key="i" prop="userName">
          <el-input v-model="form[item.field]" :placeholder="'请输入' + item.name" clearable v-if="item.queryType === 'input'" />
        </el-form-item>
        <!--<el-form-item label="角色:" prop="roleId">
          <el-select v-model="form.roleId" placeholder="请选择角色" clearable>
            <el-option v-for="item in roleList" :key="item.value" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()" size="small">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirm()" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request';
import { addOrEditUser, getRole } from '@/api/system';
export default {
  props: {
    showOperate: {
      type: Boolean,
      default: false
    },
    operateObj: {
      type: Object,
      default: () => ({})
    },
    operateFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      btnLoading: false,
      formList: [],
      form: {},
      rules: {
        // userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }], //用户名称
        // password: [{ required: true, message: '请输入密码', trigger: 'blur' }], //密码
        // roleId: [{ required: true, message: '请选择角色', trigger: 'change' }] //角色
      }
    };
  },
  watch: {
    showOperate(val) {
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    async getData() {
      let form = this.form;
      this.formList = JSON.parse(JSON.stringify(this.operateFields)).filter(item => {
        if (this.operateObj.name === '添加' && item.isAdd) {
          return item;
        }
        if (this.operateObj.name === '编辑' && item.isEdit) {
          return item;
        }
      });
      this.formList.forEach(item => {
        this.$set(form, item.field, undefined);
      });
    },
    // 添加
    confirm() {
      let form = JSON.parse(JSON.stringify(this.form));
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          if (this.operateObj.name === '添加' || this.operateObj.name === '编辑') {
            request({ url: this.operateObj.requestUrl, method: 'post', data: form })
              .then(response => {
                this.hidePopups();
                this.$notify.success({ title: `${this.operateObj.name}成功` });
                this.$parent.getTableList();
                this.btnLoading = false;
              })
              .catch(err => {
                this.btnLoading = false;
              });
          } else {
          }
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
