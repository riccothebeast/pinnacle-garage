import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-subtitle-top">PREMIUM AUTOMOTIVE SPECIALISTS</div>
        <h1>
          <span className="highlight">Land Rover</span> and <span className="highlight">Jaguar</span>
          Auto Boutique
        </h1>
        <p className="description">
          High-quality genuine & aftermarket spare parts for <br />
          <span className="brand">BMW</span>, <span className="brand">Range Rover</span> & <span className="brand">Jaguar</span>.
        </p>
        <Link to="/shop" className="btn-primary" style={{ fontSize: '1.1rem', padding: '12px 28px', marginTop: '10px' }}>
          Browse Parts &rarr;
        </Link>
      </section>

      <section className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '40px', fontSize: '2.5rem' }}>Supported Brands</h2>
        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Jaguar', 'BMW', 'Range Rover'].map(brand => (
             <Link key={brand} to={`/shop?brand=${brand}`} className="glass" style={{ padding: '40px', width: '250px', cursor: 'pointer', transition: '0.3s' }}>
                <h3>{brand}</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '10px', textTransform: 'lowercase', fontFamily: 'Inter, sans-serif' }}>view catalog &rarr;</p>
             </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '30px', fontSize: '2.5rem' }}>About Land Rover and Jaguar Auto Boutique</h2>
        <div className="glass" style={{ padding: '50px', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.8' }}>
            At Land Rover and Jaguar Auto Boutique, we specialize in supplying both genuine and high-quality aftermarket components exclusively for luxury automotive brands.
          </p>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            With decades of combined experience specializing in <strong style={{ color: 'var(--accent-color)' }}>Jaguar, BMW, and Range Rover</strong>, our curated catalog ensures your vehicle maintains factory-level performance and prestige. We source directly from top-tier manufacturers to guarantee uncompromising quality.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container" style={{ padding: '80px 20px', marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '40px', fontSize: '2.5rem', textAlign: 'center' }}>Contact Us</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div className="glass" style={{ padding: '40px' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--accent-color)' }}>Reach Out</h3>
            <p style={{ marginBottom: '15px' }}><strong>Phone:</strong> +1 (800) 555-0198</p>
            <p style={{ marginBottom: '15px' }}><strong>Email:</strong> contact@landroverjaguar.com</p>
            <p><strong>Location:</strong> 1200 Automotive Way, Suite 100<br/>Motorsport Valley, CA 90210</p>
          </div>
          <form className="glass" style={{ padding: '40px' }} onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! We'll get back to you shortly."); }}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ color: 'var(--text-secondary)' }}>Name</label>
              <input type="text" required style={{ width: '100%', padding: '12px', marginTop: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', color: '#fff', borderRadius: '4px' }} />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input type="email" required style={{ width: '100%', padding: '12px', marginTop: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', color: '#fff', borderRadius: '4px' }} />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ color: 'var(--text-secondary)' }}>Message</label>
              <textarea rows="4" required style={{ width: '100%', padding: '12px', marginTop: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', color: '#fff', borderRadius: '4px' }}></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', justifyContent: 'center' }}>Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home;
