import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAnimalById } from '../../services/animals'
import { getVaccinationsByAnimal } from '../../services/vaccinations'
import api from '../../services/api'
import {
  ArrowLeft, Edit, Syringe, UtensilsCrossed, ClipboardList,
  Tag, Calendar, Heart, AlertTriangle, CheckCircle, Clock,
  User, Weight, Dna, ChevronDown, ChevronUp
} from 'lucide-react'

const StatusConfig = {
  healthy: { label: 'Healthy', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', icon: CheckCircle },
  sick: { label: 'Sick', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', icon: AlertTriangle },
  treatment: { label: 'Under Treatment', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', icon: Clock },
  unknown: { label: 'Unknown', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', icon: Heart },
}

const getDaysUntil = (dateStr) => {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
}

const DueBadge = ({ date }) => {
  const days = getDaysUntil(date)
  if (days === null) return <span className="text-gray-400 text-xs">—</span>
  if (days < 0) return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Overdue</span>
  if (days === 0) return <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Due today</span>
  if (days <= 7) return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">In {days}d</span>
  return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{new Date(date).toLocaleDateString()}</span>
}

const Section = ({ icon: Icon, title, count, color = 'green', children }) => {
  const [open, setOpen] = useState(true)
  const colors = {
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  }
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-800">{title}</span>
          {count !== undefined && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{count}</span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

const AnimalDetail = () => {
  const { animalId } = useParams()
  const navigate = useNavigate()
  const [animal, setAnimal] = useState(null)
  const [vaccinations, setVaccinations] = useState([])
  const [visits, setVisits] = useState([])
  const [feedingLogs, setFeedingLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [animalData, vaccData, visitsData, feedData] = await Promise.all([
          getAnimalById(animalId),
          getVaccinationsByAnimal(animalId).catch(() => []),
          api.get('/visits').then(r => r.data.filter(v => v.animal_id === animalId)).catch(() => []),
          api.get('/feeding').then(r => r.data.filter(f => f.animal_id === animalId)).catch(() => []),
        ])
        setAnimal(animalData)
        setVaccinations(vaccData)
        setVisits(visitsData)
        setFeedingLogs(feedData)
      } catch (err) {
        setError('Failed to load animal details.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [animalId])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error || !animal) return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
      <p className="text-gray-600">{error || 'Animal not found'}</p>
      <button onClick={() => navigate('/animals')} className="mt-4 text-green-600 hover:underline">
        Back to Animals
      </button>
    </div>
  )

  const status = StatusConfig[animal.status] || StatusConfig.unknown
  const StatusIcon = status.icon

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 mt-16">

      {/* Back button */}
      <button
        onClick={() => navigate('/animals')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Animals
      </button>

      {/* Hero card */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl">
              {animal.species === 'cow' ? '🐄' :
                animal.species === 'goat' ? '🐐' :
                  animal.species === 'sheep' ? '🐑' :
                    animal.species === 'chicken' ? '🐔' : '🐾'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-4 h-4 opacity-80" />
                <span className="text-green-100 text-sm">Tag ID</span>
              </div>
              <h1 className="text-3xl font-bold">{animal.tag}</h1>
              <p className="text-green-100 capitalize mt-0.5">{animal.species} · {animal.breed || 'Unknown breed'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white bg-opacity-20`}>
              <span className={`w-2 h-2 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <Link
              to={`/animals/${animalId}/edit`}
              className="flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors"
            >
              <Edit className="w-4 h-4" /> Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Calendar, label: 'Age', value: animal.age ? `${animal.age} months` : '—' },
          { icon: Weight, label: 'Weight', value: animal.weight ? `${animal.weight} kg` : '—' },
          { icon: User, label: 'Farmer', value: animal.farmer_name || '—' },
          { icon: Dna, label: 'Species', value: animal.species || '—', capitalize: true },
        ].map(({ icon: Icon, label, value, capitalize }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-green-500" />
              <p className="text-xs text-gray-400 font-medium uppercase">{label}</p>
            </div>
            <p className={`text-sm font-semibold text-gray-800 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Vaccinations */}
      <div className="space-y-4">
        <Section icon={Syringe} title="Vaccination History" count={vaccinations.length} color="blue">
          {vaccinations.length === 0 ? (
            <p className="text-sm text-gray-400 py-2">No vaccination records found.</p>
          ) : (
            <div className="space-y-2 mt-1">
              {vaccinations.map(v => (
                <div key={v.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{v.vaccine_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Administered: {new Date(v.date_administered).toLocaleDateString()}
                      {v.vet_responsible && ` · ${v.vet_responsible}`}
                    </p>
                  </div>
                  <DueBadge date={v.next_due_date} />
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Feeding logs */}
        <Section icon={UtensilsCrossed} title="Feeding Logs" count={feedingLogs.length} color="green">
          {feedingLogs.length === 0 ? (
            <p className="text-sm text-gray-400 py-2">No feeding records found.</p>
          ) : (
            <div className="space-y-2 mt-1">
              {feedingLogs.slice(0, 5).map(log => (
                <div key={log.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{log.feed_type}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(log.feeding_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {log.quantity} {log.unit}
                    </span>
                    {log.cost > 0 && (
                      <p className="text-xs text-gray-400 mt-1">KSh {log.cost}</p>
                    )}
                  </div>
                </div>
              ))}
              {feedingLogs.length > 5 && (
                <p className="text-xs text-center text-gray-400 pt-1">
                  +{feedingLogs.length - 5} more records
                </p>
              )}
            </div>
          )}
        </Section>

        {/* Health visits */}
        <Section icon={ClipboardList} title="Health Records" count={visits.length} color="amber">
          {visits.length === 0 ? (
            <p className="text-sm text-gray-400 py-2">No health records found.</p>
          ) : (
            <div className="space-y-2 mt-1">
              {visits.map(v => (
                <Link
                  key={v.id}
                  to={`/records/${v.id}`}
                  className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 hover:bg-amber-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {Array.isArray(v.diseases) && v.diseases.length > 0
                        ? v.diseases.map(d => d.name || d).join(', ')
                        : 'Visit'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(v.visit_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs text-amber-600 font-medium">View </span>
                </Link>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}

export default AnimalDetail