import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../services/api'
import ApplicationForm from '../components/ApplicationForm'
import Navbar from '../components/Navbar'

export default function EditApplicationPage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [initial,  setInitial]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    api.applications
      .getOne(id)
      .then((app) => {
        setInitial({
          ...app,
          appliedDate: app.appliedDate
            ? new Date(app.appliedDate).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (form) => {
    setError('')
    setLoading(true)
    try {
      await api.applications.update(id, form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm">
            ← Back
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Edit Application</h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {fetching ? (
            <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
          ) : (
            <ApplicationForm
              initial={initial}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              submitLabel="Save Changes"
            />
          )}
        </div>
      </main>
    </div>
  )
}
