import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import Navbar from '../components/Navbar'

const STATUSES = ['', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn']

const STAT_CONFIG = [
  { key: 'total',        label: 'Total',        color: 'bg-gray-100 text-gray-700' },
  { key: 'applied',      label: 'Applied',      color: 'bg-blue-100 text-blue-700' },
  { key: 'interviewing', label: 'Interviewing', color: 'bg-amber-100 text-amber-700' },
  { key: 'offer',        label: 'Offers',       color: 'bg-emerald-100 text-emerald-700' },
  { key: 'rejected',     label: 'Rejected',     color: 'bg-red-100 text-red-700' },
]

export default function Dashboard() {
  const [data,    setData]    = useState({ data: [], stats: {} })
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [status,  setStatus]  = useState('')
  const [search,  setSearch]  = useState('')
  const [sort,    setSort]    = useState('newest')
  const navigate = useNavigate()
  const { user }  = useAuth()

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await api.applications.getAll({ status, search, sort })
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [status, search, sort])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return
    try {
      await api.applications.remove(id)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  const stats = data.stats || {}
  const apps  = data.data  || []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {user?.name ? `Hi, ${user.name}` : 'Your Applications'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Track every job you apply for</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {STAT_CONFIG.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setStatus(key === 'total' ? '' : key)}
              className={`${color} rounded-xl p-4 text-left transition-all hover:opacity-80 ${
                status === (key === 'total' ? '' : key) ? 'ring-2 ring-offset-1 ring-indigo-400' : ''
              }`}
            >
              <div className="text-2xl font-bold">{stats[key] ?? 0}</div>
              <div className="text-xs font-medium mt-0.5">{label}</div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or role..."
            className="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All statuses'}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="company">Company A–Z</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Table */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
        ) : apps.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm mb-4">No applications yet</p>
            <Link
              to="/applications/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
            >
              Add your first application
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Company</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {apps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {app.company}
                      <div className="text-xs text-gray-500 sm:hidden mt-0.5">{app.role}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{app.role}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {new Date(app.appliedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => navigate(`/applications/${app.id}/edit`)}
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
