<template>
  <div class="add">
    <el-dialog title="添加菜单" :visible="showAdd" :close-on-click-modal="false" width="800px" top="10vh" @close="hidePopups()">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small" v-loading="boxLoading" element-loading-text="拼命加载中">
        <el-form-item label="菜单名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" clearable />
        </el-form-item>
        <el-form-item label="菜单url:" prop="url">
          <el-input v-model="form.url" placeholder="请输入菜单url" clearable />
        </el-form-item>
        <el-form-item label="菜单图标:" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入菜单图标" clearable />
        </el-form-item>
        <el-form-item label="配置key:">
          <el-input v-model="form.key" placeholder="请输入配置key" clearable />
        </el-form-item>
        <el-form-item label="菜单层级:" prop="level">
          <el-select v-model="form.level" placeholder="请选择菜单层级" clearable>
            <el-option v-for="(item, i) in levelList" :key="i" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级菜单:" v-if="form.level === 2" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择父级菜单" clearable>
            <el-option v-for="(item, i) in parentMenuDatas" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单按钮:" v-if="form.level === 2">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="operateList" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(item, i) in menuCheckOptions" :key="i" :label="item.id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
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
import { addOrEditMenus, getMenus, getOperate } from '@/api/system';
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
      boxLoading: false,
      levelList: [
        { name: '顶级', value: 1 },
        { name: '一级', value: 2 }
      ],
      parentMenuDatas: [],
      checkAll: false,
      isIndeterminate: false,
      menuCheckOptions: [],
      operateList: [],
      form: {
        name: undefined, //菜单名称
        url: undefined, //菜单url
        icon: undefined, //菜单图标
        level: undefined, //菜单层级
        parentId: undefined, //父级菜单
        key: undefined,
        operates: undefined //按钮权限
      },
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }], //菜单名称
        url: [{ required: true, message: '请输入菜单url', trigger: 'blur' }], //菜单url
        level: [{ required: true, message: '请选择菜单层级', trigger: 'change' }], //菜单层级
        parentId: [{ required: true, message: '请选择父级菜单', trigger: 'change' }] //父级菜单
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
      try {
        this.boxLoading = true;
        const operateResponse = await getOperate({ pageIndex: 1, pageMax: 9999, dynamicFilters: [] });
        this.menuCheckOptions = operateResponse.data.datas;
        const menuResponse = await getMenus({ pageIndex: 1, pageMax: 9999, dynamicFilters: [{ field: 'parentId', operate: 'Equal', value: '99999' }] });
        this.parentMenuDatas = menuResponse.data.datas;
        this.boxLoading = false;
      } catch (error) {
        this.boxLoading = false;
      }
    },
    handleCheckAllChange(val) {
      if (val) {
        this.operateList = this.menuCheckOptions.map(item => item.id);
      } else {
        this.operateList = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.menuCheckOptions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.menuCheckOptions.length;
    },
    // 添加
    confirm() {
      let form = this.form;
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          if (form.level === 1) {
            form.parentId = 99999;
          }
          form.operates = JSON.stringify(this.operateList);
          addOrEditMenus(form)
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
      this.$refs.form.resetFields();
      this.operateList = [];
      this.checkAll = false;
      this.isIndeterminate = false;
      this.$store.dispatch('common/initObj', this.form);
    },
    cancel() {
      this.hidePopups();
    }
  }
};
</script>
<style lang="scss" scoped></style>
