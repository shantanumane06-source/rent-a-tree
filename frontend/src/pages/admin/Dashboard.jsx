import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { Users, TreePine, ShoppingBag, DollarSign, UserCheck, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => { setStats(r.data); setLoading(false); });
  }, []);

  const cards = [
    { icon: Users, label: 'Customers', value: stats.customers, color: '#2196F3' },
    { icon: UserCheck, label: 'Approved Farmers', value: stats.farmers, color: '#4CAF50' },
    { icon: TreePine, label: 'Approved Trees', value: stats.trees, color: '#93C572' },
    { icon: ShoppingBag, label: 'Adoptions', value: stats.adoptions, color: '#9C27B0' },
    { icon: DollarSign, label: 'Total Revenue', value: `₹${parseFloat(stats.revenue || 0).toFixed(0)}`, color: '#FF9800' },
    { icon: Clock, label: 'Pending Approvals', value: (parseInt(stats.pending_farmers || 0) + parseInt(stats.pending_trees || 0)), color: '#F44336' },
  ];

  return (
    <Layout>
      <div className="page-header">
        <h1>Admin Dashboard 🛡️</h1>
        <p>Overview of platform activity</p>
      </div>
      <div className="page-content">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <>
            <div className="grid-3" style={{ marginBottom: 28 }}>
              {cards.map(({ icon: Icon, label, value, color }) => (
                <div className="stat-card" key={label}>
                  <div className="stat-icon" style={{ background: `${color}22` }}><Icon size={24} color={color} /></div>
                  <div className="stat-info"><h3 style={{ color }}>{value ?? 0}</h3><p>{label}</p></div>
                </div>
              ))}
            </div>

            {(parseInt(stats.pending_farmers) > 0 || parseInt(stats.pending_trees) > 0) && (
              <div style={{ background: '#fff8e1', border: '1px solid #ffe082', padding: 16, borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                <div>
                  <p style={{ fontWeight: 700, color: '#856404' }}>Pending Approvals</p>
                  <p style={{ fontSize: '0.85rem', color: '#856404' }}>
                    {stats.pending_farmers} farmer(s) and {stats.pending_trees} tree(s) awaiting review.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
