import { useState } from 'react'
import { CheckCircle, Info, AlertCircle } from 'lucide-react'
import { useAppContext, ACTIONS } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { createVisit } from '../../services/visits'

const PredictionResult = ({ results, animal, onNew }) => {
  const { dispatch } = useAppContext()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSaveVisit = async () => {
    if (!animal) return

    setSaving(true)
    setError('')

    try {
      const visitData = {
        animalId: animal.id,
        date: new Date().toISOString(),
        symptoms: results.flatMap(r => r.matchedSymptoms || []),
        diseases: results.map(r => ({
          name: r.name,
          confidence: r.confidence,
          prevention: r.prevention,
          treatment: r.treatment
        })),
        notes: ''
      }

      const savedVisit = await createVisit(visitData)
      dispatch({ type: ACTIONS.ADD_VISIT, payload: savedVisit })
      navigate('/records')
    } catch (err) {
      console.error('Failed to save visit:', err)
      setError('Failed to save visit. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No matching diseases</h2>
        <p className="text-gray-600 mb-6">The selected symptoms do not match any known diseases.</p>
        <button onClick={onNew} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Prediction Results for {animal.tag} ({animal.species})
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <div className="space-y-4 mb-6">
        {results.map((disease) => (
          <div key={disease.name} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{disease.name}</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                {disease.confidence}% confidence
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Matched Symptoms:</span>{' '}
              {disease.matchedSymptoms.join(', ')}
            </p>

            <div className="space-y-2 mt-2">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div><span className="font-medium">Prevention:</span> {disease.prevention}</div>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div><span className="font-medium">Treatment:</span> {disease.treatment}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <button onClick={onNew} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          New Diagnosis
        </button>
        <button
          onClick={handleSaveVisit}
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save to Health Records'}
        </button>
      </div>
    </div>
  )
}

export default PredictionResult