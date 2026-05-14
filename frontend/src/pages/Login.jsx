import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { TreePine, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: 'customer' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(`/${data.user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--pista-bg) 0%, white 60%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--pista), var(--pista-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'var(--shadow-md)' }}>
            <TreePine size={36} color="white" />
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--pista-dark)' }}>Rent-a-Tree</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: 4 }}>Sign in to your account</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {/* Role selector */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--pista-bg)', padding: 6, borderRadius: 50 }}>
            {['customer', 'farmer', 'admin'].map(r => (
              <button key={r} onClick={() => setForm({ ...form, role: r })}
                style={{ flex: 1, padding: '8px 4px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.82rem', textTransform: 'capitalize', transition: 'all 0.2s',
                  background: form.role === r ? 'linear-gradient(135deg, var(--pista), var(--pista-dark))' : 'transparent',
                  color: form.role === r ? 'white' : 'var(--text-mid)' }}>
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            <div className="input-group">
              <label>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handle} placeholder="••••••••" required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1rem', marginTop: 8 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.88rem', color: 'var(--text-light)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--pista-dark)', fontWeight: 700 }}>Register here</Link>
          </div>

          <div style={{ marginTop: 20, padding: 12, background: 'var(--pista-bg)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-mid)' }}>
            <strong>Test Credentials:</strong><br />
            Admin: admin@rentAtree.com / admin123<br />
            Farmer: farmer@test.com / farmer123<br />
            Customer: customer@test.com / customer123
          </div>
        </div>
      </div>
    </div>
  );
}
