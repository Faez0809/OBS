// src/components/AdminSetup/AdminSetup.jsx

import { useState } from 'react';
import axios from 'axios';

const AdminSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: 'admin@bookcafe.com',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:3001/api/auth/create-admin', formData);
      setMessage(`Success: ${response.data.message}`);
      setFormData({ name: '', email: 'admin@bookcafe.com', password: '' });
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || 'Failed to create admin user'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '50px auto', 
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Admin Setup
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
            placeholder="Enter admin name"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              backgroundColor: '#f5f5f5'
            }}
            placeholder="admin@bookcafe.com"
            readOnly
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            This email is pre-configured as the admin email
          </small>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
            placeholder="Enter admin password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Admin...' : 'Create Admin User'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: message.includes('Success') ? '#d4edda' : '#f8d7da',
          color: message.includes('Success') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('Success') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Instructions:</h4>
        <ol style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: '#6c757d' }}>
          <li>Fill in the admin name and password</li>
          <li>Click "Create Admin User" to set up admin access</li>
          <li>After creation, you can login with this email and password</li>
          <li>Only users with this specific email can access the admin panel</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminSetup;
