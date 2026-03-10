import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  PawPrint,
  Stethoscope,
  ClipboardList,
  BookOpen,
  Shield,
  X,
  Syringe,
  UtensilsCrossed,
} from "lucide-react";
import { useRole } from "../../hooks/useRole";

const navigation = [
  { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { name: "Farmers", to: "/farmers", icon: Users },
  { name: "Animals", to: "/animals", icon: PawPrint },
  { name: "Diagnosis", to: "/diagnosis", icon: Stethoscope },
  { name: "Health Records", to: "/records", icon: ClipboardList },
  { name: "Disease Library", to: "/diseases", icon: BookOpen },
  { name: "Vaccinations", to: "/vaccinations", icon: Syringe },
  { name: "Feed Management", to: "/feeding", icon: UtensilsCrossed },
];

const ROLE_COLORS = {
  admin: 'bg-red-100 text-red-700',
  vet: 'bg-blue-100 text-blue-700',
  researcher: 'bg-purple-100 text-purple-700',
};

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin, role } = useRole();

  return (
    <>
      {/* Mobile overlay - z-40, below sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar - z-50 on mobile, sticky on desktop so modals don't cover it */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 bg-green-600 border-r border-green-100
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:top-0 md:h-screen md:z-30 md:flex-shrink-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-base font-bold text-gray-800 truncate">Livestock DMS</h1>
          </div>
          <button
            className="md:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`
              }
              onClick={onClose}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="pt-4 pb-1 px-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Admin
                </p>
              </div>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-red-50 text-red-600"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                  }`
                }
                onClick={onClose}
              >
                <Shield className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="truncate">User Management</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            {role && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${ROLE_COLORS[role] || 'bg-gray-100 text-gray-600'}`}>
                {role}
              </span>
            )}
            <p className="text-xs text-gray-400">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;