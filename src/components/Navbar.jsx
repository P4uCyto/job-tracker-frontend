import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 font-semibold text-gray-800 text-lg">
        <span className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
          JT
        </span>
        Job Tracker
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/applications/new"
          className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add Application
        </Link>
        <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          Log out
        </button>
      </div>
    </nav>
  )
}
