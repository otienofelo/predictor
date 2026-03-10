import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

// Blocks access to a route if user doesn't have required role
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { role, loading } = useRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Checking permissions...</div>
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    return (
      <div className="mt-20 max-w-md mx-auto px-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Access Denied</h2>
          <p className="text-red-600 text-sm mb-4">
            You don't have permission to access this page.
            Required role: <strong>{allowedRoles.join(' or ')}</strong>.
            Your role: <strong>{role || 'unknown'}</strong>.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute;