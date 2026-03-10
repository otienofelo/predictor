import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext, ACTIONS } from '../../context/AppContext'
import { createDisease, updateDisease } from '../../services/diseases'
import { X, Plus } from 'lucide-react'

const DiseaseForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()

  const initialFormState = {
    name: '',
    species: 'cow',
    symptoms: [],
    prevention: '',
    treatment: ''
  }

  const [formData, setFormData] = useState(initialFormState)
  const [symptomInput, setSymptomInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load disease if editing
  useEffect(() => {
    if (id) {
      const disease = state.diseases.find(d => d.id === id)
      if (disease) {
        setFormData({
          name: disease.name || '',
          species: disease.species || 'cow',
          symptoms: disease.symptoms || [],
          prevention: disease.prevention || '',
          treatment: disease.treatment || ''
        })
      }
    } else {
      setFormData(initialFormState)
    }
  }, [id, state.diseases])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Add symptom on Enter or comma
  const handleSymptomKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSymptom()
    }
  }

  const addSymptom = () => {
    const trimmed = symptomInput.trim().toLowerCase()
    if (trimmed && !formData.symptoms.includes(trimmed)) {
      setFormData(prev => ({ ...prev, symptoms: [...prev.symptoms, trimmed] }))
    }
    setSymptomInput('')
  }

  const removeSymptom = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(s => s !== symptom)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.symptoms.length === 0) {
      setError('Please add at least one symptom.')
      return
    }

    setLoading(true)
    setError('')

    const diseaseData = {
      name: formData.name.trim(),
      species: formData.species,
      symptoms: formData.symptoms,
      prevention: formData.prevention.trim(),
      treatment: formData.treatment.trim()
    }

    try {
      if (id) {
        const updated = await updateDisease(id, diseaseData)
        dispatch({ type: ACTIONS.UPDATE_DISEASE, payload: updated })
      } else {
        const created = await createDisease(diseaseData)
        dispatch({ type: ACTIONS.ADD_DISEASE, payload: created })
      }
      navigate('/diseases')
    } catch (err) {
      console.error('Failed to save disease:', err)
      setError('Failed to save disease. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-20 sm:mt-24 px-4 sm:px-6 pb-10 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-6">
          {id ? 'Edit Disease' : 'Add New Disease'}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Disease Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Disease Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Foot and Mouth Disease"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Species */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Species</label>
            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cow">Cow</option>
              <option value="goat">Goat</option>
              <option value="sheep">Sheep</option>
              <option value="chicken">Chicken</option>
            </select>
          </div>

          {/* Symptoms — Tag Input */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Symptoms
              <span className="text-gray-400 font-normal ml-1">(press Enter or comma to add)</span>
            </label>

            {/* Tag display */}
            {formData.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-200 rounded-md bg-gray-50">
                {formData.symptoms.map(symptom => (
                  <span
                    key={symptom}
                    className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs capitalize"
                  >
                    {symptom}
                    <button
                      type="button"
                      onClick={() => removeSymptom(symptom)}
                      className="hover:text-orange-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Symptom input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyDown={handleSymptomKeyDown}
                placeholder="e.g. fever"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addSymptom}
                className="px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {formData.symptoms.length} symptom{formData.symptoms.length !== 1 ? 's' : ''} added
            </p>
          </div>

          {/* Prevention */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Prevention</label>
            <textarea
              name="prevention"
              value={formData.prevention}
              onChange={handleChange}
              rows="3"
              placeholder="e.g. Vaccinate annually, quarantine new animals..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Treatment */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Treatment</label>
            <textarea
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              rows="3"
              placeholder="e.g. Antibiotics, supportive care..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/diseases')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm w-full sm:w-auto"
            >
              {loading ? 'Saving...' : `${id ? 'Update' : 'Save'} Disease`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DiseaseForm