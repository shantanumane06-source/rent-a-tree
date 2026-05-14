import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export function AdminAdoptions() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/adoptions/admin/all').then(r => { setAdoptions(r.data); setLoading(false); });
  }, []);

  const total = adoptions.reduce((s, a) => s + parseFloat(a.total_payment || 0), 0);

  return (
    <Layout>
      <div className="page-header">
        <h1>📦 Adoptions</h1>
        <p>All tree adoptions on the platform</p>
      </div>
      <div className="page-content">
        <div style={{ background: 'white', padding: '14px 20px', borderRadius: 12, border: '1px solid var(--pista-border)', marginBottom: 20, display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          <div><span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Total Adoptions</span><br /><strong style={{ color: 'var(--pista-dark)', fontSize: '1.2rem' }}>{adoptions.length}</strong></div>
          <div><span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Total Revenue</span><br /><strong style={{ color: 'var(--pista-dark)', fontSize: '1.2rem' }}>₹{total.toFixed(0)}</strong></div>
        </div>

        {loading ? <div className="loading"><div className="spinner" /></div> :
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Tree</th><th>Customer</th><th>Farmer</th><th>Delivery</th><th>Paid</th><th>Profit</th><th>Date</th></tr>
              </thead>
              <tbody>
                {adoptions.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{a.tree_type}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{a.tree_code}</div>
                    </td>
                    <td>{a.customer_name}</td>
                    <td>{a.farmer_name}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem' }}>
                        {a.delivery_type === 'home_delivery' ? '🚚 Home' : '🏪 Market'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--pista-dark)' }}>₹{parseFloat(a.total_payment).toFixed(0)}</td>
                    <td style={{ fontWeight: 700, color: parseFloat(a.profit_share) > 0 ? '#1a7431' : 'var(--text-light)' }}>
                      ₹{parseFloat(a.profit_share || 0).toFixed(0)}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{new Date(a.adopted_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {adoptions.length === 0 && <div className="empty-state"><div className="icon">📦</div><h3>No adoptions yet</h3></div>}
          </div>
        }
      </div>
    </Layout>
  );
}

export function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);
  const [resolution, setResolution] = useState('');

  const load = () => api.get('/admin/disputes').then(r => { setDisputes(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const resolve = async id => {
    try {
      await api.put(`/admin/disputes/${id}`, { status: 'resolved', resolution });
      toast.success('Dispute resolved');
      setResolving(null); setResolution('');
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>⚠️ Disputes</h1>
        <p>Resolve platform disputes</p>
      </div>
      <div className="page-content">
        {loading ? <div className="loading"><div className="spinner" /></div> :
          disputes.length === 0 ? (
            <div className="empty-state"><div className="icon">✅</div><h3>No disputes!</h3><p>Platform is running smoothly.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {disputes.map(d => (
                <div className="card" key={d.id} style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                    <div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <span className={`badge badge-${d.status}`}>{d.status}</span>
                        <span className="badge badge-pending" style={{ textTransform: 'capitalize' }}>{d.issue_type.replace('_', ' ')}</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)' }}>{d.description}</p>
                      {d.resolution && <p style={{ fontSize: '0.82rem', color: '#1a7431', marginTop: 6, fontWeight: 600 }}>Resolution: {d.resolution}</p>}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{new Date(d.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                  {d.status === 'open' && (
                    resolving === d.id ? (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 10 }}>
                        <input value={resolution} onChange={e => setResolution(e.target.value)} placeholder="Resolution notes..." style={{ flex: 1, padding: '8px 12px', border: '1.5px solid var(--pista-border)', borderRadius: 8, fontFamily: 'Nunito', fontSize: '0.85rem', outline: 'none', minWidth: 180 }} />
                        <button className="btn-primary" style={{ padding: '7px 16px', fontSize: '0.82rem' }} onClick={() => resolve(d.id)}>Resolve</button>
                        <button className="btn-secondary" style={{ padding: '7px 16px', fontSize: '0.82rem' }} onClick={() => setResolving(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.82rem', marginTop: 8 }} onClick={() => setResolving(d.id)}>Resolve Dispute</button>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
      </div>
    </Layout>
  );
}
