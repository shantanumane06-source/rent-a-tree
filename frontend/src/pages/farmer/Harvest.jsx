import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

const IMG = 'http://localhost:5000/uploads/';

export default function Harvest() {
  const [adoptedTrees, setAdoptedTrees] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [form, setForm] = useState({ tree_id: '', adoption_id: '', yield_kg: '', market_price_per_kg: '', harvest_date: new Date().toISOString().split('T')[0], notes: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('/trees/farmer/my').then(r => {
      const adopted = r.data.filter(t => t.status === 'adopted');
      setAdoptedTrees(adopted);
    });
    api.get('/activity/harvest/farmer').then(r => setHarvests(r.data));
  }, []);

  const handle = async e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'tree_id') {
      const { data } = await api.get('/adoptions/my');
      const match = data.find(a => a.tree_id === parseInt(value));
      if (match) setForm(f => ({ ...f, tree_id: value, adoption_id: match.id }));
    }
  };

  const profit = form.yield_kg && form.market_price_per_kg
    ? (parseFloat(form.yield_kg) * parseFloat(form.market_price_per_kg) * 0.9).toFixed(0) : null;

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('fruit_image', image);
      const { data } = await api.post('/activity/harvest', fd);
      toast.success(`Harvest recorded! Customer profit: ₹${data.customer_profit}`);
      setShowForm(false); setImage(null); setPreview(null);
      api.get('/activity/harvest/farmer').then(r => setHarvests(r.data));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>🍎 Harvest Management</h1>
        <p>Record harvest and share profits</p>
      </div>
      <div className="page-content">
        {adoptedTrees.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
              🍎 Record New Harvest
            </button>
          </div>
        )}

        {showForm && (
          <div className="card" style={{ padding: 24, marginBottom: 24, maxWidth: 560 }}>
            <h3 style={{ marginBottom: 20 }}>Record Harvest</h3>
            <form onSubmit={submit}>
              <div className="input-group">
                <label>Select Tree *</label>
                <select name="tree_id" value={form.tree_id} onChange={handle} required>
                  <option value="">-- Select adopted tree --</option>
                  {adoptedTrees.map(t => <option key={t.id} value={t.id}>{t.tree_type} — {t.tree_code}</option>)}
                </select>
              </div>
              <div className="grid-2">
                <div className="input-group">
                  <label>Yield (kg) *</label>
                  <input name="yield_kg" type="number" value={form.yield_kg} onChange={handle} placeholder="50" min="0" required />
                </div>
                <div className="input-group">
                  <label>Market Price (₹/kg) *</label>
                  <input name="market_price_per_kg" type="number" value={form.market_price_per_kg} onChange={handle} placeholder="40" min="0" required />
                </div>
              </div>
              <div className="input-group">
                <label>Harvest Date</label>
                <input type="date" name="harvest_date" value={form.harvest_date} onChange={handle} required />
              </div>
              <div className="input-group">
                <label>Notes</label>
                <textarea name="notes" value={form.notes} onChange={handle} placeholder="Quality, any issues..." rows={2} />
              </div>

              {profit && (
                <div style={{ background: '#d1f5d3', padding: 14, borderRadius: 8, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#1a7431' }}>Customer Profit (after 10% commission):</span>
                  <span style={{ fontWeight: 800, color: '#1a7431', fontSize: '1.1rem' }}>₹{profit}</span>
                </div>
              )}

              <label htmlFor="fruit-img">
                <div style={{ border: '2px dashed var(--pista-border)', borderRadius: 8, padding: 16, textAlign: 'center', cursor: 'pointer', background: 'var(--pista-bg)', marginBottom: 16 }}>
                  {preview ? <img src={preview} alt="" style={{ maxHeight: 140, borderRadius: 6 }} /> : <><Upload size={24} color="var(--pista)" style={{ margin: '0 auto 4px', display: 'block' }} /><p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>Upload fruit photo</p></>}
                </div>
              </label>
              <input id="fruit-img" type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setImage(f); setPreview(URL.createObjectURL(f)); } }} style={{ display: 'none' }} />

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Record Harvest'}</button>
              </div>
            </form>
          </div>
        )}

        <h2 className="section-title">📋 Harvest History</h2>
        {harvests.length === 0 ? (
          <div className="empty-state"><div className="icon">🍎</div><h3>No harvests recorded</h3></div>
        ) : (
          <div className="grid-3">
            {harvests.map(h => (
              <div className="card" key={h.id}>
                {h.fruit_image && <img src={IMG + h.fruit_image} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />}
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontSize: '0.95rem', marginBottom: 4 }}>{h.tree_type}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: 10 }}>{h.tree_code} · {new Date(h.harvest_date).toLocaleDateString('en-IN')}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      ['Yield', `${h.yield_kg} kg`],
                      ['Price', `₹${h.market_price_per_kg}/kg`],
                      ['Revenue', `₹${parseFloat(h.total_revenue).toFixed(0)}`],
                      ['Customer', `₹${parseFloat(h.customer_profit).toFixed(0)}`],
                    ].map(([l, v]) => (
                      <div key={l} style={{ background: 'var(--pista-bg)', padding: '8px 10px', borderRadius: 6 }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{l}</div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--pista-dark)' }}>{v}</div>
                      </div>
                    ))}
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
