import styles from './HeaderLoading.module.css';


const HeaderLoading = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <img src="/logo.svg" alt="СКАН" />
        </a>

        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>Главная</a>
          <a href="/tariffs" className={styles.navLink}>Тарифы</a>
          <a href="/faq" className={styles.navLink}>FAQ</a>
        </nav>

        <div className={styles.userArea}>
          {/* Скелетон для блока статистики */}
          <div className={styles.skeletonUsage}>
            <div className={styles.skeletonLine} style={{ width: 120 }} />
            <div className={styles.skeletonLine} style={{ width: 90 }} />
          </div>

          {/* Спиннер вместо аватара */}
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderLoading;