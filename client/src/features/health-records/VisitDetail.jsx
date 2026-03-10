import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { getVisitById } from '../../services/visits'
import { Calendar, Activity, FileText, ArrowLeft } from 'lucide-react'

const VisitDetail = () => {
  const { id } = useParams()
  const { state } = useAppContext()
  const [visit, setVisit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVisit = async () => {
      setLoading(true)
      setError('')
      try {
        const localVisit = state.visits?.find(v => v.id === id)
        if (localVisit) {
          setVisit(localVisit)
        } else {
          const data = await getVisitById(id)
          setVisit(data)
        }
      } catch (err) {
        console.error('Failed to fetch visit:', err)
        setError('Visit not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchVisit()
  }, [id, state.visits])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const animal = state.animals?.find(a => a.id === visit?.animal_id) || {
    tag: visit?.animal_tag,
    species: visit?.animal_species,
  }

  if (loading) return (
    <div className="mt-20 text-center py-8 text-gray-500">Loading...</div>
  )
  if (error) return (
    <div className="mt-20 text-center py-8 text-red-500">{error}</div>
  )
  if (!visit) return (
    <div className="mt-20 text-center py-8">Visit not found.</div>
  )

  return (
    <div className="mt-20 sm:mt-24 px-4 sm:px-6 pb-10 max-w-4xl mx-auto">

      {/* Back Button */}
      <Link
        to="/records"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Records
      </Link>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">

        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-semibold mb-2">Visit Details</h1>
        <div className="flex items-center text-gray-600 mb-6 text-sm sm:text-base">
          <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>{formatDate(visit.date)}</span>
        </div>

        {/* Animal Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-base sm:text-lg font-semibold mb-3">Animal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
            <p><span className="font-medium">Tag:</span> {animal?.tag || visit?.animal_tag || 'Unknown'}</p>
            <p><span className="font-medium">Species:</span> {animal?.species || visit?.animal_species || 'Unknown'}</p>
            <p><span className="font-medium">Breed:</span> {animal?.breed || 'Unknown'}</p>
            <p>
              <span className="font-medium">Farmer:</span>{' '}
              {state.farmers?.find(f => f.id === animal?.farmer_id)?.name || 'Unknown'}
            </p>
          </div>
        </div>

        {/* Symptoms */}
        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-semibold mb-2 flex items-center">
            <Activity className="w-5 h-5 mr-1 flex-shrink-0" /> Symptoms
          </h2>
          <div className="flex flex-wrap gap-2">
            {visit.symptoms?.map(s => (
              <span
                key={s}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm capitalize"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Diagnosis */}
        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-semibold mb-2 flex items-center">
            <FileText className="w-5 h-5 mr-1 flex-shrink-0" /> Diagnosis
          </h2>
          <div className="space-y-3">
            {visit.diseases?.map((disease, idx) => (
              <div
                key={idx}
                className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-2 bg-blue-50 rounded"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                  <p className="font-medium text-sm sm:text-base">{disease.name}</p>
                  <span className="text-xs sm:text-sm text-blue-700 font-medium">
                    {disease.confidence}% confidence
                  </span>
                </div>
                <p className="text-xs sm:text-sm mt-1">
                  <span className="font-medium">Prevention:</span> {disease.prevention}
                </p>
                <p className="text-xs sm:text-sm mt-1">
                  <span className="font-medium">Treatment:</span> {disease.treatment}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {visit.notes && (
          <div className="mb-2">
            <h2 className="text-base sm:text-lg font-semibold mb-2">Notes</h2>
            <p className="text-gray-700 text-sm sm:text-base">{visit.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VisitDetail