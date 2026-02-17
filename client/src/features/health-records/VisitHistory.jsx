import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { Calendar, Search, Eye } from 'lucide-react'

const VisitHistory = () => {
  const { state } = useAppContext()
  const { visits, animals } = state

  const [searchTerm, setSearchTerm] = useState('')
  const [animalFilter, setAnimalFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  // 🔍 Filter logic
  const filteredVisits = visits.filter((visit) => {
    const animal = animals.find(a => a.id === visit.animalId)
    const animalName = animal?.tag || animal?.name || 'Unknown'

    const matchesSearch =
      animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.diseases?.some(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesAnimal =
      animalFilter === 'all' || visit.animalId === animalFilter

    const matchesDate =
      !dateFilter ||
      new Date(visit.date).toDateString() ===
        new Date(dateFilter).toDateString()

    return matchesSearch && matchesAnimal && matchesDate
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Health Records</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search animal or disease..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>

        {/* Animal Filter */}
        <select
          value={animalFilter}
          onChange={(e) => setAnimalFilter(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="all">All Animals</option>
          {animals.map((animal) => (
            <option key={animal.id} value={animal.id}>
              {animal.tag || animal.name}
            </option>
          ))}
        </select>

        {/* Date Filter */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredVisits.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No health records found.
          </div>
        ) : (
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Animal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Symptoms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Diagnosis
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredVisits.map((visit) => {
                const animal = animals.find(
                  (a) => a.id === visit.animalId  
                )

                const primaryDisease =
                  visit.diseases?.[0]?.name || 'Unknown'

                return (
                  <tr key={visit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      {formatDate(visit.date)}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {animal?.tag || animal?.name || 'Unknown'}
                    </td>

                    <td className="px-6 py-4 text-sm max-w-xs truncate">
                      {visit.symptoms?.join(', ') || '—'}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {primaryDisease}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/records/${visit.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-5 h-5 inline" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default VisitHistory