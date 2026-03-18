import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext, ACTIONS } from '../../context/AppContext'
import { createAnimal, updateAnimal } from '../../services/animals'
import { PawPrint, ArrowLeft } from 'lucide-react'

const AnimalForm = () => {
  const { animalId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()

  const [formData, setFormData] = useState({
    tag: '',
    species: 'cow',
    breed: '',
    age: '',
    farmerId: '',
    status: 'healthy'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (animalId && state.animals?.length > 0) {
      const existingAnimal = state.animals.find(a => a.id === parseInt(animalId) || a.id === animalId)
      if (existingAnimal) {
        setFormData({
          tag: existingAnimal.tag,
          species: existingAnimal.species,
          breed: existingAnimal.breed || '',
          age: existingAnimal.age || '',
          farmerId: existingAnimal.farmer_id || existingAnimal.farmerId || '',
          status: existingAnimal.status || 'healthy'
        })
      }
    }
  }, [animalId, state.animals])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.farmerId) {
      setError('Please select a farmer.')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (animalId) {
        const updated = await updateAnimal(animalId, formData)
        dispatch({ type: ACTIONS.UPDATE_ANIMAL, payload: updated })
      } else {
        const newAnimal = await createAnimal(formData)
        dispatch({ type: ACTIONS.ADD_ANIMAL, payload: newAnimal })
      }
      navigate('/animals')
    } catch (err) {
      console.error('Failed to save animal:', err)
      setError('Failed to save animal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const SPECIES_EMOJI = {
    cow: '🐄', goat: '🐐', sheep: '🐑', chicken: '🐔'
  }

  return (
    <div className="max-w-2xl mx-auto mt-16 px-4 sm:px-6 pb-12">

      {/* Back button */}
      <button
        onClick={() => navigate('/animals')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Animals
      </button>

      {/* Hero header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl">
            {SPECIES_EMOJI[formData.species] || '🐾'}
          </div>
          <div>
            <h1 className="text-xl font-bold">
              {animalId ? 'Edit Animal' : 'Register New Animal'}
            </h1>
            <p className="text-green-100 text-sm mt-0.5">
              {animalId ? 'Update animal information' : 'Add a new animal to your farm'}
            </p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Tag */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tag / ID *
            </label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              required
              placeholder="e.g. COW-001"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Species & Breed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Species</label>
              <select
                name="species"
                value={formData.species}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="cow">🐄 Cow</option>
                <option value="goat">🐐 Goat</option>
                <option value="sheep">🐑 Sheep</option>
                <option value="chicken">🐔 Chicken</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Breed</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="e.g. Friesian, Boer"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age (months)</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 24"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Farmer */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Farmer *</label>
            <select
              name="farmerId"
              value={formData.farmerId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Farmer</option>
              {(state.farmers || []).map(farmer => (
                <option key={farmer.id} value={farmer.id}>
                  {farmer.name}
                </option>
              ))}
            </select>
            {(state.farmers || []).length === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                No farmers found. Please register a farmer first.
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Health Status</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'healthy',   label: 'Healthy',          color: 'green' },
                { value: 'sick',      label: 'Sick',             color: 'red' },
                { value: 'treatment', label: 'Under Treatment',  color: 'amber' },
              ].map(({ value, label, color }) => (
                <label
                  key={value}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer text-sm font-medium transition-all ${
                    formData.status === value
                      ? color === 'green' ? 'border-green-500 bg-green-50 text-green-700'
                      : color === 'red'   ? 'border-red-500 bg-red-50 text-red-700'
                      :                    'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={value}
                    checked={formData.status === value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/animals')}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : animalId ? 'Update Animal' : 'Register Animal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AnimalForm