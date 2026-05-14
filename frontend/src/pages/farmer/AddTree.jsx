import React, { useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Upload, TreePine } from 'lucide-react';

export default function AddTree() {
  const [form, setForm] = useState({ tree_type: '', age_years: '', city: '', farm_location: '', maintenance_cost: '', delivery_cost: '', description: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImg = e => { const f = e.target.files[0]; if (f) { setImage(f); setPreview(URL.createObjectURL(f)); } };

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('tree_image', image);
      await api.post('/trees', fd);
      toast.success('Tree submitted for admin approval!');
      navigate('/farmer/trees');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>🌳 Add New Tree</h1>
        <p>Submit a tree for customer adoption</p>
      </div>
      <div className="page-content">
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="card" style={{ padding: 28 }}>
            <form onSubmit={submit}>
              {/* Image upload */}
              <label htmlFor="tree-img">
                <div style={{ border: '2px dashed var(--pista-border)', borderRadius: 12, padding: 24, textAlign: 'center', cursor: 'pointer', background: 'var(--pista-bg)', marginBottom: 20, transition: 'all 0.2s' }}>
                  {preview
                    ? <img src={preview} alt="" style={{ maxHeight: 200, borderRadius: 8, maxWidth: '100%' }} />
                    : <><Upload size={36} color="var(--pista)" style={{ margin: '0 auto 8px', display: 'block' }} /><p style={{ color: 'var(--text-mid)', fontWeight: 600 }}>Click to upload tree image</p><p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>JPG, PNG up to 5MB</p></>
                  }
                </div>
              </label>
              <input id="tree-img" type="file" accept="image/*" onChange={handleImg} style={{ display: 'none' }} />

              <div className="grid-2">
                <div className="input-group">
                  <label>Tree Type *</label>
                  <input name="tree_type" value={form.tree_type} onChange={handle} placeholder="Mango, Guava, Banana..." required />
                </div>
                <div className="input-group">
                  <label>Age (Years)</label>
                  <input name="age_years" type="number" value={form.age_years} onChange={handle} placeholder="3" min="0" />
                </div>
              </div>
              <div className="grid-2">
                <div className="input-group">
                  <label>City *</label>
                  <input name="city" value={form.city} onChange={handle} placeholder="Pune, Nashik..." required />
                </div>
                <div className="input-group">
                  <label>Farm Location</label>
                  <input name="farm_location" value={form.farm_location} onChange={handle} placeholder="Village, District..." />
                </div>
              </div>
              <div className="grid-2">
                <div className="input-group">
                  <label>Maintenance Cost (₹) *</label>
                  <input name="maintenance_cost" type="number" value={form.maintenance_cost} onChange={handle} placeholder="2500" required min="0" />
                </div>
                <div className="input-group">
                  <label>Delivery Cost (₹)</label>
                  <input name="delivery_cost" type="number" value={form.delivery_cost} onChange={handle} placeholder="500" min="0" />
                </div>
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handle} placeholder="Describe the tree, its health, expected yield..." rows={3} />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => navigate('/farmer/trees')}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  <TreePine size={16} />
                  {loading ? 'Submitting...' : 'Submit Tree'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
