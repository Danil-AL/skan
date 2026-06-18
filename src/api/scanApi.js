import axios from 'axios'

const BASE_URL = import.meta.env.DEV ? '/api/v1' : `${import.meta.env.VITE_API_BASE_URL}/api/v1`

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export const login = (login, password) =>
  api.post('/account/login', { login, password }).then((r) => r.data)

export const getAccountInfo = (token) =>
  api
    .get('/account/info', { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data)

export const getHistograms = (token, params) =>
  api
    .post('/objectsearch/histograms', params, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((r) => r.data)

export const searchObjects = (token, params) =>
  api
    .post('/objectsearch', params, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((r) => r.data)

export const getDocuments = (token, ids) =>
  api
    .post('/documents', { ids }, { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data)
