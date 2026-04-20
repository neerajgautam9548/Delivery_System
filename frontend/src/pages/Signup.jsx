import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Generating profile...', { id: 'auth' });
    try {
      const res = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Profile created successfully', { id: 'auth' });
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to create profile. Email might be in use.', { id: 'auth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="glass-panel auth-panel">
        <h2 style={{textAlign: 'center', marginBottom: '0.5rem'}}>Request Access</h2>
        <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>Join the adaptive network.</p>
        
        <form onSubmit={handleSignup} style={{marginTop: '2rem'}}>
          <div className="form-group">
            <label>Operator Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field" />
          </div>
          <div className="form-group">
            <label>Security Key</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input-field"/>
          </div>
          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
             {loading ? 'Processing...' : 'Register Profile'}
          </button>
        </form>
        
        <p className="auth-footer" style={{marginTop: '2rem'}}>
          Already initialized? <span onClick={() => navigate('/login')} className="link">Login</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
