<template>
  <div id="mapscreen">
    <ReusableCockpit 
      title="AI地图监控系统"
      map-title="设备分布"
      :show-right-panel="true" 
      @marker-click="handleMarkerClick"
    />
  </div>
</template>

<script setup>
import ReusableCockpit from '@/components/Mapscreen/ReusableCockpit/index.vue'

const handleMarkerClick = (data) => {
  console.log('地图标记点击:', data)
}
</script>

<style scoped>
#mapscreen {
  width: 100vw;
  height: 100vh;
  background: #001d58;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
}
</style>