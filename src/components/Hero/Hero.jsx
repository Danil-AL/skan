import styles from './Hero.module.css';

const Hero = ({ onSearch }) => {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            Сервис по поиску
            <br />публикаций
            <br />о компании
            <br />по его ИНН
          </h1>
          <p className={styles.description}>
            Комплексный анализ публикаций, получение данных в формате PDF
            на электронную почту
          </p>
          <button className={styles.btn} onClick={onSearch}>Запросить данные</button>
        </div>
        <div className={styles.right}>
          <img src="/skan/man.png" alt="man" className={styles.image} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
