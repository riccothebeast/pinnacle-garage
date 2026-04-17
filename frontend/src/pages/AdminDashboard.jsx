import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const BRANDS = ['Jaguar', 'BMW', 'Range Rover'];

const emptyForm = {
  name: '', brand: 'Jaguar', price: '', stock: '', year: '', model: '', description: '', image: '',
};

export default function AdminDashboard() {
  const { user, token, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts]   = useState([]);
  const [form, setForm]           = useState(emptyForm);
  const [editId, setEditId]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);
  const [deleteId, setDeleteId]   = useState(null);

  // Redirect non-admins
  useEffect(() => {
    if (!token || !isAdmin) navigate('/admin/login');
  }, [token, isAdmin]);

  // Load products
  const fetchProducts = () => {
    setLoading(true);
    api.get('/products')
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchProducts(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 };
      if (editId) {
        await api.put(`/products/${editId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        showToast('Product updated ✓');
      } else {
        await api.post('/products', payload, { headers: { Authorization: `Bearer ${token}` } });
        showToast('Product added ✓');
      }
      setForm(emptyForm);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, brand: p.brand, price: p.price, stock: p.stock, year: p.year || '', model: p.model || '', description: p.description || '', image: p.image || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditId(null); setForm(emptyForm); };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Product deleted');
      fetchProducts();
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const handleLogout = async () => {
    try { await api.post('/logout', {}, { headers: { Authorization: `Bearer ${token}` } }); } catch {}
    logout();
    navigate('/admin/login');
  };

  // --- Styles ---
  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
    color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' };
  const fieldStyle = { marginBottom: '16px' };

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ background: 'rgba(20,20,20,0.95)', borderBottom: '1px solid rgba(212,175,55,0.2)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.4rem' }}>⚙️</span>
          <div>
            <div style={{ color: '#f5d98e', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.05em' }}>Admin Dashboard</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Land Rover and Jaguar Auto Boutique</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>👤 {user?.name}</span>
          <button onClick={handleLogout} style={{ background: 'rgba(231,76,60,0.15)', border: '1px solid rgba(231,76,60,0.4)', color: '#ff6b6b', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999,
          background: toast.type === 'error' ? 'rgba(231,76,60,0.9)' : 'rgba(39,174,96,0.9)',
          backdropFilter: 'blur(8px)', padding: '14px 24px', borderRadius: '10px',
          color: '#fff', fontWeight: 600, boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          animation: 'fadeIn 0.3s ease',
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Form */}
        <div className="glass" style={{ borderRadius: '16px', padding: '32px', marginBottom: '36px', border: '1px solid rgba(212,175,55,0.15)' }}>
          <h2 style={{ margin: '0 0 24px', color: '#f5d98e', fontSize: '1.2rem' }}>
            {editId ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>PRODUCT NAME *</label>
                <input id="p-name" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. F-Type Brake Kit" style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>BRAND *</label>
                <select id="p-brand" name="brand" value={form.brand} onChange={handleChange} required style={{ ...inputStyle, cursor: 'pointer' }}>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>PRICE (USD) *</label>
                <input id="p-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required placeholder="0.00" style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>STOCK QTY</label>
                <input id="p-stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="0" style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>MODEL</label>
                <input id="p-model" name="model" value={form.model} onChange={handleChange} placeholder="e.g. M4, Sport, XJR" style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>YEAR</label>
                <input id="p-year" name="year" value={form.year} onChange={handleChange} placeholder="e.g. 2024" style={inputStyle} />
              </div>
              <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea id="p-desc" name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Short product description…" style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button id="save-product-btn" type="submit" disabled={saving} style={{
                padding: '12px 32px', background: 'linear-gradient(135deg, #d4af37, #b8962e)',
                border: 'none', borderRadius: '9px', color: '#0d0d0d', fontWeight: 700,
                fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer', letterSpacing: '0.05em',
                opacity: saving ? 0.6 : 1,
              }}>
                {saving ? 'Saving…' : editId ? 'Update Product' : 'Add Product'}
              </button>
              {editId && (
                <button type="button" onClick={cancelEdit} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '9px', color: '#ccc', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products Table */}
        <div className="glass" style={{ borderRadius: '16px', padding: '28px', border: '1px solid rgba(212,175,55,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#f5d98e', fontSize: '1.2rem' }}>📦 Products ({products.length})</h2>
            <button onClick={fetchProducts} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#ccc', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '0.85rem' }}>↺ Refresh</button>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '30px 0' }}>Loading products…</p>
          ) : products.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '30px 0' }}>No products yet. Add one above.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['Name', 'Brand', 'Price', 'Stock', 'Model / Year', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.05em' }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px', color: '#fff', fontWeight: 500 }}>{p.name}</td>
                      <td style={{ padding: '12px' }}>
                        <span className="product-badge" style={{ fontSize: '0.75rem' }}>{p.brand}</span>
                      </td>
                      <td style={{ padding: '12px', color: '#f5d98e', fontWeight: 600 }}>${parseFloat(p.price).toFixed(2)}</td>
                      <td style={{ padding: '12px', color: p.stock > 0 ? '#4cd137' : '#ff6b6b', fontWeight: 600 }}>{p.stock}</td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{p.model} {p.year && `(${p.year})`}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => startEdit(p)} style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#f5d98e', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Edit</button>
                          {deleteId === p.id ? (
                            <>
                              <button onClick={() => handleDelete(p.id)} style={{ background: 'rgba(231,76,60,0.3)', border: '1px solid rgba(231,76,60,0.5)', color: '#ff6b6b', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}>Confirm</button>
                              <button onClick={() => setDeleteId(null)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#ccc', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.82rem' }}>×</button>
                            </>
                          ) : (
                            <button onClick={() => setDeleteId(p.id)} style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', color: '#ff6b6b', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
