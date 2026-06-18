import { db } from './database'
import { recordPrice } from './priceHistory'

export async function addPurchase(data) {
  const purchase = {
    sessionId: Number(data.sessionId),
    productName: data.productName,
    shopName: data.shopName || '',
    category: data.category || 'Other',
    amount: Number(data.amount),
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
  }

  const id = await db.purchases.add(purchase)

  // Update session spent amount
  const session = await db.sessions.get(Number(data.sessionId))
  if (session) {
    const newSpent = (session.spent || 0) + Number(data.amount)
    await db.sessions.update(Number(data.sessionId), {
      spent: newSpent,
      updatedAt: new Date().toISOString(),
    })
  }

  // Record price history
  await recordPrice(data.productName, Number(data.amount))

  return { ...purchase, id }
}

export async function getPurchases(sessionId) {
  return await db.purchases
    .where('sessionId')
    .equals(Number(sessionId))
    .reverse()
    .sortBy('createdAt')
}

export async function getPurchase(id) {
  return await db.purchases.get(Number(id))
}

export async function deletePurchase(id) {
  const purchase = await db.purchases.get(Number(id))
  if (!purchase) return

  await db.purchases.delete(Number(id))

  // Update session spent amount
  const session = await db.sessions.get(purchase.sessionId)
  if (session) {
    const newSpent = Math.max(0, (session.spent || 0) - purchase.amount)
    await db.sessions.update(purchase.sessionId, {
      spent: newSpent,
      updatedAt: new Date().toISOString(),
    })
  }
}

export async function getPurchasesByCategory(sessionId) {
  const purchases = await getPurchases(sessionId)
  const grouped = {}

  purchases.forEach((p) => {
    const cat = p.category || 'Other'
    if (!grouped[cat]) {
      grouped[cat] = { category: cat, total: 0, count: 0, purchases: [] }
    }
    grouped[cat].total += p.amount
    grouped[cat].count += 1
    grouped[cat].purchases.push(p)
  })

  return Object.values(grouped).sort((a, b) => b.total - a.total)
}

export async function getPurchasesByShop(sessionId) {
  const purchases = await getPurchases(sessionId)
  const grouped = {}

  purchases.forEach((p) => {
    const shop = p.shopName || 'Unknown Shop'
    if (!grouped[shop]) {
      grouped[shop] = { shopName: shop, total: 0, count: 0, purchases: [] }
    }
    grouped[shop].total += p.amount
    grouped[shop].count += 1
    grouped[shop].purchases.push(p)
  })

  return Object.values(grouped).sort((a, b) => b.total - a.total)
}

export async function getAllPurchases() {
  return await db.purchases.orderBy('createdAt').reverse().toArray()
}
