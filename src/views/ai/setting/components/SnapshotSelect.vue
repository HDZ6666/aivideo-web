<template>
  <div class="snapshot-select">
    <div v-if="modelValue" class="snapshot-card">
      <el-image
        :src="toImageUrl(modelValue)"
        :preview-src-list="[toImageUrl(modelValue)]"
        :z-index="4000"
        fit="cover"
        preview-teleported
        class="snapshot-img"
      />
      <el-button type="danger" link @click="clear">移除</el-button>
    </div>
    <el-button v-else type="primary" plain @click="dialogVisible = true">选择历史快照</el-button>
    <SnapshotDialog v-model="dialogVisible" @confirm="choose" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { toImageUrl } from '../../utils'
import SnapshotDialog from './SnapshotDialog.vue'

defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = ref(false)

function choose(url) {
  emit('update:modelValue', url)
}

function clear() {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.snapshot-select {
  display: flex;
  align-items: center;
}

.snapshot-card {
  display: flex;
  align-items: center;
  gap: 8px;
}

.snapshot-img {
  width: 120px;
  height: 88px;
  background: #000;
}
</style>
