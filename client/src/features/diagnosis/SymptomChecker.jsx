import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext, ACTIONS } from '../../context/AppContext'
import { getAnimals } from '../../services/animals'
import { getDiseases } from '../../services/diseases'
import { runDiagnosis } from '../../utils/runDiagnosis'
import PredictionResult from './PredictionResult'

const SymptomChecker = () => {
  const { state, dispatch } = useAppContext()
  const navigate = useNavigate()

  const [selectedAnimalId, setSelectedAnimalId] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch animals and diseases from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const [animals, diseases] = await Promise.all([
          getAnimals(),
          getDiseases()
        ])
        dispatch({ type: ACTIONS.SET_ANIMALS, payload: animals })
        dispatch({ type: ACTIONS.SET_DISEASES, payload: diseases })
      } catch (err) {
        console.error('Failed to load data:', err)
        setError('Failed to load animals or diseases. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dispatch])

  const selectedAnimal = state.animals?.find(a => a.id === selectedAnimalId || a.id === parseInt(selectedAnimalId))
  const species = selectedAnimal?.species

  const diseases = (state.diseases || []).filter(d => d.species === species)
  const availableSymptoms = diseases.length > 0
    ? [...new Set(diseases.flatMap(d => d.symptoms))]
    : []

  const handleAnimalSelect = (e) => {
    setSelectedAnimalId(e.target.value)
    setSelectedSymptoms([])
    setPrediction(null)
    setStep(2)
  }

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

const handlePredict = () => {
  if (!selectedAnimal || selectedSymptoms.length === 0) return
  const results = runDiagnosis(diseases, selectedSymptoms)
  setPrediction(results)

  if (results.length === 0) {
    alert('No matching diseases found. Try selecting different symptoms.')
  } else {
    setStep(3)
  }
}

  

  const handleNewDiagnosis = () => {
    setStep(1)
    setSelectedAnimalId('')
    setSelectedSymptoms([])
    setPrediction(null)
  }

  const animals = state.animals || []
  const farmers = state.farmers || []

  return (
    <div className="w-full max-w-4xl mx-auto mt-20 sm:mt-24 px-4 sm:px-10 lg:px-0">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6 text-center sm:text-left">
          Symptom Checker
        </h1>

        {loading && <div className="text-center py-8 text-gray-500">Loading...</div>}
        {error && <div className="text-center py-4 text-red-500">{error}</div>}

        {/* Step 1 */}
        {!loading && step === 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
            <label className="block text-gray-700 font-medium mb-2 sm:mb-0 sm:w-1/3">
              Select Animal
            </label>
            <select
              value={selectedAnimalId}
              onChange={handleAnimalSelect}
              className="w-full sm:w-2/3 border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="">-- Choose an animal --</option>
              {animals.map(a => (
                <option key={a.id} value={a.id}>
                  {a.tag} - {a.species} (Owner: {farmers.find(f => f.id === a.farmer_id)?.name || 'Unknown'})
                </option>
              ))}
            </select>
            {animals.length === 0 && !loading && (
              <p className="text-red-500 mt-2 text-sm">
                No animals registered. Please add animals first.
              </p>
            )}
          </div>
        )}

        {/* Step 2*/}
        {!loading && step === 2 && selectedAnimal && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Select symptoms for {selectedAnimal.tag} ({selectedAnimal.species})
            </h2>

            {availableSymptoms.length === 0 ? (
              <p className="text-gray-500 mb-4">No known diseases for this species yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {availableSymptoms.map(symptom => (
                  <label key={symptom} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => handleSymptomToggle(symptom)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="capitalize">{symptom}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto"
              >
                Back
              </button>
              <button
                onClick={handlePredict}
                disabled={selectedSymptoms.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 w-full sm:w-auto"
              >
                Predict Disease
              </button>
            </div>
          </div>
        )}

        {/* Step 3*/}
        {step === 3 && prediction && prediction.length > 0 && (
          <PredictionResult
            results={prediction}
            animal={selectedAnimal}
            onNew={handleNewDiagnosis}
          />
        )}
       </div>
    </div>
  )
}

export default SymptomChecker