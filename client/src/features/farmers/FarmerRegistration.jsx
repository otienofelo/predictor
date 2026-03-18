import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ACTIONS, useAppContext } from '../../context/AppContext'
import { createFarmer, updateFarmer } from '../../services/farmers'

const FarmerRegistration = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    farmSize: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load existing farmer data if editing
  useEffect(() => {
    if (id) {
      const farmer = state.farmers.find(f => f.id === parseInt(id) || f.id === id)
      if (farmer) {
        setFormData({
          name: farmer.name,
          phone: farmer.phone,
          village: farmer.village,
          farmSize: farmer.farm_size,
        })
      }
    }
  }, [id, state.farmers])

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (id) {
        //Update via API
        const updated = await updateFarmer(id, formData)
        dispatch({ type: ACTIONS.UPDATE_FARMER, payload: updated })
      } else {
        //Create via API
        const newFarmer = await createFarmer(formData)
        dispatch({ type: ACTIONS.ADD_FARMER, payload: newFarmer })
      }
      navigate('/farmers')
    } catch (err) {
      console.error('Failed to save farmer:', err)
      setError('Failed to save farmer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-6">
        {id ? 'Edit Farmer' : 'Register New Farmer'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Village */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Village</label>
          <input
            type="text"
            name="village"
            value={formData.village}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Farm Size */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Farm Size (acres)</label>
          <input
            type="number"
            name="farmSize"
            value={formData.farmSize}
            onChange={handleChange}
            required
            min="0.1"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/farmers')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : `${id ? 'Update' : 'Register'} Farmer`}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FarmerRegistration