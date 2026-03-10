import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext, ACTIONS } from '../../context/AppContext'
import { getDiseases, deleteDisease } from '../../services/diseases'
import { useRole } from '../../hooks/useRole'
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronUp, Shield, Lock, Clock } from 'lucide-react'
import PendingApprovals from './PendingApprovals'

const SPECIES_COLORS = {
  cow: 'bg-amber-100 text-amber-800',
  goat: 'bg-green-100 text-green-800',
  sheep: 'bg-blue-100 text-blue-800',
  chicken: 'bg-red-100 text-red-800',
}

const STATUS_BADGE = {
  approved: null,
  pending: <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" />pending</span>,
  rejected: <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">rejected</span>,
}

const DiseaseList = () => {
  const { state, dispatch } = useAppContext()
  const { isAdmin, role, loading: roleLoading } = useRole()
  const isVet = role === 'vet'
  const isResearcher = role === 'researcher'

  const [searchTerm, setSearchTerm] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const fetchDiseases = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getDiseases()
      dispatch({ type: ACTIONS.SET_DISEASES, payload: data })
    } catch (err) {
      console.error('Failed to fetch diseases:', err)
      setError('Failed to load diseases. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => { fetchDiseases() }, [fetchDiseases])

  const diseases = state.diseases || []

  const filteredDiseases = diseases.filter((disease) => {
    const matchesSearch =
      disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.symptoms?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSpecies = speciesFilter === 'all' || disease.species === speciesFilter
    return matchesSearch && matchesSpecies
  })

  const speciesCounts = diseases
    .filter(d => d.status === 'approved')
    .reduce((acc, d) => {
      acc[d.species] = (acc[d.species] || 0) + 1
      return acc
    }, {})

  const handleDelete = async (id) => {
    if (window.confirm('Delete this disease? This will affect the symptom checker.')) {
      try {
        await deleteDisease(id)
        dispatch({ type: ACTIONS.DELETE_DISEASE, payload: id })
      } catch (err) {
        alert('Failed to delete disease.')
      }
    }
  }

  // Can edit: admin always, vet always, researcher only their own pending
  const canEdit = (disease) => {
    if (isAdmin || isVet) return true
    if (isResearcher) return disease.submitted_by === disease.user_id && disease.status === 'pending'
    return false
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-20 sm:mt-24 px-4 sm:px-6 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-600" />
            Disease Library
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500">Diseases used by the Symptom Checker</p>
            {!roleLoading && role && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isAdmin ? 'bg-red-100 text-red-700' :
                isVet ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {role}
              </span>
            )}
          </div>
        </div>

        {/* Add button — admin, vet, researcher can add */}
        {(isAdmin || isVet || isResearcher) ? (
          <Link
            to="/diseases/new"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            {isResearcher ? 'Submit Disease' : 'Add Disease'}
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-100 px-3 py-2 rounded-md">
            <Lock className="w-4 h-4" /> View only
          </div>
        )}
      </div>

      {/* Admin pending approvals panel */}
      {isAdmin && <PendingApprovals onApprovalChange={fetchDiseases} />}

      {/*info banner */}
      {isResearcher && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-start gap-2 text-sm text-purple-700">
          <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>As a researcher, your submitted diseases require admin approval before appearing in the library.</p>
        </div>
      )}

      {/* Species Summary */}
      {!loading && diseases.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {['cow', 'goat', 'sheep', 'chicken'].map(species => (
            <button
              key={species}
              onClick={() => setSpeciesFilter(prev => prev === species ? 'all' : species)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                speciesFilter === species ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              <p className="text-xs text-gray-500 capitalize">{species}</p>
              <p className="text-xl font-bold text-gray-800">{speciesCounts[species] || 0}</p>
              <p className="text-xs text-gray-400">diseases</p>
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by disease name or symptom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
        >
          <option value="all">All Species</option>
          <option value="cow">Cow</option>
          <option value="goat">Goat</option>
          <option value="sheep">Sheep</option>
          <option value="chicken">Chicken</option>
        </select>
      </div>

      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          Showing <span className="font-medium text-gray-700">{filteredDiseases.length}</span> of{' '}
          <span className="font-medium text-gray-700">{diseases.length}</span> diseases
        </p>
      )}

      {loading && <div className="text-center py-12 text-gray-500">Loading disease library...</div>}
      {error && <div className="text-center py-12 text-red-500">{error}</div>}
      {!loading && !error && filteredDiseases.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">No diseases found.</div>
      )}

      {/* Disease Cards */}
      {!loading && !error && (
        <div className="space-y-3">
          {filteredDiseases.map((disease) => (
            <div key={disease.id} className="bg-white rounded-lg shadow overflow-hidden">

              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId(prev => prev === disease.id ? null : disease.id)}
              >
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${SPECIES_COLORS[disease.species]}`}>
                    {disease.species}
                  </span>
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{disease.name}</h2>
                  {STATUS_BADGE[disease.status]}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  {canEdit(disease) && (
                    <Link
                      to={`/diseases/${disease.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-md"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  )}
                  {isAdmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(disease.id) }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {expandedId === disease.id
                    ? <ChevronUp className="w-4 h-4 text-gray-400" />
                    : <ChevronDown className="w-4 h-4 text-gray-400" />
                  }
                </div>
              </div>

              {expandedId === disease.id && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Symptoms</p>
                    <div className="flex flex-wrap gap-2">
                      {disease.symptoms?.map(symptom => (
                        <span key={symptom} className="bg-orange-50 text-orange-700 border border-orange-200 px-2 py-1 rounded-full text-xs capitalize">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-md p-3">
                      <p className="text-xs font-semibold text-green-700 uppercase mb-1">Prevention</p>
                      <p className="text-sm text-gray-700">{disease.prevention}</p>
                    </div>
                    <div className="bg-blue-50 rounded-md p-3">
                      <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Treatment</p>
                      <p className="text-sm text-gray-700">{disease.treatment}</p>
                    </div>
                  </div>
                  {/* Show review note if rejected */}
                  {disease.status === 'rejected' && disease.review_note && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-xs font-semibold text-red-700 uppercase mb-1">Rejection Note</p>
                      <p className="text-sm text-red-600">{disease.review_note}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DiseaseList