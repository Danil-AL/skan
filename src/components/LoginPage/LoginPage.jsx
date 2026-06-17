import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import styles from './LoginPage.module.css'

const validateLogin = (v) => {
  if (!v.trim()) return 'Введите логин или номер телефона'
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRe = /^(\+7|8|7)[\d\s\-()]{10,15}$/
  if (!emailRe.test(v) && !phoneRe.test(v)) return 'Некорректный логин или номер телефона'
  return ''
}

const validatePassword = (v) => {
  if (!v) return 'Введите пароль'
  if (v.length < 6) return 'Пароль должен быть не менее 6 символов'
  return ''
}

const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState('login')
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const le = validateLogin(loginValue)
    const pe = validatePassword(password)
    setLoginError(le)
    setPasswordError(pe)
    if (le || pe) return
    await login({ name: loginValue || 'Алексей А.' })
    onNavigate('home')
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.leftText}>
            Для оформления подписки<br />на тариф необходимо<br />авторизоваться.
          </p>
          <img src="/skan/Characters.png" alt="" className={styles.leftImg} />
        </div>

        <div className={styles.card}>
          <img src="/skan/close.png" alt="" className={styles.closeIcon} />

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'login' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Войти
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'register' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Зарегистрироваться
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>Логин или номер телефона:</label>
            <input
              className={`${styles.input}${loginError ? ' ' + styles.inputError : ''}`}
              type="text"
              value={loginValue}
              onChange={(e) => { setLoginValue(e.target.value); setLoginError('') }}
            />
            {loginError && <span className={styles.errorText}>{loginError}</span>}

            <label className={styles.label}>Пароль:</label>
            <input
              className={`${styles.input}${passwordError ? ' ' + styles.inputError : ''}`}
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
            />
            {passwordError && <span className={styles.errorText}>{passwordError}</span>}

            <button type="submit" className={styles.submitBtn}>Войти</button>
          </form>

          <a href="/restore" className={styles.restoreLink}>Восстановить пароль</a>

          <p className={styles.socialLabel}>Войти через:</p>
          <div className={styles.socials}>
            <a href="#"><img src="/skan/google.png" alt="Google" /></a>
            <a href="#"><img src="/skan/facebook.png" alt="Facebook" /></a>
            <a href="#"><img src="/skan/yandex.png" alt="Yandex" /></a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
