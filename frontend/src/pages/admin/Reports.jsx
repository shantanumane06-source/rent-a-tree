import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

export default function Reports() {
  const [stats, setStats] = useState({});
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/adoptions/admin/all'),
    ]).then(([s, a]) => {
      setStats(s.data);
      setAdoptions(a.data);
      setLoading(false);
    });
  }, []);

  const cityMap = adoptions.reduce((acc, a) => {
    acc[a.tree_code] = acc[a.tree_code] || 0;
    acc[a.tree_code]++;
    return acc;
  }, {});

  const revenue = adoptions.reduce((s, a) => s + parseFloat(a.total_payment || 0), 0);
  const profit = adoptions.reduce((s, a) => s + parseFloat(a.profit_share || 0), 0);
  const commission = revenue - profit;

  return (
    <Layout>
      <div className="page-header">
        <h1>📊 Reports & Analytics</h1>
        <p>Platform performance overview</p>
      </div>
      <div className="page-content">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <>
            <div className="grid-3" style={{ marginBottom: 28 }}>
              {[
                { label: 'Total Revenue', value: `₹${revenue.toFixed(0)}`, sub: 'All adoption payments', color: '#4CAF50' },
                { label: 'Customer Profits', value: `₹${profit.toFixed(0)}`, sub: 'Paid back to customers', color: '#2196F3' },
                { label: 'Platform Commission', value: `₹${commission.toFixed(0)}`, sub: '10% of harvest revenue', color: '#FF9800' },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="card" style={{ padding: 22, borderTop: `4px solid ${color}` }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: 6 }}>{label}</p>
                  <h2 style={{ fontSize: '1.8rem', color, marginBottom: 4 }}>{value}</h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{sub}</p>
                </div>
              ))}
            </div>

            <div className="grid-2">
              <div className="card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: '1rem', marginBottom: 16 }}>📈 Platform Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    ['Total Customers', stats.customers],
                    ['Approved Farmers', stats.farmers],
                    ['Approved Trees', stats.trees],
                    ['Total Adoptions', stats.adoptions],
                    ['Pending Farmers', stats.pending_farmers],
                    ['Pending Trees', stats.pending_trees],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--pista-bg)' }}>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-mid)' }}>{label}</span>
                      <strong style={{ color: 'var(--pista-dark)' }}>{value ?? 0}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: '1rem', marginBottom: 16 }}>🚚 Delivery Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    ['Home Delivery', adoptions.filter(a => a.delivery_type === 'home_delivery').length],
                    ['Market Sale', adoptions.filter(a => a.delivery_type === 'market_sale').length],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.85rem' }}>{label}</span>
                        <strong style={{ color: 'var(--pista-dark)' }}>{value}</strong>
                      </div>
                      <div style={{ height: 6, background: 'var(--pista-bg)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--pista), var(--pista-dark))', width: adoptions.length ? `${(value / adoptions.length) * 100}%` : '0%', borderRadius: 3, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
