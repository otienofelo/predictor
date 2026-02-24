import { Link } from "react-router-dom";
import { User, Phone, MapPin, Ruler, Edit, Trash2 } from "lucide-react";

const FarmerCard = ({ farmer, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow w-full">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">{farmer.name}</h3>
            <p className="text-xs md:text-sm text-gray-500">ID: {farmer.id.slice(-6)}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex mt-3 md:mt-0 space-x-2">
          <Link
            to={`/farmers/${farmer.id}/edit`}
            className="text-green-600 hover:text-green-800"
          >
            <Edit className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
          <button
            onClick={() => onDelete(farmer.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>

      {/* Info section */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
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

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-400 space-y-1 sm:space-y-0">
        <Link
          to={`/farmers/${farmer.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details 
        </Link>
        <span>
          Registered: {new Date(farmer.registeredAt || Date.now()).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default FarmerCard;