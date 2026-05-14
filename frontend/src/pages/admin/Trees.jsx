import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const IMG = 'http://localhost:5000/uploads/';

export default function AdminTrees() {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => api.get('/trees/admin/all').then(r => { setTrees(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/trees/${id}/status`, { status });
      toast.success(`Tree ${status}`);
      load();
    } catch { toast.error('Failed'); }
  };

  const filtered = filter === 'all' ? trees : trees.filter(t => t.status === filter);

  return (
    <Layout>
      <div className="page-header">
        <h1>🌳 Manage Trees</h1>
        <p>Approve or reject farmer tree submissions</p>
      </div>
      <div className="page-content">
        <div className="filters" style={{ marginBottom: 20 }}>
          {['all', 'pending', 'approved', 'rejected', 'adopted', 'harvested'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={filter === f ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '7px 16px', fontSize: '0.82rem', textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>

        {loading ? <div className="loading"><div className="spinner" /></div> :
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Tree</th><th>Farmer</th><th>City</th><th>Cost</th><th>Status</th><th>Submitted</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: 'var(--pista-bg)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                          {t.tree_image ? <img src={IMG + t.tree_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🌳'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{t.tree_type}</div>
                          <div style={{ fontSize: '0.73rem', color: 'var(--text-light)' }}>{t.tree_code}</div>
                        </div>
                      </div>
                    </td>
                    <td>{t.farmer_name}</td>
                    <td>{t.city}</td>
                    <td>₹{parseFloat(t.maintenance_cost).toFixed(0)}</td>
                    <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                    <td>
                      {t.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-primary" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => updateStatus(t.id, 'approved')}>Approve</button>
                          <button className="btn-danger" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => updateStatus(t.id, 'rejected')}>Reject</button>
                        </div>
                      )}
                      {t.status === 'approved' && (
                        <button className="btn-danger" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => updateStatus(t.id, 'rejected')}>Reject</button>
                      )}
                      {t.status === 'rejected' && (
                        <button className="btn-primary" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => updateStatus(t.id, 'approved')}>Re-approve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="empty-state"><div className="icon">🌱</div><h3>No trees found</h3></div>}
          </div>
        }
      </div>
    </Layout>
  );
}
