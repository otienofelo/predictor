import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext, ACTIONS } from '../../context/AppContext'
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react'

const FarmerList = () => {
  const { state, dispatch } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')

  // Use state.farmers if available, otherwise fallback to mock data
  const farmers = state.farmers.length > 0 ? state.farmers : mockFarmers

  // Filter farmers based on search term
  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.phone.includes(searchTerm)
  )

  // Delete farmer handler
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      dispatch({ type: ACTIONS.DELETE_FARMER, payload: id })
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Farmers</h1>
        <Link
          to="/farmers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Farmer
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name, village or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Farmers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Village</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farm Size</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFarmers.map((farmer) => (
              <tr key={farmer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{farmer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{farmer.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{farmer.village}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{farmer.farmSize} acres</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/farmers/${farmer.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-3 inline-block"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  <Link
                    to={`/farmers/${farmer.id}/edit`}
                    className="text-green-600 hover:text-green-900 mr-3 inline-block"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(farmer.id)}
                    className="text-red-600 hover:text-red-900 inline-block"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredFarmers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No farmers found.</div>
        )}
      </div>
    </div>
  )
}

// Mock data 
const mockFarmers = [
  { id: '1', name: 'John Doe', phone: '0712345678', village: 'Kibwezi', farmSize: 5 },
  { id: '2', name: 'Jane Smith', phone: '0723456789', village: 'Makueni', farmSize: 3 },
  { id: '3', name: 'Peter Kimani', phone: '0734567890', village: 'Kitui', farmSize: 7 },
]

export default FarmerList