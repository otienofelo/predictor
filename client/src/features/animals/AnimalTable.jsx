import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext, ACTIONS } from '../../context/AppContext'
import { getAnimals, deleteAnimal } from '../../services/animals'
import AnimalStatusBadge from './AnimalStatusBadge'
import { Search, Plus, Edit, Trash2, Eye, PawPrint } from 'lucide-react'

const AnimalTable = () => {
  const { state, dispatch } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const farmers = state.farmers || []

  useEffect(() => {
    const fetchAnimals = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getAnimals()
        dispatch({ type: ACTIONS.SET_ANIMALS, payload: data })
      } catch (err) {
        console.error('Failed to fetch animals:', err)
        setError('Failed to load animals. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchAnimals()
  }, [dispatch])

  const animals = state.animals || []

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch =
      animal.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.breed?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecies = speciesFilter === 'all' || animal.species === speciesFilter
    const matchesStatus = statusFilter === 'all' || animal.status === statusFilter
    return matchesSearch && matchesSpecies && matchesStatus
  })

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      try {
        await deleteAnimal(id)
        dispatch({ type: ACTIONS.DELETE_ANIMAL, payload: id })
      } catch (err) {
        console.error('Failed to delete animal:', err)
        alert('Failed to delete animal. Please try again.')
      }
    }
  }

  const getFarmerName = (farmerId) => {
    const farmer = farmers.find(f => f.id === farmerId || f.id === parseInt(farmerId))
    return farmer?.name || 'Unknown'
  }

  const SPECIES_EMOJI = {
    cow: '🐄', goat: '🐐', sheep: '🐑', chicken: '🐔'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 mt-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <PawPrint className="w-6 h-6 text-green-600" /> Animals
          </h1>
          <p className="text-sm text-gray-500 mt-1">{animals.length} animals registered</p>
        </div>
        <Link
          to="/animals/new"
          className="mt-3 sm:mt-0 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 text-sm font-medium shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Animal
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tag or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Species</option>
          <option value="cow">🐄 Cow</option>
          <option value="goat">🐐 Goat</option>
          <option value="sheep">🐑 Sheep</option>
          <option value="chicken">🐔 Chicken</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Status</option>
          <option value="healthy">Healthy</option>
          <option value="sick">Sick</option>
          <option value="treatment">Under Treatment</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Tag/ID</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Species</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Breed</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Farmer</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-green-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAnimals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>{SPECIES_EMOJI[animal.species] || '🐾'}</span>
                        {animal.tag}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{animal.species}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{animal.breed || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{animal.age ? `${animal.age} mo` : '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{getFarmerName(animal.farmer_id)}</td>
                    <td className="px-6 py-4">
                      <AnimalStatusBadge status={animal.status || 'unknown'} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/animals/${animal.id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/animals/${animal.id}/edit`}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(animal.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAnimals.length === 0 && (
            <div className="text-center py-16">
              <PawPrint className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No animals found</p>
              <p className="text-gray-400 text-sm mt-1">
                {animals.length === 0
                  ? 'Register your first animal to get started'
                  : 'Try adjusting your search or filters'}
              </p>
              {animals.length === 0 && (
                <Link
                  to="/animals/new"
                  className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" /> Add First Animal
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AnimalTable