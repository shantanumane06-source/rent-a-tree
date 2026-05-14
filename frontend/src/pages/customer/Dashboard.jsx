import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { Trees, DollarSign, Leaf, TrendingUp } from 'lucide-react';

const IMG = 'http://localhost:5000/uploads/';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/adoptions/my').then(r => { setAdoptions(r.data); setLoading(false); });
  }, []);

  const totalPaid = adoptions.reduce((s, a) => s + parseFloat(a.total_payment || 0), 0);
  const totalProfit = adoptions.reduce((s, a) => s + parseFloat(a.profit_share || 0), 0);

  const growthColor = { Planted: '#006064', Flowering: '#880e4f', 'Fruits Ready': '#f57f17', Harvested: '#6a1b9a' };

  return (
    <Layout>
      <div className="page-header">
        <h1>Welcome back, {user?.name}! 🌿</h1>
        <p>Track your adopted trees and earnings</p>
      </div>

      <div className="page-content">
        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {[
            { icon: Trees, label: 'Adopted Trees', value: adoptions.length, color: '#93C572' },
            { icon: DollarSign, label: 'Total Invested', value: `₹${totalPaid.toFixed(0)}`, color: '#4CAF50' },
            { icon: TrendingUp, label: 'Total Profit', value: `₹${totalProfit.toFixed(0)}`, color: '#2196F3' },
            { icon: Leaf, label: 'Active Trees', value: adoptions.filter(a => a.growth_status !== 'Harvested').length, color: '#FF9800' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div className="stat-card" key={label}>
              <div className="stat-icon" style={{ background: `${color}22` }}>
                <Icon size={24} color={color} />
              </div>
              <div className="stat-info">
                <h3 style={{ color }}>{value}</h3>
                <p>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* My Trees */}
        <h2 className="section-title">🌳 My Adopted Trees</h2>
        {loading ? <div className="loading"><div className="spinner" /></div> :
          adoptions.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🌱</div>
              <h3>No trees adopted yet</h3>
              <p>Browse available trees and start your green journey!</p>
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/customer/browse')}>Browse Trees</button>
            </div>
          ) : (
            <div className="grid-3">
              {adoptions.map(a => (
                <div className="card" key={a.id}>
                  <div style={{ height: 160, overflow: 'hidden', background: 'var(--pista-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
                    {a.tree_image ? <img src={IMG + a.tree_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🌳'}
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>{a.tree_type}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>📍 {a.city}</p>
                      </div>
                      <span className="badge" style={{ background: growthColor[a.growth_status] + '22', color: growthColor[a.growth_status] }}>
                        {a.growth_status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: 12 }}>
                      Code: <strong>{a.tree_code}</strong> · Farmer: {a.farmer_name}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div style={{ background: 'var(--pista-bg)', padding: '8px 10px', borderRadius: 8 }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Paid</p>
                        <p style={{ fontWeight: 800, color: 'var(--pista-dark)' }}>₹{parseFloat(a.total_payment).toFixed(0)}</p>
                      </div>
                      <div style={{ background: a.profit_share > 0 ? '#d1f5d3' : 'var(--pista-bg)', padding: '8px 10px', borderRadius: 8 }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Profit</p>
                        <p style={{ fontWeight: 800, color: a.profit_share > 0 ? '#1a7431' : 'var(--text-light)' }}>₹{parseFloat(a.profit_share || 0).toFixed(0)}</p>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)' }}>
                      <span>{a.delivery_type === 'home_delivery' ? '🚚 Home Delivery' : '🏪 Market Sale'}</span>
                      <span>{new Date(a.adopted_at).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </Layout>
  );
}
