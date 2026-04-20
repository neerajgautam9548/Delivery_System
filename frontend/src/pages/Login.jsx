import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Authenticating...', { id: 'auth' });
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Access Granted', { id: 'auth' });
      navigate('/dashboard');
    } catch (err) {
      toast.error('Authentication Failed. Check credentials.', { id: 'auth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="glass-panel auth-panel">
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
           <div className="spinner" style={{width: '30px', height: '30px', animation: 'none', transform: 'rotate(45deg)', borderRadius: '4px'}}></div>
        </div>
        <h2 style={{textAlign: 'center', marginBottom: '0.5rem'}}>System Access</h2>
        <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>Enter credentials to securely connect.</p>
        
        <form onSubmit={handleLogin} style={{marginTop: '2rem'}}>
          <div className="form-group">
            <label>Operator Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field" />
          </div>
          <div className="form-group">
            <label>Security Key</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input-field"/>
          </div>
          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
             {loading ? 'Processing...' : 'Establish Connection'}
          </button>
        </form>
        
        <p className="auth-footer" style={{marginTop: '2rem'}}>
          No clearance? <span onClick={() => navigate('/signup')} className="link">Request Access</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
