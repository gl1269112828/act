<template>
  <LTable
    class="l-table"
    :tableLoading="tableLoading"
    :tableHeader="tableHeader"
    :tableData="tableData"
    :total="total"
    :tableQueryData.sync="tableQueryData"
    :selectTableData.sync="selectTableData"
    :getTableList="getTableList"
  >
    <template :slot="'priceJson'" slot-scope="scope">
      <!-- <slot :name="item.prop" :data="scope.row" v-if="item.render"></slot> -->
      <el-table-column :prop="scope.data.prop" :label="scope.data.label"></el-table-column>
    </template>
    <template :slot="item.prop" slot-scope="scope" v-for="(item, i) in tableSlotData">
      <span :key="i">
        <template v-for="(itemJ, j) in item.selectArray">
          <el-tag :key="j" v-if="itemJ.value.indexOf(scope.data[item.prop]) > -1">
            {{ itemJ.key }}
          </el-tag>
        </template>
      </span>
    </template>
  </LTable>
</template>

<script>
export default {
  props: {
    tableLoading: {
      type: false,
      default: true
    },
    tableHeader: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    tableSlotData: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    tableQueryData: {
      type: Object,
      default: () => ({})
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
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
