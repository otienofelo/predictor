import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext, ACTIONS } from '../../context/AppContext'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'

const DiseaseList = () => {
  const { state, dispatch } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('all')

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
    <div className="w-full max-w-6xl mx-auto mt-20 sm:mt-24 px-4 sm:px-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Disease Library
        </h1>

        <Link
          to="/diseases/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center sm:justify-start"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Disease
        </Link>
      </div>

    
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by disease or symptom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Species Filter */}
        <select
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Species</option>
          <option value="cow">Cow</option>
          <option value="goat">Goat</option>
          <option value="sheep">Sheep</option>
          <option value="chicken">Chicken</option>
        </select>
      </div>

      {filteredDiseases.length === 0 && (
        <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow">
          No diseases found.
        </div>
      )}


      <div className="grid gap-4 sm:hidden">
        {filteredDiseases.map((disease) => (
          <div
            key={disease.id}
            className="bg-white p-4 rounded-lg shadow space-y-2"
          >
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-gray-800">
                {disease.name}
              </h2>

              <div className="flex gap-3">
                <Link
                  to={`/diseases/${disease.id}/edit`}
                  className="text-green-600"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(disease.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 capitalize">
              Species: {disease.species}
            </p>

            <p className="text-sm text-gray-600">
              {disease.symptoms?.join(', ')}
            </p>
          </div>
        ))}
      </div>

      <div className="hidden sm:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Disease Name
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

          <tbody className="divide-y divide-gray-200">
            {filteredDiseases.map((disease) => (
              <tr key={disease.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {disease.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                  {disease.species}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {disease.symptoms?.join(', ')}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                  <Link
                    to={`/diseases/${disease.id}/edit`}
                    className="text-green-600 hover:text-green-900"
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
      </div>
    </div>
  )
}

export default DiseaseList