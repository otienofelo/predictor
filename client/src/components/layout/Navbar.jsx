import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRole } from "../../hooks/useRole";
import { Home, Menu, LogOut, ChevronDown, User } from "lucide-react";

const ROLE_COLORS = {
  admin: 'bg-red-100 text-red-700',
  vet: 'bg-blue-100 text-blue-700',
  researcher: 'bg-purple-100 text-purple-700',
};

const Navbar = ({ onMenuClick }) => {
  const { currentUser, logout } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2.5 fixed top-0 left-0 right-0 z-30 md:left-64">
      <div className="flex justify-between items-center h-11">

        {/* LEFT — hamburger + home */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          <Link
            to={currentUser ? "/dashboard" : "/"}
            className="flex items-center gap-1.5 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-semibold text-sm sm:text-base">Home</span>
          </Link>
        </div>

        {/* RIGHT — user info + sign out */}
        {currentUser && (
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Role badge — hidden on very small screens */}
            {role && (
              <span className={`hidden sm:inline-block text-xs px-2 py-1 rounded-full font-medium ${ROLE_COLORS[role] || 'bg-gray-100 text-gray-600'}`}>
                {role}
              </span>
            )}

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-700"
              >
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                {/* Email — truncated on small screens */}
                <span className="hidden sm:block max-w-[140px] truncate text-sm text-gray-600">
                  {currentUser.email}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <>
                  {/* Click outside to close */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                    {/* User info */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      {role && (
                        <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[role] || 'bg-gray-100 text-gray-600'}`}>
                          {role}
                        </span>
                      )}
                    </div>

                    {/* Sign out */}
                    <button
                      onClick={() => { setDropdownOpen(false); handleSignOut(); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;