<template>
  <div class="stream-player">
    <JessibucaPlayer
      v-if="url"
      ref="playerRef"
      :video-url="url"
      :auto-play="true"
      :muted="false"
      :show-operate-btns="true"
      :show-bandwidth="true"
      loading-text="视频加载中..."
      @error="emit('error', $event)"
      @timeout="emit('timeout')"
    />
    <div v-else class="stream-player__empty">
      <slot />
    </div>
    <el-button
      v-if="url"
      class="stream-player__clear"
      circle
      plain
      size="small"
      icon="Close"
      title="关闭当前画面"
      @click.stop="clear"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import JessibucaPlayer from '@/components/player/JessibucaPlayer.vue'

defineProps({
  url: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['clear', 'error', 'timeout'])
const playerRef = ref(null)

function play(url) {
  playerRef.value?.play(url)
}

function pause() {
  playerRef.value?.pause()
}

async function destroy() {
  await playerRef.value?.destroy?.()
}

function screenshot() {
  playerRef.value?.screenshot()
}

async function clear() {
  await destroy()
  emit('clear')
}

defineExpose({
  play,
  pause,
  destroy,
  screenshot,
  clear
})
</script>

<style lang="scss" scoped>
.stream-player {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
}

.stream-player__empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.72);
  font-size: 30px;
  font-weight: 600;
}

.stream-player__clear {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 3;
}
</style>

