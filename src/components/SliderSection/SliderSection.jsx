import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './SliderSection.module.css';

const defaultCards = [
  { id: 1, logo: '/time.svg', text: 'Высокая и оперативная скорость обработки заявки' },
  { id: 2, logo: '/loop.svg', text: 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос' },
  { id: 3, logo: '/def.svg', text: 'Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству' },
  { id: 4, logo: '/time.svg', text: 'Высокая и оперативная скорость обработки заявки' },
  { id: 5, logo: '/loop.svg', text: 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос' },
  { id: 6, logo: '/def.svg', text: 'Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству' },
];

const getVisibleCount = () => (window.innerWidth <= 768 ? 1 : 3);

const SliderSection = ({ title = 'Заголовок', cards = defaultCards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [visible, setVisible] = useState(getVisibleCount);
  const cardRef = useRef(null);

  const maxIndex = Math.max(0, cards.length - visible);

  const recalc = useCallback(() => {
    setVisible(getVisibleCount());
  }, []);

  useEffect(() => {
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [recalc]);

  useEffect(() => {
    if (cardRef.current) {
      const card = cardRef.current;
      const step = card.offsetWidth + 24;
      setOffset(currentIndex * step);
    }
  }, [currentIndex, visible]);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.sliderWrapper}>
          <button
            className={styles.arrow}
            onClick={prev}
            disabled={currentIndex === 0}
            aria-label="Назад"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19.5" stroke="currentColor" />
              <path d="M22 14L16 20L22 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className={styles.slider}>
            <div
              className={styles.track}
              style={{ transform: `translateX(-${offset}px)` }}
            >
              {cards.map((card, i) => (
                <div key={card.id} className={styles.card} ref={i === 0 ? cardRef : null}>
                  <div className={styles.cardLogo}>
                    {card.logo ? (
                      <img src={card.logo} alt="" />
                    ) : (
                      <div className={styles.logoPlaceholder}>Лого</div>
                    )}
                  </div>
                  <p className={styles.cardText}>{card.text}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            className={styles.arrow}
            onClick={next}
            disabled={currentIndex >= maxIndex}
            aria-label="Вперёд"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19.5" stroke="currentColor" />
              <path d="M18 14L24 20L18 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <img className={styles.heroImage} src="/skan/hero.png" alt="" />
      </div>
    </section>
  );
};

export default SliderSection;
