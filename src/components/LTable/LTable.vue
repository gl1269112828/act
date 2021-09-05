<template>
  <div class="l-table">
    <el-table v-loading="isLoading" :data="tableData" size="medium" :row-key="rowKey" @selection-change="mirChange" :row-style="rowStyle" :max-height="tableHeight">
      <template v-for="(item, i) in tableHeader">
        <el-table-column :key="i" type="selection" :width="item.width || ''" align="center" v-if="item.label == 'selection'"></el-table-column>
        <el-table-column
          :key="i"
          type="index"
          :index="indexMethod"
          :label="'序号'"
          :width="item.minWidth || ''"
          align="center"
          v-else-if="item.label == '序号' || item.label == 'ID'"
        ></el-table-column>
        <el-table-column
          :type="item.label == 'expand' ? 'expand' : ''"
          :key="i"
          :prop="item.prop"
          :label="item.label == 'expand' ? '' : item.label"
          :align="item.align || 'center'"
          :width="item.width && item.width !== '0' ? item.width : ''"
          :min-width="item.minWidth || ''"
          :fixed="item.fixed || false"
          :sortable="item.sortable || false"
          :show-overflow-tooltip="item.render ? false : true"
          v-else
        >
          <template slot-scope="scope">
            <slot :name="item.prop" :data="scope.row" v-if="item.render"></slot>
            <el-tooltip class="item" effect="dark" :content="scope.row[item.prop]" placement="top" v-else-if="item.tooltip">
              <div class="toltip-content" :style="{ width: item.width + 'px' }">{{ scope.row[item.prop] }}</div>
            </el-tooltip>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <Pagination :total="total" :page.sync="pageData.pageIndex" :limit.sync="pageData.pageMax" @pagination="handlePagination" v-if="!isPagination" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
export default {
  name: 'l-table',
  components: {
    Pagination
  },
  props: {
    isLoading: {
      type: Boolean,
      defalut: false
    },
    isPagination: {
      type: Boolean,
      defalut: false
    },
    total: {
      type: Number,
      defalut: 0
    },
    pageData: {
      type: Object,
      defalut: () => ({
        pageIndex: 1,
        pageMax: 10
      })
    },
    tableHeader: {
      type: Array,
      defalut: () => []
    },
    tableData: {
      type: Array,
      defalut: () => []
    },
    getTableList: {
      type: Function,
      defalut: null
    },
    selectTableData: {
      type: Array,
      defalut: () => []
    },
    rowStyle: {
      type: Function,
      defalut: null
    },
    rowKey: {
      type: String,
      default: '$index'
    },
    tooltip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableHeight: 800
    };
  },
  created() {
    // this.$nextTick(() => {
    //   let searchFromHeight = 0;
    //   let batchOperatorHeight = 0;
    //   if (this.$slots.searchFrom) {
    //     searchFromHeight = this.$slots.searchFrom[0].componentInstance.$el.clientHeight;
    //   }
    //   if (this.$slots.batchOperator) {
    //     batchOperatorHeight = this.$slots.batchOperator[0].componentInstance.$el.clientHeight;
    //   }
    //   window.innerHeight - 134 - 172 < 500 ? (this.tableHeight =  500) : (this.tableHeight = window.innerHeight);
    // });
  },
  methods: {
    //计算序号
    indexMethod(index) {
      if (!this.isPagination) {
        return index + 1 + (this.pageData.pageIndex - 1) * this.pageData.pageMax;
      } else {
        return index + 1;
      }
    },
    handlePagination() {
      this.getTableList();
    },
    mirChange(selection) {
      this.$emit('update:selectTableData', selection);
    }
  }
};
</script>
<style lang="scss" scoped>
.l-table {
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  overflow-x: hidden;
  overflow-y: auto;
  ::v-deep .el-table th {
    user-select: initial;
    padding: 15px 0;
    background: #fafafa;
    font-weight: 500;
    font-size: 14px;
    font-family: Source Han Sans CN;
    color: #262626;
  }
  ::v-deep .el-table td {
    padding: 8px 0;
    // border: none;
  }
  ::v-deep .el-table .cell {
    line-height: 30px;
  }
}
.l-table::-webkit-scrollbar {
  display: none;
}
.toltip-content {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
