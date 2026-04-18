import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'
import ApplicationForm from '../components/ApplicationForm'
import Navbar from '../components/Navbar'

export default function NewApplicationPage() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (form) => {
    setError('')
    setLoading(true)
    try {
      await api.applications.create(form)
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
          <h1 className="text-xl font-semibold text-gray-800">Add Application</h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <ApplicationForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            submitLabel="Add Application"
          />
        </div>
      </main>
    </div>
  )
}
