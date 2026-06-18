/**
 * Format a number as currency
 * @param {number} amount
 * @param {string} currency
 * @returns {string} e.g. "500,000 TZS"
 */
export function formatCurrency(amount, currency = 'TZS') {
  if (amount === null || amount === undefined) return `0 ${currency}`
  const num = Number(amount)
  if (isNaN(num)) return `0 ${currency}`

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)

  return `${formatted} ${currency}`
}

/**
 * Format a currency value as compact (e.g. 1.5M, 500K)
 */
export function formatCurrencyCompact(amount, currency = 'TZS') {
  const num = Number(amount)
  if (isNaN(num)) return `0 ${currency}`

  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M ${currency}`
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K ${currency}`
  }
  return `${num} ${currency}`
}

/**
 * Format a Date or ISO string to a readable date
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

/**
 * Format a date as short
 */
export function formatDateShort(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(d)
}

/**
 * Format a percentage value
 * @param {number} value
 * @param {number} total
 * @returns {string} e.g. "65.3%"
 */
export function formatPercent(value, total) {
  if (!total || total === 0) return '0%'
  const pct = (value / total) * 100
  if (pct === 0) return '0%'
  if (pct >= 100) return '100%'
  return `${pct.toFixed(1)}%`
}

/**
 * Get a human-readable time since a date
 * @param {string|Date} date
 * @returns {string} e.g. "2 hours ago"
 */
export function getTimeSince(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''

  const now = new Date()
  const diffMs = now - d
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay === 1) return 'Yesterday'
  if (diffDay < 7) return `${diffDay}d ago`
  return formatDateShort(d)
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0'
  return new Intl.NumberFormat('en-US').format(Number(num))
}

/**
 * Truncate text
 */
export function truncate(str, maxLen = 30) {
  if (!str) return ''
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen - 3) + '...'
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
