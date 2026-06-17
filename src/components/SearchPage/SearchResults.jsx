import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './SearchPage.module.css'

const mockHistograms = [
  { period: '2024-01', total: 245, risks: 12 },
  { period: '2024-02', total: 312, risks: 8 },
  { period: '2024-03', total: 189, risks: 15 },
  { period: '2024-04', total: 421, risks: 22 },
  { period: '2024-05', total: 278, risks: 5 },
  { period: '2024-06', total: 356, risks: 18 },
  { period: '2024-07', total: 198, risks: 10 },
  { period: '2024-08', total: 445, risks: 27 },
]

const mockDocuments = [
  {
    id: 1,
    date: '13.09.2021',
    source: 'Комсомольская правда KP.RU',
    title: 'Скиллфэктори — лучшая онлайн-школа для будущих айтишников',
    tags: ['Технические новости'],
    tagColor: 'rgba(255, 182, 79, 1)',
    text: 'SkillFactory — школа для всех, кто хочет изменить свою карьеру и жизнь. С 2016 года обучение прошли 20 000+ человек из 40 стран с 4 континентов, самому взрослому студенту сейчас 86 лет. Выпускники работают в Сбере, Cisco, Bayer, Nvidia, МТС, Ростелекоме, Mail.ru, Яндексе, Ozon и других топовых компаниях. Принципы SkillFactory: акцент на практике, забота о студентах и ориентир на трудоустройство. 80% обучения — выполнение упражнений и реальных проектов. Каждого студента поддерживают менторы, 2 саппорт-линии и комьюнити курса. А карьерный центр помогает составить резюме, подготовиться к собеседованиям и познакомиться с IT-рекрутерами.',
    wordCount: 752,
    image: '/skan/last1.png',
    link: '#',
  },
  {
    id: 2,
    date: '15.10.2021',
    source: 'VC.RU',
    title: 'Работа в Data Science в 2022 году: тренды, навыки и обзор специализаций',
    tags: ['Технические новости'],
    tagColor: 'rgba(255, 182, 79, 1)',
    text: 'Кто такой Data Scientist и чем он занимается? Data Scientist — это специалист, который работает с большими массивами данных, чтобы с их помощью решить задачи бизнеса. Простой пример использования больших данных и искусственного интеллекта — умные ленты в социальных сетях. На основе ваших просмотров и лайков алгоритм выдает рекомендации с контентом, который может быть вам интересен. Эту модель создал и обучил дата-сайентист, и скорее всего, не один. В небольших компаниях и стартапах дата-сайентист делает все: собирает и очищает данные, создает математическую модель для их анализа, тестирует ее и презентует готовое решение бизнесу.',
    wordCount: 684,
    image: '/skan/last2.png',
    link: '#',
  },
  {
    id: 3,
    date: '20.11.2021',
    source: 'РБК',
    title: 'Искусственный интеллект в бизнесе: как компании внедряют AI-решения',
    tags: ['Технические новости', 'Анонсы и события'],
    tagColor: 'rgba(255, 182, 79, 1)',
    text: 'Крупнейшие российские компании активно внедряют решения на основе искусственного интеллекта. По данным исследования, более 60% организаций уже используют AI в своих бизнес-процессах. Наиболее популярные направления — компьютерное зрение, обработка естественного языка и предиктивная аналитика.',
    wordCount: 523,
    image: '/skan/last1.png',
    link: '#',
  },
  {
    id: 4,
    date: '05.12.2021',
    source: 'ТАСС',
    title: 'Кибербезопасность 2022: главные угрозы и способы защиты',
    tags: ['Сводки новостей'],
    tagColor: 'rgba(124, 227, 225, 1)',
    text: 'Эксперты по кибербезопасности прогнозируют рост числа атак с использованием программ-вымогателей в 2022 году. Компаниям рекомендуется усилить защиту периметра сети, внедрить многофакторную аутентификацию и регулярно проводить обучение сотрудников основам информационной безопасности.',
    wordCount: 445,
    image: '/skan/last2.png',
    link: '#',
  },
]

const ITEMS_PER_PAGE = 2

const SearchResults = ({ onBack }) => {
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [histogramIndex, setHistogramIndex] = useState(0)
  const trackRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const maxHistogramIndex = Math.max(0, mockHistograms.length - 3)

  const prevHistogram = () => setHistogramIndex((i) => Math.max(0, i - 1))
  const nextHistogram = () => setHistogramIndex((i) => Math.min(maxHistogramIndex, i + 1))

  const visibleDocs = mockDocuments.slice(0, visibleCount)
  const allLoaded = visibleCount >= mockDocuments.length

  const loadMore = () => setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, mockDocuments.length))

  const handleTagClass = useCallback((tags) => {
    if (tags.includes('Технические новости')) return 'tagOrange'
    if (tags.includes('Анонсы и события')) return 'tagGreen'
    if (tags.includes('Сводки новостей')) return 'tagBlue'
    return 'tagOrange'
  }, [])

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.resultsHero}>
            <div className={styles.resultsHeroLeft}>
              <h2 className={styles.resultsTitle}>Ищем. Скоро будут<br />результаты</h2>
              <p className={styles.resultsSubtext}>
                Поиск может занять некоторое время,<br />просим сохранять терпение.
              </p>
            </div>
            <img className={styles.resultsHeroImg} src="/skan/searchhero.png" alt="" />
          </div>
          <div className={styles.loader}>
            <div className={styles.spinner} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* ── Hero block ── */}
        <div className={styles.resultsHero}>
          <div className={styles.resultsHeroLeft}>
            <h2 className={styles.resultsTitle}>Ищем. Скоро будут<br />результаты</h2>
            <p className={styles.resultsSubtext}>
              Поиск может занять некоторое время,<br />просим сохранять терпение.
            </p>
          </div>
          <img className={styles.resultsHeroImg} src="/skan/searchhero.png" alt="" />
        </div>

        {/* ── Summary block ── */}
        <div className={styles.summaryBlock}>
          <h2 className={styles.sectionTitle}>ОБЩАЯ СВОДКА</h2>
          <p className={styles.summaryCount}>Найдено {mockHistograms.reduce((s, h) => s + h.total, 0)} вариантов</p>

          <div className={styles.histogramCarousel}>
            <button
              className={styles.histogramArrow}
              onClick={prevHistogram}
              disabled={histogramIndex === 0}
              aria-label="Назад"
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="19.5" stroke="currentColor" />
                <path d="M22 14L16 20L22 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className={styles.histogramViewport}>
              <div
                className={styles.histogramTrack}
                ref={trackRef}
                style={{ transform: `translateX(-${histogramIndex * 200}px)` }}
              >
                <div className={styles.histogramHeader}>
                  <span className={styles.histogramCell}>Период</span>
                  <span className={styles.histogramCell}>Всего</span>
                  <span className={styles.histogramCell}>Риски</span>
                </div>
                {mockHistograms.map((h) => (
                  <div key={h.period} className={styles.histogramRow}>
                    <span className={styles.histogramCell}>{h.period}</span>
                    <span className={styles.histogramCell}>{h.total}</span>
                    <span className={`${styles.histogramCell} ${styles.riskCell}`}>{h.risks}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className={styles.histogramArrow}
              onClick={nextHistogram}
              disabled={histogramIndex >= maxHistogramIndex}
              aria-label="Вперёд"
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="19.5" stroke="currentColor" />
                <path d="M18 14L24 20L18 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Documents block ── */}
        <div className={styles.documentsBlock}>
          <h2 className={styles.sectionTitle}>СПИСОК ДОКУМЕНТОВ</h2>

          <div className={styles.documentsGrid}>
            {visibleDocs.map((doc) => (
              <article key={doc.id} className={styles.docCard}>
                <div className={styles.docCardHeader}>
                  <span className={styles.docDate}>{doc.date}</span>
                  <span className={styles.docSource}>{doc.source}</span>
                </div>
                <h3 className={styles.docTitle}>{doc.title}</h3>
                <div className={styles.docTags}>
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`${styles.docTag} ${styles[handleTagClass(doc.tags)]}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className={styles.docBody}>
                  <img className={styles.docBodyImg} src={doc.image} alt="" />
                  <p className={styles.docText}>{doc.text}</p>
                </div>
                <div className={styles.docFooter}>
                  <a
                    href={doc.link}
                    className={styles.docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Читать в источнике
                  </a>
                  <span className={styles.docWords}>{doc.wordCount} слов</span>
                </div>
              </article>
            ))}
          </div>

          {!allLoaded && (
            <div className={styles.loadMoreRow}>
              <button className={styles.loadMoreBtn} onClick={loadMore}>
                Показать больше
              </button>
            </div>
          )}
        </div>

        <button className={styles.backBtn} onClick={onBack}>
          Назад к поиску
        </button>
      </div>
    </section>
  )
}

export default SearchResults
