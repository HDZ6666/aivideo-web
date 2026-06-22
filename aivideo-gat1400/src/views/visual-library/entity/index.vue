<template>
  <EntityPage :config-key="configKey" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import EntityPage from '../components/EntityPage.vue'

const route = useRoute()
const configKey = computed(() => route.meta.configKey)
</script>
