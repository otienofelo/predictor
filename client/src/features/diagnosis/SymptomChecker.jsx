import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { runDiagnosis } from '../../utils/runDiagnosis'
import diseaseRules from '../../utils/diseaseRules'
import PredictionResult from './PredictionResult'

const SymptomChecker = () => {
  const { state } = useAppContext()
  const navigate = useNavigate()

  const [selectedAnimalId, setSelectedAnimalId] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [step, setStep] = useState(1)

  const selectedAnimal = state.animals.find(a => a.id === selectedAnimalId)
  const species = selectedAnimal?.species

  // get all symptoms for the animal's species
 const availableSymptoms = species
  ? [...new Set(
      (diseaseRules[species] || [])
        .flatMap(d => d.symptoms)
    )]
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
    if (!selectedAnimal) return

    const results = runDiagnosis(selectedAnimal.species, selectedSymptoms)
    setPrediction(results)
    setStep(3)
  }

  const handleNewDiagnosis = () => {
    setStep(1)
    setSelectedAnimalId('')
    setSelectedSymptoms([])
    setPrediction(null)
  }

  const handleSaveVisit = () => {
    // Save to health records
    navigate('/records')
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-6">Symptom Checker</h1>

      {/* Step 1 Select Animal */}
      {step === 1 && (
        <div>
          <label className="block text-gray-700 font-medium mb-2">Select Animal</label>
          <select
            value={selectedAnimalId}
            onChange={handleAnimalSelect}
            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
          >
            <option value="">-- Choose an animal --</option>
            {state.animals.map(a => (
              <option key={a.id} value={a.id}>
                {a.tag} - {a.species} (Owner: {state.farmers.find(f => f.id === a.farmerId)?.name})
              </option>
            ))}
          </select>
          {state.animals.length === 0 && (
            <p className="text-red-500">No animals registered. Please add animals first.</p>
          )}
        </div>
      )}

      {/* Step 2 Select Symptoms */}
      {step === 2 && selectedAnimal && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Select symptoms for {selectedAnimal.tag} ({selectedAnimal.species})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
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

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Back
            </button>
            <button
              onClick={handlePredict}
              disabled={selectedSymptoms.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Predict Disease
            </button>

          </div>
        </div>
      )}

      {/* Step 3: Prediction Results */}
      {step === 3 && prediction && (
        <PredictionResult
          results={prediction}
          animal={selectedAnimal}
          onNew={handleNewDiagnosis}
          onSave={handleSaveVisit}
        />
      )}
    </div>
  )
}

export default SymptomChecker





