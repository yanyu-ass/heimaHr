<template>
  <div>
    <el-cascader :value="value" size="mini" :options="treeData" :props="defaultProps" separator="-" @change="changeValue" />
  </div>
</template>

<script>
import { getDepartments } from '@/api/department'
import { transListToTree } from '@/utils'

export default {
  name: 'SelectTree',
  props: {
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        label: 'name',
        value: 'id'
      }
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    async getTreeData() {
      this.treeData = transListToTree(await getDepartments(), 0)
    },
    changeValue(checkedIdList) {
      if (checkedIdList.length) {
        this.$emit('input', checkedIdList.at(-1))
      } else {
        this.$emit('input', null)
      }
    }
  }
}
</script>

<style scoped>

</style>
