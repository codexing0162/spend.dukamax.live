import { formatCurrency, formatPercent } from './formatters'

/**
 * Calculate the percentage of budget spent
 */
export function calcSpentPercent(spent, budget) {
  if (!budget || budget === 0) return 0
  return Math.min(100, (spent / budget) * 100)
}

/**
 * Calculate health score 0-100 based on sessions
 */
export function calcHealthScore(sessions) {
  if (!sessions || sessions.length === 0) return 50

  const completed = sessions.filter((s) => s.budget > 0)
  if (completed.length === 0) return 50

  let totalScore = 0
  let count = 0

  for (const s of completed) {
    if (!s.budget || s.budget === 0) continue
    const spentPct = (s.spent || 0) / s.budget
    let sessionScore = 100

    if (spentPct > 1.2) sessionScore = 20
    else if (spentPct > 1.0) sessionScore = 40
    else if (spentPct > 0.9) sessionScore = 60
    else if (spentPct > 0.75) sessionScore = 75
    else if (spentPct > 0.5) sessionScore = 90
    else sessionScore = 100

    totalScore += sessionScore
    count++
  }

  const baseScore = count > 0 ? totalScore / count : 50

  // Bonus for consistent usage (more sessions = better data)
  const consistencyBonus = Math.min(10, sessions.length * 2)

  return Math.min(100, Math.round(baseScore * 0.9 + consistencyBonus))
}

/**
 * Get health label and color from score
 */
export function getHealthLabel(score) {
  if (score >= 85) return { label: 'Excellent', color: '#22c55e' }
  if (score >= 65) return { label: 'Good', color: '#6C63FF' }
  if (score >= 40) return { label: 'Average', color: '#f59e0b' }
  return { label: 'Poor', color: '#ef4444' }
}

/**
 * Get health label key for i18n
 */
export function getHealthLabelKey(score) {
  if (score >= 85) return 'excellent'
  if (score >= 65) return 'good'
  if (score >= 40) return 'average'
  return 'poor'
}

/**
 * Generate smart advice strings
 */
export function calcSmartAdvice(session, purchases, previousSession, language = 'en') {
  if (!session || !purchases || purchases.length === 0) return []

  const advice = []
  const budget = session.budget || 0
  const spent = session.spent || 0
  const currency = session.currency || 'TZS'

  // Category analysis
  const categoryTotals = {}
  const shopTotals = {}

  for (const p of purchases) {
    const cat = p.category || 'Other'
    categoryTotals[cat] = (categoryTotals[cat] || 0) + p.amount

    const shop = p.shopName || 'Unknown'
    shopTotals[shop] = (shopTotals[shop] || 0) + p.amount
  }

  // Food spending check
  const foodSpent = categoryTotals['Food'] || 0
  if (budget > 0 && foodSpent / budget > 0.4) {
    const pct = Math.round((foodSpent / budget) * 100)
    if (language === 'sw') {
      advice.push(`Ulitumia ${pct}% ya bajeti kwenye chakula. Fikiria kununua kwa wingi kupunguza gharama.`)
    } else {
      advice.push(`You spent ${pct}% of budget on food. Consider bulk buying to reduce costs.`)
    }
  }

  // Single shop dominance
  const topShop = Object.entries(shopTotals).sort((a, b) => b[1] - a[1])[0]
  if (topShop && budget > 0 && topShop[1] / budget > 0.5) {
    const pct = Math.round((topShop[1] / budget) * 100)
    if (language === 'sw') {
      advice.push(`Duka "${topShop[0]}" lilipata ${pct}% ya bajeti yako. Tafuta maduka mbadala.`)
    } else {
      advice.push(`Shop "${topShop[0]}" took ${pct}% of your budget. Explore alternative vendors.`)
    }
  }

  // Too many purchases
  if (purchases.length > 10) {
    if (language === 'sw') {
      advice.push(`Ulifanya manunuzi ${purchases.length}. Fikiria kuchanganya safari za ununuzi kuokoa muda.`)
    } else {
      advice.push(`You made ${purchases.length} purchases. Consider combining shopping trips to save time.`)
    }
  }

  // Low remaining budget
  const remaining = budget - spent
  if (budget > 0 && remaining > 0 && remaining / budget < 0.1) {
    if (language === 'sw') {
      advice.push(`Kilichobaki ni ${formatCurrency(remaining, currency)} tu. Toa kipaumbele kwa mahitaji muhimu pekee.`)
    } else {
      advice.push(`Only ${formatCurrency(remaining, currency)} remaining. Prioritize essentials only.`)
    }
  }

  // Budget exceeded
  if (budget > 0 && spent > budget) {
    const excess = spent - budget
    if (language === 'sw') {
      advice.push(`Bajeti imezidiwa kwa ${formatCurrency(excess, currency)}. Kagua matumizi yako.`)
    } else {
      advice.push(`Budget exceeded by ${formatCurrency(excess, currency)}. Review your spending.`)
    }
  }

  // Compare to previous session
  if (previousSession && previousSession.budget > 0 && budget > 0) {
    const prevRate = (previousSession.spent || 0) / previousSession.budget
    const currRate = spent / budget

    if (currRate < prevRate * 0.85) {
      const pct = Math.round((1 - currRate / prevRate) * 100)
      if (language === 'sw') {
        advice.push(`Ulitumia ${pct}% chini ya kikao chako kilichopita. Nidhamu nzuri!`)
      } else {
        advice.push(`You spent ${pct}% less than your previous session. Great discipline!`)
      }
    } else if (currRate > prevRate * 1.2) {
      const pct = Math.round((currRate / prevRate - 1) * 100)
      if (language === 'sw') {
        advice.push(`Ulitumia ${pct}% zaidi ya kikao chako kilichopita. Kagua orodha yako.`)
      } else {
        advice.push(`You spent ${pct}% more than your previous session. Review your list.`)
      }
    }
  }

  // Category diversity
  const numCategories = Object.keys(categoryTotals).length
  if (numCategories >= 4) {
    if (language === 'sw') {
      advice.push(`Matumizi mazuri kwa aina ${numCategories} tofauti.`)
    } else {
      advice.push(`Good spending diversity across ${numCategories} categories.`)
    }
  } else if (numCategories === 1) {
    if (language === 'sw') {
      advice.push(`Matumizi yote katika aina moja. Fikiria kupanga bajeti iliyosawazishwa zaidi.`)
    } else {
      advice.push(`All spending in one category. Consider planning a more balanced budget.`)
    }
  }

  return advice.slice(0, 4) // Max 4 tips
}

/**
 * Get budget alert level based on spent vs budget
 * Returns null | '50' | '75' | '90' | 'exceeded'
 */
export function getBudgetAlertLevel(spent, budget) {
  if (!budget || budget === 0) return null
  const pct = (spent / budget) * 100

  if (pct >= 100) return 'exceeded'
  if (pct >= 90) return '90'
  if (pct >= 75) return '75'
  if (pct >= 50) return '50'
  return null
}

/**
 * Calculate category percentages for a session
 */
export function calcCategoryBreakdown(purchases, totalSpent) {
  const totals = {}

  for (const p of purchases) {
    const cat = p.category || 'Other'
    totals[cat] = (totals[cat] || 0) + p.amount
  }

  return Object.entries(totals)
    .map(([category, amount]) => ({
      category,
      amount,
      percent: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}

/**
 * Get category color
 */
const CATEGORY_COLORS = {
  Food: '#22c55e',
  Transport: '#3b82f6',
  Drinks: '#f59e0b',
  Supplies: '#8b5cf6',
  Wholesale: '#06b6d4',
  Retail: '#ec4899',
  Electronics: '#6366f1',
  Clothing: '#f97316',
  Other: '#94a3b8',
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || '#94a3b8'
}

/**
 * Get category icon
 */
const CATEGORY_ICONS = {
  Food: '🥦',
  Transport: '🚗',
  Drinks: '🥤',
  Supplies: '📦',
  Wholesale: '🏪',
  Retail: '🛍️',
  Electronics: '📱',
  Clothing: '👕',
  Other: '📌',
}

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || '📌'
}

export const CATEGORIES = [
  'Food',
  'Transport',
  'Drinks',
  'Supplies',
  'Wholesale',
  'Retail',
  'Electronics',
  'Clothing',
  'Other',
]
