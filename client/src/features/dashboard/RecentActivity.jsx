// frontend/src/features/dashboard/RecentVisits.jsx
import { Link } from 'react-router-dom'
import { Calendar, Eye } from 'lucide-react'

const RecentVisits = ({ visits = [], animals = [] }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Recent Health Records</h2>
      </div>

      {visits.length === 0 ? (
        <p className="px-6 py-4 text-gray-500">No recent visits.</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {visits.map((visit) => {
            const animal = animals.find(a => a.id === visit.animalId)
            const diseaseName = visit.diseases?.[0]?.name || 'No diagnosis'

            return (
              <div
                key={visit.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate" title={diseaseName}>
                      {animal?.tag || 'Unknown'} – {diseaseName}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(visit.date)}</p>
                  </div>
                </div>
                <Link
                  to={`/records/${visit.id}`}
                  className="text-blue-600 hover:text-blue-800"
                  title="View details"
                >
                  <Eye className="h-5 w-5" />
                </Link>
              </div>
            )
          })}
        </div>
      )}

      <div className="px-6 py-3 border-t border-gray-200 text-right">
        <Link
          to="/records"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View all records →
        </Link>
      </div>
    </div>
  )
}

export default RecentVisits