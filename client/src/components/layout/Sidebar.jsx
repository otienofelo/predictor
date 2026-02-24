import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  PawPrint,
  Stethoscope,
  ClipboardList,
  BookOpen,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { name: "Farmers", to: "/farmers", icon: Users },
  { name: "Animals", to: "/animals", icon: PawPrint },
  { name: "Diagnosis", to: "/diagnosis", icon: Stethoscope },
  { name: "Health Records", to: "/records", icon: ClipboardList },
  { name: "Disease Library", to: "/diseases", icon: BookOpen },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="flex flex-col h-full">
        
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <h1 className="text-lg font-bold text-gray-800">Livestock DMS</h1>
            {/* Close button for mobile */}
            <button
              className="md:hidden p-2"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
                onClick={onClose} // auto-close sidebar on mobile when a link is clicked
              >
                <item.icon className="mr-3 h-5 w-5 transition-colors duration-200" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">Version 1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;