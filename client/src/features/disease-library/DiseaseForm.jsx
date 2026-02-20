import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext, ACTIONS } from '../../context/AppContext'

const DiseaseForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()

  const initialFormState = {
    name: '',
    species: 'cow',
    symptoms: '',
    prevention: '',
    treatment: ''
  }

  const [formData, setFormData] = useState(initialFormState)

  // Load disease if there is editing
  useEffect(() => {
    if (id) {
      const disease = state.diseases.find(d => d.id === id)

      if (disease) {
        setFormData({
          name: disease.name || '',
          species: disease.species || 'cow',
          symptoms: disease.symptoms?.join(', ') || '',
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const symptomsArray = formData.symptoms
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const diseaseData = {
      id: id || crypto.randomUUID(),
      name: formData.name.trim(),
      species: formData.species,
      symptoms: symptomsArray,
      prevention: formData.prevention.trim(),
      treatment: formData.treatment.trim()
    }

    if (id) {
      dispatch({ type: ACTIONS.UPDATE_DISEASE, payload: diseaseData })
    } else {
      dispatch({ type: ACTIONS.ADD_DISEASE, payload: diseaseData })
    }

    navigate('/diseases')
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-6">
        {id ? 'Edit Disease' : 'Add New Disease'}
      </h1>

      <form onSubmit={handleSubmit}>

        {/* Disease Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Disease Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Species */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Species
          </label>
          <select
            name="species"
            value={formData.species}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="cow">Cow</option>
            <option value="goat">Goat</option>
            <option value="sheep">Sheep</option>
            <option value="chicken">Chicken</option>
          </select>
        </div>

        {/* Symptoms */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Symptoms <span className="text-gray-500 text-xs">(comma separated)</span>
          </label>
          <input
            type="text"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="e.g. fever, cough, loss of appetite"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Prevention */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Prevention
          </label>
          <textarea
            name="prevention"
            value={formData.prevention}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Treatment */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Treatment
          </label>
          <textarea
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/diseases')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {id ? 'Update' : 'Save'} Disease
          </button>
        </div>

      </form>
    </div>
  )
}

export default DiseaseForm