<template>
  <div class="config-btn-container">
    <el-dialog title="配置按钮" :visible="showConfigBtn" :close-on-click-modal="false" width="1400px" top="4vh" @close="hidePopups()">
      <el-table v-loading="boxLoading" :data="tableData" :span-method="tableMethod" border size="mini">
        <el-table-column label="按钮名称" align="center" width="80px">
          <template slot-scope="scope">
            <el-tag size="mini">{{ scope.row.btnName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="请求地址" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.requestUrl" placeholder="请输入请求地址" size="mini" clearable />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="是否批量操作" align="center" width="80px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isBatch" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="字段配置" align="center">
          <el-table-column label="类型" align="center">
            <template slot-scope="scope">
              <el-select v-model="scope.row.fieldsType" placeholder="请选择类型" size="mini">
                <el-option v-for="(items, i) in configQueryList" :key="i" :label="items.name" :value="items.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="提交字段名" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.submitFieldsName" placeholder="请输入提交字段名" size="mini" clearable />
            </template>
          </el-table-column>
          <el-table-column label="匹配字段名" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.matchFiledsName" placeholder="请输入匹配字段名" size="mini" clearable />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80px">
            <template slot-scope="scope">
              <el-button style="color:red" type="text" size="mini" @click="handleDeleteFiled(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleAddFiled(scope.row, scope.$index)">添加字段</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-form ref="form" :model="form" size="small" v-loading="boxLoading" element-loading-text="拼命加载中">
        <el-row>
          <el-col class="config-table-list" :span="24" v-for="(item, i) in form.buttons" :key="i" v-cloak>
            <el-col class="config-list-close" :span="24">
              <img :src="require('@/static/moveUp.png')" alt="" @click="handerMoveUp(item, i)" v-show="form.buttons.length > 1" />
              <img :src="require('@/static/moveDown.png')" alt="" @click="handeMoveDown(item, i)" v-show="form.buttons.length > 1" />
            </el-col>
            <el-col :span="6">
              <el-form-item label="按钮名称:" label-width="120px">
                <el-input v-model="item.btnName" placeholder="请输入按钮名称" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="请求地址:" label-width="120px">
                <el-input v-model="item.requestUrl" placeholder="请输入请求地址" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否批量操作:" label-width="120px">
                <el-switch v-model="item.isBatch" :active-value="1" :inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="item.isBatch">
              <el-form-item label="ids字段:" label-width="120px">
                <el-input v-model="item.batchId" placeholder="请输入ids字段" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <h4 class="">操作字段:</h4>
              <el-col :span="6">
                <el-form-item label="类型:" label-width="120px">
                  <el-select v-model="item.queryType" placeholder="请选择类型">
                    <el-option v-for="(items, i) in configQueryList" :key="i" :label="items.name" :value="items.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
          </el-col>
        </el-row>
      </el-form> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()" size="small">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirm()" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getOperate } from '@/api/system';
import { getConfigTable, getMenuButtons, addOrEditAutomatedConfigTable } from '@/api/configManage';
export default {
  props: {
    showConfigBtn: {
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
      configQueryList: this.$store.state.common.configQueryList,
      operateChecks: [],
      tableData: [
        { btnName: '测试', requestUrl: '', isBatch: 0, fieldsType: 'input', fieldsName: '', mergeRowNum: 1 },
        { btnName: '测试', requestUrl: '', isBatch: 0, fieldsType: 'input', fieldsName: '', mergeRowNum: 2 },
        { btnName: '测试', requestUrl: '', isBatch: 0, fieldsType: 'input', fieldsName: '', mergeRowNum: 3 },
        { btnName: '测试', requestUrl: '', isBatch: 0, fieldsType: 'select', fieldsName: '', mergeRowNum: 4 }
      ],
      mergeColumnIndexs: [0, 1, 2, 7],
      form: {
        id: 0,
        buttons: [{ btnName: '', requestUrl: '', isBatch: 0, batchId: '', operateFields: [] }],
        functions: undefined,
        dataUrl: undefined,
        isMultipe: undefined,
        isRow: undefined,
        rowWith: 180,
        fields: undefined
      }
    };
  },
  watch: {
    showConfigBtn(val) {
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    async getData() {
      try {
        this.boxLoading = true;
        const roleId = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleId);
        const buttons = await getMenuButtons({ roleId: roleId, key: this.itemObj.key });

        // this.tableData = buttons.data.datas
        //   .filter(item => item.unique !== '1003')
        //   .map(items => {
        //     {
        //       return {
        //         btnName: items.name,
        //         requestUrl: '',
        //         isBatch: 0,
        //         fieldsType: 'input',
        //         submitFieldsName: '',
        //         matchFiledsName: '',
        //         mergeRowNum: 1
        //       };
        //     }
        //   });

        this.boxLoading = false;
      } catch (error) {
        this.boxLoading = false;
      }
    },
    tableMethod({ row, column, rowIndex, columnIndex }) {
      // if (this.mergeColumnIndexs.indexOf(columnIndex) > -1) {
      //   return {
      //     rowspan: row.mergeRowNum,
      //     colspan: 1
      //   };
      // } else {
      //   return {
      //     rowspan: 0,
      //     colspan: 0
      //   };
      // }
    },
    handleAddFiled(row, index) {
      const rowNumber = row.mergeRowNum;
      this.tableData[index].mergeRowNum++;
      const itemObj = { btnName: row.btnName, requestUrl: '', isBatch: 0, fieldsType: '', fieldsName: '' };
      this.tableData.splice(index + rowNumber, 0, itemObj);
    },
    handleDeleteFiled(row, index) {
      console.log(row);
      console.log(index);
      // this.tableData.splice(index, 1);
    },

    // 添加
    confirm() {
      let form = this.form;
      console.log(JSON.parse(JSON.stringify(this.tableData)));
      return;
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          addOrEditAutomatedConfigTable(form)
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
      // this.$refs.form.resetFields();
      this.form = {
        id: 0,
        buttons: [{ btnName: '', requestUrl: '', isBatch: 0, batchId: '', operateFields: [] }],
        functions: undefined,
        dataUrl: undefined,
        isMultipe: undefined,
        isRow: undefined,
        rowWith: 180,
        fields: undefined
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
/deep/ .el-select {
  display: block;
}
.checkbox-item {
  margin-bottom: 10px;
}
.config-table-list {
  padding: 0 0 20px 0;
  border-top: 1px solid #b8d7f7;
  .config-list-close {
    min-height: 38px;
    padding: 10px 0;
    text-align: right;
    img {
      cursor: pointer;
      width: 18px;
      height: 18px;
      margin-left: 10px;
      vertical-align: middle;
    }
  }
}
.config-table-operate {
  padding: 10px 0;
  text-align: right;
  border-top: 1px solid #b8d7f7;
}
</style>
