<template>
  <div class="select-list">
    <el-button type="primary" :disabled="disabled" @click="dialogVisible = true">选择设备</el-button>
    <el-button v-if="!disabled && model.length" type="danger" link @click="clear">清空</el-button>
    <div v-if="model.length" class="tag-list">
      <el-tag
        v-for="item in model"
        :key="item.id"
        :closable="!disabled"
        @close="remove(item.id)"
      >
        {{ item.name || item.channelId || item.deviceId }}
      </el-tag>
    </div>
    <el-empty v-else description="未选择设备" :image-size="44" />
    <DeviceSelectDialog
      v-model="dialogVisible"
      :selected="model"
      :alarm-type-id="alarmTypeId"
      @confirm="updateValue"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import DeviceSelectDialog from './DeviceSelectDialog.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  alarmTypeId: {
    type: [String, Number],
    default: undefined
  },
  disabled: Boolean
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

