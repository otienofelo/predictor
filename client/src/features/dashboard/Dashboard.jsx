import React from 'react'
import { useAppContext } from '../../context/AppContext'
import StatsCard from './StatsCards'
import RecentVisits from './RecentActivity'
import { Users, PawPrint, Activity, AlertCircle } from 'lucide-react'

const Dashboard = () => {

  const { state } = useAppContext()
  const { farmers = [], animals = [], visits = [] } = state

  const totalFarmers = farmers.length
  const totalAnimals = animals.length
  const sickAnimals = animals.filter(a => ['sick', 'treatment'].includes(a.status)).length
  const totalVisits = visits.length

  const recentVisits = [...visits]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const statsChange = { farmers: 0, animals: 0, sick: 0, visits: 0 }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Farmers"
          value={totalFarmers}
          icon={Users}
          color="blue"
          change={statsChange.farmers}
        />
        <StatsCard
          title="Total Animals"
          value={totalAnimals}
          icon={PawPrint}
          color="green"
          change={statsChange.animals}
        />
        <StatsCard
          title="Sick Animals"
          value={sickAnimals}
          icon={AlertCircle}
          color="red"
          change={statsChange.sick}
        />
        <StatsCard
          title="Health Records"
          value={totalVisits}
          icon={Activity}
          color="purple"
          change={statsChange.visits}
        />
      </div>

      <RecentVisits visits={recentVisits} animals={animals} />
    </div>
  )
}

export default Dashboard