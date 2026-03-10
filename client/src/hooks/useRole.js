//fetches current user using useState & useEffect 
import api from '../services/api';
import { useState, useEffect } from 'react';

// Custom hook to get current user role
export const useRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await api.get('/users/me');
        setRole(response.data.role);
      } catch (err) {
        console.error('Failed to fetch role:', err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  return {
    role,
    loading,
    isAdmin: role === 'admin',
    isVet: role === 'vet',
    isResearcher: role === 'researcher',
    canEditDiseases: role === 'admin',
  };
};