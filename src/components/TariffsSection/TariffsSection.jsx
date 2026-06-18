import { useTilt } from '../../hooks/useTilt';
import { useAuth } from '../../context/useAuth';
import { asset } from '../../utils/assets';
import styles from './TariffsSection.module.css';

const tariffs = [
  {
    id: 1,
    title: 'Beginner',
    desc: 'Для небольшого исследования',
    logo: 'lamp.svg',
    price: '799 ₽',
    oldPrice: '1 200 ₽',
    installment: 'или 150 ₽/мес. при рассрочке на 24 мес.',
    features: ['Безлимитная история запросов', 'Безопасная сделка', 'Поддержка 24/7'],
    bgColor: 'rgba(255, 182, 79, 1)',
    textColor: '#000',
    buttonLabel: 'Перейти в личный кабинет',
    buttonBg: 'rgba(210, 210, 210, 1)',
    buttonColor: '#000',
  },
  {
    id: 2,
    title: 'Pro',
    desc: 'Для HR и фрилансеров',
    logo: 'arr.svg',
    price: '1 299 ₽',
    oldPrice: '2 600 ₽',
    installment: 'или 279 ₽/мес. при рассрочке на 24 мес.',
    features: ['Все пункты тарифа Beginner', 'Экспорт истории', 'Рекомендации по приоритетам'],
    bgColor: 'rgba(124, 227, 225, 1)',
    textColor: '#000',
    buttonLabel: 'Подробнее',
    buttonBg: 'rgba(89, 112, 255, 1)',
    buttonColor: '#fff',
  },
  {
    id: 3,
    title: 'Business',
    desc: 'Для корпоративных клиентов',
    logo: 'lap.svg',
    price: '2 379 ₽',
    oldPrice: '3 700 ₽',
    features: ['Все пункты тарифа Pro', 'Безлимитное количество запросов', 'Приоритетная поддержка'],
    bgColor: 'rgba(0, 0, 0, 1)',
    textColor: '#fff',
    buttonLabel: 'Подробнее',
    buttonBg: 'rgba(89, 112, 255, 1)',
    buttonColor: '#fff',
  },
];

const TariffCard = ({ t, isCurrent }) => {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt(8);

  return (
    <div
      ref={ref}
      className={`${styles.card}${isCurrent ? ' ' + styles.cardCurrent : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={styles.cardTopSection}
        style={{ backgroundColor: t.bgColor, color: t.textColor }}
      >
        <div className={styles.cardTop}>
          <div className={styles.cardTopLeft}>
            <h3 className={styles.cardTitle}>{t.title}</h3>
            <p className={styles.cardDesc}>{t.desc}</p>
          </div>
          <img className={styles.cardLogo} src={asset(t.logo)} alt="" />
        </div>
      </div>

      <div className={styles.cardBottomSection}>
        {isCurrent && (
          <span className={styles.currentBadge}>Текущий тариф</span>
        )}
        <div className={styles.cardBottom}>
          <div className={styles.priceRow}>
            <span className={styles.price}>{t.price}</span>
            <span className={styles.oldPrice}>{t.oldPrice}</span>
          </div>
          {t.installment && <p className={styles.installment}>{t.installment}</p>}
        </div>
        <div className={styles.featuresBlock}>
          <p className={styles.featuresTitle}>В тариф входит:</p>
          <ul className={styles.featuresList}>
            {t.features.map((f, i) => (
              <li key={i} className={styles.featureItem}>
                <img className={styles.featureIcon} src={asset('icon.svg')} alt="" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          className={styles.button}
          style={{ backgroundColor: t.buttonBg, color: t.buttonColor }}
        >
          {t.buttonLabel}
        </button>
      </div>
    </div>
  );
};

const TariffsSection = () => {
  const { user } = useAuth();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>НАШИ ТАРИФЫ</h2>
        <div className={styles.cards}>
          {tariffs.map((t) => (
            <TariffCard key={t.id} t={t} isCurrent={!!user && t.id === 1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TariffsSection;
