import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type User = { id: string; username: string; email?: string }
type StoredUser = User & { passwordHash: string }

type AuthResult = { ok: true } | { ok: false; error: string }

type AuthContextValue = {
  ready: boolean
  user: User | null
  login: (identifier: string, password: string, remember?: boolean) => Promise<AuthResult>
  register: (username: string, password: string, email?: string, remember?: boolean) => Promise<AuthResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const USERS_KEY = 'sl.users'
const SESSION_KEY = 'sl.session'

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? (list as StoredUser[]) : []
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function saveSession(user: User | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  else localStorage.removeItem(SESSION_KEY)
}

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder()
  const data = enc.encode(input)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const bytes = new Uint8Array(digest)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

function findByIdentifier(list: StoredUser[], identifier: string): StoredUser | undefined {
  const lowered = identifier.toLowerCase()
  return list.find(u => u.username.toLowerCase() === lowered || (u.email && u.email.toLowerCase() === lowered))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const u = loadSession()
    if (u) setUser(u)
    setReady(true)
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    ready,
    user,
    login: async (identifier, password, remember = true) => {
      const users = loadUsers()
      const found = findByIdentifier(users, identifier)
      if (!found) return { ok: false, error: '账号或密码错误' }
      const hash = await sha256Hex(password)
      if (hash !== found.passwordHash) return { ok: false, error: '账号或密码错误' }
      const publicUser: User = { id: found.id, username: found.username, email: found.email }
      setUser(publicUser)
      if (remember) saveSession(publicUser)
      return { ok: true }
    },
    register: async (username, password, email, remember = true) => {
      const users = loadUsers()
      const existed = users.find(u => u.username.toLowerCase() === username.toLowerCase())
      if (existed) return { ok: false, error: '用户名已被占用' }
      const id = crypto.randomUUID()
      const passwordHash = await sha256Hex(password)
      const stored: StoredUser = { id, username, email, passwordHash }
      saveUsers([...users, stored])
      const publicUser: User = { id, username, email }
      setUser(publicUser)
      if (remember) saveSession(publicUser)
      return { ok: true }
    },
    logout: () => { setUser(null); saveSession(null) }
  }), [ready, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

