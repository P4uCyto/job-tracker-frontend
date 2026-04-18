const STYLES = {
  applied:      'bg-blue-100 text-blue-700',
  interviewing: 'bg-amber-100 text-amber-700',
  offer:        'bg-emerald-100 text-emerald-700',
  rejected:     'bg-red-100 text-red-700',
  withdrawn:    'bg-gray-100 text-gray-600',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${STYLES[status] || STYLES.applied}`}>
      {status}
    </span>
  )
}
