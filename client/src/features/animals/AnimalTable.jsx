import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext, ACTIONS } from '../../context/AppContext'
import AnimalStatusBadge from './AnimalStatusBadge'
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react'

const AnimalTable = () => {
  
  const { state, dispatch } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

   const animals = state.animals?.length > 0 ? state.animals : mockAnimals
  const farmers = state.farmers || []

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch =
      animal.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.breed?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecies = speciesFilter === 'all' || animal.species === speciesFilter
    const matchesStatus = statusFilter === 'all' || animal.status === statusFilter
    return matchesSearch && matchesSpecies && matchesStatus
  })
const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      dispatch({ type: ACTIONS.DELETE_ANIMAL, payload: id })
    }
  }
   const getFarmerName = (farmerId) => {
    const farmer = farmers.find(f => f.id === farmerId)
    return farmer?.name || 'Unknown'
  }

  return (
      <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Animals</h1>
        <Link
          to="/animals/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Animal
        </Link>
      </div>
       {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tag or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <select
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="all">All Species</option>
          <option value="cow">Cow</option>
          <option value="goat">Goat</option>
          <option value="sheep">Sheep</option>
          <option value="chicken">Chicken</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="healthy">Healthy</option>
          <option value="sick">Sick</option>
          <option value="treatment">Under Treatment</option>
        </select>
        <div /> 
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tag/ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Species</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAnimals.map((animal) => (
              <tr key={animal.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{animal.tag}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{animal.species}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{animal.breed}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{animal.age} months</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getFarmerName(animal.farmerId)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <AnimalStatusBadge status={animal.status || 'unknown'} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/animals/${animal.id}`} className="text-blue-600 hover:text-blue-900 mr-3" title="View">
                    <Eye className="w-5 h-5 inline" />
                  </Link>
                  <Link to={`/animals/${animal.id}/edit`} className="text-green-600 hover:text-green-900 mr-3" title="Edit">
                    <Edit className="w-5 h-5 inline" />
                  </Link>
                  <button onClick={() => handleDelete(animal.id)} className="text-red-600 hover:text-red-900" title="Delete">
                    <Trash2 className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAnimals.length === 0 && (
          <div className="text-center py-8 text-gray-500">No animals found.</div>
        )}
      </div>
    </div>
  )
}

// Mock data for testing if state.animals is empty
const mockAnimals = [
  { id: '1', tag: 'COW001', species: 'cow', breed: 'Friesian', age: 24, farmerId: '1', status: 'healthy' },
  { id: '2', tag: 'GOAT045', species: 'goat', breed: 'Saanen', age: 12, farmerId: '2', status: 'sick' },
  { id: '3', tag: 'SHP022', species: 'sheep', breed: 'Dorper', age: 18, farmerId: '1', status: 'treatment' },
]
export default AnimalTable
