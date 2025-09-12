import { Link, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { AuthProvider, useAuth } from './auth/AuthProvider'

function Header() {
  const { user, logout } = useAuth()
  return (
    <header className="app-header">
      <nav className="container nav">
        <div className="brand">Simple Login</div>
        <div className="links">
          <Link to="/login">登录</Link>
          <Link to="/register">注册</Link>
          <Link to="/dashboard">Dashboard</Link>
          {user && (
            <>
              <span style={{ marginLeft: 8, opacity: 0.8 }}>Hi, {user.username}</span>
              <button className="btn" style={{ marginLeft: 8 }} onClick={logout}>退出</button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="*" element={<Login />} />
          </Routes>
        </main>
        <footer className="footer container">React + Vite · 任务1骨架</footer>
      </div>
    </AuthProvider>
  )
}

function Protected({ children }: { children: JSX.Element }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}
