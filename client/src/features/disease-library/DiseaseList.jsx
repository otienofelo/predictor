import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext, ACTIONS } from '../../context/AppContext'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'

const DiseaseList = () => {
  const { state, dispatch } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('all')

  // Use diseases from global state
  const diseases = state.diseases || []

  const filteredDiseases = diseases.filter((disease) => {
    const matchesSearch =
      disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.symptoms?.some((symptom) =>
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesSpecies =
      speciesFilter === 'all' || disease.species === speciesFilter

    return matchesSearch && matchesSpecies
  })

  const handleDelete = (id) => {
    if (window.confirm('Delete this disease? This may affect diagnosis.')) {
      dispatch({
        type: ACTIONS.DELETE_DISEASE,
        payload: id,
      })
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Disease Library
        </h1>

        <Link
          to="/diseases/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Disease
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Search by disease or symptom..."
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
      </div>

      {/* Diseases Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Disease
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Species
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Symptoms
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDiseases.map((disease) => (
              <tr key={disease.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {disease.name}
                </td>

                <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                  {disease.species}
                </td>

                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {disease.symptoms?.join(', ')}
                </td>

                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link
                    to={`/diseases/${disease.id}/edit`}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    <Edit className="w-5 h-5 inline" />
                  </Link>

                  <button
                    onClick={() => handleDelete(disease.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDiseases.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No diseases found.
          </div>
        )}
      </div>
    </div>
  )
}

export default DiseaseList