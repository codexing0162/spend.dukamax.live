import Dexie from 'dexie'

export const db = new Dexie('DukaMaxPesaSafari')

db.version(1).stores({
  sessions: '++id, name, createdAt, status',
  purchases: '++id, sessionId, productName, shopName, category, createdAt',
  priceHistory: '++id, productName, amount, createdAt',
  settings: 'key'
})

export default db
