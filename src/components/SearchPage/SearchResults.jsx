import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAuth } from '../../context/useAuth'
import { getHistograms, searchObjects, getDocuments } from '../../api/scanApi'
import { asset } from '../../utils/assets'
import styles from './SearchPage.module.css'

const ITEMS_PER_PAGE = 10

function stripHtml(markup) {
  if (!markup) return ''
  return markup.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

function getTagInfo(attrs) {
  const tags = []
  if (attrs?.isTechNews) tags.push({ label: 'Технические новости', className: 'tagOrange' })
  if (attrs?.isAnnouncement) tags.push({ label: 'Анонсы и события', className: 'tagGreen' })
  if (attrs?.isDigest) tags.push({ label: 'Сводки новостей', className: 'tagBlue' })
  return tags
}

const mockHistogramData = {
  data: [
    {
      data: [
        { date: '2024-01-01T00:00:00+03:00', value: 245 },
        { date: '2024-02-01T00:00:00+03:00', value: 312 },
        { date: '2024-03-01T00:00:00+03:00', value: 189 },
        { date: '2024-04-01T00:00:00+03:00', value: 421 },
        { date: '2024-05-01T00:00:00+03:00', value: 278 },
        { date: '2024-06-01T00:00:00+03:00', value: 356 },
      ],
      histogramType: 'totalDocuments',
    },
    {
      data: [
        { date: '2024-01-01T00:00:00+03:00', value: 12 },
        { date: '2024-02-01T00:00:00+03:00', value: 8 },
        { date: '2024-03-01T00:00:00+03:00', value: 15 },
        { date: '2024-04-01T00:00:00+03:00', value: 22 },
        { date: '2024-05-01T00:00:00+03:00', value: 5 },
        { date: '2024-06-01T00:00:00+03:00', value: 18 },
      ],
      histogramType: 'riskFactors',
    },
  ],
}

const mockEncodedIds = Array.from({ length: 25 }, (_, i) => `mock-id-${i + 1}`)

const mockDoc = (i) => ({
  schemaVersion: '1.0',
  id: `mock-doc-${i}`,
  version: 1,
  issueDate: new Date(2024, 0, i + 1).toISOString(),
  url: '#',
  source: { id: i, groupId: 1, name: 'Источник информации', categoryId: 7, levelId: 1 },
  dedupClusterId: `cluster-${i}`,
  title: { text: `Публикация №${i} — анализ рынка и корпоративных событий`, markup: '' },
  content: { markup: `<p>Текст публикации №${i}. Здесь описываются важные корпоративные события, финансовые показатели и рыночные тенденции, которые могут повлиять на деятельность компании. Детальный анализ позволяет сделать выводы о текущем состоянии бизнеса.</p>` },
  attributes: {
    isTechNews: i % 3 === 0,
    isAnnouncement: i % 5 === 0,
    isDigest: i % 7 === 0,
    wordCount: 150 + i * 10,
    influence: 100,
    coverage: { value: 50000, state: 'hasData' },
  },
  language: 'russian',
})

const SearchResults = ({ params, onBack }) => {
  const { token, isMock } = useAuth()

  const [histogramData, setHistogramData] = useState(null)
  const [histogramLoading, setHistogramLoading] = useState(true)
  const [histogramError, setHistogramError] = useState('')

  const [allIds, setAllIds] = useState([])
  const [idsLoading, setIdsLoading] = useState(true)

  const [documents, setDocuments] = useState([])
  const [docsLoading, setDocsLoading] = useState(false)
  const [docsError, setDocsError] = useState('')

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [histogramIndex, setHistogramIndex] = useState(0)

  const histogramsDone = useRef(false)
  const idsDone = useRef(false)

  useEffect(() => {
    if (!token || !params) return

    const searchBody = buildSearchBody(params)

    if (isMock) {
      setTimeout(() => {
        setHistogramData(mockHistogramData)
        histogramsDone.current = true
        setHistogramLoading(false)
      }, 800)
      setTimeout(() => {
        setAllIds(mockEncodedIds)
        idsDone.current = true
        setIdsLoading(false)
      }, 1200)
      return
    }

    getHistograms(token, searchBody)
      .then((data) => {
        setHistogramData(data)
        histogramsDone.current = true
      })
      .catch((err) => {
        setHistogramError(err?.response?.data?.message || 'Ошибка загрузки сводки')
      })
      .finally(() => setHistogramLoading(false))

    searchObjects(token, searchBody)
      .then((data) => {
        const ids = (data.items || []).map((item) => item.encodedId)
        setAllIds(ids)
        idsDone.current = true
      })
      .catch(() => {})
      .finally(() => setIdsLoading(false))
  }, [token, params, isMock])

  useEffect(() => {
    if (!idsDone.current || allIds.length === 0) return
    loadDocsBatch(0, ITEMS_PER_PAGE)
  }, [allIds])

  const loadDocsBatch = useCallback(
    (start, count) => {
      const batch = allIds.slice(start, start + count)
      if (batch.length === 0) return
      setDocsLoading(true)
      setDocsError('')

      if (isMock) {
        setTimeout(() => {
          const mockResults = batch.map((_, idx) => mockDoc(start + idx + 1))
          setDocuments((prev) => [...prev, ...mockResults])
          setDocsLoading(false)
        }, 500)
        return
      }

      getDocuments(token, batch)
        .then((results) => {
          const okDocs = results
            .filter((r) => r.ok)
            .map((r) => r.ok)
          setDocuments((prev) => [...prev, ...okDocs])
        })
        .catch((err) => {
          setDocsError(err?.response?.data?.message || 'Ошибка загрузки документов')
        })
        .finally(() => setDocsLoading(false))
    },
    [allIds, token, isMock],
  )

  const handleLoadMore = () => {
    const nextVisible = visibleCount + ITEMS_PER_PAGE
    const currentDocs = documents.length
    if (nextVisible > currentDocs) {
      loadDocsBatch(currentDocs, nextVisible - currentDocs)
    }
    setVisibleCount(nextVisible)
  }

  const loaded = documents.slice(0, visibleCount)
  const totalIds = allIds.length
  const allLoaded = visibleCount >= totalIds && !idsLoading

  const maxHistogramIndex = Math.max(0, mergedHistograms.length - 1)

  const prevHistogram = () => setHistogramIndex((i) => Math.max(0, i - 1))
  const nextHistogram = () => setHistogramIndex((i) => Math.min(maxHistogramIndex, i + 1))

  const mergedHistograms = useMemo(() => {
    if (!histogramData?.data) return []
    const totalMap = {}
    const riskMap = {}
    histogramData.data.forEach((h) => {
      ;(h.data || []).forEach((p) => {
        const key = p.date
        if (h.histogramType === 'totalDocuments') totalMap[key] = p.value
        if (h.histogramType === 'riskFactors') riskMap[key] = p.value
      })
    })
    const allKeys = Object.keys({ ...totalMap, ...riskMap }).sort()
    return allKeys.map((key) => ({
      date: key,
      total: totalMap[key] ?? 0,
      risks: riskMap[key] ?? 0,
    }))
  }, [histogramData])

  const totalDocuments = mergedHistograms.reduce((s, h) => s + h.total, 0)

  if (histogramLoading) {
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
            <img className={styles.resultsHeroImg} src={asset('searchhero.png')} alt="" />
          </div>
          <div className={styles.loader}>
            <div className={styles.spinner} />
          </div>
        </div>
      </section>
    )
  }

  if (histogramError) {
    return (
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.resultsHero}>
            <div className={styles.resultsHeroLeft}>
              <h2 className={styles.resultsTitle}>Ошибка</h2>
              <p className={styles.resultsSubtext}>{histogramError}</p>
            </div>
          </div>
          <button className={styles.backBtn} onClick={onBack}>Назад к поиску</button>
        </div>
      </section>
    )
  }

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
          <img className={styles.resultsHeroImg} src={asset('searchhero.png')} alt="" />
        </div>

        <div className={styles.summaryBlock}>
          <h2 className={styles.sectionTitle}>ОБЩАЯ СВОДКА</h2>
          <p className={styles.summaryCount}>Найдено {totalDocuments || 0} вариантов</p>

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
                style={{ transform: `translateX(-${histogramIndex * 200}px)` }}
              >
                <div className={styles.histogramHeader}>
                  <span className={styles.histogramCell}>Период</span>
                  <span className={styles.histogramCell}>Всего</span>
                  <span className={styles.histogramCell}>Риски</span>
                </div>
                {mergedHistograms.map((h) => (
                  <div key={h.date} className={styles.histogramRow}>
                    <span className={styles.histogramCell}>{formatDate(h.date)}</span>
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

        <div className={styles.documentsBlock}>
          <h2 className={styles.sectionTitle}>СПИСОК ДОКУМЕНТОВ</h2>

          {idsLoading && documents.length === 0 && (
            <div className={styles.loader}>
              <div className={styles.spinner} />
            </div>
          )}

          {docsError && <p className={styles.errorText}>{docsError}</p>}

          <div className={styles.documentsGrid}>
            {loaded.map((doc) => {
              const tags = getTagInfo(doc.attributes)
              const text = stripHtml(doc.content?.markup)
              return (
                <article key={doc.id} className={styles.docCard}>
                  <div className={styles.docCardHeader}>
                    <span className={styles.docDate}>{formatDate(doc.issueDate)}</span>
                    <span className={styles.docSource}>{doc.source?.name}</span>
                  </div>
                  <h3 className={styles.docTitle}>{doc.title?.text || doc.title?.markup ? stripHtml(doc.title.markup) : ''}</h3>
                  {tags.length > 0 && (
                    <div className={styles.docTags}>
                      {tags.map((tag) => (
                        <span key={tag.label} className={`${styles.docTag} ${styles[tag.className]}`}>
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className={styles.docBody}>
                    {text && <p className={styles.docText}>{text}</p>}
                  </div>
                  <div className={styles.docFooter}>
                    <a
                      href={doc.url || '#'}
                      className={styles.docLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Читать в источнике
                    </a>
                    <span className={styles.docWords}>{doc.attributes?.wordCount || 0} слов</span>
                  </div>
                </article>
              )
            })}
          </div>

          {docsLoading && (
            <div className={styles.loader}>
              <div className={styles.spinner} />
            </div>
          )}

          {!idsLoading && !allLoaded && !docsLoading && (
            <div className={styles.loadMoreRow}>
              <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
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

function buildSearchBody(params) {
  return {
    intervalType: 'month',
    histogramTypes: ['totalDocuments', 'riskFactors'],
    issueDateInterval: {
      startDate: params.dateFrom ? `${params.dateFrom}T00:00:00+03:00` : '2019-01-01T00:00:00+03:00',
      endDate: params.dateTo ? `${params.dateTo}T23:59:59+03:00` : '2025-12-31T23:59:59+03:00',
    },
    searchContext: {
      targetSearchEntitiesContext: {
        targetSearchEntities: [
          {
            type: 'company',
            sparkId: null,
            entityId: null,
            inn: parseInt(params.inn, 10),
            maxFullness: !!params.maxFullness,
            inBusinessNews: params.inBusinessNews ? true : null,
          },
        ],
        onlyMainRole: !!params.onlyMainRole,
        tonality: params.tonality || 'any',
        onlyWithRiskFactors: !!params.onlyWithRiskFactors,
        riskFactors: { and: [], or: [], not: [] },
        themes: { and: [], or: [], not: [] },
      },
      themesFilter: { and: [], or: [], not: [] },
    },
    searchArea: {
      includedSources: [],
      excludedSources: [],
      includedSourceGroups: [],
      excludedSourceGroups: [],
    },
    attributeFilters: {
      excludeTechNews: !params.includeTechNews,
      excludeAnnouncements: !params.includeAnnouncements,
      excludeDigests: !params.includeDigests,
    },
    similarMode: 'duplicates',
    limit: params.limit || 100,
    sortType: 'sourceInfluence',
    sortDirectionType: 'desc',
  }
}

export default SearchResults
