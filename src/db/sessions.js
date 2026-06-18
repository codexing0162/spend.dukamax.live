import { db } from './database'

export async function createSession(data) {
  const session = {
    name: data.name,
    budget: Number(data.budget),
    spent: 0,
    currency: data.currency || 'TZS',
    notes: data.notes || '',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: data.startDate || new Date().toISOString().split('T')[0],
  }
  const id = await db.sessions.add(session)
  return { ...session, id }
}

export async function getSessions() {
  return await db.sessions.orderBy('createdAt').reverse().toArray()
}

export async function getSession(id) {
  return await db.sessions.get(Number(id))
}

export async function updateSession(id, data) {
  const updated = { ...data, updatedAt: new Date().toISOString() }
  await db.sessions.update(Number(id), updated)
  return await db.sessions.get(Number(id))
}

export async function deleteSession(id) {
  await db.purchases.where('sessionId').equals(Number(id)).delete()
  await db.sessions.delete(Number(id))
}

export async function getActiveSession() {
  const sessions = await db.sessions
    .where('status')
    .equals('active')
    .reverse()
    .sortBy('createdAt')
  return sessions.length > 0 ? sessions[0] : null
}

export async function closeSession(id) {
  await db.sessions.update(Number(id), {
    status: 'closed',
    updatedAt: new Date().toISOString(),
  })
}
