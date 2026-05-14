import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

function UserTable({ title, endpoint, updateEndpoint, icon }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get(endpoint).then(r => { setUsers(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const update = async (id, status) => {
    try {
      await api.put(`${updateEndpoint}/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>{icon} {title}</h1>
        <p>Manage platform {title.toLowerCase()}</p>
      </div>
      <div className="page-content">
        {loading ? <div className="loading"><div className="spinner" /></div> :
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700 }}>{u.name}</td>
                    <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                    <td style={{ fontSize: '0.85rem' }}>{u.phone || '—'}</td>
                    <td>{u.city || '—'}</td>
                    <td><span className={`badge badge-${u.status}`}>{u.status}</span></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {u.status === 'pending' && (
                          <button className="btn-primary" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => update(u.id, 'approved')}>Approve</button>
                        )}
                        {u.status !== 'suspended' && (
                          <button className="btn-danger" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => update(u.id, 'suspended')}>Suspend</button>
                        )}
                        {u.status === 'suspended' && (
                          <button className="btn-primary" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => update(u.id, 'active')}>Activate</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="empty-state"><div className="icon">👤</div><h3>No {title.toLowerCase()} found</h3></div>}
          </div>
        }
      </div>
    </Layout>
  );
}

export function AdminFarmers() {
  return <UserTable title="Farmers" endpoint="/admin/farmers" updateEndpoint="/admin/farmers" icon="🌾" />;
}

export function AdminCustomers() {
  return <UserTable title="Customers" endpoint="/admin/customers" updateEndpoint="/admin/customers" icon="👥" />;
}
