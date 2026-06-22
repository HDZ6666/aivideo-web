export function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  const pad = (num) => String(num).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => resolve(event?.target?.result || '')
    reader.onerror = () => reject(new Error('read file failed'))
    reader.readAsDataURL(file)
  })
}

export function loadImageMeta(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve({
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height
      })
    }
    image.onerror = reject
    image.src = url
  })
}

export function normalizeOptionList(response) {
  const rawList = Array.isArray(response?.data) ? response.data : Array.isArray(response?.rows) ? response.rows : []
  return rawList
    .map((item) => ({
      value: item.value || item.id || item.ApeID || item.apeId || item.channelId || '',
      label: item.label || item.name || item.Name || item.channelName || item.value || item.id || ''
    }))
    .filter((item) => item.value)
}

export function getMockDeviceOptions(keyword = '') {
  const mockList = [
    { value: '34020000001320000001', label: '一层东门枪机01' },
    { value: '34020000001320000002', label: '一层东门枪机02' },
    { value: '34020000001320000003', label: '一层大厅球机01' },
    { value: '34020000001320000004', label: '二层走廊枪机01' },
    { value: '34020000001320000005', label: '二层走廊枪机02' },
    { value: '34020000001320000006', label: '二层电梯口枪机01' },
    { value: '34020000001320000007', label: '三层北侧枪机01' },
    { value: '34020000001320000008', label: '三层北侧枪机02' },
    { value: '34020000001320000009', label: '三层南侧球机01' },
    { value: '34020000001320000010', label: '地下车库A区枪机01' },
    { value: '34020000001320000011', label: '地下车库A区枪机02' },
    { value: '34020000001320000012', label: '地下车库B区枪机01' }
  ]
  const key = String(keyword || '').trim().toLowerCase()
  if (!key) return mockList
  return mockList.filter((item) => item.label.toLowerCase().includes(key) || item.value.toLowerCase().includes(key))
}
