import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { TreePine, Upload } from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', address: '', farm_location: '', password: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImg = e => {
    const f = e.target.files[0];
    if (f) { setImage(f); setPreview(URL.createObjectURL(f)); }
  };

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('profile_image', image);
      await api.post(`/auth/${role}/register`, fd);
      toast.success(role === 'farmer' ? 'Registration submitted! Await admin approval.' : 'Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--pista-bg) 0%, white 60%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--pista), var(--pista-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: 'var(--shadow-md)' }}>
            <TreePine size={30} color="white" />
          </div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--pista-dark)' }}>Create Account</h1>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--pista-bg)', padding: 6, borderRadius: 50 }}>
            {['customer', 'farmer'].map(r => (
              <button key={r} onClick={() => setRole(r)}
                style={{ flex: 1, padding: '8px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.9rem', textTransform: 'capitalize', transition: 'all 0.2s',
                  background: role === r ? 'linear-gradient(135deg, var(--pista), var(--pista-dark))' : 'transparent',
                  color: role === r ? 'white' : 'var(--text-mid)' }}>
                {r === 'customer' ? '🌿 Customer' : '🌾 Farmer'}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            {/* Profile image */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <label htmlFor="img-upload" style={{ cursor: 'pointer' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', border: '3px dashed var(--pista)', margin: '0 auto 8px', overflow: 'hidden', background: 'var(--pista-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {preview ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Upload size={24} color="var(--pista)" />}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--pista-dark)', fontWeight: 600 }}>Upload Profile Photo</span>
              </label>
              <input id="img-upload" type="file" accept="image/*" onChange={handleImg} style={{ display: 'none' }} />
            </div>

            <div className="grid-2">
              <div className="input-group">
                <label>Full Name *</label>
                <input name="name" value={form.name} onChange={handle} placeholder="Your name" required />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handle} placeholder="9876543210" />
              </div>
            </div>
            <div className="input-group">
              <label>Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
            </div>
            <div className="input-group">
              <label>City *</label>
              <input name="city" value={form.city} onChange={handle} placeholder="Mumbai, Pune..." required />
            </div>
            {role === 'customer' && (
              <div className="input-group">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handle} placeholder="Full address for delivery" />
              </div>
            )}
            {role === 'farmer' && (
              <div className="input-group">
                <label>Farm Location</label>
                <input name="farm_location" value={form.farm_location} onChange={handle} placeholder="Village, District..." />
              </div>
            )}
            <div className="input-group">
              <label>Password *</label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters" minLength={6} required />
            </div>

            {role === 'farmer' && (
              <div style={{ padding: 12, background: '#fff8e1', borderRadius: 8, fontSize: '0.82rem', color: '#856404', marginBottom: 16 }}>
                ⚠️ Farmer accounts require admin approval before you can add trees.
              </div>
            )}

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1rem' }}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.88rem', color: 'var(--text-light)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--pista-dark)', fontWeight: 700 }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
