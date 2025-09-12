import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({})
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const fe: { identifier?: string; password?: string } = {}
    if (!identifier.trim()) fe.identifier = '请输入用户名或邮箱'
    if (!password || password.length < 8) fe.password = '密码至少 8 位'
    setFieldErrors(fe)
    if (Object.keys(fe).length > 0) return

    login(identifier.trim(), password, remember)
      .then(res => {
        if (res.ok) {
          setOk('登录成功，正在跳转...')
          setTimeout(() => navigate('/dashboard', { replace: true }), 200)
        }
        else setError(res.error)
      })
      .catch(() => setError('登录失败，请重试'))
  }

  return (
    <section className="card">
      <h1>登录</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {ok && <div className="alert" style={{border:'1px solid #2e7d32', background:'rgba(46,125,50,0.15)', color:'#b9f6ca'}}>{ok}</div>}
      <form onSubmit={onSubmit} className="form">
        <label>
          <span>用户名或邮箱</span>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="yourname 或 you@example.com"
            autoComplete="username"
            required
          />
          {fieldErrors.identifier && <div className="field-error">{fieldErrors.identifier}</div>}
        </label>
        <label>
          <span>密码</span>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 8 位"
              autoComplete="current-password"
              required
              minLength={8}
            />
            <button className="link" type="button" onClick={() => setShowPassword(v => !v)}>
              {showPassword ? '隐藏' : '显示'}
            </button>
          </div>
          {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
        </label>
        <label className="row">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span>记住我</span>
        </label>
        <div className="row actions">
          <button type="submit" className="btn primary">登录</button>
          <Link to="/register" className="btn">去注册</Link>
        </div>
      </form>
      <div className="muted">任务1占位，任务2/3将接入登录态与受保护路由。</div>
    </section>
  )
}
