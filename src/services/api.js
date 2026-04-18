const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const getToken = () => localStorage.getItem('jt_token')

const buildHeaders = (auth = false) => ({
  'Content-Type': 'application/json',
  ...(auth && getToken() && { Authorization: `Bearer ${getToken()}` }),
})

async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: buildHeaders(auth),
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

export const api = {
  auth: {
    register: (d) => apiFetch('/api/auth/register', { method: 'POST', body: d }),
    login:    (d) => apiFetch('/api/auth/login',    { method: 'POST', body: d }),
    me:       ()  => apiFetch('/api/auth/me', { auth: true }),
  },
  applications: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString()
      return apiFetch(`/api/applications${qs ? '?' + qs : ''}`, { auth: true })
    },
    getOne:  (id)    => apiFetch(`/api/applications/${id}`,  { auth: true }),
    create:  (d)     => apiFetch('/api/applications',        { method: 'POST',   body: d, auth: true }),
    update:  (id, d) => apiFetch(`/api/applications/${id}`,  { method: 'PUT',    body: d, auth: true }),
    remove:  (id)    => apiFetch(`/api/applications/${id}`,  { method: 'DELETE', auth: true }),
  },
}
