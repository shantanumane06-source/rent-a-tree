import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Upload, PlusCircle } from 'lucide-react';

const IMG = 'http://localhost:5000/uploads/';

export default function Maintenance() {
  const [trees, setTrees] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tree_id: '', activity_type: 'water', description: '', log_date: new Date().toISOString().split('T')[0] });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/trees/farmer/my').then(r => {
      const active = r.data.filter(t => ['approved', 'adopted'].includes(t.status));
      setTrees(active);
      if (active.length) { setForm(f => ({ ...f, tree_id: active[0].id })); loadLogs(active[0].id); }
    });
  }, []);

  const loadLogs = id => api.get(`/activity/maintenance/${id}`).then(r => setLogs(r.data));

  const handle = e => {
    const v = e.target.value;
    setForm({ ...form, [e.target.name]: v });
    if (e.target.name === 'tree_id') loadLogs(v);
  };

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('log_image', image);
      await api.post('/activity/maintenance', fd);
      toast.success('Maintenance logged!');
      setShowForm(false); setImage(null); setPreview(null);
      loadLogs(form.tree_id);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>🔧 Maintenance Logs</h1>
        <p>Record tree care activities</p>
      </div>
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Tree:</label>
            <select value={form.tree_id} name="tree_id" onChange={handle} style={{ padding: '8px 14px', border: '1.5px solid var(--pista-border)', borderRadius: 50, fontFamily: 'Nunito', fontSize: '0.88rem', outline: 'none' }}>
              {trees.map(t => <option key={t.id} value={t.id}>{t.tree_type} — {t.tree_code}</option>)}
            </select>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}><PlusCircle size={16} /> Log Activity</button>
        </div>

        {showForm && (
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <form onSubmit={submit}>
              <div className="grid-2">
                <div className="input-group">
                  <label>Activity Type</label>
                  <select name="activity_type" value={form.activity_type} onChange={handle}>
                    {['fertilizer', 'water', 'labor', 'other'].map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Date</label>
                  <input type="date" name="log_date" value={form.log_date} onChange={handle} required />
                </div>
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handle} placeholder="Describe what was done..." rows={2} />
              </div>
              <label htmlFor="log-img">
                <div style={{ border: '2px dashed var(--pista-border)', borderRadius: 8, padding: 16, textAlign: 'center', cursor: 'pointer', background: 'var(--pista-bg)', marginBottom: 16 }}>
                  {preview ? <img src={preview} alt="" style={{ maxHeight: 120, borderRadius: 6 }} /> : <><Upload size={24} color="var(--pista)" style={{ margin: '0 auto 4px', display: 'block' }} /><p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>Upload photo (optional)</p></>}
                </div>
              </label>
              <input id="log-img" type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setImage(f); setPreview(URL.createObjectURL(f)); } }} style={{ display: 'none' }} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Log'}</button>
              </div>
            </form>
          </div>
        )}

        {logs.length === 0 ? (
          <div className="empty-state"><div className="icon">📋</div><h3>No maintenance logs</h3></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {logs.map(l => (
              <div className="card" key={l.id} style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                {l.log_image && <img src={IMG + l.log_image} alt="" style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
                    <span className="badge badge-approved" style={{ textTransform: 'capitalize' }}>{l.activity_type}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{new Date(l.log_date).toLocaleDateString('en-IN')}</span>
                  </div>
                  {l.description && <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)' }}>{l.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
