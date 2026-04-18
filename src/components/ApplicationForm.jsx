import { useState } from 'react'

const STATUSES = ['applied', 'interviewing', 'offer', 'rejected', 'withdrawn']

const EMPTY = {
  company:     '',
  role:        '',
  status:      'applied',
  appliedDate: new Date().toISOString().slice(0, 10),
  notes:       '',
  jobUrl:      '',
  salary:      '',
  location:    '',
}

export default function ApplicationForm({
  initial = {},
  onSubmit,
  loading,
  error,
  submitLabel = 'Save',
}) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Company *</label>
          <input
            className={inputCls}
            value={form.company}
            onChange={set('company')}
            placeholder="e.g. Google"
            required
          />
        </div>

        <div>
          <label className={labelCls}>Role *</label>
          <input
            className={inputCls}
            value={form.role}
            onChange={set('role')}
            placeholder="e.g. Junior Frontend Developer"
            required
          />
        </div>

        <div>
          <label className={labelCls}>Status</label>
          <select className={inputCls} value={form.status} onChange={set('status')}>
            {STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Date applied</label>
          <input
            type="date"
            className={inputCls}
            value={form.appliedDate}
            onChange={set('appliedDate')}
          />
        </div>

        <div>
          <label className={labelCls}>Location</label>
          <input
            className={inputCls}
            value={form.location}
            onChange={set('location')}
            placeholder="e.g. Manila, PH / Remote"
          />
        </div>

        <div>
          <label className={labelCls}>Salary range</label>
          <input
            className={inputCls}
            value={form.salary}
            onChange={set('salary')}
            placeholder="e.g. ₱30k–40k / month"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Job URL</label>
          <input
            type="url"
            className={inputCls}
            value={form.jobUrl}
            onChange={set('jobUrl')}
            placeholder="https://..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Notes</label>
          <textarea
            className={inputCls}
            value={form.notes}
            onChange={set('notes')}
            rows={4}
            placeholder="Interview notes, contacts, follow-up reminders..."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
