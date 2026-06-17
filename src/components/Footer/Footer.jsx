import styles from './Footer.module.css';



const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
       
        <a href="/" className={styles.logo}>
          <img src="/skan/footer-logo.png" alt="СКАН" />
        </a>

        <div className={styles.right}>
          <address className={styles.contacts}>
            <span>г. Москва, Цветной б-р, 40</span>
            <a href="tel:+74957712111" className={styles.contactLink}>
              +7 495 771 21 11
            </a>
            <a href="mailto:info@skan.ru" className={styles.contactLink}>
              info@skan.ru
            </a>
          </address>

          <p className={styles.copyright}>Copyright, 2022</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;