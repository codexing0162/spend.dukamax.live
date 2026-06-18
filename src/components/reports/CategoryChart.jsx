import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getCategoryColor } from '../../utils/calculations'
import { formatCurrency } from '../../utils/formatters'
import { useLanguage } from '../../hooks/useLanguage'

const RADIAN = Math.PI / 180

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.06) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="11"
      fontWeight="700"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function CustomTooltip({ active, payload, currency }) {
  if (active && payload && payload.length) {
    const entry = payload[0]
    return (
      <div
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '10px 14px',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div style={{ fontWeight: 700, color: entry.payload.fill, marginBottom: '2px' }}>
          {entry.name}
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
          {formatCurrency(entry.value, currency)}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {(entry.payload.percent * 100).toFixed(1)}% of total
        </div>
      </div>
    )
  }
  return null
}

function CategoryChart({ data, currency = 'TZS' }) {
  const { t } = useLanguage()

  if (!data || data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '24px' }}>
        <div className="empty-icon">📊</div>
        <p>{t('noPurchasesYet')}</p>
      </div>
    )
  }

  const chartData = data.map((d) => ({
    name: d.category,
    value: d.amount,
    fill: getCategoryColor(d.category),
    percent: d.percent / 100,
  }))

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={40}
            labelLine={false}
            label={renderCustomLabel}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip currency={currency} />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
        {data.map((d) => (
          <div key={d.category} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '3px',
                background: getCategoryColor(d.category),
                flexShrink: 0,
              }}
            />
            <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text)' }}>{d.category}</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>
              {formatCurrency(d.amount, currency)}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '40px', textAlign: 'right' }}>
              {d.percent.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryChart
