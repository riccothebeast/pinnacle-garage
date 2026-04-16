import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import api from './api';

function ProtectedRoute({ children }) {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
}

function NavBar({ cartCount }) {
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
      try {
          await api.post('/logout');
      } catch (e) {}
      logout();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-text">PINNACLE</Link>
      <div className="nav-links">
        <Link to="/shop" className="nav-item">SPARE PARTS</Link>
        <a href="/#about" className="nav-item">ABOUT</a>
        <a href="/#contact" className="nav-item">CONTACT</a>
        
        {user ? (
          <>
              {isAdmin && (
                  <Link to="/admin" className="nav-item" style={{ color: '#f5d98e', fontWeight: 700 }}>
                    ⚙️ Admin
                  </Link>
              )}
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em', marginLeft: '10px' }}>Hi, {user.name}</span>
              <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item" style={{ color: '#fff', fontWeight: 600 }}>Login</Link>
            <Link to="/register" className="nav-item" style={{ color: '#d4af37', fontWeight: 600 }}>Register</Link>
          </>
        )}
        
        <Link to="/checkout" className="btn-primary">
          🛒 View Cart {cartCount > 0 && `(${cartCount})`}
        </Link>
      </div>
    </nav>
  );
}

function Layout({ children, cartCount }) {
  return (
    <>
      <NavBar cartCount={cartCount} />
      <main>{children}</main>
      <footer style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
        <p>&copy; 2026 Pinnacle Garage &amp; Parts - Premium Quality Guaranteed.</p>
      </footer>
    </>
  );
}

function AppContent() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/" element={<Layout cartCount={cartCount}><Home /></Layout>} />
        
        <Route path="/shop" element={
            <Layout cartCount={cartCount}>
                <ProtectedRoute>
                    <Shop addToCart={addToCart} />
                </ProtectedRoute>
            </Layout>
        } />
        
        <Route path="/checkout" element={
            <Layout cartCount={cartCount}>
                <ProtectedRoute>
                    <Checkout cart={cart} setCart={setCart} />
                </ProtectedRoute>
            </Layout>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
