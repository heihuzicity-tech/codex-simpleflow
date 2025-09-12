import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; email?: string; password?: string; confirm?: string }>({})
  const { register, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const fe: { username?: string; email?: string; password?: string; confirm?: string } = {}
    if (!username.trim() || username.trim().length < 3) fe.username = '用户名至少 3 个字符'
    if (email && !/.+@.+\..+/.test(email)) fe.email = '邮箱格式不正确'
    if (!password || password.length < 8) fe.password = '密码至少 8 位'
    if (confirm !== password) fe.confirm = '两次输入的密码不一致'
    setFieldErrors(fe)
    if (Object.keys(fe).length > 0) return
    register(username, password, email || undefined, true)
      .then((res) => {
        if (res.ok) {
          setOk('注册成功并已登录，正在跳转...')
          setTimeout(() => navigate('/dashboard', { replace: true }), 200)
        }
        else setError(res.error)
      })
      .catch(() => setError('注册失败，请重试'))
  }

  return (
    <section className="card">
      <h1>注册</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {ok && <div className="alert" style={{border:'1px solid #2e7d32', background:'rgba(46,125,50,0.15)', color:'#b9f6ca'}}>{ok}</div>}
      <form onSubmit={onSubmit} className="form">
        <label>
          <span>用户名</span>
          <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} required minLength={3} />
          {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
        </label>
        <label>
          <span>邮箱（可选）</span>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
        </label>
        <label>
          <span>密码</span>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 8 位"
              autoComplete="new-password"
              required
              minLength={8}
            />
            <button className="link" type="button" onClick={() => setShowPassword(v=>!v)}>
              {showPassword ? '隐藏' : '显示'}
            </button>
          </div>
          {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
        </label>
        <label>
          <span>确认密码</span>
          <input type={showPassword ? 'text' : 'password'} value={confirm} onChange={(e)=>setConfirm(e.target.value)} required minLength={8}/>
          {fieldErrors.confirm && <div className="field-error">{fieldErrors.confirm}</div>}
        </label>
        <div className="row actions">
          <button type="submit" className="btn primary">注册</button>
          <Link to="/login" className="btn">返回登录</Link>
        </div>
      </form>
      <div className="muted">任务1占位，任务2/3将接入登录态与受保护路由。</div>
    </section>
  )
}
