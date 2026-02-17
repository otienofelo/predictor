
const statusColors = {
  healthy: 'bg-green-100 text-green-800',
  sick: 'bg-red-100 text-red-800',
  treatment: 'bg-yellow-100 text-yellow-800',
}

const AnimalStatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || 'unknown'
  const colorClass =
    statusColors[normalizedStatus] || 'bg-gray-100 text-gray-800'

  const formattedText =
    normalizedStatus.charAt(0).toUpperCase() +
    normalizedStatus.slice(1)

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}
    >
      {formattedText}
    </span>
  )
}

export default AnimalStatusBadge