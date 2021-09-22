<template>
  <div class="public-popups">
    <el-dialog :title="selectObj.name" :visible="showOperate" :close-on-click-modal="false" append-to-body width="800px" top="10vh" @close="hidePopups()">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item
          :label="item.name + ':'"
          v-for="(item, i) in formList"
          :key="i"
          :prop="item.field"
          v-show="(selectObj.name === '添加' && item.isAdd) || (selectObj.name === '编辑' && item.isEdit)"
        >
          <el-input v-model="form[item.field]" :placeholder="'请输入' + item.name" clearable v-if="item.queryType === 'input'" />
          <el-select v-model="form[item.field]" :placeholder="'请选择' + item.name" clearable v-else-if="item.queryType === 'select'">
            <el-option v-for="(items, i) in item.selectArray" :key="i" :label="items.key" :value="items.value"></el-option>
          </el-select>
          <el-date-picker v-model="form[item.field]" value-format="yyyy-MM-dd hh:mm:ss" type="datetime" placeholder="请选择时间" v-else-if="item.queryType === 'date'"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="formList.length > 0">
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
      let form = this.form;
      const selectTableData = this.selectTableData[0];
      const arrs = JSON.parse(JSON.stringify(this.operateFields));
      for (let i = 0; i < arrs.length; i++) {
        const item = arrs[i];

        if (item.isRequired) {
          this.rules[item.field] = [{ required: true, message: `请输入${item.name}`, trigger: 'blur' }];
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
