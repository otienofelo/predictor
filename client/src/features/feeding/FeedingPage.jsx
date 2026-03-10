import { useState, useEffect } from 'react'
import { useRole } from '../../hooks/useRole'
import { getAnimals } from '../../services/animals'
import { getFeedingLogs, getDailyFeedingLogs, getMonthlyCostSummary, createFeedingLog, updateFeedingLog, deleteFeedingLog } from '../../services/feeding'
import { UtensilsCrossed, Plus, Edit, Trash2, X, TrendingUp, Clock, DollarSign, ChevronDown, ChevronUp, Lock, CheckCircle } from 'lucide-react'

const EMPTY_FORM = { animalId: '', feedType: '', quantity: '', unit: 'kg', feedingTime: '', cost: '', notes: '' }
const FEED_TYPES = ['Hay', 'Silage', 'Grain', 'Maize', 'Grass', 'Pellets', 'Bran', 'Salt lick', 'Supplement', 'Other']
const UNITS = ['kg', 'g', 'litres', 'bags', 'bales', 'pieces']

const ROLE_COLORS = {
  admin: 'bg-red-100 text-red-700',
  vet: 'bg-blue-100 text-blue-700',
  farmer: 'bg-green-100 text-green-700',
  researcher: 'bg-purple-100 text-purple-700',
}

const FeedingPage = () => {
  const { role, isAdmin, loading: roleLoading } = useRole()
  const isVet = role === 'vet'
  const isFarmer = role === 'farmer'
  const isResearcher = role === 'researcher'

  const canManage = isAdmin || isVet
  const canView = isAdmin || isVet || isFarmer

  const [logs, setLogs] = useState([])
  const [dailyLogs, setDailyLogs] = useState([])
  const [monthlyCost, setMonthlyCost] = useState([])
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [view, setView] = useState('all')

  useEffect(() => {
    if (!roleLoading && canView) fetchAll()
    if (!roleLoading && !canView) setLoading(false)
  }, [roleLoading, role])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [all, daily, monthly, anim] = await Promise.all([
        getFeedingLogs(), getDailyFeedingLogs(), getMonthlyCostSummary(), getAnimals()
      ])
      setLogs(all)
      setDailyLogs(daily)
      setMonthlyCost(monthly)
      setAnimals(anim)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (log) => {
    setEditId(log.id)
    setForm({
      animalId: log.animal_id,
      feedType: log.feed_type,
      quantity: log.quantity,
      unit: log.unit,
      feedingTime: log.feeding_time?.slice(0, 16) || '',
      cost: log.cost,
      notes: log.notes || ''
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editId) {
        const updated = await updateFeedingLog(editId, form)
        setLogs(prev => prev.map(l => l.id === editId ? { ...l, ...updated } : l))
      } else {
        await createFeedingLog(form)
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
    if (!window.confirm('Delete this feeding log?')) return
    try {
      await deleteFeedingLog(id)
      setLogs(prev => prev.filter(l => l.id !== id))
      setDailyLogs(prev => prev.filter(l => l.id !== id))
    } catch (err) {
      alert('Failed to delete.')
    }
  }

  const displayLogs = view === 'today' ? dailyLogs : logs
  const todayTotal = dailyLogs.reduce((sum, l) => sum + parseFloat(l.cost || 0), 0)
  const thisMonth = monthlyCost[0]?.total_cost || 0


  if (!roleLoading && isResearcher) {
    return (
      <div className="max-w-md mx-auto mt-32 px-4 text-center">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8">
          <Lock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-purple-800 mb-2">Access Restricted</h2>
          <p className="text-purple-600 text-sm">
            Researchers do not have access to the Feed Management page.
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
            <UtensilsCrossed className="w-6 h-6 text-green-600" /> Feed Management
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500">Track daily livestock feeding and costs</p>
            {role && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[role] || 'bg-gray-100 text-gray-600'}`}>
                {role}
              </span>
            )}
          </div>
        </div>

        {/* Only admin and vet can log feeding */}
        {canManage ? (
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm({ ...EMPTY_FORM, feedingTime: new Date().toISOString().slice(0, 16) }) }}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Log Feeding
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
          You can view feeding records for your animals. Contact your vet to add or update records.
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase">Today's Feedings</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{dailyLogs.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase">Today's Cost</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">KSh {parseFloat(todayTotal).toFixed(0)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase">This Month</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">KSh {parseFloat(thisMonth).toFixed(0)}</p>
        </div>
      </div>

      {/* Monthly cost breakdown */}
      {monthlyCost.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" /> Monthly Cost Trend
          </h2>
          <div className="space-y-2">
            {monthlyCost.map((m, i) => {
              const maxCost = Math.max(...monthlyCost.map(x => parseFloat(x.total_cost)))
              const pct = maxCost > 0 ? (parseFloat(m.total_cost) / maxCost) * 100 : 0
              return (
                <div key={i} className="flex items-center gap-3">
                  <p className="text-xs text-gray-500 w-20 flex-shrink-0">
                    {new Date(m.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  </p>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs font-semibold text-gray-700 w-20 text-right">KSh {parseFloat(m.total_cost).toFixed(0)}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* View toggle */}
      <div className="flex gap-2 mb-4">
        {['all', 'today'].map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${view === v ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}>{v === 'today' ? "Today's Log" : 'All Records'}</button>
        ))}
        <span className="ml-auto text-sm text-gray-400 self-center">{displayLogs.length} records</span>
      </div>

      {loading && <div className="text-center py-12 text-gray-500">Loading feeding logs...</div>}

      {!loading && displayLogs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No feeding records found</p>
          <p className="text-gray-400 text-sm mt-1">
            {canManage ? 'Log your first feeding session to get started' : 'No records have been added yet'}
          </p>
        </div>
      )}

      {/* Feeding log cards */}
      {!loading && (
        <div className="space-y-3">
          {displayLogs.map(log => (
            <div key={log.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedId(prev => prev === log.id ? null : log.id)}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <UtensilsCrossed className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-800 text-sm">{log.feed_type}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {log.quantity} {log.unit}
                      </span>
                      {log.cost > 0 && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          KSh {log.cost}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {log.animal_tag} · {new Date(log.feeding_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  {/* Only admin and vet see edit/delete */}
                  {canManage && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(log) }}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      {/* Only admin can delete */}
                      {isAdmin && (
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(log.id) }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                  {expandedId === log.id
                    ? <ChevronUp className="w-4 h-4 text-gray-400" />
                    : <ChevronDown className="w-4 h-4 text-gray-400" />
                  }
                </div>
              </div>

              {expandedId === log.id && (
                <div className="px-4 pb-4 border-t border-gray-50 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Animal', value: `${log.animal_tag} (${log.animal_species})` },
                    { label: 'Quantity', value: `${log.quantity} ${log.unit}` },
                    { label: 'Cost', value: log.cost > 0 ? `KSh ${log.cost}` : '—' },
                    { label: 'Notes', value: log.notes || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 uppercase font-semibold mb-1">{label}</p>
                      <p className="text-sm font-medium text-gray-700 capitalize">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form Modal — only for admin and vet */}
      {showForm && canManage && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-lg">{editId ? 'Edit' : 'Log'} Feeding</h2>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Feed Type *</label>
                  <select value={form.feedType} onChange={e => setForm(p => ({ ...p, feedType: e.target.value }))} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select type</option>
                    {FEED_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Feeding Time *</label>
                  <input type="datetime-local" value={form.feedingTime} onChange={e => setForm(p => ({ ...p, feedingTime: e.target.value }))} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity *</label>
                  <input type="number" step="0.01" min="0" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} required
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Unit</label>
                  <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cost (KSh)</label>
                <input type="number" step="0.01" min="0" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))}
                  placeholder="0.00"
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

export default FeedingPage