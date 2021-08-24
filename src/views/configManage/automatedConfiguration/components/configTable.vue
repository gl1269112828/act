<template>
  <div class="configTable">
    <el-dialog title="配置表格" :visible="showConfigTable" :close-on-click-modal="false" width="1200px" top="5vh" @close="hidePopups()">
      <el-form ref="form" :model="form" v-loading="boxLoading" label-width="140px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据地址:" prop="dataUrl" :rules="[{ required: true, message: '请输入数据地址', trigger: 'blur' }]">
              <el-input v-model="form.dataUrl" placeholder="请输入数据地址" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否具备多选:">
              <el-switch v-model="form.isMultipe" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否具备操作列:">
              <el-switch v-model="form.isRow" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="form.isRow">
            <el-form-item label="操作列宽度:" prop="rowWith">
              <el-input v-model="form.rowWith" placeholder="请输入操作列宽度" clearable />
            </el-form-item>
          </el-col>
          <el-col class="config-table-list" :span="24" v-for="(item, i) in form.fields" :key="i">
            <img class="config-list-close" :src="require('@/static/listClose.png')" alt="" @click="handerListLess(item, i)" v-if="form.fields.length > 1" />
            <el-col :span="6">
              <el-form-item label="名称:" label-width="90px" :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]" :prop="'fields.' + i + '.name'">
                <el-input v-model="item.name" placeholder="请输入名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="字段:" label-width="90px" :rules="[{ required: true, message: '请输入字段', trigger: 'blur' }]" :prop="'fields.' + i + '.field'">
                <el-input v-model="item.field" placeholder="请输入字段" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="数据源:" label-width="90px">
                <el-input v-model="item.url" placeholder="请输入数据源" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="列宽:" label-width="90px">
                <el-input v-model="item.width" placeholder="请输入列宽" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否添加:" label-width="90px">
                <el-switch v-model="item.isAdd" :active-value="1" :inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否编辑:" label-width="90px">
                <el-switch v-model="item.isEdit" :active-value="1" :inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否查询:" label-width="90px">
                <el-switch v-model="item.isQuery" :active-value="1" :inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="item.isQuery">
              <el-form-item label="查询类型:" label-width="90px">
                <el-select v-model="item.queryType" placeholder="请选择查询条件">
                  <el-option v-for="(items, i) in configQueryList" :key="i" :label="items.name" :value="items.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="item.isQuery">
              <el-form-item label="查询条件:" label-width="90px">
                <el-select v-model="item.condition" placeholder="请选择查询条件">
                  <el-option v-for="(items, i) in conditionList" :key="i" :label="items.name" :value="items.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24" class="config-table-operate">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddList">添加</el-button>
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
import { getConfigTable, addOrEditAutomatedConfigTable } from '@/api/configManage';
export default {
  props: {
    showConfigTable: {
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
      conditionList: this.$store.state.common.conditionList,
      configQueryList: this.$store.state.common.configQueryList,
      form: {
        id: 0,
        dataUrl: undefined,
        isMultipe: undefined,
        isRow: undefined,
        rowWith: 180,
        fields: [{ name: '', field: '', url: '', width: 0, isAdd: 0, isEdit: 0, isQuery: 0, queryType: 'input', condition: 'Like' }]
      }
    };
  },
  watch: {
    showConfigTable(val) {
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    async getData() {
      try {
        this.boxLoading = true;
        const { data } = await getConfigTable({
          dynamicFilters: [{ field: 'pageId', operate: 'Equal', value: this.itemObj.id }]
        });
        if (data.datas.length > 0) {
          data.datas[0].fields = JSON.parse(data.datas[0].fields);
          Object.keys(this.form).forEach(key => {
            this.form[key] = data.datas[0][key];
          });
        } else {
          this.form.id = 0;
        }
        this.boxLoading = false;
      } catch (error) {
        this.boxLoading = false;
      }
    },
    handleAddList() {
      this.form.fields.push({ name: '', field: '', url: '', width: 0, isAdd: 0, isEdit: 0, isQuery: 0, queryType: 'input', condition: 'Like' });
    },
    handerListLess(item, i) {
      this.form.fields.splice(i, 1);
    },
    confirm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          let formData = JSON.parse(JSON.stringify(this.form));
          formData['pageId'] = this.itemObj.id;
          formData.fields = JSON.stringify(formData.fields);
          addOrEditAutomatedConfigTable(formData)
            .then(response => {
              this.hidePopups();
              this.$notify.success({ title: '配置成功' });
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
      this.form = {
        id: 0,
        dataUrl: undefined,
        isMultipe: undefined,
        isRow: undefined,
        rowWith: 180,
        fields: [{ name: '', field: '', url: '', width: 0, isAdd: 0, isEdit: 0, isQuery: 0, queryType: 'input', condition: 'Like' }]
      };
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
.config-table-list {
  position: relative;
  margin-top: 20px;
  border-bottom: 1px solid #b8d7f7;
  .config-list-close {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 18px;
    height: 18px;
  }
}
.config-table-operate {
  padding: 10px 0;
  text-align: right;
}
</style>
