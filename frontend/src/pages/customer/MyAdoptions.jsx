import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

const IMG = 'http://localhost:5000/uploads/';
const growthSteps = ['Planted', 'Flowering', 'Fruits Ready', 'Harvested'];

export default function MyAdoptions() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/adoptions/my').then(r => { setAdoptions(r.data); setLoading(false); });
  }, []);

  return (
    <Layout>
      <div className="page-header">
        <h1>🌿 My Adoptions</h1>
        <p>Track all your adopted trees</p>
      </div>
      <div className="page-content">
        {loading ? <div className="loading"><div className="spinner" /></div> :
          adoptions.length === 0 ? (
            <div className="empty-state"><div className="icon">🌱</div><h3>No adoptions yet</h3></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {adoptions.map(a => {
                const step = growthSteps.indexOf(a.growth_status);
                return (
                  <div className="card" key={a.id} style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      <div style={{ width: 160, minHeight: 160, background: 'var(--pista-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', flexShrink: 0 }}>
                        {a.tree_image ? <img src={IMG + a.tree_image} alt="" style={{ width: '100%', height: 160, objectFit: 'cover' }} /> : '🌳'}
                      </div>
                      <div style={{ flex: 1, padding: 20, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                          <div>
                            <h3 style={{ fontSize: '1.1rem' }}>{a.tree_type}</h3>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>📍 {a.city} · 👨‍🌾 {a.farmer_name}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{a.tree_code}</div>
                            <div style={{ fontWeight: 800, color: 'var(--pista-dark)', fontSize: '1.1rem' }}>₹{parseFloat(a.total_payment).toFixed(0)}</div>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            {growthSteps.map((s, i) => (
                              <span key={s} style={{ fontSize: '0.7rem', color: i <= step ? 'var(--pista-dark)' : 'var(--text-light)', fontWeight: i <= step ? 700 : 400 }}>{s}</span>
                            ))}
                          </div>
                          <div style={{ height: 6, background: 'var(--pista-bg)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--pista), var(--pista-dark))', width: `${((step + 1) / growthSteps.length) * 100}%`, borderRadius: 3, transition: 'width 0.5s ease' }} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                          <span style={{ background: 'var(--pista-bg)', padding: '4px 12px', borderRadius: 50, fontSize: '0.78rem', color: 'var(--text-mid)', fontWeight: 600 }}>
                            {a.delivery_type === 'home_delivery' ? '🚚 Home Delivery' : '🏪 Market Sale'}
                          </span>
                          {parseFloat(a.profit_share) > 0 && (
                            <span style={{ background: '#d1f5d3', padding: '4px 12px', borderRadius: 50, fontSize: '0.78rem', color: '#1a7431', fontWeight: 700 }}>
                              💰 Profit: ₹{parseFloat(a.profit_share).toFixed(0)}
                            </span>
                          )}
                          <span style={{ background: '#dce9ff', padding: '4px 12px', borderRadius: 50, fontSize: '0.78rem', color: '#1a4faa', fontWeight: 600 }}>
                            📞 {a.farmer_phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </Layout>
  );
}
