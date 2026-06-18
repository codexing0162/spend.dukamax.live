import { db } from '../db/database'
import { getSessions } from '../db/sessions'
import { getAllPurchases } from '../db/purchases'

/**
 * Export all data to a JSON file download
 */
export async function exportToJSON() {
  const sessions = await getSessions()
  const purchases = await getAllPurchases()
  const priceHistory = await db.priceHistory.toArray()

  const exportData = {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    app: 'DukaMax PesaSafari',
    sessions,
    purchases,
    priceHistory,
  }

  const json = JSON.stringify(exportData, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `pesasafari-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Import data from a JSON file
 * @param {File} file
 */
export async function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result)

        // Validate structure
        if (!data.sessions || !data.purchases) {
          throw new Error('Invalid file format: missing sessions or purchases')
        }

        // Clear existing data
        await db.sessions.clear()
        await db.purchases.clear()
        await db.priceHistory.clear()

        // Import sessions (strip ids so Dexie auto-generates)
        for (const session of data.sessions) {
          const { id, ...rest } = session
          await db.sessions.add(rest)
        }

        // Import purchases
        for (const purchase of data.purchases) {
          const { id, ...rest } = purchase
          await db.purchases.add(rest)
        }

        // Import price history if present
        if (data.priceHistory && Array.isArray(data.priceHistory)) {
          for (const record of data.priceHistory) {
            const { id, ...rest } = record
            await db.priceHistory.add(rest)
          }
        }

        resolve({ sessions: data.sessions.length, purchases: data.purchases.length })
      } catch (err) {
        reject(err)
      }
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Clear all data
 */
export async function clearAllData() {
  await db.sessions.clear()
  await db.purchases.clear()
  await db.priceHistory.clear()
  await db.settings.clear()
}
