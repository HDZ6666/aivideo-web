const STORAGE_KEY = 'aivideo-viid-plan-maps'

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch (error) {
    console.warn('[plan-map] failed to read store', error)
    return []
  }
}

function writeStore(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function normalizePlan(plan = {}) {
  return {
    id: plan.id || '',
    name: plan.name || '',
    imageUrl: plan.imageUrl || '',
    imageWidth: Number(plan.imageWidth) || 0,
    imageHeight: Number(plan.imageHeight) || 0,
    cameras: Array.isArray(plan.cameras) ? plan.cameras : [],
    markers: Array.isArray(plan.markers) ? plan.markers : [],
    createdAt: plan.createdAt || 0,
    updatedAt: plan.updatedAt || 0
  }
}

export function listPlanMaps() {
  return readStore()
    .map((item) => normalizePlan(item))
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
}

export function getPlanMap(id) {
  const plan = readStore().find((item) => item.id === id)
  return plan ? normalizePlan(plan) : null
}

export function upsertPlanMap(plan) {
  const next = normalizePlan(plan)
  const list = readStore()
  const index = list.findIndex((item) => item.id === next.id)
  if (index > -1) {
    list.splice(index, 1, next)
  } else {
    list.unshift(next)
  }
  writeStore(list)
  return next
}

export function removePlanMap(id) {
  const list = readStore().filter((item) => item.id !== id)
  writeStore(list)
  return list
}

export function createPlanMapId() {
  const rand = Math.random().toString(36).slice(2, 7)
  return `pm_${Date.now()}_${rand}`
}
