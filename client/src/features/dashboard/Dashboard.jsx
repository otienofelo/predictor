import { useEffect } from 'react'
import { useAppContext, ACTIONS } from '../../context/AppContext'
import { getFarmers } from '../../services/farmers'
import { getAnimals } from '../../services/animals'
import { getVisits } from '../../services/visits'
import StatsCard from './StatsCards'
import RecentVisits from './RecentActivity'
import { Users, PawPrint, Activity, AlertCircle } from 'lucide-react'

const Dashboard = () => {
  const { state, dispatch } = useAppContext()
  const { farmers = [], animals = [], visits = [] } = state

  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [farmersData, animalsData, visitsData] = await Promise.all([
          getFarmers(),
          getAnimals(),
          getVisits(),
        ])
        dispatch({ type: ACTIONS.SET_FARMERS, payload: farmersData })
        dispatch({ type: ACTIONS.SET_ANIMALS, payload: animalsData })
        dispatch({ type: ACTIONS.SET_VISITS, payload: visitsData })
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      }
    }
    fetchAll()
  }, [dispatch])

  const totalFarmers = farmers.length
  const totalAnimals = animals.length
  const sickAnimals = animals.filter(a => ['sick', 'treatment'].includes(a.status)).length
  const totalVisits = visits.length

  const recentVisits = [...visits]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="px-4 sm:px-6 pt-20 sm:pt-6 pb-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 hidden sm:block">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatsCard
          title="Total Farmers"
          value={totalFarmers}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Total Animals"
          value={totalAnimals}
          icon={PawPrint}
          color="green"
        />
        <StatsCard
          title="Sick Animals"
          value={sickAnimals}
          icon={AlertCircle}
          color="red"
        />
        <StatsCard
          title="Health Records"
          value={totalVisits}
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Recent Visits */}
      <RecentVisits visits={recentVisits} animals={animals} />
    </div>
  )
}

export default Dashboard