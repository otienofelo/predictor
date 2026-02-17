
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  PawPrint,
  Stethoscope,
  ClipboardList,
  BookOpen
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Farmers', to: '/farmers', icon: Users },
  { name: 'Animals', to: '/animals', icon: PawPrint },
  { name: 'Diagnosis', to: '/diagnosis', icon: Stethoscope },
  { name: 'Health Records', to: '/records', icon: ClipboardList },
  { name: 'Disease Library', to: '/diseases', icon: BookOpen },
]

const Sidebar = () => {
  return (
<aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">      
      <div className="flex flex-col w-full">
        
        {/* Logo / Brand */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-800 tracking-wide">
            Livestock DMS
          </h1>
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
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 transition-colors duration-200"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Version 1.0.0
          </p>
        </div>

      </div>
    </aside>
  )
}

export default Sidebar