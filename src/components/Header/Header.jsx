import { asset } from '../../utils/assets'
import styles from './Header.module.css';


const Header = ({ onLogin, onNavigate }) => {
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

        <div className={styles.actions}>
          <a href="/register" className={styles.registerLink}>
            Зарегистрироваться
          </a>
          <button className={styles.loginBtn} onClick={onLogin}>
            Войти
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;