const StatsCards = ({ title, value, icon: Icon, color = 'blue', change }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {change !== undefined && (
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

export default StatsCards