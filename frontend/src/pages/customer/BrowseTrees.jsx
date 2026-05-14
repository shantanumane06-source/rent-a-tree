import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { MapPin, Search, TreePine, X } from 'lucide-react';

const IMG = 'http://localhost:5000/uploads/';

export default function BrowseTrees() {
  const [trees, setTrees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [selected, setSelected] = useState(null);
  const [delivery, setDelivery] = useState('market_sale');
  const [adopting, setAdopting] = useState(false);

  useEffect(() => {
    api.get('/trees').then(r => { setTrees(r.data); setFiltered(r.data); setLoading(false); });
  }, []);

  useEffect(() => {
    let f = trees;
    if (city) f = f.filter(t => t.city.toLowerCase().includes(city.toLowerCase()));
    if (type) f = f.filter(t => t.tree_type.toLowerCase().includes(type.toLowerCase()));
    setFiltered(f);
  }, [city, type, trees]);

  const totalCost = selected ? (
    parseFloat(selected.maintenance_cost) + (delivery === 'home_delivery' ? parseFloat(selected.delivery_cost) : 0)
  ) : 0;

  const adopt = async () => {
    setAdopting(true);
    try {
      await api.post('/adoptions', { tree_id: selected.id, delivery_type: delivery });
      toast.success('🌳 Tree adopted successfully!');
      setSelected(null);
      api.get('/trees').then(r => { setTrees(r.data); setFiltered(r.data); });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setAdopting(false); }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>🌳 Browse Trees</h1>
        <p>Find and adopt a tree near you</p>
      </div>

      <div className="page-content">
        {/* Filters */}
        <div className="filters">
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="Filter by city..." style={{ paddingLeft: 38, width: '100%', padding: '9px 14px 9px 38px', border: '1.5px solid var(--pista-border)', borderRadius: 50, fontFamily: 'Nunito', fontSize: '0.88rem', outline: 'none' }} />
          </div>
          <input value={type} onChange={e => setType(e.target.value)} placeholder="Tree type (Mango, Guava...)" style={{ flex: 1, minWidth: 180, padding: '9px 14px', border: '1.5px solid var(--pista-border)', borderRadius: 50, fontFamily: 'Nunito', fontSize: '0.88rem', outline: 'none' }} />
          {(city || type) && (
            <button className="btn-secondary" onClick={() => { setCity(''); setType(''); }}>
              <X size={14} /> Clear
            </button>
          )}
          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>{filtered.length} trees</span>
        </div>

        {loading ? <div className="loading"><div className="spinner" /></div> :
          filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔍</div>
              <h3>No trees found</h3>
              <p>Try different filters</p>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(t => (
                <div className="card tree-card" key={t.id} onClick={() => { setSelected(t); setDelivery('market_sale'); }}>
                  <div style={{ height: 180, background: 'var(--pista-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', overflow: 'hidden' }}>
                    {t.tree_image ? <img src={IMG + t.tree_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🌳'}
                  </div>
                  <div className="tree-card-body">
                    <div className="tree-card-type">{t.tree_type}</div>
                    <div className="tree-card-city"><MapPin size={12} />{t.city} · {t.farmer_name}</div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: 10, lineHeight: 1.4 }}>{t.description?.substring(0, 80)}...</p>
                    <div className="tree-card-meta">
                      <div>
                        <div className="tree-card-cost">₹{parseFloat(t.maintenance_cost).toFixed(0)}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>maintenance cost</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="tree-card-code">{t.tree_code}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: 4 }}>{t.age_years} yr old</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Adopt Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🌳 Adopt {selected.tree_type}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              {selected.tree_image && (
                <img src={IMG + selected.tree_image} alt="" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 16 }} />
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  ['Tree Code', selected.tree_code],
                  ['Location', selected.city],
                  ['Age', `${selected.age_years} years`],
                  ['Farmer', selected.farmer_name],
                ].map(([l, v]) => (
                  <div key={l} style={{ background: 'var(--pista-bg)', padding: '10px 12px', borderRadius: 8 }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{l}</p>
                    <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>{v}</p>
                  </div>
                ))}
              </div>

              <div className="input-group">
                <label>Choose Delivery Type</label>
                <select value={delivery} onChange={e => setDelivery(e.target.value)}>
                  <option value="market_sale">🏪 Market Sale (no delivery fee)</option>
                  <option value="home_delivery">🚚 Home Delivery (+₹{parseFloat(selected.delivery_cost).toFixed(0)})</option>
                </select>
              </div>

              <div style={{ background: 'var(--pista-bg)', padding: 16, borderRadius: 10, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.88rem' }}>
                  <span>Maintenance Cost</span><span>₹{parseFloat(selected.maintenance_cost).toFixed(0)}</span>
                </div>
                {delivery === 'home_delivery' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.88rem' }}>
                    <span>Delivery Fee</span><span>₹{parseFloat(selected.delivery_cost).toFixed(0)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', borderTop: '1px solid var(--pista-border)', paddingTop: 8, marginTop: 4 }}>
                  <span>Total Payment</span><span style={{ color: 'var(--pista-dark)' }}>₹{totalCost.toFixed(0)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn-primary" onClick={adopt} disabled={adopting}>
                {adopting ? 'Processing...' : `🌳 Adopt for ₹${totalCost.toFixed(0)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
