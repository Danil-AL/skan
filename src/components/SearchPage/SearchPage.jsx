import { useState } from 'react'
import SearchResults from './SearchResults'
import styles from './SearchPage.module.css'

const tonalityOptions = ['Любая', 'Позитивная', 'Негативная', 'Нейтральная']

const checkboxes = [
  'Признак максимальной полноты',
  'Упоминания в бизнес-контексте',
  'Главная роль в публикации',
  'Публикации только с риск-факторами',
  'Включать технические новости рынков',
  'Включать анонсы и календари',
  'Включать сводки новостей',
]

const SearchPage = () => {
  const [searching, setSearching] = useState(false)
  const [inn, setInn] = useState('')
  const [tonality, setTonality] = useState('Любая')
  const [docCount, setDocCount] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [checked, setChecked] = useState(checkboxes.map(() => false))
  const [innError, setInnError] = useState('')

  const isInnValid = /^\d{10}$/.test(inn)
  const canSearch = isInnValid

  if (searching) {
    return <SearchResults onBack={() => setSearching(false)} />
  }

  const handleCheckbox = (index) => {
    setChecked((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  const handleInnChange = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 10)
    setInn(v)
    if (innError) setInnError('')
  }

  const handleInnBlur = () => {
    if (inn && !isInnValid) {
      setInnError('Некорректный ИНН')
    } else {
      setInnError('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSearch) return
    setSearching(true)
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.mainRow}>
          <div className={styles.formBlock}>
            <h2 className={styles.title}>Найдите необходимые данные в пару кликов.</h2>
            <p className={styles.subtitle}>Задайте параметры поиска.</p>
            <p className={styles.description}>
              Чем больше заполните, тем точнее поиск
            </p>

            <form onSubmit={handleSubmit}>
              <div className={styles.formContent}>
                <div className={styles.fieldsColumn}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      ИНН компании <span className={styles.required}>*</span>
                    </label>
                    <input
                      className={`${styles.input}${innError ? ' ' + styles.inputError : ''}`}
                      type="text"
                      inputMode="numeric"
                      placeholder="10 цифр"
                      value={inn}
                      onChange={handleInnChange}
                      onBlur={handleInnBlur}
                    />
                    {innError && <span className={styles.errorText}>{innError}</span>}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Тональность</label>
                    <select
                      className={styles.select}
                      value={tonality}
                      onChange={(e) => setTonality(e.target.value)}
                    >
                      {tonalityOptions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Количество документов в выдаче</label>
                    <input
                      className={styles.input}
                      type="number"
                      min="1"
                      max="1000"
                      placeholder="от 1 до 1000"
                      value={docCount}
                      onChange={(e) => setDocCount(e.target.value)}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Диапазон поиска</label>
                    <div className={styles.dateRow}>
                      <input
                        className={styles.dateInput}
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                      <input
                        className={styles.dateInput}
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.checkboxesColumn}>
                  {checkboxes.map((text, i) => (
                    <label key={text} className={styles.checkboxLabel}>
                      <input
                        className={styles.checkbox}
                        type="checkbox"
                        checked={checked[i]}
                        onChange={() => handleCheckbox(i)}
                      />
                      {text}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.buttonRow}>
                <button
                  type="submit"
                  className={styles.searchBtn}
                  disabled={!canSearch}
                >
                  Поиск
                </button>
                <span className={styles.requiredNote}>
                  * Обязательные поля к заполнению
                </span>
              </div>
            </form>
          </div>

          <div className={styles.imagesBlock}>
            <div className={styles.topImages}>
              <img className={styles.docImg} src="/Document.png" alt="" />
              <img className={styles.foldersImg} src="/Folders.png" alt="" />
            </div>
            <img className={styles.innheroImg} src="/innhero.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchPage
