import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

function Shop({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const brand = params.get('brand');
    
    let endpoint = '/products';
    if (brand) endpoint += `?brand=${brand}`;

    api.get(endpoint)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  }, [location]);

  if (loading) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>Loading parts...</div>;

  return (
    <div className="container">
      <h1 style={{ marginTop: '40px' }}>Parts Catalog</h1>
      
      {products.length === 0 ? (
        <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>No products listed yet. Please add products via the database/seeders.</p>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="glass product-card">
              <div>
                <span className="product-badge">{product.brand}</span>
                <h3>{product.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>{product.model} - {product.year}</p>
                <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
                <p style={{ fontSize: '0.9em', color: '#ccc', marginBottom: '15px' }}>{product.description}</p>
                <p style={{ fontSize: '0.8em', color: product.stock > 0 ? '#4cd137' : 'var(--danger)', marginBottom: '20px' }}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </p>
              </div>
              <button 
                className="btn-primary" 
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                style={{ opacity: product.stock <= 0 ? 0.5 : 1 }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Shop;
