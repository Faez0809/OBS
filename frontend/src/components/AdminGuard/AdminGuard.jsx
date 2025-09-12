// src/components/AdminGuard/AdminGuard.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminGuard = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Decode the token to get user info
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userRole = tokenPayload.role;

        if (userRole === 'admin') {
          setIsAdmin(true);
        } else {
          alert('Access denied. Admin privileges required.');
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        alert('Error verifying admin status. Please login again.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Verifying admin access...
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect to home or login
  }

  return children;
};

export default AdminGuard;
