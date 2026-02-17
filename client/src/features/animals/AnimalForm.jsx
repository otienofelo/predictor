
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext, ACTIONS } from '../../context/AppContext'

const AnimalForm = () => {
  const { id } = useParams()
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

  // Load animal if editing
  useEffect(() => {
    if (id && state.animals?.length > 0) {
      const existingAnimal = state.animals.find(a => a.id === id)
      if (existingAnimal) {
        setFormData({
          ...existingAnimal,
          age: existingAnimal.age || ''
        })
      }
    }
  }, [id, state.animals])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.farmerId) {
      alert('Please select a farmer.')
      return
    }

    if (id) {
      dispatch({
        type: ACTIONS.UPDATE_ANIMAL,
        payload: { ...formData, id }
      })
    } else {
      dispatch({
        type: ACTIONS.ADD_ANIMAL,
        payload: {
          ...formData,
          id: Date.now().toString()
        }
      })
    }

    navigate('/animals')
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-6">
        {id ? 'Edit Animal' : 'Register New Animal'}
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Tag */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tag/ID</label>
          <input
            type="text"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Species */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Species</label>
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

        {/* Breed */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Breed</label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Age */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Age (months)</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Farmer Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Farmer</label>
          <select
            name="farmerId"
            value={formData.farmerId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Farmer</option>
            {(state.farmers || []).map(farmer => (
              <option key={farmer.id} value={farmer.id}>
                {farmer.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Health Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="healthy">Healthy</option>
            <option value="sick">Sick</option>
            <option value="treatment">Under Treatment</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/animals')}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {id ? 'Update' : 'Register'} Animal
          </button>
        </div>
      </form>
    </div>
  )
}

export default AnimalForm