import { useState, useEffect } from 'react'
import { useAppContext, ACTIONS } from '../../context/AppContext'
import { getAnimals } from '../../services/animals'
import { getDiseases } from '../../services/diseases'
import { runDiagnosis } from '../../utils/runDiagnosis'
import PredictionResult from './PredictionResult'
import { Stethoscope, ChevronRight, ChevronLeft, Search } from 'lucide-react'

const SymptomChecker = () => {
  const { state, dispatch } = useAppContext()

  const [selectedAnimalId, setSelectedAnimalId] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [symptomSearch, setSymptomSearch] = useState('')

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

  const animals = state.animals || []
  const farmers = state.farmers || []
  const selectedAnimal = animals.find(a => a.id === selectedAnimalId)
  const species = selectedAnimal?.species

  // ✅ Fix: show diseases with no species OR matching species
  const diseases = (state.diseases || []).filter(d =>
    !d.species || !species || d.species === species
  )

  // ✅ Fix: safely handle null/undefined symptoms array
  const availableSymptoms = diseases.length > 0
    ? [...new Set(diseases.flatMap(d => Array.isArray(d.symptoms) ? d.symptoms : []))]
    : []

  const filteredSymptoms = availableSymptoms.filter(s =>
    s.toLowerCase().includes(symptomSearch.toLowerCase())
  )

  const handleAnimalSelect = (e) => {
    setSelectedAnimalId(e.target.value)
    setSelectedSymptoms([])
    setPrediction(null)
    if (e.target.value) setStep(2)
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
      setError('No matching diseases found. Try selecting different symptoms.')
    } else {
      setError('')
      setStep(3)
    }
  }

  const handleNewDiagnosis = () => {
    setStep(1)
    setSelectedAnimalId('')
    setSelectedSymptoms([])
    setPrediction(null)
    setError('')
    setSymptomSearch('')
  }

  const stepLabels = ['Select Animal', 'Choose Symptoms', 'Results']

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 mt-16">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-green-600" /> Symptom Checker
        </h1>
        <p className="text-sm text-gray-500 mt-1">Diagnose your animal by selecting observed symptoms</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {stepLabels.map((label, i) => {
          const num = i + 1
          const isActive = step === num
          const isDone = step > num
          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isDone ? 'bg-green-600 text-white' :
                  isActive ? 'bg-green-600 text-white' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {isDone ? '✓' : num}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${isActive ? 'text-green-700' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > num ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Step 1 — Select Animal */}
      {!loading && step === 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Which animal needs diagnosis?</h2>

          {animals.length === 0 ? (
            <p className="text-gray-500 text-sm">No animals registered. Please add animals first.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {animals.map(a => (
                <button
                  key={a.id}
                  onClick={() => { setSelectedAnimalId(a.id); setSelectedSymptoms([]); setPrediction(null); setStep(2) }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    selectedAnimalId === a.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">
                    {a.species === 'cow' ? '🐄' :
                     a.species === 'goat' ? '🐐' :
                     a.species === 'sheep' ? '🐑' :
                     a.species === 'chicken' ? '🐔' : '🐾'}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800">{a.tag}</p>
                    <p className="text-xs text-gray-500 capitalize">{a.species} · {farmers.find(f => f.id === a.farmer_id)?.name || 'Unknown'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2 — Select Symptoms */}
      {!loading && step === 2 && selectedAnimal && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Symptoms for {selectedAnimal.tag}
              </h2>
              <p className="text-sm text-gray-500 capitalize">{selectedAnimal.species} · {selectedAnimal.breed || 'Unknown breed'}</p>
            </div>
            {selectedSymptoms.length > 0 && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                {selectedSymptoms.length} selected
              </span>
            )}
          </div>

          {/* Symptom search */}
          {availableSymptoms.length > 8 && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search symptoms..."
                value={symptomSearch}
                onChange={e => setSymptomSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          )}

          {availableSymptoms.length === 0 ? (
            <p className="text-gray-500 text-sm mb-4">No known diseases for this species yet. Please add diseases to the library first.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-6 max-h-72 overflow-y-auto pr-1">
              {filteredSymptoms.map(symptom => (
                <label
                  key={symptom}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedSymptoms.includes(symptom)
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => handleSymptomToggle(symptom)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm capitalize">{symptom}</span>
                </label>
              ))}
            </div>
          )}

          {/* Selected symptoms pills */}
          {selectedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-green-50 rounded-xl">
              {selectedSymptoms.map(s => (
                <span
                  key={s}
                  onClick={() => handleSymptomToggle(s)}
                  className="text-xs bg-green-600 text-white px-2 py-1 rounded-full cursor-pointer hover:bg-green-700 capitalize"
                >
                  {s} ×
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-xl text-sm hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handlePredict}
              disabled={selectedSymptoms.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Run Diagnosis <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Results */}
      {step === 3 && prediction && prediction.length > 0 && (
        <PredictionResult
          results={prediction}
          animal={selectedAnimal}
          onNew={handleNewDiagnosis}
        />
      )}
    </div>
  )
}

export default SymptomChecker