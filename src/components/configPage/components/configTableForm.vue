<template>
  <div class="public-popups">
    <el-dialog :title="selectObj.name" :visible="showOperate" :close-on-click-modal="false" append-to-body width="800px" top="10vh" @close="hidePopups()">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small" v-loading="boxLoading" element-loading-text="拼命加载中">
        <template v-for="(item, i) in formList">
          <el-form-item :key="i" :label="item.name + ':'" :prop="item.field" v-if="item.showTypes.includes('isAdd') || item.showTypes.includes('isEdit')">
            <el-input v-model="form[item.field]" :placeholder="'请输入' + item.name" clearable v-if="item.fieldType === 'input'" />
            <el-input v-model="form[item.field]" type="textarea" :placeholder="'请输入' + item.name" v-if="item.fieldType === 'textarea'"></el-input>
            <el-select v-model="form[item.field]" :placeholder="'请选择' + item.name" clearable v-else-if="item.fieldType === 'select'">
              <el-option v-for="(items, i) in item.selectArray" :key="i" :label="items.key" :value="items.value"></el-option>
            </el-select> 
            <el-date-picker v-model="form[item.field]" value-format="yyyy-MM-dd hh:mm:ss" type="datetime" placeholder="请选择时间" v-else-if="item.fieldType === 'date'"></el-date-picker>
            <el-switch v-model="form[item.field]" :active-value="true" :inactive-value="false" v-else-if="item.fieldType === 'switch'"></el-switch>
          </el-form-item>
        </template>
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
export default {
  props: {
    showOperate: {
      type: Boolean,
      default: false
    },
    selectObj: {
      type: Object,
      default: () => ({})
    },
    operateFields: {
      type: Array,
      default: () => []
    },
    selectTableData: {
      type: Array,
      default: () => []
    },
    getTableList: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      boxLoading: false,
      btnLoading: false,
      formList: [],
      form: {},
      rules: {}
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
      this.boxLoading = true;
      let form = this.form;
      const selectTableData = this.selectTableData[0];
      const arrs = JSON.parse(JSON.stringify(this.operateFields));
      for (let i = 0; i < arrs.length; i++) {
        const item = arrs[i];

        if (item.showTypes.includes('isFormRequired')) {
          this.rules[item.field] = [{ required: true, message: item.selectArray && item.selectArray.length ? `请选择${item.name}` : `请输入${item.name}`, trigger: 'blur' }];
        }
        if (!!item.url) {
          item['selectArray'] = (await request({ url: item.url, method: 'GET' })).data.map(item => {
            item.value = JSON.parse(item.value);
            return item;
          });
        }
        this.$set(form, item.field, undefined);
      }
      this.formList = arrs;

      if (this.selectObj.name === '编辑') {
        Object.assign(this.form, selectTableData);
      }
      this.boxLoading = false;
    },

    confirm() {
      let form = JSON.parse(JSON.stringify(this.form));
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          // if (this.selectObj.name === '添加' || this.selectObj.name === '编辑') {
          request({ url: this.selectObj.requestUrl, method: 'post', data: form })
            .then(response => {
              this.hidePopups();
              this.$notify.success({ title: `${this.selectObj.name}成功` });
              this.getTableList();
              this.btnLoading = false;
            })
            .catch(err => {
              this.btnLoading = false;
            });
        }
        // }
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
