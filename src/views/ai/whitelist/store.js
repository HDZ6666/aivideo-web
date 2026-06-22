const STORAGE_KEY = 'aivideo-viid-whitelist-areas'

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch (error) {
    console.warn('[whitelist] failed to read store', error)
    return []
  }
}

function writeStore(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function normalizeArea(area = {}) {
  return {
    id: area.id || '',
    name: area.name || '',
    cameras: Array.isArray(area.cameras) ? area.cameras : [],
    images: Array.isArray(area.images) ? area.images : [],
    syncAt: area.syncAt || 0,
    createdAt: area.createdAt || 0,
    updatedAt: area.updatedAt || 0
  }
}

export function listWhitelistAreas() {
  return readStore()
    .map((item) => normalizeArea(item))
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
}

export function getWhitelistArea(id) {
  const area = readStore().find((item) => item.id === id)
  return area ? normalizeArea(area) : null
}

export function upsertWhitelistArea(area) {
  const next = normalizeArea(area)
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

export function removeWhitelistArea(id) {
  const next = readStore().filter((item) => item.id !== id)
  writeStore(next)
  return next
}

export function createWhitelistAreaId() {
  const rand = Math.random().toString(36).slice(2, 7)
  return `wl_${Date.now()}_${rand}`
}

export function createWhitelistImageId() {
  const rand = Math.random().toString(36).slice(2, 8)
  return `wli_${Date.now()}_${rand}`
}
