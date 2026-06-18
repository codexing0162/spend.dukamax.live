import React from 'react'
import { getCategoryColor, getCategoryIcon } from '../../utils/calculations'

const statusColors = {
  active: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', border: 'rgba(34,197,94,0.3)' },
  closed: { bg: 'rgba(100,116,139,0.15)', color: '#64748b', border: 'rgba(100,116,139,0.3)' },
  warning: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  danger: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  info: { bg: 'rgba(108,99,255,0.15)', color: '#6C63FF', border: 'rgba(108,99,255,0.3)' },
}

function Badge({ type = 'info', label, category, size = 'md', icon }) {
  const isCategory = !!category
  let bg, color, border

  if (isCategory) {
    const catColor = getCategoryColor(category)
    bg = `${catColor}22`
    color = catColor
    border = `${catColor}44`
  } else {
    const colors = statusColors[type] || statusColors.info
    bg = colors.bg
    color = colors.color
    border = colors.border
  }

  const catIcon = isCategory ? getCategoryIcon(category) : icon

  const sizeStyle =
    size === 'sm'
      ? { fontSize: '0.7rem', padding: '2px 8px', gap: '4px' }
      : { fontSize: '0.78rem', padding: '4px 10px', gap: '5px' }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: bg,
        color,
        border: `1px solid ${border}`,
        borderRadius: '100px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        ...sizeStyle,
      }}
    >
      {catIcon && <span style={{ fontSize: '0.85em' }}>{catIcon}</span>}
      {label || category}
    </span>
  )
}

export default Badge
