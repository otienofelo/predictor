//Admin parnel to manage user roles
import { useState, useEffect } from 'react'
import { useRole } from '../../hooks/useRole'
import { Shield, User, ChevronDown } from 'lucide-react'
import api from '../../services/api'

const ROLE_COLORS = {
    admin: 'bg-red-100 text-red-700',
    vet: 'bg-blue-100 text-blue-700',
    researcher: 'bg-purple-100 text-purple-700',
}

const AdminUserManager = () => {
    const { isAdmin, loading: roleLoading } = useRole()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [updating, setUpdating] = useState(null)

    useEffect(() => {
        if (!roleLoading && isAdmin) {
            fetchUsers()
        }
    }, [isAdmin, roleLoading])

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users')
            setUsers(res.data)
        } catch (err) {
            setError('Failed to load users.')
        } finally {
            setLoading(false)
        }
    }

    const handleRoleChange = async (firebaseUid, newRole) => {
        setUpdating(firebaseUid)
        try {
            await api.put(`/users/${firebaseUid}/role`, { role: newRole })
            setUsers(prev =>
                prev.map(u => u.firebase_uid === firebaseUid ? { ...u, role: newRole } : u)
            )
        } catch (err) {
            alert('Failed to update role. Please try again.')
        } finally {
            setUpdating(null)
        }
    }

    if (roleLoading || loading) {
        return <div className="text-center py-8 text-gray-500">Loading...</div>
    }

    if (!isAdmin) {
        return (
            <div className="mt-20 max-w-md mx-auto px-4 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <Shield className="w-10 h-10 text-red-400 mx-auto mb-3" />
                    <h2 className="text-lg font-semibold text-red-700">Admin Only</h2>
                    <p className="text-sm text-red-500 mt-1">You don't have permission to manage users.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-20 sm:mt-24 px-4 sm:px-6 pb-10 max-w-4xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-red-600" />
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">User Management</h1>
                    <p className="text-sm text-gray-500">Assign roles to control access across the app</p>
                </div>
            </div>

            {/* Role Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="font-semibold text-red-700 text-sm">Admin</p>
                    <p className="text-xs text-red-500 mt-1">Full access — can edit disease library, manage users</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="font-semibold text-blue-700 text-sm">Vet</p>
                    <p className="text-xs text-blue-500 mt-1">Can manage farmers, animals, visits and run diagnosis</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="font-semibold text-purple-700 text-sm">Researcher</p>
                    <p className="text-xs text-purple-500 mt-1">Read-only access to disease library and records</p>
                </div>
            </div>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="sm:hidden divide-y divide-gray-100">
                    {users.map(user => (
                        <div key={user.firebase_uid} className="p-4 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                                </div>
                                {user.name && <p className="text-xs text-gray-500 mt-0.5 ml-6">{user.name}</p>}
                            </div>
                            <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.firebase_uid, e.target.value)}
                                disabled={updating === user.firebase_uid}
                                className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${ROLE_COLORS[user.role]} disabled:opacity-50`}
                            >
                                <option value="admin">admin</option>
                                <option value="vet">vet</option>
                                <option value="researcher">researcher</option>
                            </select>
                        </div>
                    ))}
                </div>
                <table className="hidden sm:table min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(user => (
                            <tr key={user.firebase_uid} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    {user.name || '—'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.firebase_uid, e.target.value)}
                                            disabled={updating === user.firebase_uid}
                                            className={`text-xs font-medium px-3 py-1 rounded-full border-0 cursor-pointer appearance-none ${ROLE_COLORS[user.role]} disabled:opacity-50`}
                                        >
                                            <option value="admin">admin</option>
                                            <option value="vet">vet</option>
                                            <option value="researcher">researcher</option>
                                        </select>
                                        <ChevronDown className="w-3 h-3 text-gray-400" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">No users found.</div>
                )}
            </div>
        </div>
    )
}

export default AdminUserManager
