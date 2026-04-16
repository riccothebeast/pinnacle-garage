import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
        return setError("Passwords do not match.");
    }
    
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/register', formData);
      login(res.data.user, res.data.token);
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0d0d0d 70%)', padding: '20px',
    }}>
      <div className="glass" style={{ width: '100%', maxWidth: '420px', padding: '48px 40px', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.6rem', margin: 0, color: '#f5d98e', letterSpacing: '0.05em' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.9rem' }}>Join Pinnacle Garage</p>
        </div>

        {error && <div style={{ background: 'rgba(231,76,60,0.15)', border: '1px solid rgba(231,76,60,0.4)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#ff6b6b', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>FULL NAME</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '1rem', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>EMAIL ADDRESS</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '1rem', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>PASSWORD</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '1rem', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>CONFIRM PASSWORD</label>
            <input type="password" required value={formData.password_confirmation} onChange={e => setFormData({...formData, password_confirmation: e.target.value})} style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '1rem', outline: 'none' }} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700 }}>
            {loading ? 'Creating Account…' : 'REGISTER'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
             Already have an account? <Link to="/login" style={{ color: '#d4af37', textDecoration: 'none' }}>Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
