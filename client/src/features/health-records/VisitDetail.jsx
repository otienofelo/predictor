import { useParams, Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { Calendar, Activity, FileText, ArrowLeft } from 'lucide-react'

const VisitDetail = () => {
  const { id } = useParams()
  const { state } = useAppContext()
  const visit = state.visits.find(v => v.id === id) || mockVisits.find(v => v.id === id)
  const animal = state.animals.find(a => a.id === visit?.animalId)

  if (!visit) {
    return <div className="text-center py-8">Visit not found.</div>
  }

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

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/records" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Records
      </Link>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-2">Visit Details</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(visit.date)}</span>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Animal Information</h2>
          <p><span className="font-medium">Tag:</span> {animal?.tag || 'Unknown'}</p>
          <p><span className="font-medium">Species:</span> {animal?.species || 'Unknown'}</p>
          <p><span className="font-medium">Breed:</span> {animal?.breed || 'Unknown'}</p>
          <p><span className="font-medium">Farmer:</span> {animal ? state.farmers.find(f => f.id === animal.farmerId)?.name : 'Unknown'}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <Activity className="w-5 h-5 mr-1" /> Symptoms
          </h2>
          <div className="flex flex-wrap gap-2">
            {visit.symptoms?.map(s => (
              <span key={s} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <FileText className="w-5 h-5 mr-1" /> Diagnosis
          </h2>
          {visit.diseases?.map((disease, idx) => (
            <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2 mb-3 bg-blue-50 rounded">
              <p className="font-medium">{disease.name}</p>
              <p className="text-sm text-gray-600">Confidence: {disease.confidence}%</p>
              <p className="text-sm mt-1"><span className="font-medium">Prevention:</span> {disease.prevention}</p>
              <p className="text-sm"><span className="font-medium">Treatment:</span> {disease.treatment}</p>
            </div>
          ))}
        </div>

        {visit.notes && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Notes</h2>
            <p className="text-gray-700">{visit.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Same mock data for fallback
const mockVisits = [
  {
    id: '1',
    animalId: '1',
    date: new Date().toISOString(),
    symptoms: ['fever', 'mouth blisters'],
    diseases: [{ name: 'Foot and Mouth Disease', confidence: 90, prevention: 'Vaccinate annually', treatment: 'Supportive care' }]
  },
  {
    id: '2',
    animalId: '2',
    date: new Date(Date.now() - 86400000).toISOString(),
    symptoms: ['cough', 'nasal discharge'],
    diseases: [{ name: 'Pneumonia', confidence: 75, prevention: 'Avoid stress', treatment: 'Antibiotics' }]
  }
]

export default VisitDetail