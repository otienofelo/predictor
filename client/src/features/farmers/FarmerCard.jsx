import { Link } from 'react-router-dom'
import { User, Phone, MapPin, Ruler, Edit, Trash2 } from 'lucide-react'

const FarmerCard = ({ farmer, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{farmer.name}</h3>
            <p className="text-sm text-gray-500">ID: {farmer.id.slice(-6)}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/farmers/${farmer.id}/edit`}
            className="text-green-600 hover:text-green-800"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(farmer.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          {farmer.phone}
        </div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          {farmer.village}
        </div>
        <div className="flex items-center">
          <Ruler className="h-4 w-4 mr-2 text-gray-400" />
          {farmer.farmSize} acres
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
        <Link
          to={`/farmers/${farmer.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details →
        </Link>
        <span className="text-xs text-gray-400">
          Registered: {new Date(farmer.registeredAt || Date.now()).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}

export default FarmerCard