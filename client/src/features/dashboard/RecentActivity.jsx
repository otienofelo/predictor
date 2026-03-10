import { Link } from 'react-router-dom'
import { Calendar, Eye, ArrowRight } from 'lucide-react'

const RecentVisits = ({ visits = [], animals = [] }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">

      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">Recent Health Records</h2>
        <span className="text-xs text-gray-400">{visits.length} record{visits.length !== 1 ? 's' : ''}</span>
      </div>

      {visits.length === 0 ? (
        <div className="px-4 sm:px-6 py-8 text-center text-gray-400 text-sm">
          No recent visits yet.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {visits.map((visit) => {
            // ✅ backend returns animal_id, also fallback to animalId for local state
            const animal = animals.find(a =>
              a.id === visit.animal_id || a.id === visit.animalId
            )
            const animalTag = animal?.tag || visit.animal_tag || 'Unknown'
            const diseaseName = visit.diseases?.[0]?.name || 'No diagnosis'

            return (
              <div
                key={visit.id}
                className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg flex-shrink-0">
                    <Calendar className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {animalTag}
                      <span className="text-gray-400 mx-1">·</span>
                      <span className="text-gray-600 font-normal">{diseaseName}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(visit.date)}</p>
                  </div>
                </div>

                <Link
                  to={`/records/${visit.id}`}
                  className="flex-shrink-0 p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="View details"
                >
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 sm:px-6 py-3 border-t border-gray-100 flex justify-end">
        <Link
          to="/records"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View all records
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

export default RecentVisits