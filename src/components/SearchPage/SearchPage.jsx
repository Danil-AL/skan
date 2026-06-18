import { useState } from 'react'
import SearchResults from './SearchResults'
import { asset } from '../../utils/assets'
import styles from './SearchPage.module.css'

const tonalityOptions = [
  { label: 'Любая', value: 'any' },
  { label: 'Позитивная', value: 'positive' },
  { label: 'Негативная', value: 'negative' },
]

const checkboxes = [
  { label: 'Признак максимальной полноты', key: 'maxFullness' },
  { label: 'Упоминания в бизнес-контексте', key: 'inBusinessNews' },
  { label: 'Главная роль в публикации', key: 'onlyMainRole' },
  { label: 'Публикации только с риск-факторами', key: 'onlyWithRiskFactors' },
  { label: 'Включать технические новости рынков', key: 'includeTechNews' },
  { label: 'Включать анонсы и календари', key: 'includeAnnouncements' },
  { label: 'Включать сводки новостей', key: 'includeDigests' },
]

function isValidInn(inn) {
  if (!/^\d{10}$/.test(inn)) return false
  const coefficients = [2, 4, 10, 3, 5, 9, 4, 6, 8]
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(inn[i]) * coefficients[i]
  }
  let check = sum % 11
  if (check > 9) check %= 10
  return check === parseInt(inn[9])
}

const SearchPage = () => {
  const [searching, setSearching] = useState(false)
  const [searchParams, setSearchParams] = useState(null)
  const [inn, setInn] = useState('')
  const [tonality, setTonality] = useState('any')
  const [docCount, setDocCount] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [checked, setChecked] = useState(checkboxes.map(() => false))
  const [innError, setInnError] = useState('')
  const [dateError, setDateError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const isInnValid = isValidInn(inn)
  const docCountNum = parseInt(docCount, 10)
  const isDocCountValid = docCount && docCountNum >= 1 && docCountNum <= 1000

  const dateFromObj = dateFrom ? new Date(dateFrom) : null
  const dateToObj = dateTo ? new Date(dateTo) : null
  const now = new Date()

  const isDatesValid =
    dateFrom &&
    dateTo &&
    dateFromObj <= dateToObj &&
    dateFromObj <= now &&
    dateToObj <= now

  const canSearch = isInnValid && isDocCountValid && isDatesValid && !innError

  if (searching) {
    return <SearchResults params={searchParams} onBack={() => setSearching(false)} />
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
    if (dateError) setDateError('')
  }

  const handleInnBlur = () => {
    if (inn && !isValidInn(inn)) {
      setInnError('Некорректный ИНН')
    } else {
      setInnError('')
    }
  }

  const validateDates = () => {
    if (!dateFrom || !dateTo) return
    if (dateFromObj > dateToObj) {
      setDateError('Дата начала не может быть позже даты конца')
    } else if (dateFromObj > now) {
      setDateError('Дата не может быть в будущем')
    } else if (dateToObj > now) {
      setDateError('Дата не может быть в будущем')
    } else {
      setDateError('')
    }
  }

  const handleDateChange = (setter) => (e) => {
    setter(e.target.value)
    setDateError('')
  }

  const buildSearchParams = () => ({
    inn,
    tonality,
    limit: docCountNum,
    dateFrom,
    dateTo,
    maxFullness: checked[0],
    inBusinessNews: checked[1],
    onlyMainRole: checked[2],
    onlyWithRiskFactors: checked[3],
    includeTechNews: checked[4],
    includeAnnouncements: checked[5],
    includeDigests: checked[6],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSearch) return
    validateDates()
    if (dateError) return
    setSearchParams(buildSearchParams())
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
                    <label className={styles.label}>Тональность <span className={styles.required}>*</span></label>
                    <select
                      className={styles.select}
                      value={tonality}
                      onChange={(e) => setTonality(e.target.value)}
                    >
                      {tonalityOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Количество документов в выдаче <span className={styles.required}>*</span></label>
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
                    <label className={styles.label}>Диапазон поиска <span className={styles.required}>*</span></label>
                    <div className={styles.dateRow}>
                      <input
                        className={`${styles.dateInput}${dateError ? ' ' + styles.inputError : ''}`}
                        type="date"
                        max={today}
                        value={dateFrom}
                        onChange={handleDateChange(setDateFrom)}
                        onBlur={validateDates}
                      />
                      <input
                        className={`${styles.dateInput}${dateError ? ' ' + styles.inputError : ''}`}
                        type="date"
                        max={today}
                        value={dateTo}
                        onChange={handleDateChange(setDateTo)}
                        onBlur={validateDates}
                      />
                    </div>
                    {dateError && <span className={styles.errorText}>{dateError}</span>}
                  </div>
                </div>

                <div className={styles.checkboxesColumn}>
                  {checkboxes.map((cb, i) => (
                    <label key={cb.key} className={styles.checkboxLabel}>
                      <input
                        className={styles.checkbox}
                        type="checkbox"
                        checked={checked[i]}
                        onChange={() => handleCheckbox(i)}
                      />
                      {cb.label}
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
              <img className={styles.docImg} src={asset('Document.png')} alt="" />
              <img className={styles.foldersImg} src={asset('Folders.png')} alt="" />
            </div>
            <img className={styles.innheroImg} src={asset('innhero.png')} alt="" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchPage
