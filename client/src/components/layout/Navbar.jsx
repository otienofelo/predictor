import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Home, Menu } from "lucide-react";

const Navbar = ({ onMenuClick }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed top-0 left-0 right-0 z-30 md:left-64 md:pl-0">
      <div className="flex justify-between items-center">
        {/* LEFT SIDE */}
        <div className="flex items-center space-x-4">
          {/* Hamburger menu for mobile */}
          <button onClick={onMenuClick} className="md:hidden p-2">
            <Menu className="h-6 w-6" />
          </button>

          {/* Home link */}
          <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center">
            <Home className="h-5 w-5 mr-1" />
            <span className="font-semibold">Home</span>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        {currentUser && (
          <button
            onClick={handleSignOut}
            className="text-sm bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;