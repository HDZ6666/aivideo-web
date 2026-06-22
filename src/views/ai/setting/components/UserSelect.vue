<template>
  <div class="select-list">
    <el-button type="primary" @click="dialogVisible = true">选择人员</el-button>
    <el-button v-if="model.length" type="danger" link @click="clear">清空</el-button>
    <div v-if="model.length" class="tag-list">
      <el-tag v-for="item in model" :key="item.id" closable @close="remove(item.id)">
        {{ item.name }}
      </el-tag>
    </div>
    <el-empty v-else description="未选择人员" :image-size="44" />
    <UserSelectDialog v-model="dialogVisible" :selected="model" @confirm="updateValue" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import UserSelectDialog from './UserSelectDialog.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = ref(false)
const model = computed(() => props.modelValue || [])

function updateValue(value) {
  emit('update:modelValue', value)
}

function clear() {
  updateValue([])
}

function remove(id) {
  updateValue(model.value.filter((item) => item.id !== id))
}
</script>

<style scoped>
.select-list {
  width: 100%;
}

.tag-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}
</style>

