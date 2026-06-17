import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import styles from './LoginForm.module.css'

const LoginForm = ({ onClose }) => {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPending(true)
    await login({ name: name.trim() || 'Алексей А.' })
    setPending(false)
    onClose?.()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <form className={styles.form} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Войти</h2>

        <label className={styles.label}>
          Имя пользователя
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Алексей А."
            autoFocus
          />
        </label>

        <div className={styles.actions}>
          <button className={styles.btn} type="submit" disabled={pending}>
            {pending ? 'Вход...' : 'Войти'}
          </button>
          <button className={styles.btnOutline} type="button" onClick={onClose}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
