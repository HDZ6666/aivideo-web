const ALARM_DETAIL_PATH = '/pages/alarm/detail'

const ALARM_ID_KEYS = ['id', 'alarmId', 'alarm_id']

function normalizePath(path: string) {
  const purePath = path.split('?')[0]
  return purePath.startsWith('/') ? purePath : `/${purePath}`
}

function decodeOptionValue(value: unknown) {
  if (value === undefined || value === null)
    return ''

  try {
    return decodeURIComponent(String(value))
      .trim()
  }
  catch {
    return String(value)
      .trim()
  }
}

function decodeRawOptionValue(value: unknown) {
  if (value === undefined || value === null)
    return ''

  try {
    return decodeURIComponent(String(value))
  }
  catch {
    return String(value)
  }
}

function getQueryValueFromRawUrl(url: string, queryKey: string) {
  const queryString = url.split('?')[1]?.split('#')[0]
  if (!queryString)
    return ''

  const queryItems = queryString.split('&').filter(Boolean)
  for (const item of queryItems) {
    const [rawKey, ...rawValueParts] = item.split('=')
    const key = decodeRawOptionValue(rawKey)
    if (key === queryKey) {
      return decodeRawOptionValue(rawValueParts.join('='))
    }
  }

  return ''
}

function getAuthorizationFromLocationHash() {
  // H5 hash route keeps `+` as-is, while uni onLoad options may parse it as space.
  if (typeof window === 'undefined')
    return ''

  return getQueryValueFromRawUrl(window.location.hash, 'authorization')
}

export function encodeAuthorizationForQuery(authorization: string) {
  return encodeURIComponent(authorization)
}

export function parseUrlPathAndQuery(url: string) {
  const [path, queryString = ''] = url.split('?')
  const query: Record<string, string> = {}

  queryString.split('&').filter(Boolean).forEach((item) => {
    const [rawKey, ...rawValueParts] = item.split('=')
    const key = decodeOptionValue(rawKey)
    query[key] = decodeOptionValue(rawValueParts.join('=') || '')
  })

  return { path, query }
}

export function isAlarmDetailPath(path: string) {
  return normalizePath(path) === ALARM_DETAIL_PATH
}

export function getAlarmIdFromOptions(options?: Record<string, unknown>) {
  if (!options)
    return undefined

  for (const key of ALARM_ID_KEYS) {
    const rawValue = options[key]
    if (rawValue === undefined || rawValue === null || rawValue === '')
      continue

    const alarmId = Number.parseInt(String(rawValue), 10)
    if (Number.isFinite(alarmId))
      return alarmId
  }

  return undefined
}

export function getAuthorizationFromOptions(options?: Record<string, unknown>) {
  const rawHashAuthorization = getAuthorizationFromLocationHash()
  if (rawHashAuthorization)
    return rawHashAuthorization

  const authorizationFromOptions = decodeRawOptionValue(options?.authorization)
  return authorizationFromOptions || undefined
}

export function isPublicAlarmDetailEntry(
  path: string,
  options?: Record<string, unknown>,
) {
  if (!isAlarmDetailPath(path))
    return false

  return !!getAuthorizationFromOptions(options)
}
