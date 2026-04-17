import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      login(res.data.user, res.data.token);
      
      if (res.data.user.is_admin) {
          navigate('/admin');
      } else {
          navigate('/shop');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0d0d0d 70%)',
      padding: '20px',
    }}>
      <div className="glass" style={{
        width: '100%', maxWidth: '420px',
        padding: '48px 40px',
        borderRadius: '20px',
        border: '1px solid rgba(212,175,55,0.25)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 16px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4af37, #f5d98e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px',
          }}>🔑</div>
          <h1 style={{ fontSize: '1.6rem', margin: 0, color: '#f5d98e', letterSpacing: '0.05em' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.9rem' }}>
            Log in to Land Rover and Jaguar Auto Boutique
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(231,76,60,0.15)', border: '1px solid rgba(231,76,60,0.4)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
            color: '#ff6b6b', fontSize: '0.9rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              EMAIL ADDRESS
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              style={{
                width: '100%', padding: '13px 16px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.06)', color: '#fff',
                fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.7)'}
              onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              PASSWORD
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '13px 16px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.06)', color: '#fff',
                fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.7)'}
              onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #d4af37, #b8962e)',
              border: 'none', borderRadius: '10px',
              color: '#0d0d0d', fontWeight: 700, fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.08em',
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(212,175,55,0.3)',
            }}
          >
            {loading ? 'Signing in…' : 'SIGN IN'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
             Don't have an account? <Link to="/register" style={{ color: '#d4af37', textDecoration: 'none' }}>Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
