import { useParams, Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const FarmerDetail = () => {
  const { id } = useParams()
  const { state } = useAppContext()
  const farmer = state.farmers.find(f => f.id === id)

  if (!farmer) return <div>Farmer not found</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">{farmer.name}</h1>
      <p><strong>Phone:</strong> {farmer.phone}</p>
      <p><strong>Village:</strong> {farmer.village}</p>
      <p><strong>Farm Size:</strong> {farmer.farmSize} acres</p>
      <Link to={`/farmers/${id}/edit`} className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md">Edit</Link>
    </div>
  )
}

export default FarmerDetail