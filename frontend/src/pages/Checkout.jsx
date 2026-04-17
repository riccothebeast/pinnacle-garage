import React, { useState } from 'react';
import api from '../api';

function Checkout({ cart, setCart }) {
  const [formData, setFormData] = useState({ email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState(''); // 'cash' or 'mpesa'
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [receiptData, setReceiptData] = useState(null);

  const total = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Cart is empty');
    if (!paymentMethod) return alert('Please select a payment method');

    setLoading(true);
    try {
      const payload = {
        user_email: formData.email,
        user_phone: formData.phone,
        items: cart.map(i => ({ product_id: i.id, quantity: i.quantity, price: i.price }))
      };
      
      const res = await api.post('/orders', payload);
      const orderId = res.data.order_id;
      
      if (paymentMethod === 'mpesa') {
        if (!mpesaPhone) {
            setLoading(false);
            return alert('Please enter M-Pesa phone number');
        }
        
        setPaymentStatus('Initiating M-Pesa STK Push... Please check your phone.');
        
        try {
            await api.post('/mpesa/stkpush', {
                phone: mpesaPhone,
                amount: total,
                reference: `ORDER-${orderId}`
            });
            setPaymentStatus('STK Push Sent! Enter your PIN on your phone to complete payment.');
        } catch (mpesaErr) {
            console.error('M-Pesa error:', mpesaErr);
            setPaymentStatus('Failed to send STK Push. You can pay via cash on pickup.');
        }
      } else {
          setPaymentStatus('Order placed successfully. Please pay with cash upon pickup/delivery.');
      }

      setOrderStatus(`Success! Order #${orderId} placed.`);
      
      // Save receipt data before clearing cart
      setReceiptData({
          orderId,
          date: new Date().toLocaleString(),
          items: [...cart],
          total,
          paymentMethod,
          customer: { ...formData }
      });
      
      setCart([]);
    } catch (error) {
      console.error(error);
      setOrderStatus('Failed to place order. Please try again.');
      setPaymentStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
      window.print();
  };

  if (receiptData) {
      return (
          <div className="container" style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
              <div id="receipt" className="glass" style={{ padding: '40px', background: '#fff', color: '#000' }}>
                  <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                      <h1 style={{ color: '#000', margin: 0 }}>Land Rover and Jaguar Auto Boutique</h1>
                      <p style={{ color: '#666', margin: '5px 0' }}>Premium Auto Parts Receipt</p>
                      <p style={{ fontSize: '14px', color: '#888' }}>Date: {receiptData.date}</p>
                      <h3 style={{ marginTop: '20px', color: '#333' }}>Order #{receiptData.orderId}</h3>
                  </div>
                  
                  <div style={{ marginBottom: '20px', borderBottom: '2px dashed #ccc', paddingBottom: '20px' }}>
                      <p><strong>Customer Email:</strong> {receiptData.customer.email}</p>
                      <p><strong>Customer Phone:</strong> {receiptData.customer.phone}</p>
                      <p><strong>Payment Method:</strong> {receiptData.paymentMethod.toUpperCase()}</p>
                  </div>
                  
                  <table style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse' }}>
                      <thead>
                          <tr style={{ borderBottom: '1px solid #ccc' }}>
                              <th style={{ textAlign: 'left', padding: '10px 0', color: '#333' }}>Item</th>
                              <th style={{ textAlign: 'center', padding: '10px 0', color: '#333' }}>Qty</th>
                              <th style={{ textAlign: 'right', padding: '10px 0', color: '#333' }}>Price</th>
                          </tr>
                      </thead>
                      <tbody>
                          {receiptData.items.map(item => (
                              <tr key={item.id}>
                                  <td style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>{item.name}</td>
                                  <td style={{ textAlign: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>{item.quantity}</td>
                                  <td style={{ textAlign: 'right', padding: '10px 0', borderBottom: '1px solid #eee' }}>${(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  
                  <div style={{ textAlign: 'right', fontSize: '1.2em', fontWeight: 'bold', marginTop: '20px' }}>
                      TOTAL: ${receiptData.total.toFixed(2)}
                  </div>
                  
                  <div style={{ textAlign: 'center', marginTop: '40px', color: '#666', fontSize: '0.9em' }}>
                      Thank you for your business!
                  </div>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '30px' }} className="no-print">
                  <button onClick={handlePrintReceipt} className="btn-primary" style={{ padding: '15px 30px', fontSize: '1.1em', marginRight: '15px' }}>
                      🖨️ Print Receipt
                  </button>
                  <button onClick={() => setReceiptData(null)} style={{ padding: '15px 30px', fontSize: '1.1em', background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', borderRadius: '8px', cursor: 'pointer' }}>
                      Close
                  </button>
              </div>
              
              <style>{`
                  @media print {
                      body * { visibility: hidden; }
                      .navbar, footer, .no-print { display: none !important; }
                      #receipt, #receipt * { visibility: visible; }
                      #receipt { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; background: white; }
                  }
              `}</style>
          </div>
      );
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      <h1>Checkout</h1>
      
      {orderStatus && (
        <div className="glass" style={{ padding: '20px', background: orderStatus.includes('Success') ? 'rgba(76, 209, 55, 0.1)' : 'rgba(255, 71, 87, 0.1)', marginTop: '20px', borderLeft: `4px solid ${orderStatus.includes('Success') ? '#4cd137' : '#ff4757'}` }}>
          {orderStatus}
        </div>
      )}

      {paymentStatus && (
          <div className="glass" style={{ padding: '20px', background: 'rgba(52, 152, 219, 0.1)', marginTop: '20px', borderLeft: '4px solid #3498db', color: '#fff' }}>
              {paymentStatus}
          </div>
      )}

      {cart.length > 0 ? (
        <div style={{ marginTop: '30px' }}>
          <div className="glass" style={{ padding: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>Order Summary</h2>
            {cart.map(item => (
              <div key={item.id} className="cart-item" style={{ borderBottom: '1px solid var(--card-border)' }}>
                <div>
                  <h4>{item.name}</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>Qty: {item.quantity}</p>
                </div>
                <div>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div className="cart-total">
              Total: <span style={{ color: 'var(--accent-color)' }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass" style={{ padding: '30px', marginTop: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>Contact & Payment Details</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Contact Phone Number</label>
                  <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
                </div>
            </div>

            <h3 style={{ marginTop: '30px', marginBottom: '15px', color: '#f5d98e' }}>Payment Method</h3>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '15px', border: '1px solid', borderColor: paymentMethod === 'cash' ? '#d4af37' : 'var(--card-border)', borderRadius: '8px', flex: 1, background: paymentMethod === 'cash' ? 'rgba(212,175,55,0.1)' : 'transparent' }}>
                    <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} style={{ width: '20px', height: '20px' }} />
                    <span style={{ fontSize: '1.1em', fontWeight: paymentMethod === 'cash' ? 'bold' : 'normal' }}>💵 Cash on Pickup</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '15px', border: '1px solid', borderColor: paymentMethod === 'mpesa' ? '#4cd137' : 'var(--card-border)', borderRadius: '8px', flex: 1, background: paymentMethod === 'mpesa' ? 'rgba(76,209,55,0.1)' : 'transparent' }}>
                    <input type="radio" name="payment" value="mpesa" checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')} style={{ width: '20px', height: '20px' }} />
                    <span style={{ fontSize: '1.1em', fontWeight: paymentMethod === 'mpesa' ? 'bold' : 'normal' }}>📱 M-Pesa </span>
                </label>
            </div>

            {paymentMethod === 'mpesa' && (
                <div className="form-group" style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                    <label style={{ color: '#4cd137', fontWeight: 'bold' }}>M-Pesa Phone Number</label>
                    <p style={{ fontSize: '0.85em', color: 'var(--text-secondary)', marginBottom: '10px' }}>Enter the Safaricom number to receive the STK Push prompt (e.g. 0712345678 or 254712345678)</p>
                    <input 
                        type="text" 
                        required 
                        placeholder="07XX XXX XXX" 
                        value={mpesaPhone} 
                        onChange={e => setMpesaPhone(e.target.value)} 
                        style={{ width: '100%', padding: '12px', border: '1px solid #4cd137', background: 'rgba(0,0,0,0.3)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '30px', padding: '18px', fontSize: '1.2em', fontWeight: 'bold' }} disabled={loading}>
              {loading ? 'Processing...' : (paymentMethod === 'mpesa' ? 'Pay with M-Pesa' : 'Complete Order')}
            </button>
          </form>
        </div>
      ) : (
        !orderStatus && <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Checkout;
