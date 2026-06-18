import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { asset } from '../../utils/assets'
import styles from './LoginPage.module.css'

const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState('login')
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = loginValue.trim() && password && !submitting

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setError('')
    setSubmitting(true)
    try {
      await login(loginValue, password)
      onNavigate('home')
    } catch (err) {
      if (err?.message) {
        setError(err.message)
      } else if (err?.response?.status === 401) {
        setError('Неправильная пара логин/пароль')
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Ошибка авторизации. Попробуйте позже.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.leftText}>
            Для оформления подписки<br />на тариф необходимо<br />авторизоваться.
          </p>
          <img src={asset('Characters.png')} alt="" className={styles.leftImg} />
        </div>

        <div className={styles.card}>
          <img src={asset('close.png')} alt="" className={styles.closeIcon} />

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
              className={`${styles.input}${error ? ' ' + styles.inputError : ''}`}
              type="text"
              value={loginValue}
              onChange={(e) => { setLoginValue(e.target.value); setError('') }}
            />

            <label className={styles.label}>Пароль:</label>
            <input
              className={`${styles.input}${error ? ' ' + styles.inputError : ''}`}
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
            />

            {error && <span className={styles.errorText}>{error}</span>}

            <button type="submit" className={styles.submitBtn} disabled={!canSubmit}>
              {submitting ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <a href="/restore" className={styles.restoreLink}>Восстановить пароль</a>

          <p className={styles.socialLabel}>Войти через:</p>
          <div className={styles.socials}>
            <a href="#"><img src={asset('google.png')} alt="Google" /></a>
            <a href="#"><img src={asset('facebook.png')} alt="Facebook" /></a>
            <a href="#"><img src={asset('yandex.png')} alt="Yandex" /></a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
