import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Trees, DollarSign, Leaf, CheckCircle } from 'lucide-react';

const IMG = 'http://localhost:5000/uploads/';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trees/farmer/my').then(r => { setTrees(r.data); setLoading(false); });
  }, []);

  const approved = trees.filter(t => t.status === 'approved').length;
  const adopted = trees.filter(t => t.status === 'adopted').length;
  const pending = trees.filter(t => t.status === 'pending').length;

  return (
    <Layout>
      <div className="page-header">
        <h1>Welcome, {user?.name}! 🌾</h1>
        <p>Manage your trees and track earnings</p>
      </div>
      <div className="page-content">
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {[
            { icon: Trees, label: 'Total Trees', value: trees.length, color: '#93C572' },
            { icon: CheckCircle, label: 'Approved', value: approved, color: '#4CAF50' },
            { icon: Leaf, label: 'Adopted', value: adopted, color: '#2196F3' },
            { icon: DollarSign, label: 'Pending', value: pending, color: '#FF9800' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div className="stat-card" key={label}>
              <div className="stat-icon" style={{ background: `${color}22` }}><Icon size={24} color={color} /></div>
              <div className="stat-info"><h3 style={{ color }}>{value}</h3><p>{label}</p></div>
            </div>
          ))}
        </div>

        <h2 className="section-title">🌳 My Trees</h2>
        {loading ? <div className="loading"><div className="spinner" /></div> :
          trees.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🌱</div>
              <h3>No trees added yet</h3>
              <p>Add your first tree to get started!</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Tree</th><th>Code</th><th>City</th><th>Cost</th><th>Status</th><th>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {trees.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--pista-bg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                            {t.tree_image ? <img src={IMG + t.tree_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🌳'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{t.tree_type}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{t.age_years} yr</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="tree-card-code">{t.tree_code}</span></td>
                      <td>{t.city}</td>
                      <td>₹{parseFloat(t.maintenance_cost).toFixed(0)}</td>
                      <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                      <td><span className={`badge badge-${t.growth_status?.toLowerCase().replace(' ', '-')}`}>{t.growth_status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </Layout>
  );
}
