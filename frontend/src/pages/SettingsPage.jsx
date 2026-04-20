import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Save, User, Shield } from 'lucide-react';

const SettingsPage = () => {
  const [preferences, setPreferences] = useState({ quality: 'auto', theme: 'dark' });
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setProfile(res.data);
        if (res.data.preferences) {
          setPreferences(res.data.preferences);
        }
      } catch (err) {
        console.error('Failed to load profile settings');
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    toast.loading('Synchronizing configuration...', { id: 'savePrefs' });
    try {
      await api.put('/auth/preferences', { preferences });
      toast.success('System parameters updated!', { id: 'savePrefs' });
    } catch (err) {
      toast.error('Failed to sync state', { id: 'savePrefs' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="page-header">
         <div>
            <h2>Configuration Matrix</h2>
            <p className="text-muted">Adjust neural parameters and overrides</p>
         </div>
      </header>

      <div className="comparison-grid">
         <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} className="glass-panel">
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
               <Shield color="var(--accent-green)" /> Adaptive Overrides
            </h3>
            
            <div className="form-group">
              <label>Quality Resolution Caps</label>
              <select 
                className="select-dropdown" 
                value={preferences.quality} 
                onChange={(e) => setPreferences({...preferences, quality: e.target.value})}
              >
                <option value="auto">System Handled (Auto)</option>
                <option value="low">Force Low Threshold</option>
                <option value="medium">Force Medium Threshold</option>
                <option value="high">Force High Threshold</option>
              </select>
              <p className="setting-description">Forcing a threshold will cause the engine to bypass environmental sensing.</p>
            </div>

            <div className="form-group" style={{marginTop: '2rem'}}>
              <label>Interface Theme Mode</label>
              <div className="segmented-controls" style={{maxWidth: '300px'}}>
                 <button className={preferences.theme === 'dark' ? 'active' : ''} onClick={() => setPreferences({...preferences, theme: 'dark'})}>DARK</button>
                 <button className={preferences.theme === 'light' ? 'active' : ''} onClick={() => setPreferences({...preferences, theme: 'light'})} disabled title="Light UI deprecated in Phase 3">LIGHT (Disabled)</button>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{marginTop: '1rem', width: '100%'}}>
              <Save size={18} /> {loading ? 'Transmitting...' : 'Commit Changes'}
            </button>
         </motion.div>

         <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.1}} className="glass-panel">
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
               <User color="var(--accent-purple)" /> Operator Profile
            </h3>
            
            <div className="metric-info" style={{marginBottom: '1rem'}}>
               <h4>Identification Token</h4>
               <div className="value" style={{fontSize: '1.2rem', fontFamily: 'monospace', color: 'var(--accent-blue)'}}>
                 {profile._id || '...................'}
               </div>
            </div>

            <div className="metric-info">
               <h4>Assigned Email Protocol</h4>
               <div className="value" style={{fontSize: '1.2rem', fontFamily: 'monospace', color: 'var(--accent-blue)'}}>
                 {profile.email || 'Initializing...'}
               </div>
            </div>
            
            <div style={{marginTop: '3rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px'}}>
               <h4 style={{color: '#ef4444', marginBottom: '0.5rem'}}>Danger Zone</h4>
               <p className="setting-description" style={{marginBottom: '1rem'}}>Wiping telemetry will permanently erase all tracking data and restore to System Handled (Auto).</p>
               <button className="btn btn-outline" style={{borderColor: '#ef4444', color: '#ef4444'}}>Wipe Telemetry</button>
            </div>
         </motion.div>
      </div>
    </>
  );
};

export default SettingsPage;
