import { useAuth } from '../../context/useAuth'
import { asset } from '../../utils/assets'
import styles from './HeaderAuthorized.module.css'

const HeaderAuthorized = ({ onNavigate }) => {
  const { user, infoLoading, logout } = useAuth()

  const { name, avatarSrc, usedCount, totalCount } = user || {}

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo} onClick={(e) => { e.preventDefault(); onNavigate('home') }}>
          <img src={asset('header-logo.png')} alt="СКАН" />
        </a>

        <nav className={styles.nav}>
          <a href="/" className={styles.navLink} onClick={(e) => { e.preventDefault(); onNavigate('main') }}>Главная</a>
          <a href="/tariffs" className={styles.navLink}>Тарифы</a>
          <a href="/faq" className={styles.navLink}>FAQ</a>
        </nav>

        <div className={styles.userArea}>
          <div className={styles.usage}>
            {infoLoading ? (
              <>
                <div className={styles.usageRow}>
                  <span className={styles.usageLabel}>Использовано компаний</span>
                  <span className={styles.usageValue}>--</span>
                </div>
                <div className={styles.usageRow}>
                  <span className={styles.usageLabel}>Лимит по компаниям</span>
                  <span className={styles.usageValueMuted}>--</span>
                </div>
              </>
            ) : (
              <>
                <div className={styles.usageRow}>
                  <span className={styles.usageLabel}>Использовано компаний</span>
                  <span className={styles.usageValue}>{usedCount}</span>
                </div>
                <div className={styles.usageRow}>
                  <span className={styles.usageLabel}>Лимит по компаниям</span>
                  <span className={styles.usageValueMuted}>{totalCount}</span>
                </div>
              </>
            )}
          </div>

          <div className={styles.user}>
            <span className={styles.userName}>{name}</span>
            <div className={styles.avatar}>
              {avatarSrc ? (
                <img src={avatarSrc} alt={name} className={styles.avatarImg} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {name ? name.charAt(0) : '?'}
                </div>
              )}
            </div>
            <button className={styles.logoutBtn} onClick={logout} title="Выйти">
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderAuthorized
