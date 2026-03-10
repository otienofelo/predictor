import { useState, useEffect } from 'react'
import { useRole } from '../../hooks/useRole'
import { getVaccinations, getUpcomingVaccinations, createVaccination, updateVaccination, deleteVaccination } from "../../services/vaccinations"
import { getAnimals } from '../../services/animals'
import { Syringe, Plus, Edit, Trash2, X, Bell, Calendar, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Lock } from 'lucide-react'

const EMPTY_FORM = { animalId: '', vaccineName: '', dateAdministered: '', nextDueDate: '', vetResponsible: '', notes: '' }

const getDaysUntil = (dateStr) => {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
  return diff
}

const DueBadge = ({ date }) => {
  const days = getDaysUntil(date)
  if (days === null) return null
  if (days < 0) return <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full"><AlertTriangle className="w-3 h-3" />Overdue</span>
  if (days === 0) return <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full"><Bell className="w-3 h-3" />Due today</span>
  if (days <= 7) return <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full"><Bell className="w-3 h-3" />Due in {days}d</span>
  if (days <= 30) return <span className="flex items-center gap-1 text-xs bg-green-100 text-blue-700 px-2 py-0.5 rounded-full"><Calendar className="w-3 h-3" />Due in {days}d</span>
  return <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"><CheckCircle className="w-3 h-3" />{new Date(date).toLocaleDateString()}</span>
}

const ROLE_COLORS = {
  admin: 'bg-red-100 text-red-700',
  vet: 'bg-blue-100 text-blue-700',
  farmer: 'bg-green-100 text-green-700',
  researcher: 'bg-purple-100 text-purple-700',
}

const VaccinationPage = () => {
  const { role, isAdmin, loading: roleLoading } = useRole()
  const isVet = role === 'vet'
  const isFarmer = role === 'farmer'
  const isResearcher = role === 'researcher'

  // Researchers have no access
  const canManage = isAdmin || isVet  
  const canView = isAdmin || isVet || isFarmer 

  const [vaccinations, setVaccinations] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!roleLoading && canView) fetchAll()
    if (!roleLoading && !canView) setLoading(false)
  }, [roleLoading, role])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [vacc, upc, anim] = await Promise.all([
        getVaccinations(),
        getUpcomingVaccinations(),
        getAnimals()
      ])
      setVaccinations(vacc)
      setUpcoming(upc)
      setAnimals(anim)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (v) => {
    setEditId(v.id)
    setForm({
      animalId: v.animal_id,
      vaccineName: v.vaccine_name,
      dateAdministered: v.date_administered?.split('T')[0] || '',
      nextDueDate: v.next_due_date?.split('T')[0] || '',
      vetResponsible: v.vet_responsible || '',
      notes: v.notes || ''
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editId) {
        const updated = await updateVaccination(editId, form)
        setVaccinations(prev => prev.map(v => v.id === editId ? { ...v, ...updated } : v))
      } else {
        await createVaccination(form)
      }
      setShowForm(false)
      setEditId(null)
      setForm(EMPTY_FORM)
      fetchAll()
    } catch (err) {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vaccination record?')) return
    try {
      await deleteVaccination(id)
      setVaccinations(prev => prev.filter(v => v.id !== id))
    } catch (err) {
      alert('Failed to delete.')
    }
  }

  const filtered = vaccinations.filter(v => {
    const days = getDaysUntil(v.next_due_date)
    if (filter === 'upcoming') return days !== null && days >= 0 && days <= 30
    if (filter === 'overdue') return days !== null && days < 0
    return true
  })

  // Researcher no access
  if (!roleLoading && isResearcher) {
    return (
      <div className="max-w-md mx-auto mt-32 px-4 text-center">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8">
          <Lock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-purple-800 mb-2">Access Restricted</h2>
          <p className="text-purple-600 text-sm">
            Researchers do not have access to the Vaccination Management page.
          </p>
          <p className="text-purple-400 text-xs mt-2">Contact an admin if you need access.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 mt-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Syringe className="w-6 h-6 text-green-600" /> Vaccination Management
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500">Track and schedule animal vaccinations</p>
            {role && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[role] || 'bg-gray-100 text-gray-600'}`}>
                {role}
              </span>
            )}
          </div>
        </div>

        {/* Only admin and vet can add */}
        {canManage ? (
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM) }}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Vaccination
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-100 px-3 py-2 rounded-lg">
            <Lock className="w-4 h-4" /> View only
          </div>
        )}
      </div>

      {/* Farmer info banner */}
      {isFarmer && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          You can view vaccination records for your animals. Contact your vet to add or update records.
        </div>
      )}

      {/* Upcoming reminders banner */}
      {upcoming.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-green-300 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-800">Upcoming in 30 days ({upcoming.length})</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {upcoming.map(v => (
              <div key={v.id} className="bg-white rounded-lg px-3 py-2 flex items-center justify-between border border-green-100">
                <div>
                  <p className="text-sm font-medium text-gray-800">{v.animal_tag} — {v.vaccine_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{v.animal_species}</p>
                </div>
                <DueBadge date={v.next_due_date} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'upcoming', 'overdue'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filter === f ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400 self-center">{filtered.length} records</span>
      </div>

      {loading && <div className="text-center py-12 text-gray-500">Loading vaccinations...</div>}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Syringe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No vaccination records found</p>
          <p className="text-gray-400 text-sm mt-1">
            {canManage ? 'Add your first vaccination record to get started' : 'No records have been added yet'}
          </p>
        </div>
      )}

      {/* Vaccination cards */}
      {!loading && (
        <div className="space-y-3">
          {filtered.map(v => (
            <div key={v.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedId(prev => prev === v.id ? null : v.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Syringe className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-800 text-sm">{v.vaccine_name}</p>
                      <DueBadge date={v.next_due_date} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {v.animal_tag} · <span className="capitalize">{v.animal_species}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  {/* Only admin and vet see edit/delete */}
                  {canManage && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(v) }}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      {/* Only admin can delete */}
                      {isAdmin && (
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(v.id) }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                  {expandedId === v.id
                    ? <ChevronUp className="w-4 h-4 text-gray-400" />
                    : <ChevronDown className="w-4 h-4 text-gray-400" />
                  }
                </div>
              </div>

              {expandedId === v.id && (
                <div className="px-4 pb-4 border-t border-gray-50 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Administered</p>
                    <p className="text-sm font-medium text-gray-700">{new Date(v.date_administered).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Next Due</p>
                    <p className="text-sm font-medium text-gray-700">{v.next_due_date ? new Date(v.next_due_date).toLocaleDateString() : '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Vet</p>
                    <p className="text-sm font-medium text-gray-700">{v.vet_responsible || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Notes</p>
                    <p className="text-sm font-medium text-gray-700">{v.notes || '—'}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/*only for admin and vet */}
      {showForm && canManage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-lg">{editId ? 'Edit' : 'Add'} Vaccination</h2>
              <button onClick={() => { setShowForm(false); setEditId(null) }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Animal *</label>
                <select value={form.animalId} onChange={e => setForm(p => ({ ...p, animalId: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select animal</option>
                  {animals.map(a => <option key={a.id} value={a.id}>{a.tag} — {a.species}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Vaccine Name *</label>
                <input type="text" value={form.vaccineName} onChange={e => setForm(p => ({ ...p, vaccineName: e.target.value }))} required
                  placeholder="e.g. FMD Vaccine, Anthrax"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date Administered *</label>
                  <input type="date" value={form.dateAdministered} onChange={e => setForm(p => ({ ...p, dateAdministered: e.target.value }))} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Next Due Date</label>
                  <input type="date" value={form.nextDueDate} onChange={e => setForm(p => ({ ...p, nextDueDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Vet Responsible</label>
                <input type="text" value={form.vetResponsible} onChange={e => setForm(p => ({ ...p, vetResponsible: e.target.value }))}
                  placeholder="e.g. Dr. Kamau"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                  placeholder="Any additional notes..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
                  {saving ? 'Saving...' : editId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default VaccinationPage