import { db } from './database'

export async function recordPrice(productName, amount) {
  if (!productName || !amount) return

  await db.priceHistory.add({
    productName: productName.trim(),
    amount: Number(amount),
    createdAt: new Date().toISOString(),
  })
}

export async function getProductHistory(productName) {
  const records = await db.priceHistory
    .where('productName')
    .equalsIgnoreCase(productName.trim())
    .reverse()
    .sortBy('createdAt')

  return records.slice(0, 5)
}

export async function getAllProducts() {
  const all = await db.priceHistory.orderBy('productName').toArray()
  const unique = [...new Set(all.map((r) => r.productName))]
  return unique.sort()
}

export async function getProductStats(productName) {
  const history = await getProductHistory(productName)
  if (history.length === 0) return null

  const amounts = history.map((h) => h.amount)
  return {
    lastPrice: amounts[0],
    avgPrice: amounts.reduce((a, b) => a + b, 0) / amounts.length,
    minPrice: Math.min(...amounts),
    maxPrice: Math.max(...amounts),
    count: amounts.length,
  }
}

export async function clearPriceHistory() {
  await db.priceHistory.clear()
}
