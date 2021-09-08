<template>
  <div class="config-table-container">
    <el-dialog title="配置表格" :visible="showConfigTable" :close-on-click-modal="false" width="1200px" top="4vh" @close="hidePopups()">
      <el-form ref="form" :model="form" label-width="140px" size="mini" v-loading="boxLoading" element-loading-text="拼命加载中">
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据地址:" prop="dataUrl" :rules="[{ required: true, message: '请输入数据地址', trigger: 'blur' }]">
              <el-input v-model="form.dataUrl" placeholder="请输入数据地址" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="config-table-operate">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddList">添加</el-button>
          </el-col>
          <el-col class="config-table-list" :span="24" v-for="(item, i) in form.fields" :key="i" v-cloak>
            <el-col :span="24">
              <el-col :span="4">
                <el-form-item label="是否添加:" label-width="90px">
                  <el-switch v-model="item.isAdd" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="是否编辑:" label-width="90px">
                  <el-switch v-model="item.isEdit" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="是否查询:" label-width="90px">
                  <el-switch v-model="item.isQuery" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="是否必填:" label-width="90px">
                  <el-switch v-model="item.isRequired" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
              </el-col>
              <el-col class="config-list-close" :span="8">
                <img :src="require('@/static/moveUp.png')" alt="" @click="handerMoveUp(item, i)" v-show="form.fields.length > 1" />
                <img :src="require('@/static/moveDown.png')" alt="" @click="handeMoveDown(item, i)" v-show="form.fields.length > 1" />
                <img :src="require('@/static/listClose.png')" alt="" @click="handerListLess(item, i)" v-show="form.fields.length > 1" />
              </el-col>
            </el-col>
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
            <el-col :span="6" v-if="item.isQuery">
              <el-form-item label="查询类型:" label-width="90px">
                <el-select v-model="item.queryType" placeholder="请选择查询条件">
                  <el-option v-for="(items, i) in configQueryList" :key="i" :label="items.key" :value="items.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="item.isQuery">
              <el-form-item label="查询条件:" label-width="90px">
                <el-select v-model="item.condition" placeholder="请选择查询条件">
                  <el-option v-for="(items, i) in conditionList" :key="i" :label="items.key" :value="items.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24" class="config-table-operate" style="border:none" v-if="form.fields.length > 3">
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
import { getDictionaryByGroup, getConfigTable, addOrEditAutomatedConfigTable } from '@/api/configManage';
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
      conditionList: [],
      configQueryList: [],
      form: {
        id: 0,
        buttons: undefined,
        functions: undefined,
        dataUrl: undefined,
        fields: [{ name: '', field: '', url: '', width: 0, isAdd: 0, isEdit: 0, isQuery: 0, isRequired: 0, queryType: 'input', condition: 'Like' }]
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
        this.conditionList = (await getDictionaryByGroup('Condition')).data;
        this.configQueryList = (await getDictionaryByGroup('FieldType')).data;

        const configTableData = await getConfigTable({
          dynamicFilters: [{ field: 'pageId', operate: 'Equal', value: this.itemObj.id }]
        });
        if (configTableData.data.datas.length > 0) {
          configTableData.data.datas[0].fields = JSON.parse(configTableData.data.datas[0].fields);
          Object.keys(this.form).forEach(key => {
            this.form[key] = configTableData.data.datas[0][key];
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
      this.form.fields.push({ name: '', field: '', url: '', width: 0, isAdd: 0, isEdit: 0, isQuery: 0, isRequired: 0, queryType: 'input', condition: 'Like' });
    },
    handerListLess(item, index) {
      this.form.fields.splice(index, 1);
    },
    moveFn(index, index1, array) {
      array[index] = array.splice(index1, 1, array[index])[0];
      return array;
    },
    handerMoveUp(item, index) {
      if (index === 0) {
        this.$message.warning('已到最顶部');
        return;
      }
      this.form.fields = this.moveFn(index, index - 1, this.form.fields);
    },
    handeMoveDown(item, index) {
      if (index === this.form.fields.length - 1) {
        this.$message.warning('已到最底部');
        return;
      }
      this.form.fields = this.moveFn(index, index + 1, this.form.fields);
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
        buttons: undefined,
        functions: undefined,
        dataUrl: undefined,
        fields: [{ name: '', field: '', url: '', width: 0, isAdd: 0, isEdit: 0, isQuery: 0, isRequired: 0, queryType: 'input', condition: 'Like' }]
      };
    },
    cancel() {
      this.hidePopups();
    }
  }
};
</script>
<style lang="scss" scoped>
[v-cloak] {
  display: none;
}

.config-table-list {
  padding: 20px 0 2px 0;
  border-bottom: 1px solid #b8d7f7;
  .config-list-close {
    text-align: right;
    img {
      cursor: pointer;
      width: 28px;
      height: 28px;
      margin-left: 10px;
      vertical-align: middle;
    }
  }
}
.config-table-operate {
  padding: 10px 0;
  text-align: right;
  border-bottom: 1px solid #b8d7f7;
}
/deep/ .el-select {
  display: block;
}
</style>
