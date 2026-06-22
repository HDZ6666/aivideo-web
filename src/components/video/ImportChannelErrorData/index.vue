<template>
  <el-dialog
    v-model="open"
    title="导入通道数据成功，但数据存在重复"
    width="520px"
    top="2rem"
    append-to-body
    destroy-on-close
  >
    <div class="error-block">
      <div class="error-header">
        <span>重复国标ID</span>
        <el-button type="primary" plain size="small" icon="DocumentCopy" @click="copyList(gbIds)">复制</el-button>
      </div>
      <el-scrollbar max-height="180px">
        <el-empty v-if="!gbIds.length" description="无重复数据" />
        <ul v-else class="error-list">
          <li v-for="id in gbIds" :key="id">{{ id }}</li>
        </ul>
      </el-scrollbar>
    </div>

    <div class="error-block">
      <div class="error-header">
        <span>重复 App/Stream</span>
        <el-button type="primary" plain size="small" icon="DocumentCopy" @click="copyList(streams)">复制</el-button>
      </div>
      <el-scrollbar max-height="180px">
        <el-empty v-if="!streams.length" description="无重复数据" />
        <ul v-else class="error-list">
          <li v-for="item in streams" :key="item">{{ item }}</li>
        </ul>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

defineProps({
  gbIds: {
    type: Array,
    default: () => []
  },
  streams: {
    type: Array,
    default: () => []
  }
})

const open = ref(false)

function openDialog() {
  open.value = true
}

async function copyList(list) {
  const text = list.join(',')
  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}

defineExpose({
  openDialog
})
</script>

<style scoped>
.error-block + .error-block {
  margin-top: 18px;
}

.error-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 600;
}

.error-list {
  margin: 0;
  padding-left: 18px;
  line-height: 24px;
}
</style>
