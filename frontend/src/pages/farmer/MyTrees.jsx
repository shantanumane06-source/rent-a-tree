import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const IMG = 'http://localhost:5000/uploads/';
const GROWTH = ['Planted', 'Flowering', 'Fruits Ready', 'Harvested'];

export default function FarmerTrees() {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => api.get('/trees/farmer/my').then(r => { setTrees(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const updateGrowth = async (id, growth_status) => {
    try {
      await api.put(`/trees/${id}/growth`, { growth_status });
      toast.success('Growth status updated!');
      load();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>🌳 My Trees</h1>
        <p>Manage your tree listings</p>
      </div>
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button className="btn-primary" onClick={() => navigate('/farmer/trees/add')}>
            <PlusCircle size={16} /> Add New Tree
          </button>
        </div>

        {loading ? <div className="loading"><div className="spinner" /></div> :
          trees.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🌱</div><h3>No trees yet</h3>
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/farmer/trees/add')}>Add First Tree</button>
            </div>
          ) : (
            <div className="grid-3">
              {trees.map(t => (
                <div className="card" key={t.id}>
                  <div style={{ height: 160, background: 'var(--pista-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', overflow: 'hidden', position: 'relative' }}>
                    {t.tree_image ? <img src={IMG + t.tree_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🌳'}
                    <span className={`badge badge-${t.status}`} style={{ position: 'absolute', top: 10, right: 10 }}>{t.status}</span>
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>{t.tree_type}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: 10 }}>📍 {t.city} · {t.tree_code}</p>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <div style={{ flex: 1, background: 'var(--pista-bg)', padding: '8px', borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Maint.</div>
                        <div style={{ fontWeight: 800, color: 'var(--pista-dark)', fontSize: '0.9rem' }}>₹{parseFloat(t.maintenance_cost).toFixed(0)}</div>
                      </div>
                      <div style={{ flex: 1, background: 'var(--pista-bg)', padding: '8px', borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Delivery</div>
                        <div style={{ fontWeight: 800, color: 'var(--pista-dark)', fontSize: '0.9rem' }}>₹{parseFloat(t.delivery_cost).toFixed(0)}</div>
                      </div>
                    </div>
                    {(t.status === 'adopted' || t.status === 'approved') && (
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem' }}>Update Growth Status</label>
                        <select value={t.growth_status} onChange={e => updateGrowth(t.id, e.target.value)} style={{ fontSize: '0.85rem', padding: '7px 10px' }}>
                          {GROWTH.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </Layout>
  );
}
